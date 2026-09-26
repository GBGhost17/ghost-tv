import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { TVSidebar } from '../components/TVSidebar';
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';
import { Icon, icons } from '../components/Icon';
import { HeaderSearchBar } from '../components/HeaderSearchBar';
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
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* TV Sidebar Drawer Component */}
        <TVSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content Area */}
        <div className="scrollable-content" style={{
          marginLeft: isMobile ? 0 : theme.sidebar.width,
          width: isMobile ? '100%' : `calc(100vw - ${theme.sidebar.width})`,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          boxSizing: 'border-box',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Top Header Bar: Left Menu (Mobile) | Center SearchBar | Right Logo Only (Mobile) */}
          <header style={{
            width: '100%',
            minHeight: '60px',
            backgroundColor: theme.colors.bgPrimary,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'center',
            padding: isMobile ? '8px 12px' : '10px 28px',
            boxSizing: 'border-box',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            flexShrink: 0,
            gap: isMobile ? '8px' : '20px',
          }}>
            {/* Left: Menu toggle button (Mobile only) */}
            {isMobile && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: theme.radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.accent,
                  flexShrink: 0,
                }}
              >
                <Icon name={icons.menu} size={24} color={theme.colors.accent} />
              </button>
            )}

            {/* Middle: Search Bar with live results */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: isMobile ? '520px' : '640px' }}>
              <HeaderSearchBar />
            </div>

            {/* Right: Ghost TV logo icon ONLY (Mobile only) */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
                <img
                  src="/favicon.svg"
                  alt="Ghost TV Logo"
                  style={{
                    width: '28px',
                    height: '28px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.3))',
                  }}
                />
              </div>
            )}
          </header>

          <div style={{
            padding: isMobile ? '16px 14px 0' : '28px 40px 0',
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
