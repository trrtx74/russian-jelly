
/**
 * Russian Jelly Agent - Pure TypeScript Implementation
 * No external dependencies.
 */

// Import weights directly
import valueNetWeights from './value_net.json';
import intuitionNetWeights from './intuition_net.json';

/* ==========================================
   Math Utilities
   ========================================== */

function add(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i]);
}

function matMul(vec: number[], weights: number[][]): number[] {
  // vec: [M], weights: [N][M] (rows, cols) -> output: [N]
  // Note: PyTorch linear layer weights are (out_features, in_features)
  const outDim = weights.length;
  const inDim = weights[0].length;

  if (vec.length !== inDim) {
    throw new Error(`Dimension mismatch: vec ${vec.length}, weight cols ${inDim}`);
  }

  const result = new Array(outDim).fill(0);
  for (let i = 0; i < outDim; i++) {
    let sum = 0;
    for (let j = 0; j < inDim; j++) {
      sum += vec[j] * weights[i][j];
    }
    result[i] = sum;
  }
  return result;
}

function relu(vec: number[]): number[] {
  return vec.map(x => Math.max(0, x));
}

// function tanh(vec: number[]): number[] {
//   return vec.map(x => Math.tanh(x));
// }

function symlog(x: number): number {
  return Math.sign(x) * Math.log1p(Math.abs(x));
}

function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - i + 1) / i;
  }
  return result;
}

function hypergeomPmf(k: number, M: number, n: number, N: number): number {
  // k: successes (reds), M: population (n_rem), n: successes in pop (n_red), N: draws (action)
  if (k < Math.max(0, N - (M - n)) || k > Math.min(N, n)) {
    return 0.0;
  }

  const num = combinations(n, k) * combinations(M - n, N - k);
  const den = combinations(M, N);
  if (den === 0) return 0.0;
  return num / den;
}

/* ==========================================
   Model Classes
   ========================================== */

interface LayerWeights {
  weight: number[][];
  bias: number[];
}

interface ModelWeights {
  fc1: LayerWeights;
  fc2: LayerWeights;
  fc3: LayerWeights;
  value_head: LayerWeights;
}

class SimpleMLP {
  weights: ModelWeights;

  constructor(weights: ModelWeights) {
    this.weights = weights;
  }

  forward(input: number[]): number {
    let x = input;

    // FC1
    x = matMul(x, this.weights.fc1.weight);
    x = add(x, this.weights.fc1.bias);
    x = relu(x);

    // FC2
    x = matMul(x, this.weights.fc2.weight);
    x = add(x, this.weights.fc2.bias);
    x = relu(x);

    // FC3
    x = matMul(x, this.weights.fc3.weight);
    x = add(x, this.weights.fc3.bias);
    x = relu(x);

    // Value Head
    x = matMul(x, this.weights.value_head.weight);
    x = add(x, this.weights.value_head.bias);

    return Math.tanh(x[0]);
  }
}

class ValueNet extends SimpleMLP {
  forwardState(nRem: number, nRed: number, scoreDiff: number): number {
    // Input: One-hot n_rem (26) + One-hot n_red (7) + Score (1) = 34

    // 1. One-hot n_rem (1-26 -> index 0-25)
    // Note: n_rem can be 26 max for post-reveal? Check python code.
    // Python: n_rem_onehot = F.one_hot(n_rem - 1, num_classes=26)
    const nRemVec = new Array(26).fill(0);
    if (nRem >= 1 && nRem <= 26) {
      nRemVec[nRem - 1] = 1;
    }

    // 2. One-hot n_red (1-7 -> index 0-6)
    const nRedVec = new Array(7).fill(0);
    if (nRed >= 1 && nRed <= 7) {
      nRedVec[nRed - 1] = 1;
    }

    // 3. Score Norm
    const scoreSym = symlog(scoreDiff);
    const scoreNorm = Math.max(-1, Math.min(1, scoreSym / 10));

    const input = [...nRemVec, ...nRedVec, scoreNorm];
    return this.forward(input);
  }
}

class IntuitionNet extends SimpleMLP {
  forwardState(nRem: number, scoreDiff: number): number {
    // Input: One-hot n_rem (27) + Score (1) = 28

    // 1. One-hot n_rem (1-27 -> index 0-26)
    const nRemVec = new Array(27).fill(0);
    if (nRem >= 1 && nRem <= 27) {
      nRemVec[nRem - 1] = 1;
    }

    // 2. Score Norm
    const scoreSym = symlog(scoreDiff);
    const scoreNorm = Math.max(-1, Math.min(1, scoreSym / 10));

    const input = [...nRemVec, scoreNorm];
    return this.forward(input);
  }
}

/* ==========================================
   Agent
   ========================================== */

export interface AgentResult {
  bestK: number;
  value: number;
}

export class Agent {
  valueNet: ValueNet;
  intuitionNet: IntuitionNet;

  // Cache for belief state and hypergeom to avoid re-calc (optional, but good for perf)
  beliefCache: Map<number, number[]> = new Map();

  constructor() {
    this.valueNet = new ValueNet(valueNetWeights);
    this.intuitionNet = new IntuitionNet(intuitionNetWeights);
  }

  /**
   * Main entry point.
   * isRevealed: boolean
   * nRem: number (remaining marbles)
   * scoreDiff: number (my score - opp score)
   * nRed: number (optional, only valid if isRevealed=true, otherwise ignored/treated as unknown)
   * temperature: number (0.0 = greedy, >0.0 = softmax sampling)
   */
  getAction(nRem: number, scoreDiff: number, isRevealed: boolean, nRed: number = 0, temperature: number = 0): AgentResult {
    if (isRevealed) {
      // Solver Mode
      return this.getBestActionPostReveal(nRem, nRed, scoreDiff, temperature);
    } else {
      // Intuition Mode
      return this.getBestActionPreReveal(nRem, scoreDiff, temperature);
    }
  }

  // --- Post-Reveal (Solver) Logic ---

  private getBestActionPostReveal(nRem: number, nRed: number, scoreDiff: number, temperature: number): AgentResult {
    const validActions = [];
    for (let k = 1; k <= nRem; k++) validActions.push(k);

    // Store (k, expectedValue) pairs
    const actionValues: { k: number, val: number }[] = [];

    for (const k of validActions) {
      let expectedValue = 0;

      const maxReds = Math.min(k, nRed);
      const minReds = Math.max(0, k - (nRem - nRed));

      for (let r = minReds; r <= maxReds; r++) {
        const prob = hypergeomPmf(r, nRem, nRed, k);
        if (prob < 1e-9) continue;

        const [nextState, _, done] = this.computeTransition(nRem, nRed, scoreDiff, k, r);

        let vNext = 0;
        if (done) {
          vNext = this.getTerminalValue(nextState.scoreDiff);
        } else {
          const vOpp = this.valueNet.forwardState(nextState.nRem, nextState.nRed, nextState.scoreDiff);
          vNext = vOpp;
        }

        expectedValue += prob * (-vNext);
      }

      actionValues.push({ k, val: expectedValue });
    }

    return this.selectAction(actionValues, temperature);
  }

  // --- Pre-Reveal (Intuition) Logic ---

  private getBeliefDist(nRem: number): number[] {
    if (this.beliefCache.has(nRem)) return this.beliefCache.get(nRem)!;

    const probs = [];
    let sum = 0;
    // r in 1..8 (Python range(1,9))
    for (let r = 1; r <= 8; r++) {
      const nDrawn = 27 - nRem;
      // Prob = comb(27-r, nDrawn) / comb(27, nDrawn)
      // Assuming uniform prior over 'which r cards are red' is not quite right,
      // The Python code: 
      // if n_drawn > 27 - r: p = 0
      // else: p = comb(27 - r, n_drawn) / comb(27, n_drawn)
      // This is P(surviving n_drawn rounds | Total Reds = r).
      // Then normalized.

      let p = 0;
      if (nDrawn <= 27 - r) {
        p = combinations(27 - r, nDrawn) / combinations(27, nDrawn);
      }
      probs.push(p);
      sum += p;
    }

    // Normalize
    const dist = probs.map(p => (sum === 0 ? 1 / 8 : p / sum));
    this.beliefCache.set(nRem, dist);
    return dist;
  }

  private getBestActionPreReveal(nRem: number, scoreDiff: number, temperature: number): AgentResult {
    const belief = this.getBeliefDist(nRem);
    const validActions = [];
    for (let k = 1; k <= nRem; k++) validActions.push(k);

    const actionValues: { k: number, val: number }[] = [];

    for (const k of validActions) {
      let expectedValue = 0;
      const basePoints = Math.pow(2, k - 1);

      for (let rIdx = 0; rIdx < 8; rIdx++) {
        const r = rIdx + 1;
        const rProb = belief[rIdx];
        if (rProb < 1e-8) continue;

        const p0 = hypergeomPmf(0, nRem, r, k);
        if (p0 > 0) {
          const weight = rProb * p0;
          let val = 0;

          if (nRem - k === 0) {
            const finalAdv = scoreDiff + basePoints;
            val = this.getTerminalValue(finalAdv);
          } else {
            const oppScore = -(scoreDiff + basePoints);
            const vOpp = this.intuitionNet.forwardState(nRem - k, oppScore);
            val = -vOpp;
          }
          expectedValue += weight * val;
        }

        const limit = Math.min(k, r);
        for (let x = 1; x <= limit; x++) {
          const px = hypergeomPmf(x, nRem, r, k);
          if (px > 0) {
            const weight = rProb * px;
            const rRem = r - x;
            const remRem = nRem - k;
            const oppScore = -(scoreDiff - x * basePoints);

            let val = 0;
            if (remRem === 0 || rRem === 0) {
              val = -this.getTerminalValue(oppScore);
            } else {
              const vOpp = this.valueNet.forwardState(remRem, rRem, oppScore);
              val = -vOpp;
            }
            expectedValue += weight * val;
          }
        }
      }

      actionValues.push({ k, val: expectedValue });
    }

    return this.selectAction(actionValues, temperature);
  }

  // --- Selection Logic ---

  private selectAction(actionValues: { k: number, val: number }[], temperature: number): AgentResult {
    if (temperature === 0) {
      // Greedy
      let bestK = -1;
      let bestVal = -Infinity;
      for (const av of actionValues) {
        if (av.val > bestVal) {
          bestVal = av.val;
          bestK = av.k;
        }
      }
      return { bestK, value: bestVal };
    } else {
      // Softmax
      // Shift values for numerical stability: v_i - max(v)
      let maxVal = -Infinity;
      for (const av of actionValues) maxVal = Math.max(maxVal, av.val);

      const exps = actionValues.map(av => Math.exp((av.val - maxVal) / temperature));
      const sumExps = exps.reduce((a, b) => a + b, 0);
      const probs = exps.map(e => e / sumExps);

      const r = Math.random();
      let cumProb = 0;
      for (let i = 0; i < actionValues.length; i++) {
        cumProb += probs[i];
        if (r <= cumProb) {
          return { bestK: actionValues[i].k, value: actionValues[i].val };
        }
      }
      // Fallback (should not be reached if sumExps > 0 and r is within [0,1))
      return { bestK: actionValues[actionValues.length - 1].k, value: actionValues[actionValues.length - 1].val };
    }
  }

  // --- Shared Logic ---

  private computeTransition(nRem: number, nRed: number, scoreDiff: number, k: number, drawnReds: number) {
    let points = 0;
    if (drawnReds === 0) {
      points = Math.pow(2, k - 1);
    } else {
      points = -drawnReds * Math.pow(2, k - 1);
    }

    const newRem = nRem - k;
    const newRed = nRed - drawnReds;
    const newScoreDiff = -(scoreDiff + points);

    const done = (newRed === 0) || (newRem === 0);

    return [{ nRem: newRem, nRed: newRed, scoreDiff: newScoreDiff }, points, done] as const;
  }

  private getTerminalValue(diff: number): number {
    if (diff > 0) return 1.0;
    if (diff < 0) return -1.0;
    return 0.0;
  }
}
