import styled, { keyframes, css } from 'styled-components';

interface JellyProps {
  type: 'JELLY' | 'BULLET';
  isOutline?: boolean;
}

const popAnimation = keyframes`
  0% { transform: scale(0.5) translateY(20px); opacity: 0; }
  50% { transform: scale(1.1) translateY(-10px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
`;

export const Jelly = styled.div<JellyProps>`
  width: 40px;
  height: 40px;
  border-radius: 8px; /* Slightly rounded rect as requested */
  margin: 2px;
  
  ${({ theme, type, isOutline }) => {
    if (isOutline) {
      return css`
        border: 2px solid ${type === 'JELLY' ? theme.colors.jelly : theme.colors.bullet};
        background: transparent;
      `;
    }
    return css`
      background-color: ${type === 'JELLY' ? theme.colors.jelly : theme.colors.bullet};
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    `;
  }}

  animation: ${popAnimation} 0.3s ease-out;
`;
