import { theme } from '../styles/theme';

interface IconProps {
  /** Iconify icon name, e.g. "mdi:home" */
  name: string;
  size?: number;
  color?: string;
  className?: string;
  spin?: boolean;
}

/**
 * Fetches flat-style SVG icons via Iconify API (similar to Flaticon style).
 * @see https://iconify.design/docs/api/svg.html
 */
export function Icon({ name, size = 24, color = theme.colors.textPrimary, className, spin }: IconProps) {
  const encodedColor = encodeURIComponent(color);
  const src = `https://api.iconify.design/${name}.svg?color=${encodedColor}&width=${size}&height=${size}`;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={`icon-img${spin ? ' icon-spin' : ''}${className ? ` ${className}` : ''}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}

/** Centralized icon name registry */
export const icons = {
  home: 'mdi:home-outline',
  search: 'mdi:magnify',
  genres: 'mdi:theater',
  movie: 'mdi:movie-open-outline',
  series: 'mdi:television-classic',
  country: 'mdi:earth',
  back: 'mdi:arrow-left',
  forward: 'mdi:arrow-right',
  settings: 'mdi:cog-outline',
  wave: 'mdi:hand-wave-outline',
  fire: 'mdi:fire',
  play: 'mdi:play-circle-outline',
  library: 'mdi:bookshelf',
  loading: 'mdi:loading',
  warning: 'mdi:alert-circle-outline',
  globe: 'mdi:web',
  film: 'mdi:filmstrip',
  clear: 'mdi:close-circle-outline',
  logo: 'mdi:television-play',
} as const;
