import styled from 'styled-components';
import { useGameStore } from '../store/useGameStore';

interface NavbarProps {
  onOpenHelp: () => void;
}

const NavContainer = styled.nav`
  ${({ theme }) => theme.glass}
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0 0 16px 16px;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavActions = styled.div`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

export const Navbar = ({ onOpenHelp }: NavbarProps) => {
  const { language, setLanguage, status, quitGame, vsCpuStats } = useGameStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const handleBackToMenu = () => {
    if (status === 'PLAYING') {
      const message = language === 'ko'
        ? '게임이 진행 중입니다. 정말 나가시겠습니까? (패배로 기록될 수 있습니다)'
        : 'Game in progress. Are you sure you want to quit? (May count as a loss)';

      if (window.confirm(message)) {
        quitGame();
      }
    } else {
      quitGame();
    }
  };

  const winRate = vsCpuStats.totalGames > 0
    ? Math.round((vsCpuStats.wins / vsCpuStats.totalGames) * 100)
    : 0;

  return (
    <NavContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Title>Russian Jelly</Title>
        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
          {language === 'ko' ? 'CPU 전적: ' : 'VS CPU: '}
          {vsCpuStats.wins}W / {vsCpuStats.totalGames}G ({winRate}%)
        </div>
      </div>

      <NavActions>
        {status !== 'IDLE' && (
          <NavButton onClick={handleBackToMenu}>
            {language === 'ko' ? '메인 메뉴' : 'Main Menu'}
          </NavButton>
        )}
        <NavButton onClick={toggleLanguage}>
          {language === 'ko' ? 'EN' : 'KO'}
        </NavButton>
        <NavButton onClick={onOpenHelp}>
          ?
        </NavButton>
      </NavActions>
    </NavContainer>
  );
};
