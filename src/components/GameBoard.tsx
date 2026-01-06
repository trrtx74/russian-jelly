import { useEffect } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/useGameStore';
import { ControlPanel } from './ControlPanel';
import { cpuAgent } from '../services/agent';

// Layout Components
const BoardContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: space-between;
  padding: 20px;
  padding-top: 80px; /* Space for Navbar */
  position: relative;
  
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    gap: 20px;
  }
`;

const PlayerSection = styled.div<{ isCurrentTurn: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ isCurrentTurn }) =>
    isCurrentTurn ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  transition: ${({ theme }) => theme.transitions.default};
  border: 1px solid ${({ theme, isCurrentTurn }) => (isCurrentTurn ? theme.colors.primary : 'transparent')};
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    width: 100%;
    padding: 10px;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const CenterSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
    gap: 20px;
    order: -1; /* Move center section (gameplay) to middle usually? No, let's keep order or maybe put P2 at top? */
    /* Let's keep standard source order: P1, Center, P2 */
    /* Actually on mobile: P2(Top/Opponent), Center, P1(Bottom/Self) is common in card games */
    /* But for this simplicity, let's just stack: P1, Center, P2 or Center in middle. */
    width: 100%;
  }
`;

const ScoreDisplay = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PinkBox = styled.div`
  width: 300px;
  height: 200px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 0, 127, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const BulletCount = styled.div`
  margin-top: 10px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GameBoard = () => {
  const {
    status,
    jelliesRemaining,
    bulletsRemaining,
    isBulletRevealed,
    currentTurn,
    scores,
    drawJellies,
    startGame,
    winner,
    surrender,
    mode
  } = useGameStore();

  useEffect(() => {
    if (status === 'PLAYING' && currentTurn === 'PLAYER_2' && mode === 'VS_CPU') {
      // CPU Turn
      const timer = setTimeout(() => {
        const action = cpuAgent.predict(jelliesRemaining, bulletsRemaining);
        drawJellies(action);
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
      {/* Player 1 Section */}
      <PlayerSection isCurrentTurn={isP1Turn}>
        <h2>PLAYER 1</h2>
        <ScoreDisplay>{scores.PLAYER_1}</ScoreDisplay>
      </PlayerSection>

      {/* Center Section */}
      <CenterSection>
        {status === 'ENDED' ? (
          <div style={{ textAlign: 'center' }}>
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
        ) : (
          <>
            <ControlPanel
              maxJellies={jelliesRemaining}
              onDraw={drawJellies}
              disabled={
                status !== 'PLAYING' ||
                (currentTurn === 'PLAYER_2' && mode === 'VS_CPU')
              }
            />

            <PinkBox>
              <h3 style={{ color: 'white' }}>JELLY BOX</h3>
            </PinkBox>

            <BulletCount>
              Bullets Remaining: {isBulletRevealed ? bulletsRemaining : '?'}
            </BulletCount>

            <button
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
            </button>
          </>
        )}
      </CenterSection>

      {/* Player 2 Section */}
      <PlayerSection isCurrentTurn={isP2Turn}>
        <h2>PLAYER 2 (CPU)</h2>
        <ScoreDisplay>{scores.PLAYER_2}</ScoreDisplay>
      </PlayerSection>
    </BoardContainer>
  );
};

export default GameBoard;
