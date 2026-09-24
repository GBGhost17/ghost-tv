import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

interface MenuItemProps {
  label: string;
  iconName: string;
  path: string;
  onSelect?: () => void;
}

function MenuItem({ label, iconName, path, onSelect }: MenuItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentRoute = path === '/movies'
    ? location.pathname === '/movies'
    : location.pathname.startsWith(path);

  const isActive = isCurrentRoute;

  const handleClick = () => {
    navigate(path);
    if (onSelect) onSelect();
  };

  return (
    <div
      className={isActive ? 'sidebar-item-active' : ''}
      onClick={handleClick}
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

interface TVSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export function TVSidebar({ isOpen = false, onClose, isMobile = false }: TVSidebarProps) {
  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.75)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 90,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Main Sidebar Container */}
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
          zIndex: isMobile ? 100 : 50,
          overflowX: 'hidden',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isMobile && isOpen ? theme.shadow.lg : 'none',
        }}
      >
        {/* Brand Header & Mobile Close Button */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '24px', paddingLeft: '8px', paddingRight: '4px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.textSecondary,
              }}
            >
              <Icon name={icons.close} size={22} color={theme.colors.textSecondary} />
            </button>
          )}
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
            <MenuItem key={item.path} {...item} onSelect={isMobile ? onClose : undefined} />
          ))}
        </div>

        {/* Anchored Bottom Item (Quay lại) */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: `1px solid ${theme.colors.border}`,
          flexShrink: 0,
        }}>
          <MenuItem label="Quay lại" iconName={icons.back} path="/" onSelect={isMobile ? onClose : undefined} />
        </div>
      </div>
    </>
  );
}
