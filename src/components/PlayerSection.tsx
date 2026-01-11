import styled from "styled-components";
import { JellyCounter } from "./JellyCounter";
import { useEffect, useState } from "react";

interface Props {
  isCurrentTurn: boolean;
  name: string;
  score: number;
  jellies: number;
  bullets: number;
}

const Container = styled.div<{ $isCurrentTurn: boolean }>`
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

const ScoreDisplay = styled.h2<{ $size?: number }>`
  position: relative;
  font-size: ${({ $size }) => `${$size || 2}rem`};
  color: ${({ theme }) => theme.colors.text};
`;

const ScoreDiff = styled.div<{ $isBad?: boolean }>`
  position: absolute;
  top: 0;
  left: 100%;
  font-size: 1.8rem;
  margin-left: 10px;
  color: ${({ theme, $isBad }) => $isBad ? theme.colors.error : theme.colors.success};
  opacity: 0;

  @keyframes ScoreDiffAnimation1 {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  @keyframes ScoreDiffAnimation2 {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

export const PlayerSection = ({
  isCurrentTurn,
  name,
  score,
  jellies,
  bullets,
}: Props) => {
  const [anim, setAnim] = useState<number | null>(null);
  const [diff, setDiff] = useState(0);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (score !== null && prevScore !== null) {
      setDiff(score - prevScore);
      setPrevScore(score);

      if (jellies === 0) {
        setAnim(null);
      } else {
        setAnim(anim ? 3 - anim : 1);
      }
    }
  }, [score]);

  const scoreSize = (score < 1000 && score > -1000)
    ? 2
    : (score < 100000 && score > -100000)
      ? 1.8
      : 1.5;

  return (
    <Container $isCurrentTurn={isCurrentTurn}>
      <h2>{name}</h2>
      <ScoreDisplay $size={scoreSize}>
        {score.toLocaleString()}
        <ScoreDiff
          style={{ animation: anim ? `ScoreDiffAnimation${anim} 3s` : 'none' }}
          $isBad={diff < 0}
        >
          {diff > 0 && "+"}{diff.toLocaleString()}
        </ScoreDiff>
      </ScoreDisplay>
      <JellyCounter count={jellies - bullets} type="JELLY" size={32} />
      <JellyCounter count={bullets} type="BULLET" size={32} />
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
    </Container>
  )
}