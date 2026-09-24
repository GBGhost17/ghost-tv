import { Outlet } from 'react-router-dom';
import { TVSidebar } from '../components/TVSidebar';
import { PageTransition } from '../components/PageTransition';
import { Footer } from '../components/Footer';
import { theme } from '../styles/theme';

export function MovieLayout() {
  return (
    <div className="page-enter" style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.colors.bgDeep,
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      <TVSidebar />

      <div className="scrollable-content" style={{
        marginLeft: theme.sidebar.width,
        width: `calc(100vw - ${theme.sidebar.width})`,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ padding: '36px 48px 0', flex: '1 0 auto' }}>
          <PageTransition className="page-enter-fast">
            <Outlet />
          </PageTransition>
        </div>
        <Footer />
      </div>
    </div>
  );
}
