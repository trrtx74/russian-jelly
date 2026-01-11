import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  INITIAL_JELLIES,
  calculateScore,
  generateBullets,
  simulateDraw,
} from '../utils/gameRules';
import type { Player } from '../utils/gameRules';

interface VsCpuStats {
  totalGames: number; // Incremented at start
  wins: number;
  draws: number;
}

interface GameStore {
  // Session State (Persisted)
  vsCpuStats: VsCpuStats;
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  resetHistory: () => void;

  // Current Game State
  status: 'IDLE' | 'PLAYING' | 'ENDED';
  jelliesRemaining: number;
  bulletsRemaining: number;
  isBulletRevealed: boolean;
  currentTurn: Player;
  scores: Record<Player, number>;
  startingPlayer: Player;
  winner: Player | 'DRAW' | null;
  mode: 'VS_CPU' | 'VS_HUMAN';

  // Actions
  startGame: (mode: 'VS_CPU' | 'VS_HUMAN') => void;
  quitGame: () => void;
  drawJellies: (count: number) => void;
  surrender: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial Session State
      vsCpuStats: { totalGames: 0, wins: 0, draws: 0 },
      language: 'ko',
      setLanguage: (lang) => set({ language: lang }),
      resetHistory: () =>
        set({
          vsCpuStats: { totalGames: 0, wins: 0, draws: 0 },
        }),

      // Initial Game State
      status: 'IDLE',
      jelliesRemaining: INITIAL_JELLIES,
      bulletsRemaining: 0,
      isBulletRevealed: false,
      currentTurn: 'PLAYER_1',
      scores: { PLAYER_1: 0, PLAYER_2: 0 },
      startingPlayer: 'PLAYER_2', // Will swap to PLAYER_1 on first game
      winner: null,
      mode: 'VS_CPU',

      startGame: (mode) => {
        const { startingPlayer } = get();
        const nextStartingPlayer =
          startingPlayer === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
        const bullets = generateBullets();

        set((state) => {
          const newStats = { ...state.vsCpuStats };
          if (mode === 'VS_CPU') {
            newStats.totalGames += 1;
          }

          return {
            status: 'PLAYING',
            jelliesRemaining: INITIAL_JELLIES,
            bulletsRemaining: bullets,
            isBulletRevealed: false,
            currentTurn: nextStartingPlayer,
            startingPlayer: nextStartingPlayer,
            scores: { PLAYER_1: 0, PLAYER_2: 0 },
            winner: null,
            mode: mode,
            vsCpuStats: newStats,
          };
        });
      },

      quitGame: () => {
        set({ status: 'IDLE' });
      },

      drawJellies: (count) => {
        const {
          jelliesRemaining,
          bulletsRemaining,
          currentTurn,
          scores,
          status,
          isBulletRevealed,
        } = get();

        if (status !== 'PLAYING') return;

        const { bulletsDrawn, newTotalJellies, newTotalBullets } = simulateDraw(
          count,
          jelliesRemaining,
          bulletsRemaining
        );

        const scoreChange = calculateScore(count, bulletsDrawn);
        const newScores = {
          ...scores,
          [currentTurn]: scores[currentTurn] + scoreChange,
        };

        const newIsBulletRevealed = isBulletRevealed || bulletsDrawn > 0;

        // Game Over Condition: LAST bullet drawn.
        // Rule: "마지막 총알 젤리가 뽑힌 순간 게임이 종료됨"
        // This means if newTotalBullets === 0 (and we started with > 0), game ends.
        const isGameOver = newTotalBullets === 0;

        if (isGameOver) {
          const p1Score = newScores.PLAYER_1;
          const p2Score = newScores.PLAYER_2;
          let winner: Player | 'DRAW' | null = null;

          if (p1Score > p2Score) winner = 'PLAYER_1';
          else if (p2Score > p1Score) winner = 'PLAYER_2';
          else winner = 'DRAW';

          set((state) => {
            const newStats = { ...state.vsCpuStats };

            // Only update wins/draws if in VS_CPU mode
            // totalGames was already incremented at start
            if (state.mode === 'VS_CPU') {
              if (winner === 'PLAYER_1') {
                // User won (assuming Player 1 is user in VS CPU)
                newStats.wins++;
              } else if (winner === 'DRAW') {
                newStats.draws++;
              }
            }

            return {
              jelliesRemaining: newTotalJellies,
              bulletsRemaining: newTotalBullets,
              scores: newScores,
              status: 'ENDED',
              winner,
              vsCpuStats: newStats,
              isBulletRevealed: newIsBulletRevealed
            };
          });
        } else {
          // Switch Turn
          const nextTurn = currentTurn === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
          set({
            jelliesRemaining: newTotalJellies,
            bulletsRemaining: newTotalBullets,
            scores: newScores,
            currentTurn: nextTurn,
            isBulletRevealed: newIsBulletRevealed,
          });
        }
      },

      surrender: () => {
        const { currentTurn, status } = get();
        if (status !== 'PLAYING') return;

        const winner = currentTurn === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';

        set(() => {
          // Surrender counts as loss, so no win update for P1
          // If CPU surrendered (impossible logically but handled), P1 wins?
          // Actually surrender is only for Human Player 1?
          // If Human surrenders, they lose. 
          // totalGames already ++, wins not ++. Correct.

          return {
            status: 'ENDED',
            winner,
          };
        });
      },
    }),
    {
      name: 'russian-jelly-storage',
      partialize: (state) => ({
        vsCpuStats: state.vsCpuStats,
        language: state.language,
      }),
    }
  )
);
