import { useEffect } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/useGameStore';
import { ControlPanel } from './ControlPanel';
import { LogPanel } from './LogPanel';
import { useAgent } from '../services/useAgent';
import { JellyCounter } from './JellyCounter';

// Layout Components
const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: min(600px, 100vw);
  height: 100vh;
  padding: 20px;
  padding-top: 80px; /* Space for Navbar */
  position: relative;
`;

const PlayerSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
`;

const PlayerSection = styled.div<{ $isCurrentTurn: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ $isCurrentTurn }) =>
    $isCurrentTurn ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition: ${({ theme }) => theme.transitions.default};
  border: 2px solid ${({ theme, $isCurrentTurn }) => ($isCurrentTurn ? theme.colors.primary : 'transparent')};
`;

const ScoreDisplay = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const CounterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const GameBoard = () => {
  const {
    status,
    jelliesRemaining,
    bulletsRemaining,
    isBulletRevealed,
    currentTurn,
    scores,
    playerJellies,
    playerBullets,
    drawJellies,
    startGame,
    winner,
    // surrender,
    mode
  } = useGameStore();
  const agent = useAgent();

  useEffect(() => {
    if (status === 'PLAYING' && currentTurn === 'PLAYER_2' && mode === 'VS_CPU') {
      // CPU Turn
      const timer = setTimeout(() => {
        // const action = Agent.predict(jelliesRemaining, bulletsRemaining);
        // getAction(nRem: number, scoreDiff: number, isRevealed: boolean, nRed: number = 0, temperature: number = 0):
        const scoreDiff = scores.PLAYER_2 - scores.PLAYER_1;
        const action = agent.getAction(jelliesRemaining, scoreDiff, isBulletRevealed, bulletsRemaining);
        drawJellies(action.bestK);
      }, 1000); // 1 second "thinking" time

      return () => clearTimeout(timer);
    }
  }, [status, currentTurn, jelliesRemaining, bulletsRemaining, drawJellies]);

  if (status === 'IDLE') {
    return null; // App handles StartScreen now
  }

  const isP1Turn = currentTurn === 'PLAYER_1';
  const isP2Turn = currentTurn === 'PLAYER_2';

  return (
    <BoardContainer>
      <PlayerSectionContainer>
        <PlayerSection $isCurrentTurn={isP1Turn}>
          <h2>PLAYER 1</h2>
          <ScoreDisplay>{scores.PLAYER_1}</ScoreDisplay>
          <JellyCounter count={playerJellies.PLAYER_1} type="JELLY" size={32} />
          <JellyCounter count={playerBullets.PLAYER_1} type="BULLET" size={32} />
          {/* <button
            onClick={surrender}
            style={{
              color: '#f44336',
              marginTop: '20px',
              background: 'transparent',
              border: '1px solid #f44336',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            Surrender
          </button> */}
        </PlayerSection>
        <PlayerSection $isCurrentTurn={isP2Turn}>
          <h2>{mode === 'VS_CPU' ? 'CPU' : 'PLAYER 2'}</h2>
          <ScoreDisplay>{scores.PLAYER_2}</ScoreDisplay>
          <JellyCounter count={playerJellies.PLAYER_2} type="JELLY" size={32} />
          <JellyCounter count={playerBullets.PLAYER_2} type="BULLET" size={32} />
          {/* <button
            onClick={surrender}
            style={{
              color: '#f44336',
              marginTop: '20px',
              background: 'transparent',
              border: '1px solid #f44336',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
          >
            Surrender
          </button> */}
        </PlayerSection>
      </PlayerSectionContainer>

      <CounterContainer>
        <JellyCounter count={jelliesRemaining} type="JELLY" />
        <JellyCounter count={isBulletRevealed ? bulletsRemaining : null} type="BULLET" />
      </CounterContainer>

      {status === 'PLAYING' ? (
        <ControlPanel
          maxJellies={jelliesRemaining}
          onDraw={drawJellies}
          disabled={
            status !== 'PLAYING' ||
            (currentTurn === 'PLAYER_2' && mode === 'VS_CPU')
          }
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h1>{winner === 'DRAW' ? 'DRAW!' : `${winner} WINS!`}</h1>
          <button
            onClick={() => startGame(mode)}
            style={{
              marginTop: '20px',
              padding: '15px 30px',
              fontSize: '1.5rem',
              background: '#4caf50',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Next Round
          </button>
        </div>
      )}
      <LogPanel />
    </BoardContainer>
  );
};

export default GameBoard;
