import styled from 'styled-components';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ko' | 'en';
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  backdrop-filter: blur(5px);
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  text-align: center;
`;

const Content = styled.div`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  font-size: 0.95rem;

  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    margin: 15px 0 5px;
  }

  ul {
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 5px;
  }
`;

const CloseButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const HelpModal = ({ isOpen, onClose, language }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>{language === 'ko' ? '게임 규칙' : 'Game Rules'}</Title>
        <Content>
          {language === 'ko' ? (
            <>
              <h3>1. 게임 목표</h3>
              <p>상대방보다 더 높은 점수를 얻으면 승리합니다.</p>

              <h3>2. 진행 방법</h3>
              <ul>
                <li>젤리 박스에는 총 27개의 젤리가 들어있습니다.</li>
                <li>그 중 1~8개는 '총알 젤리'입니다. (게임 시작 시 비공개)</li>
                <li>자신의 턴에 원하는 만큼 젤리를 뽑을 수 있습니다.</li>
              </ul>

              <h3>3. 점수 계산</h3>
              <ul>
                <li>성공 (총알 없음): 2^(뽑은 개수 - 1) 점 획득</li>
                <li>실패 (총알 포함): -(뽑은 총알 수 * 2^(뽑은 개수 - 1)) 점 감점</li>
              </ul>

              <h3>4. 종료 조건</h3>
              <p>마지막 총알 젤리가 뽑히면 즉시 게임이 종료됩니다.</p>
            </>
          ) : (
            <>
              <h3>1. Objective</h3>
              <p>Score more points than your opponent to win.</p>

              <h3>2. Gameplay</h3>
              <ul>
                <li>The box contains 27 jellies.</li>
                <li>There are 1 to 8 'Bullet Jellies' hidden inside.</li>
                <li>On your turn, draw as many jellies as you dare.</li>
              </ul>

              <h3>3. Scoring</h3>
              <ul>
                <li>Success (No Bullets): Gain 2^(draw count - 1) points.</li>
                <li>Failure (Bullet Hit): Lose (bullet count * 2^(draw count - 1)) points.</li>
              </ul>

              <h3>4. Game Over</h3>
              <p>The game ends immediately when the LAST bullet jelly is drawn.</p>
            </>
          )}
        </Content>
        <CloseButton onClick={onClose}>{language === 'ko' ? '닫기' : 'Close'}</CloseButton>
      </ModalContainer>
    </Overlay>
  );
};
