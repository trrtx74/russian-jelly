import styled from "styled-components";
import { useEffect, useState } from "react";
import { Jelly } from "./Jelly";

interface Props {
  jellyCount: number;
  bulletCount: number;
  size?: number;
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Container = styled.div`
  width: 160px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  opacity: 0;
  
  z-index: 1;
  pointer-events: none;

  @keyframes IndicatorAnimation1 {
    0% {
      opacity: 1;
      transform: translate(-50%, 10px);
    }
    40% {
      transform: translate(-50%, -6px);
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
  }

  @keyframes IndicatorAnimation2 {
    0% {
      opacity: 1;
      transform: translate(-50%, 10px);
    }
    40% {
      transform: translate(-50%, -6px);
      opacity: 0.8;
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
  }
`;

export const JellyIndicator = ({
  jellyCount,
  bulletCount,
  size = 32,
}: Props) => {
  const [anim, setAnim] = useState<number | null>(null);
  const [prevCount, setPrevCount] = useState([jellyCount, bulletCount]);
  const [jellyArray, setJellyArray] = useState<("JELLY" | "BULLET")[]>([]);

  useEffect(() => {
    if (jellyCount !== null && bulletCount !== null && prevCount !== null) {
      const newDiff = [jellyCount - prevCount[0], bulletCount - prevCount[1]];
      setPrevCount([jellyCount, bulletCount]);

      const newJellyArray = getRandomJellyArray(newDiff[0], newDiff[1]);
      setJellyArray(newJellyArray);

      if (jellyCount === 0 && bulletCount === 0) {
        setAnim(null);
      } else {
        setAnim(anim ? 3 - anim : 1);
      }
    }
  }, [jellyCount, bulletCount]);

  return (
    <Wrapper>
      <Container
        style={{ animation: anim !== null ? `IndicatorAnimation${anim} 2s` : 'none' }}
      >
        {jellyArray.map((type, i) => {
          const marginFactor = (jellyArray.length < 5 && i === 0)
          ? (5 - jellyArray.length) // single row only case
          : (i % 9 === 5) ? 1 : 0; // for even rows
          return (
            <Jelly
              key={i}
              type={type}
              size={size}
              marginLeft={marginFactor * size / 2}
              marginBottom={-size * 0.2}
            />
          );
        })}
      </Container>
    </Wrapper>
  );
};

const getRandomJellyArray = (a: number, b: number) => {
  const total = a + b;

  return Array.from({ length: total }, () => {
    const p = a / (a + b);
    if (Math.random() < p) {
      a--;
      return 'JELLY';
    } else {
      b--;
      return 'BULLET';
    }
  });
};


// import styled from "styled-components";
// import { useEffect, useState } from "react";
// import { Jelly } from "./Jelly";

// interface Props {
//   jellyCount: number;
//   bulletCount: number;
//   size?: number;
//   animDirection?: 'LEFT' | 'RIGHT' | 'NONE';
// };

// const Wrapper = styled.div`
//   position: relative;
//   width: 100%;

//   @keyframes IndicatorWrapperAnimationLEFT1 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(-20px);
//     }
//     100% {
//       transform: translateX(-20px);
//     }
//   }

//   @keyframes IndicatorWrapperAnimationLEFT2 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(-20px);
//     }
//     100% {
//       transform: translateX(-20px);
//     }
//   }

//   @keyframes IndicatorWrapperAnimationRIGHT1 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(20px);
//     }
//     100% {
//       transform: translateX(20px);
//     }
//   }

//   @keyframes IndicatorWrapperAnimationRIGHT2 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(20px);
//     }
//     100% {
//       transform: translateX(20px);
//     }
//   }

//   @keyframes IndicatorWrapperAnimationNONE1 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(0);
//     }
//     100% {
//       transform: translateX(0);
//     }
//   }

//   @keyframes IndicatorWrapperAnimationNONE2 {
//     0% {
//       transform: translateX(0);
//     }
//     40% {
//       transform: translateX(0);
//     }
//     100% {
//       transform: translateX(0);
//     }
//   }
// `;

// const Container = styled.div`
//   width: 160px;
//   position: absolute;
//   top: 0;
//   left: 50%;
//   transform: translateX(-50%);
//   display: flex;
//   flex-wrap: wrap;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   opacity: 0;
  
//   z-index: 1;
//   pointer-events: none;

//   @keyframes IndicatorAnimation1 {
//     0% {
//       opacity: 1;
//       transform: translate(-50%, 10px);
//     }
//     40% {
//       transform: translate(-50%, -6px);
//       opacity: 0.8;
//     }
//     100% {
//       opacity: 0;
//       transform: translate(-50%, -10px);
//     }
//   }

//   @keyframes IndicatorAnimation2 {
//     0% {
//       opacity: 1;
//       transform: translate(-50%, 10px);
//     }
//     40% {
//       transform: translate(-50%, -6px);
//       opacity: 0.8;
//     }
//     100% {
//       opacity: 0;
//       transform: translate(-50%, -10px);
//     }
//   }
// `;

// export const JellyIndicator = ({
//   jellyCount,
//   bulletCount,
//   size = 32,
//   animDirection = 'NONE',
// }: Props) => {
//   const [anim, setAnim] = useState<number | null>(null);
//   const [prevCount, setPrevCount] = useState([jellyCount, bulletCount]);
//   const [jellyArray, setJellyArray] = useState<("JELLY" | "BULLET")[]>([]);

//   useEffect(() => {
//     if (jellyCount !== null && bulletCount !== null && prevCount !== null) {
//       const newDiff = [jellyCount - prevCount[0], bulletCount - prevCount[1]];
//       setPrevCount([jellyCount, bulletCount]);

//       const newJellyArray = getRandomJellyArray(newDiff[0], newDiff[1]);
//       setJellyArray(newJellyArray);

//       if (jellyCount === 0 && bulletCount === 0) {
//         setAnim(null);
//       } else {
//         setAnim(anim ? 3 - anim : 1);
//       }
//     }
//   }, [jellyCount, bulletCount]);

//   return (
//     <Wrapper
//       style={{ animation: anim !== null ? `IndicatorWrapperAnimation${animDirection}${anim} 2s` : 'none' }}
//     >
//       <Container
//         style={{ animation: anim !== null ? `IndicatorAnimation${anim} 2s` : 'none' }}
//       >
//         {jellyArray.map((type, i) => (
//           <Jelly key={i} type={type} size={size} />
//         ))}
//       </Container>
//     </Wrapper>
//   );
// };

// const getRandomJellyArray = (a: number, b: number) => {
//   const total = a + b;

//   return Array.from({ length: total }, () => {
//     const p = a / (a + b);
//     if (Math.random() < p) {
//       a--;
//       return 'JELLY';
//     } else {
//       b--;
//       return 'BULLET';
//     }
//   });
// };
