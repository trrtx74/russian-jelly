import styled from "styled-components";
import { useEffect, useState } from "react";
import { Jelly } from "./Jelly";
import { FaPlus } from "react-icons/fa";

interface Props {
  count: number | null;
  type?: 'JELLY' | 'BULLET' | 'COMBINED';
  size?: number;
  diffEffect?: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Counter = styled.h2`
  position: relative;
  width: 2rem;
  font-size: 1.5rem;
  margin-left: 10px;
`;

const CounterDiff = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0;

  @keyframes CounterDiffAnimation1 {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }

  @keyframes CounterDiffAnimation2 {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

export const JellyCounter = ({
  count,
  type = 'JELLY',
  size = 64,
  diffEffect = false,
}: Props) => {
  const [anim, setAnim] = useState<number | null>(null);
  const [diff, setDiff] = useState(0);
  const [prevCount, setPrevCount] = useState(count);

  useEffect(() => {
    if (count !== null && prevCount !== null) {
      setDiff(count - prevCount);
      setPrevCount(count);

      if (diffEffect) {
        if (count === 0) {
          setAnim(null);
        } else {
          setAnim(anim ? 3 - anim : 1);
        }
      }
    }
  }, [count]);

  if (type === 'COMBINED') {
    return (
      <Container>
        <Jelly type="BULLET" size={size} />
        <FaPlus size={size / 4} />
        <Jelly type="JELLY" size={size} />
        <Counter>
          {count}
        </Counter>
      </Container>
    );
  }

  return (
    <Container>
      <Jelly type={type} size={size} />
      <Counter>
        {count !== null ? count : '?'}
        {diffEffect &&
          <CounterDiff
            style={{ animation: anim !== null ? `CounterDiffAnimation${anim} 2s` : 'none' }}
          >
            +{diff}
          </CounterDiff>
        }
      </Counter>
    </Container>
  );
};