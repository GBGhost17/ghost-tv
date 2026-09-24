import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ActionButton } from '../../components/ui/ActionButton';
import { theme } from '../../styles/theme';

import { useDraggableScroll } from '../../hooks/useDraggableScroll';
import { getHistory } from '../../services/history';

let globalHomeCache: { watching: MovieItem[]; news: MovieItem[]; catalog: MovieItem[] } | null = null;

function HorizontalMovieRow({ title, iconName, movies, onSelectMovie }: {
  title: string; iconName: string; movies: MovieItem[]; onSelectMovie: (slug: string) => void;
}) {
  const scrollRef = useDraggableScroll<HTMLDivElement>();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 className="section-title">
        <Icon name={iconName} size={24} color={theme.colors.accent} />
        {title}
      </h2>
      <div ref={scrollRef} className="horizontal-scroll">
        {movies.map((movie) => (
          <div key={movie.id} className="horizontal-card-item">
            <MovieCard
              title={movie.name}
              thumbUrl={movie.thumb_url}
              onEnter={() => onSelectMovie(movie.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeTab() {
  const [watchingMovies, setWatchingMovies] = useState<MovieItem[]>([]);
  const [newMovies, setNewMovies] = useState<MovieItem[]>(globalHomeCache?.news || []);
  const [catalogMovies, setCatalogMovies] = useState<MovieItem[]>(globalHomeCache?.catalog || []);
  const [currentPage, setCurrentPage] = useState(2);
  const [displayCount, setDisplayCount] = useState(16);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(!globalHomeCache);
  const navigate = useNavigate();

  useEffect(() => {
    // Read watch history from localStorage
    const rawHistory = getHistory();
    const mappedHistory: MovieItem[] = rawHistory.slice(0, 10).map((item) => ({
      id: item.id,
      name: item.episode_name ? `${item.name} (Tập ${item.episode_name})` : item.name,
      slug: item.slug,
      thumb_url: item.thumb_url,
      current_episode: item.episode_name ? `Tập ${item.episode_name}` : '',
    }));
    setWatchingMovies(mappedHistory);

    if (globalHomeCache) {
      setNewMovies(globalHomeCache.news);
      setCatalogMovies(globalHomeCache.catalog);
      setLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setLoading(true);
      try {
        const page1 = await fetchMovies(1);
        const page2 = await fetchMovies(2);
        const items1 = page1?.items || [];
        const items2 = page2?.items || [];
        const combined = [...items1, ...items2];

        globalHomeCache = { watching: [], news: items1, catalog: combined };
        setNewMovies(items1);
        setCatalogMovies(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleLoadMore = async () => {
    if (displayCount < catalogMovies.length) {
      setDisplayCount(prev => Math.min(prev + 12, catalogMovies.length));
      return;
    }
    try {
      const nextPage = currentPage + 1;
      const res = await fetchMovies(nextPage);
      if (res?.items?.length) {
        const updated = [...catalogMovies, ...res.items];
        setCatalogMovies(updated);
        if (globalHomeCache) globalHomeCache.catalog = updated;
        setDisplayCount(prev => prev + 12);
        setCurrentPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '36px',
      width: '100%', boxSizing: 'border-box',
    }}>
      <PageHeader
        icon={icons.home}
        title="Trang chủ"
        subtitle="Tận hưởng những bộ phim hấp dẫn nhất."
        showGreeting={true}
      />

      {loading && <LoadingSpinner />}

      {watchingMovies.length > 0 && (
        <HorizontalMovieRow
          title="Phim đang xem"
          iconName={icons.play}
          movies={watchingMovies}
          onSelectMovie={(slug) => navigate(`/player/${slug}`)}
        />
      )}

      {newMovies.length > 0 && (
        <HorizontalMovieRow
          title="Mới cập nhật"
          iconName={icons.fire}
          movies={newMovies}
          onSelectMovie={(slug) => navigate(`/player/${slug}`)}
        />
      )}

      {catalogMovies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 className="section-title">
            <Icon name={icons.library} size={24} color={theme.colors.accent} />
            Kho Phim Tổng Hợp
          </h2>
          <div className="movie-grid">
            {catalogMovies.slice(0, displayCount).map((movie) => (
              <MovieCard
                key={`cat-${movie.id}`}
                title={movie.name}
                thumbUrl={movie.thumb_url}
                onEnter={() => navigate(`/player/${movie.slug}`)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            {hasMore ? (
              <ActionButton onClick={handleLoadMore} size="lg">Xem thêm</ActionButton>
            ) : (
              <span style={{ color: theme.colors.textMuted, fontSize: '15px' }}>Đã hiển thị toàn bộ.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
