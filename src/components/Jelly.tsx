interface JellyProps {
  type?: 'JELLY' | 'BULLET';
  size?: number;
};

export const Jelly = ({
  type = 'JELLY',
  size = 64,
}: JellyProps) => {
  // const faceColor = '#ffffaadf';
  // const shadeColor = '#ffffff86';
  const faceColor = type === 'JELLY' ? '#FFFFAA' : '#cccc64';
  const shadeColor = type === 'JELLY' ? '#ffffff' : '#b39f45';
  const strokeColor = type === 'JELLY' ? '#8a8a50' : '#c41700';
  const strokeScale = 64 / size;
  return (
    <svg
      width={size}
      height={size}
      viewBox="10 10 80 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={type === 'JELLY' ? 'topGrad' : 'bulletTopGrad'} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={shadeColor} />
          <stop offset="40%" stopColor={faceColor} />
          <stop offset="60%" stopColor={faceColor} />
          <stop offset="100%" stopColor={shadeColor} />
        </linearGradient>

        <linearGradient id={type === 'JELLY' ? 'leftGrad' : 'bulletLeftGrad'} x1="0" y1="0" x2="0.5" y2="1.2">
          <stop offset="0%" stopColor={shadeColor} />
          <stop offset="40%" stopColor={faceColor} />
          <stop offset="60%" stopColor={faceColor} />
          <stop offset="100%" stopColor={shadeColor} />
        </linearGradient>

        <linearGradient id={type === 'JELLY' ? 'rightGrad' : 'bulletRightGrad'} x1="1" y1="0" x2="0.5" y2="1.2">
          <stop offset="0%" stopColor={shadeColor} />
          <stop offset="40%" stopColor={faceColor} />
          <stop offset="60%" stopColor={faceColor} />
          <stop offset="100%" stopColor={shadeColor} />
        </linearGradient>

        <linearGradient id="bulletGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00000064" />
          <stop offset="100%" stopColor="#a11e1e62" />
        </linearGradient>
      </defs>

      {/* top */}
      <polygon
        points="50 20, 80 32, 50 49, 20 32"
        fill={type === 'JELLY' ? 'url(#topGrad)' : 'url(#bulletTopGrad)'}
        stroke={strokeColor}
        strokeWidth={strokeScale}
      />

      {/* left */}
      <polygon
        points="20 32, 50 49, 50 85, 22.6 66.5"
        fill={type === 'JELLY' ? 'url(#leftGrad)' : 'url(#bulletLeftGrad)'}
        stroke={strokeColor}
        strokeWidth={strokeScale}
      />

      {/* right */}
      <polygon
        points="80 32, 50 49, 50 85, 77.4 66.5"
        fill={type === 'JELLY' ? 'url(#rightGrad)' : 'url(#bulletRightGrad)'}
        stroke={strokeColor}
        strokeWidth={strokeScale}
      />

      {type === 'BULLET' && (
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="url(#bulletGrad)"
        />
      )}

      {/* outline */}
      <polygon
        points="50 20, 80 32, 77.4 66.5, 50 85, 22.6 66.5, 20 32"
        fill="transparent"
        stroke={strokeColor}
        strokeWidth={2 * strokeScale}
      />
    </svg>
  );
};