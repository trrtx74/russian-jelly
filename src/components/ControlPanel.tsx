import styled from 'styled-components';
import { useState } from 'react';
import { Jelly } from './Jelly';

interface ControlPanelProps {
  maxJellies: number;
  onDraw: (count: number) => void;
  disabled?: boolean;
}

const PanelContainer = styled.div`
  ${({ theme }) => theme.glass}
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const DrawButton = styled.button<{ isHovered?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #555;
  }
`;

const PreviewContainer = styled.div`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

export const ControlPanel = ({ maxJellies, onDraw, disabled }: ControlPanelProps) => {
  const [hoverCount, setHoverCount] = useState<number | null>(null);

  const buttons = Array.from({ length: maxJellies }, (_, i) => i + 1);

  return (
    <PanelContainer>
      <PreviewContainer>
        {hoverCount &&
          Array.from({ length: hoverCount }).map((_, i) => (
            <Jelly key={i} type="JELLY" isOutline />
          ))}
      </PreviewContainer>
      <ButtonGrid>
        {buttons.map((count) => (
          <DrawButton
            key={count}
            onClick={() => onDraw(count)}
            onMouseEnter={() => setHoverCount(count)}
            onMouseLeave={() => setHoverCount(null)}
            disabled={disabled}
          >
            {count}
          </DrawButton>
        ))}
      </ButtonGrid>
    </PanelContainer>
  );
};
