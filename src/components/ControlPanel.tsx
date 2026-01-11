import styled from 'styled-components';
// import { GiCardPickup } from "react-icons/gi";
import { useGameStore } from '../store/useGameStore';
import { useState } from 'react';
// import { Jelly } from './Jelly';

interface ControlPanelProps {
  maxJellies: number;
  onDraw: (count: number) => void;
  disabled?: boolean;
}

const PanelContainer = styled.div`
  padding: 20px;
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const ButtonGrid = styled.div`
  width: 440px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 240px;
    height: 150px;
    overflow-y: auto;
  }
`;

const DrawButton = styled.button<{ $isHighlighted?: boolean, $isHovered?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  transition: ${({ theme }) => theme.transitions.fast};
  transform: ${({ $isHovered }) => $isHovered ? 'scale(1)' : 'scale(0.9)'};

  background: ${({ theme, $isHighlighted }) => $isHighlighted ? theme.colors.primary : 'transparent'};
  font-size: ${({ $isHovered }) => $isHovered ? '1.5rem' : '1rem'};

  &:disabled {
    opacity: 0.5;
    cursor: default;
    color: transparent;
    background: transparent;
    border-color: #555;
    border-radius: 50%;
    transform: scale(0.2);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: ${({ $isHovered }) => $isHovered ? '2rem' : '1.5rem'};

    &:disabled {
      display: none;
    }
  }
`;

const Filler = styled.div`
  width: 40px;
  height: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ConfirmButton = styled.button`
  width: 240px;
  height: 60px;

  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
  font-weight: bold;

  &:disabled {
    opacity: 0.5;
    cursor: default;
    background: transparent;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const ControlPanel = ({ maxJellies, onDraw, disabled }: ControlPanelProps) => {
  const { language } = useGameStore();
  const [hoverCount, setHoverCount] = useState<number | null>(null);
  // const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>, count: number) => {
    if (e.pointerType === 'touch') {
      setHoverCount(count);
      // setSelectedCount(count);
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>, count: number) => {
    if (e.pointerType === 'mouse') {
      onDraw(count);
    }
  }

  // const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>, count: number) => {
  //   setHoverCount(count);
  //   if (e.pointerType === 'touch') {
  //     setSelectedCount(count);
  //   }
  // }

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>, count: number) => {
    if (e.pointerType === 'mouse') {
      setHoverCount(count);
    }
  }

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse') {
      setHoverCount(null);
    }
  }

  const handleConfirm = () => {
    onDraw(hoverCount || 1);
    setHoverCount(null);
  }

  const buttons = [
    0, 0, 1, 2, 3, 4, 5, 6, 7, 0, 0,
    0, 8, 9, 10, 11, 12, 13, 14, 15, 16, 0,
    17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  ]

  return (
    <PanelContainer>
      {/* <PreviewContainer>
        {hoverCount &&
          Array.from({ length: hoverCount }).map((_, i) => (
            <Jelly key={i} type="JELLY" />
          ))}
      </PreviewContainer> */}
      <ButtonGrid>
        {buttons.map((count, i) => {
          if (count === 0) {
            return <Filler key={`filler-${i}`} />;
          } else {
            return (
              <DrawButton
                key={`button-${i}`}
                // onClick={(e) => onButtonClick(e, count)}
                // onMouseEnter={() => setHoverCount(count)}
                // onMouseLeave={() => setHoverCount(null)}
                onPointerEnter={(e) => handlePointerEnter(e, count)}
                onPointerLeave={(e) => handlePointerLeave(e)}
                // onPointerMove={(e) => onPointerMove(e, count)}
                onPointerUp={(e) => handlePointerUp(e, count)}
                onPointerDown={(e) => handlePointerDown(e, count)}
                disabled={disabled || count > maxJellies}
                $isHighlighted={(hoverCount || 0) >= count}
                $isHovered={hoverCount === count}
              >
                {count}
              </DrawButton>
            );
          }
        })}
      </ButtonGrid>
      <ConfirmButton
        onClick={handleConfirm}
        disabled={!hoverCount}
      >
        {language === 'ko' ? (hoverCount ? `${hoverCount}개 뽑기` : '뽑기') : (hoverCount ? `Draw ${hoverCount}` : 'Draw')}
        {/* {hoverCount ? `${hoverCount}` : ''} <GiCardPickup /> */}
      </ConfirmButton>
    </PanelContainer>
  );
};
