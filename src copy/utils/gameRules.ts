export const INITIAL_JELLIES = 27;
export const MIN_BULLETS = 1;
export const MAX_BULLETS = 8;

export type Player = 'PLAYER_1' | 'PLAYER_2';

export interface GameState {
  jelliesRemaining: number;
  bulletsRemaining: number;
  currentTurn: Player;
  scores: Record<Player, number>;
  isGameOver: boolean;
  history: GameHistory[];
  isBulletRevealed: boolean;
}

export interface GameHistory {
  winner: Player | 'DRAW';
  scoreDate: string;
  finalScore: Record<Player, number>;
}

export const calculateScore = (drawCount: number, bulletCount: number): number => {
  const k = drawCount;
  if (bulletCount > 0) {
    // Failure: -(bullets) * 2^(k-1)
    return -bulletCount * Math.pow(2, k - 1);
  } else {
    // Success: +2^(k-1)
    return Math.pow(2, k - 1);
  }
};

export const generateBullets = (): number => {
  return Math.floor(Math.random() * (MAX_BULLETS - MIN_BULLETS + 1)) + MIN_BULLETS;
};

/**
 * Simulates drawing jellies.
 * @param drawCount Number of jellies to draw
 * @param totalJellies Total jellies currently remaining
 * @param totalBullets Total bullets currently remaining
 * @returns Object containing the number of bullets drawn and if the game should end (if all bullets drawn? No, rule says game ends when *last* bullet is drawn? Or just any bullet?
 * Re-reading PROJECT.md: "마지막 총알 젤리가 뽑힌 순간 게임이 종료됨" -> Game ends when the LAST bullet is drawn.
 */
export const simulateDraw = (
  drawCount: number,
  totalJellies: number,
  totalBullets: number
): { bulletsDrawn: number; newTotalJellies: number; newTotalBullets: number } => {
  let bulletsDrawn = 0;
  let currentBullets = totalBullets;
  let currentJellies = totalJellies;

  for (let i = 0; i < drawCount; i++) {
    if (currentJellies === 0) break;

    const isBullet = Math.random() < (currentBullets / currentJellies);

    if (isBullet) {
      bulletsDrawn++;
      currentBullets--;
    }
    currentJellies--;
  }

  return {
    bulletsDrawn,
    newTotalJellies: currentJellies,
    newTotalBullets: currentBullets,
  };
};
