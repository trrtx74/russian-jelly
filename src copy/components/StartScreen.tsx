import styled, { keyframes } from 'styled-components';
import { useGameStore } from '../store/useGameStore';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  gap: 40px;
  position: relative;
  z-index: 10;
`;

const Logo = styled.h1`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 20px ${({ theme }) => theme.colors.primary};
  animation: ${float} 3s ease-in-out infinite;
  text-align: center;
  line-height: 1.2;

  span {
    color: ${({ theme }) => theme.colors.jelly};
    display: block;
    font-size: 2.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 300px;
`;

const MenuButton = styled.button`
  padding: 20px;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 16px;
  backdrop-filter: blur(5px);
  transition: ${({ theme }) => theme.transitions.default};
  font-weight: bold;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.05);
    box-shadow: 0 0 30px ${({ theme }) => theme.colors.primary};
  }
`;

const RulesCard = styled.div`
  ${({ theme }) => theme.glass}
  padding: 20px;
  border-radius: 16px;
  max-width: 400px;
  text-align: left;
  margin-top: 20px;

  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: 10px;
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const StartScreen = () => {
  const { startGame, language } = useGameStore();

  return (
    <Container>
      <Logo>
        RUSSIAN
        <span>JELLY</span>
      </Logo>

      <ButtonGroup>
        <MenuButton onClick={() => startGame('VS_CPU')}>
          {language === 'ko' ? 'VS 컴퓨터' : 'VS CPU'}
        </MenuButton>
        <MenuButton onClick={() => startGame('VS_HUMAN')}>
          {language === 'ko' ? '2인 플레이' : '2 Players'}
        </MenuButton>
      </ButtonGroup>

      <RulesCard>
        <h3>{language === 'ko' ? '게임 요약' : 'Quick Rules'}</h3>
        <p>
          {language === 'ko'
            ? '젤리를 뽑아 점수를 얻으세요. 하지만 총알 젤리를 뽑으면 점수를 잃습니다! 마지막 총알이 나오면 게임 끝.'
            : 'Draw jellies to score. Draw a bullet and lose points! Game ends when the last bullet is found.'}
        </p>
      </RulesCard>
    </Container>
  );
};
