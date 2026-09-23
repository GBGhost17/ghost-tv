import { useState } from 'react';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

interface MovieCardProps {
  title: string;
  thumbUrl: string;
  onEnter: () => void;
}

export function MovieCard({ title, thumbUrl, onEnter }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="movie-card"
      onClick={onEnter}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '210px',
        height: '310px',
        backgroundColor: theme.colors.bgElevated,
        borderRadius: theme.radius.md,
        border: '2px solid',
        borderColor: isHovered ? theme.colors.accent : 'transparent',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? theme.shadow.lg : theme.shadow.sm,
        transition: `all ${theme.transition.smooth}`,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', height: '82%', overflow: 'hidden' }}>
        <img
          src={thumbUrl}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: `transform ${theme.transition.smooth}`,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
        <div className="movie-card-overlay">
          <Icon name={icons.play} size={36} color={theme.colors.accent} />
        </div>
      </div>
      <div
        style={{
          padding: '12px 10px',
          fontSize: '13px',
          fontWeight: 600,
          textAlign: 'center',
          color: theme.colors.textPrimary,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          backgroundColor: isHovered ? theme.colors.bgSecondary : theme.colors.bgElevated,
          transition: `background-color ${theme.transition.normal}`,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {title}
      </div>
    </div>
  );
}
