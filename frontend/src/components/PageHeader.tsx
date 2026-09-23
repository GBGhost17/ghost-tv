import React, { useState } from 'react';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

export interface PageHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
  showGreeting?: boolean;
  showYearFilter?: boolean;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  onBack?: () => void;
}

const YEARS = Array.from({ length: 15 }, (_, i) => (2024 - i).toString());

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  subtitle,
  showGreeting = false,
  showYearFilter = false,
  selectedYear = 'all',
  onYearChange,
  onBack,
}) => {
  const [isBackHovered, setIsBackHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '20px',
        borderBottom: `1px solid ${theme.colors.border}`,
        marginBottom: '28px',
        gap: '16px',
        flexWrap: 'wrap',
        width: '100%',
      }}
    >
      {/* Left side: Back button, Icon, Title & Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            onMouseEnter={() => setIsBackHovered(true)}
            onMouseLeave={() => setIsBackHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: isBackHovered ? theme.colors.bgHoverLight : theme.colors.bgElevated,
              color: isBackHovered ? theme.colors.accent : theme.colors.textPrimary,
              border: `1px solid ${isBackHovered ? theme.colors.accent : theme.colors.borderLight}`,
              borderRadius: theme.radius.sm,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              outline: 'none',
              transition: `all ${theme.transition.normal}`,
              fontFamily: 'inherit',
            }}
          >
            <Icon name={icons.back} size={18} color={isBackHovered ? theme.colors.accent : theme.colors.textPrimary} />
            <span>Trở về</span>
          </button>
        )}

        {icon && (
          <div className="page-header-icon" style={{ margin: 0 }}>
            <Icon name={icon} size={28} color={theme.colors.accent} />
          </div>
        )}

        <div>
          <h1 style={{ fontSize: '30px', fontWeight: 800, color: theme.colors.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '14px', color: theme.colors.textMuted, margin: '4px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Greeting & Year Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto', paddingRight: '16px', flexWrap: 'wrap' }}>
        {showGreeting && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right' }}>
            <span style={{ fontSize: '15px', color: theme.colors.accent, fontWeight: 600 }}>Xin chào,</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textPrimary }}>Chúc bạn xem phim vui vẻ!</span>
          </div>
        )}

        {showYearFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.textSecondary }}></span>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange?.(e.target.value)}
              style={{
                backgroundColor: theme.colors.bgElevated,
                color: theme.colors.textPrimary,
                border: `1px solid ${theme.colors.borderLight}`,
                borderRadius: theme.radius.sm,
                padding: '9px 16px',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: theme.shadow.sm,
                transition: `border-color ${theme.transition.normal}`,
              }}
            >
              <option value="all">Tất cả năm</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
