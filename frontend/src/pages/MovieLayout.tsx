import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TVSidebar } from '../components/TVSidebar';
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';
import { Icon, icons } from '../components/Icon';
import { theme } from '../styles/theme';

export function MovieLayout() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page-enter" style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.colors.bgDeep,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Mobile Top Header Bar with Hamburger Menu Toggle */}
      {isMobile && (
        <header style={{
          width: '100%',
          height: '56px',
          backgroundColor: theme.colors.bgPrimary,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: theme.radius.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.accent,
            }}
          >
            <Icon name={icons.menu} size={26} color={theme.colors.accent} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/favicon.svg" alt="Ghost TV Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            <span style={{ fontSize: '18px', fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: '0.5px' }}>
              GHOST TV
            </span>
          </div>

          <div style={{ width: '34px' }} /> {/* Spacer to center logo */}
        </header>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* TV Sidebar Drawer Component */}
        <TVSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Scrollable Main Content Container */}
        <div className="scrollable-content" style={{
          marginLeft: isMobile ? 0 : theme.sidebar.width,
          width: isMobile ? '100%' : `calc(100vw - ${theme.sidebar.width})`,
          height: isMobile ? 'calc(100vh - 56px)' : '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxSizing: 'border-box',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{
            padding: isMobile ? '20px 16px 0' : '36px 48px 0',
            flex: '1 0 auto',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <PageTransition className="page-enter-fast">
              <Outlet />
            </PageTransition>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
