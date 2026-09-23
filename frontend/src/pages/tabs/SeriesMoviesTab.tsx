import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSeriesMovies, fetchMoviesByYear } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { icons } from '../../components/Icon';
import { PageHeader } from '../../components/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ActionButton } from '../../components/ui/ActionButton';
import { theme } from '../../styles/theme';

let globalSeriesCache: { items: MovieItem[]; page: number; year: string } | null = null;
export function clearSeriesCache() { globalSeriesCache = null; }

export function SeriesMoviesTab() {
  const [year, setYear] = useState<string>(globalSeriesCache?.year || 'all');
  const [movies, setMovies] = useState<MovieItem[]>(globalSeriesCache?.items || []);
  const [page, setPage] = useState(globalSeriesCache?.page || 1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(!globalSeriesCache);
  const navigate = useNavigate();

  useEffect(() => {
    if (globalSeriesCache && globalSeriesCache.year === year) {
      setLoading(false);
      return;
    }
    fetchData(1, year);
  }, [year]);

  const fetchData = async (targetPage: number, currentYear: string = year) => {
    setLoading(true);
    try {
      let responseData;
      if (currentYear !== 'all') {
        responseData = await fetchMoviesByYear(currentYear, targetPage);
      } else {
        responseData = await fetchSeriesMovies(targetPage);
      }

      if (responseData?.items?.length) {
        const newItems = responseData.items;
        setMovies((prev) => {
          const updated = targetPage === 1 ? newItems : [...prev, ...newItems];
          globalSeriesCache = { items: updated, page: targetPage, year: currentYear };
          return updated;
        });
      } else {
        if (targetPage === 1) setMovies([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách Phim Bộ:', err);
      if (targetPage === 1) setMovies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (newYear: string) => {
    clearSeriesCache();
    setYear(newYear);
    setMovies([]);
    setPage(1);
    setHasMore(true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage, year);
    }
  };

  return (
    <div
      className="scrollable-content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        paddingBottom: '80px',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <PageHeader
        title="Phim Bộ"
        icon={icons.series}
        subtitle="Phim truyền hình drama Hàn Quốc, Trung Quốc, Âu Mỹ đặc sắc nhất."
        showGreeting={false}
        showYearFilter={true}
        selectedYear={year}
        onYearChange={handleYearChange}
      />

      {loading && movies.length === 0 && <LoadingSpinner />}

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

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {hasMore ? (
          <ActionButton onClick={handleLoadMore} size="lg">
            Xem thêm
          </ActionButton>
        ) : movies.length > 0 ? (
          <span style={{ color: theme.colors.textMuted, fontSize: '15px' }}>Đã hiển thị toàn bộ phim.</span>
        ) : null}
      </div>
    </div>
  );
}
