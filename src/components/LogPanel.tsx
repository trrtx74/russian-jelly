import styled from 'styled-components';
import { useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const Container = styled.div`
  width: 100%;
  /* height: 200px; */
  padding: 10px 0;
  flex: 1;
  min-height: 0;

  border: 1px solid #4F451A;
  border-radius: 6px;

  background-color: #4F451A30;
`;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
`

export const LogPanel = () => {
  const { language, history, mode } = useGameStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const logs = [...history].reverse().map((log) => {
    const playerStr = mode === 'VS_CPU'
      ? log.player === 'PLAYER_1' ? '1P' : 'CPU'
      : log.player === 'PLAYER_1' ? '1P' : '2P';
    const oppStr = log.player === 'PLAYER_1' ? '2P' : '1P';
    if (log.type === 'START') {
      return (language === 'ko'
        ? `게임 시작! ${playerStr}가 먼저 뽑습니다.`
        : `Game started! ${playerStr} goes first.`
      )
    } else if (log.type === 'SURRENDER') {
      return (language === 'ko'
        ? `[${playerStr}] 항복! ${oppStr} 승리!`
        : `[${playerStr}] surrenders! ${oppStr} wins!`
      )
    } else if (log.type === 'DRAW') {
      if (log.bulletCount === 0) {
        return (language === 'ko'
          ? `[${playerStr}] 젤리 ${log.count}개를 뽑았습니다. (+${log.scoreDiff.toLocaleString()}점)`
          : `[${playerStr}] Drew ${log.count} ${log.count === 1 ? 'jelly' : 'jellies'} (+${log.scoreDiff.toLocaleString()} points)`
        )
      }
      return (language === 'ko'
        ? `[${playerStr}] 젤리 ${log.count}개 중 총알이 ${log.bulletCount}개 뽑혔습니다. (${log.scoreDiff.toLocaleString()}점)`
        : `[${playerStr}] ${log.count} ${log.count === 1 ? 'jelly' : 'jellies'} drawn, contained ${log.bulletCount} ${log.bulletCount === 1 ? 'bullet' : 'bullets'}. (${log.scoreDiff.toLocaleString()} points)`
      )
    } else if (log.type === 'REVEAL') {
      return (language === 'ko'
        ? `첫 총알이 뽑혔습니다. 남은 총알은 ${log.bulletsLeft}개 입니다.`
        : `First bullet drawn. ${log.bulletsLeft} ${log.bulletsLeft === 1 ? 'bullet' : 'bullets'} left.`
      );
    } else if (log.type === 'END') {
      return (language === 'ko' ? `${playerStr} 승리!` : `${playerStr} wins!`);
    } else {
      return '.';
    }
  });

  // useEffect(() => {
  //   if (!panelRef.current) return;

  //   panelRef.current.scrollTop =
  //     panelRef.current.scrollHeight;
  // }, [logs]);

  return (
    <Container>
      <Panel ref={panelRef}>
        {logs.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </Panel>
    </Container>
  );
};