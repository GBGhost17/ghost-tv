import { Icon, icons } from '../Icon';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
}

export function LoadingSpinner({ text = 'Đang tải...', size = 28 }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner">
      <Icon name={icons.loading} size={size} color={theme.colors.accent} spin />
      {text && <span>{text}</span>}
    </div>
  );
}
