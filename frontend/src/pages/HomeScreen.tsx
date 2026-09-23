import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, icons } from '../components/Icon';
import { theme } from '../styles/theme';

interface HomeCardProps {
  title: string;
  subtitle: string;
  iconName: string;
  path: string;
  badge?: string;
  accentColor: string;
}

function HomeMenuCard({ title, subtitle, iconName, path, badge, accentColor }: HomeCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(path)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '360px',
        height: '220px',
        backgroundColor: theme.colors.bgPrimary,
        borderRadius: theme.radius.xl,
        border: '2px solid',
        borderColor: isHovered ? theme.colors.accent : theme.colors.border,
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: isHovered ? theme.shadow.lg : theme.shadow.sm,
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: `all ${theme.transition.smooth}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '140px', height: '140px',
        backgroundColor: accentColor,
        opacity: isHovered ? 0.15 : 0.08,
        borderRadius: '50%',
        filter: 'blur(40px)',
        transition: `opacity ${theme.transition.smooth}`,
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: `${accentColor}18`,
          border: `1px solid ${accentColor}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={iconName} size={30} color={accentColor} />
        </div>
        {badge && (
          <span style={{
            backgroundColor: theme.colors.warning,
            color: theme.colors.bgDeep,
            padding: '4px 12px',
            borderRadius: theme.radius.full,
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {badge}
          </span>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: '14px', color: theme.colors.textSecondary, margin: '6px 0 0', lineHeight: 1.5 }}>{subtitle}</p>
      </div>
    </div>
  );
}

export function HomeScreen() {
  return (
    <div className="page-enter" style={{
      width: '100vw', height: '100vh',
      backgroundColor: theme.colors.bgDeep,
      backgroundImage: 'radial-gradient(ellipse at 15% 25%, rgba(30, 41, 59, 0.5) 0%, rgba(2, 6, 23, 1) 70%)',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      padding: '60px', boxSizing: 'border-box',
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px',
        marginBottom: '48px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '12px' }}>
          <Icon name={icons.wave} size={40} color={theme.colors.accent} />
          <h1 style={{
            fontSize: '44px', fontWeight: 800, color: theme.colors.textPrimary,
            margin: 0, letterSpacing: '-0.02em',
          }}>
            Chào mừng đến Ghost TV
          </h1>
        </div>
        <p style={{ fontSize: '18px', color: theme.colors.textMuted, margin: 0 }}>
          Hệ sinh thái giải trí đa nền tảng — chọn ứng dụng để bắt đầu.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1200px' }}>
        <HomeMenuCard
          title="Xem Phim Hub"
          subtitle="Kho phim tổng hợp, thể loại, quốc gia & phát video trực tuyến"
          iconName={icons.film}
          path="/movies"
          accentColor={theme.colors.accent}
        />
        <HomeMenuCard
          title="Cài Đặt Hệ Thống"
          subtitle="Trung tâm tùy chỉnh giao diện và cấu hình"
          iconName={icons.settings}
          path="/"
          badge="Sắp ra mắt"
          accentColor={theme.colors.warning}
        />
      </div>
    </div>
  );
}
