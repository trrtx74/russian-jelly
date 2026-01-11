import styled from "styled-components";
import { Jelly } from "./Jelly";

interface Props {
  count: number | null;
  type?: 'JELLY' | 'BULLET';
  size?: number;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Counter = styled.h2`
  width: 2rem;
  font-size: 1.5rem;
`;

export const JellyCounter = ({
  count,
  type = 'JELLY',
  size = 64,
}: Props) => {
  return (
    <Container>
      <Jelly type={type} size={size} />
      <Counter>{count !== null ? count : '?'}</Counter>
    </Container>
  );
};