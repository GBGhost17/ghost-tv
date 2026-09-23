import { useState, type ReactNode } from 'react';
import { theme } from '../../styles/theme';

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function ActionButton({
  onClick,
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  fullWidth,
}: ActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const padding = { sm: '8px 16px', md: '12px 28px', lg: '15px 40px' };
  const fontSize = { sm: '14px', md: '16px', lg: '18px' };

  const bgMap = {
    primary: isHovered ? theme.colors.accent : theme.colors.accent,
    secondary: isHovered ? theme.colors.bgHoverLight : theme.colors.bgElevated,
    ghost: isHovered ? theme.colors.bgHover : 'transparent',
  };

  const colorMap = {
    primary: theme.colors.bgDeep,
    secondary: theme.colors.textPrimary,
    ghost: isHovered ? theme.colors.textPrimary : theme.colors.textSecondary,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="action-button"
      style={{
        padding: padding[size],
        fontSize: fontSize[size],
        backgroundColor: bgMap[variant],
        color: colorMap[variant],
        border: variant === 'ghost' ? '2px dashed' : '2px solid',
        borderColor: isHovered ? theme.colors.accent : theme.colors.borderLight,
        borderRadius: theme.radius.md,
        cursor: 'pointer',
        fontWeight: 'bold',
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'fit-content',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadow.md : 'none',
        transition: `all ${theme.transition.normal}`,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
