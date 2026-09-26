import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { searchMovies } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { theme } from '../../styles/theme';

export function SearchTab() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async (searchKeyword: string) => {
    if (!searchKeyword.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const resData = await searchMovies(searchKeyword);
      setResults(resData?.items ?? []);
    } catch (err) {
      console.error('Lỗi tìm kiếm phim:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (queryParam) {
      handleSearch(queryParam);
    } else {
      setResults([]);
    }
  }, [queryParam, handleSearch]);

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
        icon={icons.search}
        title="Kết quả tìm kiếm"
        subtitle={queryParam ? `Tìm kiếm từ khóa: "${queryParam}"` : 'Sử dụng thanh tìm kiếm ở đầu trang để tìm phim.'}
      />

      {queryParam && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="search-result-badge">
            <Icon name={icons.film} size={16} color={theme.colors.accent} />
            {results.length} kết quả cho "{queryParam}"
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {loading && <LoadingSpinner text={`Đang tìm kiếm "${queryParam}"...`} />}

        {!loading && results.length === 0 && queryParam && (
          <div className="state-message error">
            <Icon name={icons.warning} size={20} color={theme.colors.error} />
            Không tìm thấy kết quả phù hợp với từ khóa "{queryParam}".
          </div>
        )}

        {!loading && !queryParam && (
          <div className="state-message info">
            <Icon name={icons.search} size={20} color={theme.colors.textMuted} />
            Vui lòng nhập tên phim vào thanh tìm kiếm ở phía trên header để bắt đầu.
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="movie-grid">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.name}
                thumbUrl={movie.thumb_url}
                onEnter={() => navigate(`/player/${movie.slug}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
