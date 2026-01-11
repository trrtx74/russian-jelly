import { INITIAL_JELLIES } from '../utils/gameRules';

type ActivationFunction = 'relu' | 'sigmoid' | 'tanh';

interface LayerConfig {
  weights: number[][]; // [input][output]
  biases: number[];    // [output]
  activation: ActivationFunction;
}

export interface AgentConfig {
  layers: LayerConfig[];
}

// Simple Matrix Vector Multiplication
function matMulVec(matrix: number[][], vector: number[]): number[] {
  // Matrix is [InputDim][OutputDim] (weights from input i to output j)
  // Or usually [OutputDim][InputDim]? 
  // Standard MLP weights are usually W * x + b where W is [out, in].
  // Let's assume standard format: vector size matches Rows of Matrix?
  // Let's stick to: weights [inputSize][outputSize] for easier iteration if dense?
  // Actually, usually W is [outputSize][inputSize] for dot product.
  // We will assume W: [outputSize][inputSize]

  const outputSize = matrix.length;
  // const inputSize = matrix[0].length;
  const result = new Array(outputSize).fill(0);

  for (let i = 0; i < outputSize; i++) {
    let sum = 0;
    const row = matrix[i];
    for (let j = 0; j < row.length; j++) {
      sum += row[j] * vector[j];
    }
    result[i] = sum;
  }
  return result;
}

function addBias(vector: number[], bias: number[]): number[] {
  return vector.map((val, i) => val + bias[i]);
}

function activate(vector: number[], func: ActivationFunction): number[] {
  switch (func) {
    case 'relu':
      return vector.map(v => Math.max(0, v));
    case 'sigmoid':
      return vector.map(v => 1 / (1 + Math.exp(-v)));
    case 'tanh':
      return vector.map(v => Math.tanh(v));
    default:
      return vector;
  }
}

export class SimpleAgent {
  private config: AgentConfig | null = null;

  constructor(config?: AgentConfig) {
    if (config) {
      this.config = config;
    }
  }

  loadConfig(config: AgentConfig) {
    this.config = config;
  }

  // Basic heuristic fallback if no model
  // Strategy: If few jellies, play safe. If many, take moderate risk.
  // Actually, random for now is fine, or simple rule.
  getHeuristicAction(jelliesRemaining: number, bulletsRemaining: number): number {
    // Simple logic:
    // If bullets low and jellies high -> Draw more
    // If bullets high -> Draw 1

    // Max safe draw estimation
    const safeRatio = jelliesRemaining / (bulletsRemaining + 1);
    const draw = Math.min(Math.floor(safeRatio), jelliesRemaining);
    return Math.max(1, draw);
  }

  predict(jelliesRemaining: number, bulletsRemaining: number): number {
    if (!this.config) {
      return this.getHeuristicAction(jelliesRemaining, bulletsRemaining);
    }

    // Prepare Input Features
    // [jellies / INITIAL, bullets / 8, hasReveal?]
    // Let's assume input is simple normalized state
    const input = [
      jelliesRemaining / INITIAL_JELLIES,
      bulletsRemaining / 8, // MAX_BULLETS
      1.0 // Bias input or extra feature?
    ];

    let current = input;

    // Forward Pass
    for (const layer of this.config.layers) {
      // W * x
      const wx = matMulVec(layer.weights, current);
      // + b
      const z = addBias(wx, layer.biases);
      // Activation
      current = activate(z, layer.activation);
    }

    // Output is assumed to be Q-values or Policy?
    // Let's assume Output size = max possible actions (27?)
    // Or single value?
    // If single value -> Regression?
    // Usually Policy -> Softmax?
    // Let's return argmax of output

    // Find index of max value
    let maxVal = -Infinity;
    let maxIdx = 0;

    // Valid actions only 1..jelliesRemaining
    for (let i = 0; i < current.length; i++) {
      if (i + 1 > jelliesRemaining) continue; // Invalid action
      if (current[i] > maxVal) {
        maxVal = current[i];
        maxIdx = i;
      }
    }

    return maxIdx + 1; // 1-based action
  }
}

export const cpuAgent = new SimpleAgent();
