import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = 'page-enter' }: PageTransitionProps) {
  const location = useLocation();
  return (
    <div key={location.pathname} className={className}>
      {children}
    </div>
  );
}
