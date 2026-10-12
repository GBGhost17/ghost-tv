import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../services/favorites';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { ActionButton } from '../../components/ui/ActionButton';
import { theme } from '../../styles/theme';

export function FavoritesTab() {
  const { favorites, remove, clearAll } = useFavorites();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter & Sort favorite movies
  const displayedFavorites = useMemo(() => {
    let result = [...favorites];

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Sort
    if (sortOrder === 'newest') {
      result.sort((a, b) => b.addedAt - a.addedAt);
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => a.addedAt - b.addedAt);
    } else if (sortOrder === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return result;
  }, [favorites, searchQuery, sortOrder]);

  const handleClearAll = () => {
    clearAll();
    setConfirmClear(false);
  };

  return (
    <div
      className="page-enter-fast"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <PageHeader
        icon={icons.heart}
        title="Phim Yêu Thích"
        subtitle="Danh sách các bộ phim bạn đã lưu lại để thưởng thức bất cứ lúc nào."
      />

      {/* Control bar: Count badge, Search, Sort & Clear All (Only when list is not empty) */}
      {favorites.length > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '12px 18px',
            backgroundColor: theme.colors.bgPrimary,
            borderRadius: theme.radius.lg,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Left: Count Badge & Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: theme.radius.full,
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                color: '#fda4af',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              <Icon name={icons.heart} size={16} color="#f43f5e" />
              {favorites.length} phim đã lưu
            </span>

            {/* Quick search input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                minWidth: '220px',
                maxWidth: '320px',
                flex: 1,
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Lọc tên trong danh sách..."
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  backgroundColor: theme.colors.bgElevated,
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: theme.radius.sm,
                  color: theme.colors.textPrimary,
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ position: 'absolute', left: '10px', pointerEvents: 'none', display: 'flex' }}>
                <Icon name={icons.search} size={15} color={theme.colors.textMuted} />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    color: theme.colors.textMuted,
                  }}
                >
                  <Icon name={icons.clear} size={14} color={theme.colors.textMuted} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort Dropdown & Clear All Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', color: theme.colors.textMuted }}>Sắp xếp:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'name')}
                style={{
                  backgroundColor: theme.colors.bgElevated,
                  color: theme.colors.textPrimary,
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: theme.radius.sm,
                  padding: '7px 12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <option value="newest">Mới thêm gần đây</option>
                <option value="oldest">Cũ nhất trước</option>
                <option value="name">Tên phim (A-Z)</option>
              </select>
            </div>

            {/* Clear All Confirmation Button */}
            {confirmClear ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleClearAll}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: theme.colors.error,
                    color: '#fff',
                    border: 'none',
                    borderRadius: theme.radius.sm,
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Xác nhận xóa hết
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: theme.colors.bgElevated,
                    color: theme.colors.textSecondary,
                    border: `1px solid ${theme.colors.borderLight}`,
                    borderRadius: theme.radius.sm,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                title="Xóa toàn bộ danh sách yêu thích"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: 'transparent',
                  color: theme.colors.textMuted,
                  border: `1px solid ${theme.colors.borderLight}`,
                  borderRadius: theme.radius.sm,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.error;
                  e.currentTarget.style.borderColor = theme.colors.error;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.textMuted;
                  e.currentTarget.style.borderColor = theme.colors.borderLight;
                }}
              >
                <Icon name={icons.trash} size={15} color="currentColor" />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Movie Grid or Empty State */}
      {displayedFavorites.length > 0 ? (
        <div className="movie-grid">
          {displayedFavorites.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.name}
              thumbUrl={movie.thumb_url}
              onEnter={() => navigate(`/player/${movie.slug}`)}
              onRemove={() => remove(movie.slug)}
              removeTitle="Bỏ thích phim này"
            />
          ))}
        </div>
      ) : favorites.length > 0 && searchQuery ? (
        /* Filter returned 0 results */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            backgroundColor: theme.colors.bgPrimary,
            borderRadius: theme.radius.xl,
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
            gap: '14px',
          }}
        >
          <Icon name={icons.search} size={40} color={theme.colors.textMuted} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>
            Không tìm thấy phim phù hợp
          </h3>
          <p style={{ fontSize: '14px', color: theme.colors.textMuted, margin: 0, maxWidth: '400px' }}>
            Không có phim yêu thích nào khớp với từ khóa "{searchQuery}".
          </p>
          <ActionButton onClick={() => setSearchQuery('')} size="sm">
            Xóa bộ lọc tìm kiếm
          </ActionButton>
        </div>
      ) : (
        /* Empty State: No favorites saved yet */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 20px',
            backgroundColor: theme.colors.bgPrimary,
            borderRadius: theme.radius.xl,
            border: `1px dashed ${theme.colors.borderLight}`,
            textAlign: 'center',
            gap: '16px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(244, 63, 94, 0.15)',
            }}
          >
            <Icon name={icons.heartOutline} size={42} color="#f43f5e" />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.textPrimary, margin: 0 }}>
            Chưa có phim trong danh sách yêu thích
          </h2>

          <p
            style={{
              fontSize: '15px',
              color: theme.colors.textMuted,
              margin: 0,
              maxWidth: '460px',
              lineHeight: 1.6,
            }}
          >
            Lưu lại những bộ phim bạn yêu thích để dễ dàng theo dõi và xem lại bất cứ lúc nào bằng cách bấm vào nút{' '}
            <strong style={{ color: '#fda4af' }}>"Yêu thích"</strong> tại trang xem phim.
          </p>

          <div style={{ marginTop: '12px' }}>
            <ActionButton
              onClick={() => navigate('/movies')}
              variant="primary"
              size="lg"
              icon={<Icon name={icons.film} size={20} color={theme.colors.bgDeep} />}
            >
              Khám phá kho phim ngay
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
}
