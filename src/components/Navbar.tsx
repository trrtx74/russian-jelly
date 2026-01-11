import styled from 'styled-components';
import { useGameStore } from '../store/useGameStore';
import { FaHome, FaGlobe, FaQuestion, FaTrophy } from "react-icons/fa";
import { useState } from 'react';

interface NavbarProps {
  onOpenHelp: () => void;
}

const NavContainer = styled.nav`
  width: 100%;
  /* height: 60px; */
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  box-shadow: 0 2px 6px #D1C8A3;

  @media (max-width: 768px) {
    padding: 10px 10px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NavActions = styled.div`
  position: relative;
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text};

  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #D1C8A3;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.8rem;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.text};
  }

  &:active:not(:disabled) {
    transform: translateY(2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const StatsContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 16px;
  top: 100%;

  width: 200px;

  padding: 10px;
  border: 1px solid #D1C8A3;
  border-radius: 16px 0 16px 16px;

  background-color: ${({ theme }) => theme.colors.background};
`

export const Navbar = ({ onOpenHelp }: NavbarProps) => {
  const { language, setLanguage, status, quitGame, vsCpuStats, twoPlayerStats } = useGameStore();
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  const handleBackToMenu = () => {
    if (status === 'PLAYING') {
      const message = language === 'ko'
        ? '정말 나가시겠습니까?'
        : 'Are you sure you want to quit?';

      if (window.confirm(message)) {
        quitGame();
      }
    } else {
      quitGame();
    }
  };

  const cpuStats = `${vsCpuStats.hard.wins} / ${vsCpuStats.hard.draws} / ${vsCpuStats.hard.totalGames - vsCpuStats.hard.wins - vsCpuStats.hard.draws} (${(vsCpuStats.hard.wins / vsCpuStats.hard.totalGames || 0).toFixed(1)}%)`;
  const humanStats = `${twoPlayerStats.wins} / ${twoPlayerStats.draws} / ${twoPlayerStats.totalGames - twoPlayerStats.wins - twoPlayerStats.draws} (${(twoPlayerStats.wins / twoPlayerStats.totalGames || 0).toFixed(1)}%)`;

  return (
    <NavContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Title>RUSSIAN JELLY</Title>
      </div>

      <NavActions>
        <NavButton onClick={handleBackToMenu} disabled={status === 'IDLE'}>
          <FaHome size={16} />
        </NavButton>
        <NavButton onClick={toggleLanguage}>
          <FaGlobe size={16} />
        </NavButton>
        <NavButton onClick={onOpenHelp}>
          <FaQuestion size={16} />
        </NavButton>
        <NavButton onClick={() => setIsStatsOpen(!isStatsOpen)} onBlur={() => setIsStatsOpen(false)}>
          <FaTrophy size={16} />
        </NavButton>
        {isStatsOpen && (
          <StatsContainer>
            <h4>VS CPU</h4>
            <p>{cpuStats}</p>
            <h4>1P VS 2P</h4>
            <p>{humanStats}</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{language === 'ko' ? '(승/무/패)' : '(Win/Lose/Draw)'}</p>
          </StatsContainer>
        )}
      </NavActions>
    </NavContainer>
  );
};
