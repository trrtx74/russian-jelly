import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

const Container = styled.div`
  width: 100%;
  /* height: 200px; */
  padding: 10px 0;
  flex: 1;
  min-height: 0;

  border: 1px solid #101010;
  border-radius: 6px;

  background-color: #10101030;
`;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0 20px;
`

export const LogPanel = () => {
  const { language, history } = useGameStore();
  const panelRef = useRef<HTMLDivElement>(null);

  const logs = history.map((log) => {
    if (log.type === 'START') {
      return (language === 'ko'
        ? `게임 시작! ${log.player}가 먼저 뽑습니다.`
        : `Game started! ${log.player} goes first.`
      )
    } else if (log.type === 'SURRENDER') {
      return (language === 'ko'
        ? `${log.player} 포기!`
        : `${log.player} surrenders!`
      )
    } else if (log.type === 'DRAW') {
      if (log.bulletCount === 0) {
        return (language === 'ko'
          ? `${log.player}: 젤리 ${log.count}개를 뽑았습니다.`
          : `${log.player}: Drew ${log.count} ${log.count === 1 ? 'jelly' : 'jellies'}.`
        )
      }
      return (language === 'ko'
        ? `${log.player}: ${log.count}개를 뽑았고, 총알이 ${log.bulletCount}개 뽑혔습니다.`
        : `${log.player}: ${log.count} ${log.count === 1 ? 'jelly' : 'jellies'} drawn, contained ${log.bulletCount} ${log.bulletCount === 1 ? 'bullet' : 'bullets'}.`
      )
    } else if (log.type === 'REVEAL') {
      return (language === 'ko'
        ? `첫 총알이 뽑혔습니다. 남은 총알은 ${log.bulletsLeft}개 입니다.`
        : `First bullet drawn. ${log.bulletsLeft} ${log.bulletsLeft === 1 ? 'bullet' : 'bullets'} left.`
      );
    } else if (log.type === 'END') {
      return (language === 'ko' ? `${log.player} 승리!` : `${log.player} wins!`);
    } else {
      return '.';
    }
  });

  useEffect(() => {
    if (!panelRef.current) return;

    panelRef.current.scrollTop =
      panelRef.current.scrollHeight;
  }, [logs]);

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