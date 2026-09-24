import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetail } from '../services/api';
import type { MovieDetailData, EpisodeItem } from '../services/api';
import { Icon, icons } from '../components/Icon';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ActionButton } from '../components/ui/ActionButton';
import { theme } from '../styles/theme';
import { useDraggableScroll } from '../hooks/useDraggableScroll';
import { saveToHistory } from '../services/history';
import { Footer } from '../components/Footer';

function ServerButton({ label, isSelected, onClick, isMobile }: { label: string; isSelected: boolean; onClick: () => void; isMobile?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: isMobile ? '8px 14px' : '10px 20px',
        backgroundColor: isSelected ? theme.colors.accent : isHovered ? theme.colors.bgHoverLight : theme.colors.bgElevated,
        color: isSelected ? theme.colors.bgDeep : theme.colors.textPrimary,
        border: '2px solid',
        borderColor: isSelected || isHovered ? theme.colors.accent : 'transparent',
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: isMobile ? '13px' : '14px',
        outline: 'none',
        fontFamily: 'inherit',
        transition: `all ${theme.transition.normal}`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadow.sm : 'none',
      }}
    >
      {label}
    </button>
  );
}

function EpisodeButton({ episode, isSelected, onSelect, isMobile }: { episode: EpisodeItem; isSelected: boolean; onSelect: () => void; isMobile?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        minWidth: isMobile ? '64px' : '85px',
        height: isMobile ? '36px' : '42px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: isSelected ? theme.colors.accent : isHovered ? theme.colors.bgHover : theme.colors.bgPrimary,
        color: isSelected ? theme.colors.bgDeep : theme.colors.textPrimary,
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: isMobile ? '13px' : '14px',
        border: '2px solid',
        borderColor: isHovered && !isSelected ? theme.colors.accent : theme.colors.border,
        transition: `all ${theme.transition.normal}`,
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadow.sm : 'none',
        flexShrink: 0,
        padding: isMobile ? '0 10px' : '0 14px',
      }}
    >
      Tập {episode.name}
    </div>
  );
}

function MetaBadge({ label, value, color }: { label?: string; value: string; color?: string }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px', borderRadius: theme.radius.full,
      backgroundColor: color ? `${color}20` : 'rgba(56, 189, 248, 0.12)',
      border: `1px solid ${color ? `${color}40` : 'rgba(56, 189, 248, 0.25)'}`,
      color: color || theme.colors.accent,
      fontSize: '12px', fontWeight: 600,
    }}>
      {label && <span style={{ opacity: 0.8 }}>{label}:</span>}
      <span>{value}</span>
    </div>
  );
}

type SafeEpisode = EpisodeItem & { link_embed?: string; link_m3u8?: string };

export function PlayerScreen() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState<EpisodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const episodesScrollRef = useDraggableScroll<HTMLDivElement>();
  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchMovieDetail(slug)
      .then((res) => {
        if (res) {
          const movieData = res.movie || res.item || res.data?.item || res.data?.movie;
          if (movieData) {
            setMovie(movieData);
            if (movieData.episodes?.length) {
              const firstServer = movieData.episodes[0];
              if (firstServer.items?.length) {
                setCurrentEpisode(firstServer.items[0]);
              }
            }
            return;
          }
        }
        setErrorMsg('Không tìm thấy thông tin chi tiết phim.');
      })
      .catch(() => setErrorMsg('Lỗi kết nối máy chủ.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Track watch history whenever movie or currentEpisode updates
  useEffect(() => {
    if (movie && currentEpisode) {
      saveToHistory(movie, currentEpisode.name);
    }
  }, [movie, currentEpisode]);

  if (loading) {
    return (
      <div className="page-enter" style={{
        width: '100vw', height: '100vh', backgroundColor: theme.colors.bgDeep,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <LoadingSpinner text="Đang đồng bộ luồng phát..." size={32} />
      </div>
    );
  }

  if (errorMsg || !movie) {
    return (
      <div className="page-enter" style={{
        width: '100vw', height: '100vh', backgroundColor: theme.colors.bgDeep,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px',
      }}>
        <div className="state-message error">
          <Icon name={icons.warning} size={24} color={theme.colors.error} />
          {errorMsg}
        </div>
        <ActionButton
          onClick={handleGoBack}
          icon={<Icon name={icons.back} size={18} color={theme.colors.accent} />}
        >
          Trở về
        </ActionButton>
      </div>
    );
  }

  const activeServer = movie.episodes[selectedServerIndex];
  const safeEpisode = currentEpisode as SafeEpisode | null;
  const videoUrl = safeEpisode?.link_embed || safeEpisode?.embed || safeEpisode?.link_m3u8 || '';

  // Extract categories from movie.category object
  const categoriesList: Array<{ groupName: string; items: string[] }> = [];
  if (movie.category && typeof movie.category === 'object') {
    Object.values(movie.category).forEach((catGroup) => {
      if (catGroup?.group?.name && catGroup?.list?.length) {
        categoriesList.push({
          groupName: catGroup.group.name,
          items: catGroup.list.map((item) => item.name),
        });
      }
    });
  }

  return (
    <div className="page-enter scrollable-content" style={{
      width: '100vw', minHeight: '100vh',
      backgroundColor: theme.colors.bgDeep,
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box', overflowY: 'auto',
      padding: isMobile ? '14px 12px 0 12px' : '24px 48px 0 48px',
      gap: isMobile ? '14px' : '28px',
    }}>
      {/* Top Navigation Bar */}
      {isMobile ? (
        /* Mobile Top Bar: Minimalist Back Button & Episode Badge */
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', width: '100%' }}>
          <ActionButton
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
            icon={<Icon name={icons.back} size={18} color={theme.colors.accent} />}
          >
            Trở về
          </ActionButton>
          {currentEpisode && (
            <MetaBadge value={`Đang phát: Tập ${currentEpisode.name}`} color={theme.colors.accent} />
          )}
        </div>
      ) : (
        /* Desktop Top Bar: Title + Badges + Back Button */
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ActionButton
              onClick={handleGoBack}
              variant="ghost"
              size="sm"
              icon={<Icon name={icons.back} size={20} color={theme.colors.accent} />}
            >
              Trở về
            </ActionButton>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: theme.colors.textPrimary, margin: 0, letterSpacing: '-0.01em' }}>
                  {movie.name}
                </h1>
                {movie.original_name && (
                  <span style={{ fontSize: '16px', color: theme.colors.textMuted, fontStyle: 'italic' }}>
                    ({movie.original_name})
                  </span>
                )}
              </div>
              {currentEpisode && (
                <div style={{ marginTop: '2px', fontSize: '15px', color: theme.colors.accent, fontWeight: 600 }}>
                  Đang phát: Tập {currentEpisode.name}
                </div>
              )}
            </div>
          </div>

          {/* Quick Badges */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {movie.quality && <MetaBadge value={movie.quality} color={theme.colors.accent} />}
            {movie.language && <MetaBadge value={movie.language} color={theme.colors.success} />}
            {movie.time && <MetaBadge value={movie.time} color={theme.colors.warning} />}
            {movie.current_episode && <MetaBadge label="Tình trạng" value={movie.current_episode} color="#a855f7" />}
          </div>
        </div>
      )}

      {/* Pure 16:9 Widescreen Video Player Container */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        aspectRatio: '16 / 9',
        flexShrink: 0,
        backgroundColor: '#000',
        borderRadius: isMobile ? theme.radius.md : theme.radius.xl,
        overflow: 'hidden',
        border: `1px solid ${theme.colors.borderLight}`,
        boxShadow: theme.shadow.lg,
        position: 'relative',
        margin: '0 auto',
      }}>
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title={`Tập ${currentEpisode?.name || ''}`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <Icon name={icons.warning} size={28} color={theme.colors.error} />
            <span style={{ color: theme.colors.error, fontSize: '15px', fontWeight: 600 }}>Nguồn phát video chưa sẵn sàng.</span>
          </div>
        )}
      </div>

      {/* Mobile Title & Meta Section (Placed directly below Video Player on Mobile) */}
      {isMobile && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: theme.colors.bgPrimary,
          padding: '14px 16px',
          borderRadius: theme.radius.lg,
          border: `1px solid ${theme.colors.border}`,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <h1 style={{ fontSize: '19px', fontWeight: 800, color: theme.colors.textPrimary, margin: 0, lineHeight: 1.35 }}>
            {movie.name}
          </h1>
          {movie.original_name && (
            <div style={{ fontSize: '13px', color: theme.colors.textMuted, fontStyle: 'italic' }}>
              ({movie.original_name})
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            {movie.quality && <MetaBadge value={movie.quality} color={theme.colors.accent} />}
            {movie.language && <MetaBadge value={movie.language} color={theme.colors.success} />}
            {movie.time && <MetaBadge value={movie.time} color={theme.colors.warning} />}
            {movie.current_episode && <MetaBadge label="Tình trạng" value={movie.current_episode} color="#a855f7" />}
          </div>
        </div>
      )}

      {/* Server & Episode Selector Card */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        backgroundColor: theme.colors.bgPrimary,
        padding: isMobile ? '16px' : '28px',
        borderRadius: isMobile ? theme.radius.lg : theme.radius.xl,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '14px' : '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700, color: theme.colors.textPrimary }}>Nguồn Server:</span>
          {movie.episodes.map((server, idx) => (
            <ServerButton
              key={server.server_name}
              label={server.server_name}
              isSelected={selectedServerIndex === idx}
              isMobile={isMobile}
              onClick={() => {
                setSelectedServerIndex(idx);
                if (server.items.length) setCurrentEpisode(server.items[0]);
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 700, color: theme.colors.textPrimary }}>Danh sách tập phim:</span>
          <div
            ref={episodesScrollRef}
            style={{
              display: 'flex',
              gap: isMobile ? '8px' : '12px',
              flexWrap: 'wrap',
              maxHeight: isMobile ? '180px' : '220px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {activeServer?.items.map((ep) => (
              <EpisodeButton
                key={ep.slug}
                episode={ep}
                isSelected={currentEpisode?.slug === ep.slug}
                isMobile={isMobile}
                onSelect={() => setCurrentEpisode(ep)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Movie Information & Description Card */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        backgroundColor: theme.colors.bgPrimary,
        padding: isMobile ? '16px' : '32px',
        borderRadius: isMobile ? theme.radius.lg : theme.radius.xl,
        border: `1px solid ${theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '18px' : '28px',
        boxSizing: 'border-box',
      }}>
        {/* Row 1: Thumbnail Poster (Left) + Movie Metadata (Right) */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: isMobile ? '14px' : '28px',
          alignItems: 'flex-start',
          width: '100%',
        }}>
          {/* Poster Image */}
          <img
            src={movie.thumb_url}
            alt={movie.name}
            style={{
              width: isMobile ? '120px' : '180px',
              height: isMobile ? '175px' : '260px',
              objectFit: 'cover',
              borderRadius: theme.radius.lg,
              border: `1px solid ${theme.colors.borderLight}`,
              flexShrink: 0,
              boxShadow: theme.shadow.md,
            }}
          />

          {/* Right Column: Metadata Grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: isMobile ? '10px' : '16px', minWidth: 0 }}>
            <h2 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 700, color: theme.colors.textPrimary, margin: 0 }}>
              Thông tin phim
            </h2>

            {/* Metadata Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: isMobile ? '6px 10px' : '12px 16px',
              backgroundColor: theme.colors.bgSecondary,
              padding: isMobile ? '12px' : '20px',
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
              fontSize: isMobile ? '13px' : '14px',
            }}>
              {movie.original_name && (
                <div>
                  <span style={{ color: theme.colors.textMuted }}>Tên gốc: </span>
                  <span style={{ color: theme.colors.textPrimary, fontWeight: 600 }}>{movie.original_name}</span>
                </div>
              )}
              {movie.director && (
                <div>
                  <span style={{ color: theme.colors.textMuted }}>Đạo diễn: </span>
                  <span style={{ color: theme.colors.textPrimary, fontWeight: 600 }}>{movie.director}</span>
                </div>
              )}
              {movie.casts && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: theme.colors.textMuted }}>Diễn viên: </span>
                  <span style={{ color: theme.colors.textPrimary, fontWeight: 600 }}>{movie.casts}</span>
                </div>
              )}
              {categoriesList.map((catGroup) => (
                <div key={catGroup.groupName}>
                  <span style={{ color: theme.colors.textMuted }}>{catGroup.groupName}: </span>
                  <span style={{ color: theme.colors.accent, fontWeight: 600 }}>{catGroup.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Full Detailed Description (Below Row 1) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: isMobile ? '15px' : '17px', fontWeight: 700, color: theme.colors.textPrimary }}>
            Nội dung chi tiết:
          </span>
          <div
            style={{
              fontSize: isMobile ? '13px' : '15px',
              color: '#cbd5e1',
              lineHeight: 1.65,
              backgroundColor: theme.colors.bgSecondary,
              padding: isMobile ? '14px' : '20px',
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.border}`,
            }}
            dangerouslySetInnerHTML={{ __html: movie.description }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
