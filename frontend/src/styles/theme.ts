export const theme = {
  colors: {
    bgDeep: '#020617',
    bgPrimary: '#090d16',
    bgSecondary: '#0f172a',
    bgElevated: '#1e293b',
    bgHover: '#111827',
    bgHoverLight: '#26354d',
    accent: '#38bdf8',
    accentMuted: 'rgba(56, 189, 248, 0.15)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textDim: '#475569',
    border: '#1e293b',
    borderLight: '#334155',
    error: '#f87171',
    warning: '#f59e0b',
    success: '#34d399',
  },
  spacing: {
    xs: '6px',
    sm: '12px',
    md: '20px',
    lg: '30px',
    xl: '40px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadow: {
    sm: '0 4px 12px rgba(0, 0, 0, 0.25)',
    md: '0 10px 24px rgba(0, 0, 0, 0.35)',
    lg: '0 18px 40px rgba(0, 0, 0, 0.45)',
    glow: '0 0 20px rgba(56, 189, 248, 0.2)',
  },
  transition: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '0.35s cubic-bezier(0.22, 1, 0.36, 1)',
  },
  sidebar: {
    width: '220px',
  },
  font: {
    family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
} as const;

export type HoverStyle = {
  transform?: string;
  boxShadow?: string;
  borderColor?: string;
  backgroundColor?: string;
  color?: string;
};

export function hoverLift(isHovered: boolean, intensity: 'sm' | 'md' | 'lg' = 'md'): HoverStyle {
  const lifts = { sm: '-2px', md: '-4px', lg: '-6px' };
  return {
    transform: isHovered ? `translateY(${lifts[intensity]})` : 'translateY(0)',
    boxShadow: isHovered ? theme.shadow.md : 'none',
  };
}
