import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

interface MenuItemProps {
  label: string;
  iconName: string;
  path: string;
}

function MenuItem({ label, iconName, path }: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentRoute = path === '/movies'
    ? location.pathname === '/movies'
    : location.pathname.startsWith(path);

  const isActive = isCurrentRoute;

  return (
    <div
      className={isActive ? 'sidebar-item-active' : ''}
      onClick={() => navigate(path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '11px 12px',
        backgroundColor: isActive
          ? theme.colors.bgElevated
          : isHovered ? theme.colors.bgHover : 'transparent',
        color: isActive ? theme.colors.accent : isHovered ? theme.colors.textPrimary : theme.colors.textSecondary,
        borderRadius: theme.radius.md,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '15px',
        fontWeight: 600,
        transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
        transition: `all ${theme.transition.normal}`,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Icon
        name={iconName}
        size={20}
        color={isActive ? theme.colors.accent : isHovered ? theme.colors.textPrimary : theme.colors.textSecondary}
      />
      <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

const menuItems = [
  { label: 'Trang chủ', iconName: icons.home, path: '/movies' },
  { label: 'Tìm kiếm', iconName: icons.search, path: '/movies/search' },
  { label: 'Thể loại', iconName: icons.genres, path: '/movies/genres' },
  { label: 'Phim Lẻ', iconName: icons.movie, path: '/movies/single' },
  { label: 'Phim Bộ', iconName: icons.series, path: '/movies/series' },
  { label: 'Quốc gia', iconName: icons.country, path: '/movies/countries' },
];

export function TVSidebar() {
  return (
    <div
      style={{
        width: theme.sidebar.width,
        height: '100dvh',
        maxHeight: '100vh',
        backgroundColor: theme.colors.bgPrimary,
        borderRight: `1px solid ${theme.colors.border}`,
        padding: '24px 10px calc(24px + env(safe-area-inset-bottom, 20px)) 10px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        zIndex: 50,
        overflowX: 'hidden',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {/* Brand Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        marginBottom: '24px', paddingLeft: '8px',
        flexShrink: 0,
      }}>
        <img 
          src="/favicon.svg" 
          alt="Ghost TV Logo" 
          style={{ 
            width: '30px', 
            height: '30px', 
            objectFit: 'contain', 
            display: 'block'
          }} 
        />
        <span style={{ fontSize: '22px', fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: '0.5px' }}>
          GHOST TV
        </span>
      </div>

      {/* Middle Menu Items */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {menuItems.map((item) => (
          <MenuItem key={item.path} {...item} />
        ))}
      </div>

      {/* Anchored Bottom Item (Quay lại) */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: `1px solid ${theme.colors.border}`,
        flexShrink: 0,
      }}>
        <MenuItem label="Quay lại" iconName={icons.back} path="/" />
      </div>
    </div>
  );
}
