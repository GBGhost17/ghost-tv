import { Outlet } from 'react-router-dom';
import { TVSidebar } from '../components/TVSidebar';
import { PageTransition } from '../components/PageTransition';
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
        padding: '36px 48px',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}>
        <PageTransition className="page-enter-fast">
          <Outlet />
        </PageTransition>
      </div>
    </div>
  );
}
