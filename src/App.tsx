import { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import GameBoard from './components/GameBoard';
import { Navbar } from './components/Navbar';
import { StartScreen } from './components/StartScreen';
import { HelpModal } from './components/HelpModal';
import { useGameStore } from './store/useGameStore';

function App() {
  const { status, language } = useGameStore();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle theme={theme} />
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />

      {status === 'IDLE' ? <StartScreen /> : <GameBoard />}

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />
    </ThemeProvider>
  );
}

export default App;
