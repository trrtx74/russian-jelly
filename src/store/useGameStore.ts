import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  INITIAL_JELLIES,
  calculateScore,
  generateBullets,
  simulateDraw,
} from '../utils/gameRules';
import type { Player } from '../utils/gameRules';

interface Stats {
  totalGames: number;
  wins: number;
  draws: number;
}

interface VsCpuStats {
  easy: Stats;
  medium: Stats;
  hard: Stats;
}

interface HistoryItem {
  id: number;
  type: 'START' | 'DRAW' | 'REVEAL' | 'SURRENDER' | 'END';
  player: string;
  count: number;
  bulletCount: number;
  scoreDiff: number;
  bulletsLeft: number | null;
}

interface GameStore {
  // Session State (Persisted)
  vsCpuStats: VsCpuStats;
  twoPlayerStats: Stats;
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
  playerJellies: Record<Player, number>;
  playerBullets: Record<Player, number>;
  winner: Player | 'DRAW' | null;
  mode: 'VS_CPU' | 'VS_HUMAN';
  cpuDifficulty: 'easy' | 'medium' | 'hard';
  history: HistoryItem[];

  // Actions
  startGame: (mode: 'VS_CPU' | 'VS_HUMAN', difficulty?: 'easy' | 'medium' | 'hard') => void;
  quitGame: () => void;
  drawJellies: (count: number) => void;
  surrender: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial Session State
      vsCpuStats: {
        easy: { totalGames: 0, wins: 0, draws: 0 },
        medium: { totalGames: 0, wins: 0, draws: 0 },
        hard: { totalGames: 0, wins: 0, draws: 0 },
      },
      twoPlayerStats: { totalGames: 0, wins: 0, draws: 0 },
      language: 'ko',
      setLanguage: (lang) => set({ language: lang }),
      resetHistory: () =>
        set({
          vsCpuStats: {
            easy: { totalGames: 0, wins: 0, draws: 0 },
            medium: { totalGames: 0, wins: 0, draws: 0 },
            hard: { totalGames: 0, wins: 0, draws: 0 },
          },
          twoPlayerStats: { totalGames: 0, wins: 0, draws: 0 },
        }),

      // Initial Game State
      status: 'IDLE',
      jelliesRemaining: INITIAL_JELLIES,
      bulletsRemaining: 0,
      isBulletRevealed: false,
      currentTurn: 'PLAYER_1',
      scores: { PLAYER_1: 0, PLAYER_2: 0 },
      playerJellies: { PLAYER_1: 0, PLAYER_2: 0 },
      playerBullets: { PLAYER_1: 0, PLAYER_2: 0 },
      winner: null,
      mode: 'VS_CPU',
      cpuDifficulty: 'hard',
      history: [],

      startGame: (mode, difficulty = 'hard') => {
        const bullets = generateBullets();

        set((state) => {
          const newCpuStats = { ...state.vsCpuStats };
          if (mode === 'VS_CPU') {
            newCpuStats[difficulty].totalGames += 1;
          }

          const startingPlayer = mode === 'VS_CPU'
            ? state.vsCpuStats[difficulty].totalGames % 2 === 0 ? 'PLAYER_1' : 'PLAYER_2'
            : state.twoPlayerStats.totalGames % 2 === 0 ? 'PLAYER_1' : 'PLAYER_2';

          return {
            status: 'PLAYING',
            jelliesRemaining: INITIAL_JELLIES,
            bulletsRemaining: bullets,
            isBulletRevealed: false,
            currentTurn: startingPlayer,
            scores: { PLAYER_1: 0, PLAYER_2: 0 },
            playerJellies: { PLAYER_1: 0, PLAYER_2: 0 },
            playerBullets: { PLAYER_1: 0, PLAYER_2: 0 },
            winner: null,
            mode: mode,
            cpuDifficulty: difficulty,
            vsCpuStats: newCpuStats,
            history: [{
              id: 0,
              type: 'START',
              player: startingPlayer,
              count: 0,
              bulletCount: 0,
              scoreDiff: 0,
              bulletsLeft: null,
            }],
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
          playerJellies,
          playerBullets,
          status,
          isBulletRevealed,
          history,
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
        const newPlayerJellies = {
          ...playerJellies,
          [currentTurn]: playerJellies[currentTurn] + count,
        };
        const newPlayerBullets = {
          ...playerBullets,
          [currentTurn]: playerBullets[currentTurn] + bulletsDrawn,
        };

        const newHistory = [...history];

        const drawHistoryItem = {
          id: newHistory.length + 1,
          type: 'DRAW',
          player: currentTurn,
          count: count,
          bulletCount: bulletsDrawn,
          scoreDiff: scoreChange,
          bulletsLeft: isBulletRevealed ? newTotalBullets : null,
        } as HistoryItem;
        newHistory.push(drawHistoryItem);

        const newIsBulletRevealed = isBulletRevealed || bulletsDrawn > 0;

        const isGameOver = newTotalBullets === 0;

        if (!isBulletRevealed && newIsBulletRevealed) {
          const revealHistoryItem = {
            id: newHistory.length + 1,
            type: 'REVEAL',
            player: currentTurn,
            count: 0,
            bulletCount: bulletsDrawn,
            scoreDiff: scoreChange,
            bulletsLeft: newTotalBullets,
          } as HistoryItem;
          newHistory.push(revealHistoryItem);
        }

        if (isGameOver) {
          const p1Score = newScores.PLAYER_1;
          const p2Score = newScores.PLAYER_2;
          let winner: Player | 'DRAW' | null = null;

          if (p1Score > p2Score) winner = 'PLAYER_1';
          else if (p2Score > p1Score) winner = 'PLAYER_2';
          else winner = 'DRAW';

          set((state) => {
            const newCpuStats = { ...state.vsCpuStats };
            const newTwoPlayerStats = { ...state.twoPlayerStats };

            // Only update wins/draws if in VS_CPU mode
            // totalGames was already incremented at start
            if (state.mode === 'VS_CPU') {
              if (winner === 'PLAYER_1') {
                // User won (assuming Player 1 is user in VS CPU)
                newCpuStats[state.cpuDifficulty].wins++;
              } else if (winner === 'DRAW') {
                newCpuStats[state.cpuDifficulty].draws++;
              }
            } else {
              newTwoPlayerStats.totalGames++;
              if (winner === 'PLAYER_1') {
                newTwoPlayerStats.wins++;
              } else if (winner === 'DRAW') {
                newTwoPlayerStats.draws++;
              }
            }

            const endHistoryItem = {
              id: newHistory.length + 2,
              type: 'END',
              player: winner,
              count: count,
              bulletCount: bulletsDrawn,
              scoreDiff: scoreChange,
            } as HistoryItem;
            newHistory.push(endHistoryItem);

            return {
              jelliesRemaining: newTotalJellies,
              bulletsRemaining: newTotalBullets,
              scores: newScores,
              playerJellies: newPlayerJellies,
              playerBullets: newPlayerBullets,
              status: 'ENDED',
              winner,
              vsCpuStats: newCpuStats,
              twoPlayerStats: newTwoPlayerStats,
              isBulletRevealed: newIsBulletRevealed,
              history: newHistory,
            };
          });
        } else {
          // Switch Turn
          const nextTurn = currentTurn === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
          set(() => {
            return {
              jelliesRemaining: newTotalJellies,
              bulletsRemaining: newTotalBullets,
              scores: newScores,
              playerJellies: newPlayerJellies,
              playerBullets: newPlayerBullets,
              currentTurn: nextTurn,
              isBulletRevealed: newIsBulletRevealed,
              history: newHistory,
            };
          });
        }
      },

      surrender: () => {
        const { currentTurn, status, history } = get();
        if (status !== 'PLAYING') return;

        const winner = currentTurn === 'PLAYER_1' ? 'PLAYER_2' : 'PLAYER_1';
        const newHistoryItem = {
          id: history.length + 1,
          type: 'SURRENDER',
          player: winner,
          count: 0,
          bulletCount: 0,
          scoreDiff: 0,
        } as HistoryItem;

        set((state) => {
          if (state.mode === 'VS_HUMAN') {
            const newTwoPlayerStats = { ...state.twoPlayerStats };
            newTwoPlayerStats.totalGames++;
            if (winner === 'PLAYER_1') {
              newTwoPlayerStats.wins++;
            }
            return {
              status: 'ENDED',
              winner,
              twoPlayerStats: newTwoPlayerStats,
              history: [...state.history, newHistoryItem]
            };
          }
          return {
            status: 'ENDED',
            winner,
            history: [...state.history, newHistoryItem]
          };
        });
      },
    }),
    {
      name: 'russian-jelly-storage',
      partialize: (state) => ({
        vsCpuStats: state.vsCpuStats,
        twoPlayerStats: state.twoPlayerStats,
        language: state.language,
      }),
    }
  )
);
