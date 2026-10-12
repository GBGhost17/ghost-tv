import React, { useState } from 'react';
import type { MovieItem, MovieDetailData } from '../../services/api';
import { useFavorites, type FavoriteMovieItem } from '../../services/favorites';
import { Icon, icons } from '../Icon';
import { theme } from '../../styles/theme';

interface FavoriteButtonProps {
  movie: MovieItem | MovieDetailData | FavoriteMovieItem;
  variant?: 'pill' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function FavoriteButton({
  movie,
  variant = 'pill',
  size = 'md',
  showLabel = true,
  onToggle,
  style,
  className,
}: FavoriteButtonProps) {
  const { isFav, toggle } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const favorited = isFav(movie.slug) || (movie.id ? isFav(movie.id) : false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    const newState = toggle(movie);
    onToggle?.(newState);
  };

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const paddingMap = {
    sm: variant === 'icon' ? '6px' : '6px 12px',
    md: variant === 'icon' ? '8px' : '8px 16px',
    lg: variant === 'icon' ? '10px' : '10px 20px',
  };
  const fontSize = size === 'sm' ? '12.5px' : size === 'lg' ? '15px' : '13.5px';

  // Heart color: lively rose-red when favorited, subtle/theme color when not
  const heartColor = favorited ? '#f43f5e' : isHovered ? '#f43f5e' : theme.colors.textSecondary;

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={favorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        aria-label={favorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: paddingMap[size],
          backgroundColor: favorited
            ? 'rgba(244, 63, 94, 0.16)'
            : isHovered
            ? theme.colors.bgHoverLight
            : theme.colors.bgElevated,
          border: '1px solid',
          borderColor: favorited ? 'rgba(244, 63, 94, 0.4)' : isHovered ? '#f43f5e' : theme.colors.borderLight,
          borderRadius: theme.radius.full,
          cursor: 'pointer',
          outline: 'none',
          transition: `all ${theme.transition.fast}`,
          transform: isAnimating ? 'scale(1.2)' : isHovered ? 'scale(1.08)' : 'scale(1)',
          boxShadow: favorited ? '0 0 12px rgba(244, 63, 94, 0.3)' : isHovered ? theme.shadow.sm : 'none',
          ...style,
        }}
      >
        <Icon
          name={favorited ? icons.heart : icons.heartOutline}
          size={iconSize}
          color={heartColor}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={favorited ? 'Bỏ khỏi danh sách yêu thích' : 'Lưu vào danh sách yêu thích'}
      aria-label={favorited ? 'Bỏ khỏi danh sách yêu thích' : 'Lưu vào danh sách yêu thích'}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: paddingMap[size],
        backgroundColor: favorited
          ? 'rgba(244, 63, 94, 0.16)'
          : isHovered
          ? theme.colors.bgHoverLight
          : theme.colors.bgElevated,
        border: '1px solid',
        borderColor: favorited
          ? 'rgba(244, 63, 94, 0.45)'
          : isHovered
          ? 'rgba(244, 63, 94, 0.5)'
          : theme.colors.borderLight,
        borderRadius: theme.radius.sm,
        color: favorited ? '#fda4af' : isHovered ? theme.colors.textPrimary : theme.colors.textSecondary,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize,
        fontFamily: 'inherit',
        outline: 'none',
        transition: `all ${theme.transition.normal}`,
        transform: isAnimating ? 'scale(1.05)' : isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: favorited ? '0 0 14px rgba(244, 63, 94, 0.25)' : isHovered ? theme.shadow.sm : 'none',
        ...style,
      }}
    >
      <Icon
        name={favorited ? icons.heart : icons.heartOutline}
        size={iconSize}
        color={heartColor}
      />
      {showLabel && (
        <span>
          {favorited ? (isHovered ? 'Bỏ thích' : 'Đã thích') : 'Yêu thích'}
        </span>
      )}
    </button>
  );
}
