export const theme = {
  colors: {
    background: '#1a1a2e', // Deep dark blue/black
    surface: 'rgba(255, 255, 255, 0.1)', // Glassmorphism base
    primary: '#ff007f', // Hot Pink
    primaryHover: '#ff3399',
    secondary: '#00d4ff', // Cyan/Sky blue for contrast
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    jelly: '#ffd700', // Gold/Yellow for Jelly
    bullet: '#000000', // Black for Bullet
    success: '#4caf50',
    error: '#f44336',
  },
  glass: `
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `,
  borderRadius: '16px',
  transitions: {
    default: '0.3s ease',
    fast: '0.1s ease',
  },
};

export type Theme = typeof theme;
