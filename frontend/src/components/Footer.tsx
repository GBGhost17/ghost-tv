import { Link } from 'react-router-dom';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

export function Footer() {
  return (
    <footer style={{
      width: '100%',
      backgroundColor: theme.colors.bgPrimary,
      borderTop: `1px solid ${theme.colors.border}`,
      padding: '40px 48px calc(48px + env(safe-area-inset-bottom, 24px))',
      marginTop: '60px',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
      }}>
        {/* Top Footer Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '32px',
        }}>
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon name={icons.logo} size={28} color={theme.colors.accent} />
              <span style={{ fontSize: '20px', fontWeight: 800, color: theme.colors.textPrimary, letterSpacing: '0.5px' }}>
                GHOST TV
              </span>
            </div>
            <p style={{ fontSize: '14px', color: theme.colors.textMuted, lineHeight: 1.6, margin: 0 }}>
              Nền tảng xem phim trực tuyến hiện đại với giao diện tối ưu, mượt mà, cập nhật liên tục các bộ phim mới nhất trên mọi thiết bị.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.textPrimary }}>Khám phá</span>
              <Link to="/movies" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Trang chủ</Link>
              <Link to="/movies/single" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Phim Lẻ</Link>
              <Link to="/movies/series" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Phim Bộ</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: theme.colors.textPrimary }}>Danh mục</span>
              <Link to="/movies/genres" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Thể loại</Link>
              <Link to="/movies/countries" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Quốc gia</Link>
              <Link to="/movies/search" style={{ color: theme.colors.textSecondary, textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>Tìm kiếm</Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: theme.colors.border }} />

        {/* Bottom Disclaimer & Copyright */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '13px',
          color: theme.colors.textMuted,
        }}>
          <div>
            © {new Date().getFullYear()} Ghost TV. All rights reserved.
          </div>
          <div style={{ fontSize: '12px', fontStyle: 'italic', maxWidth: '620px', lineHeight: 1.5 }}>
            Miễn trừ trách nhiệm: Tất cả nội dung phim được tổng hợp từ các nguồn chia sẻ công khai trên Internet. Ghost TV không lưu trữ bất kỳ tệp tin phương tiện nào trên máy chủ.
          </div>
        </div>
      </div>
    </footer>
  );
}
