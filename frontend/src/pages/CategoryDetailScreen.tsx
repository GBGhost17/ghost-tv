import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchMoviesByCategory } from '../services/api';
import type { MovieItem } from '../services/api';
import { MovieCard } from '../components/MovieCard';
import { PageHeader } from '../components/PageHeader';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ActionButton } from '../components/ui/ActionButton';
import { theme } from '../styles/theme';

export function CategoryDetailScreen() {
  const { type, slug } = useParams<{ type: 'genre' | 'country'; slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryName = searchParams.get('name') || slug;

  const [year, setYear] = useState<string>('all');
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

  useEffect(() => {
    if (!slug || !type) return;
    setLoading(true);
    fetchMoviesByCategory(type, slug, page, year)
      .then((res) => {
        if (res?.items?.length) {
          setMovies((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        } else {
          if (page === 1) setMovies([]);
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy danh sách phim theo danh mục:', err);
        if (page === 1) setMovies([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [type, slug, page, year]);

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    setMovies([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <div
      className="page-enter scrollable-content"
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: theme.colors.bgDeep,
        padding: '36px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        boxSizing: 'border-box',
        overflowY: 'auto',
      }}
    >
      <PageHeader
        title={`Khám phá: ${categoryName}`}
        onBack={handleGoBack}
        showGreeting={false}
        showYearFilter={true}
        selectedYear={year}
        onYearChange={handleYearChange}
      />

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.name}
            thumbUrl={movie.thumb_url}
            onEnter={() => navigate(`/player/${movie.slug}`)}
          />
        ))}
      </div>

      {loading && <LoadingSpinner />}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMore && !loading ? (
          <ActionButton onClick={() => setPage((p) => p + 1)} size="lg">
            Xem thêm
          </ActionButton>
        ) : !hasMore && movies.length > 0 ? (
          <span style={{ color: theme.colors.textMuted, fontSize: '15px' }}>Đã hiển thị toàn bộ phim.</span>
        ) : null}
      </div>
    </div>
  );
}
