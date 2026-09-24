import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { theme } from '../../styles/theme';

export function SearchTab() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const handleInputChange = (value: string) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(value), 400);
  };

  const handleClear = () => {
    setKeyword('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      handleSearch(keyword);
    }
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div
      className="page-enter-fast"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <PageHeader icon={icons.search} title="Tìm kiếm" />

      <div>
        <div className="search-input-wrapper">
          <span className="search-input-icon">
            <Icon name={icons.search} size={22} color={theme.colors.textMuted} />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Nhập tên phim cần tìm..."
            value={keyword}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          {keyword && (
            <button type="button" className="search-clear-btn" onClick={handleClear} aria-label="Xóa">
              <Icon name={icons.clear} size={20} color={theme.colors.textSecondary} />
            </button>
          )}
        </div>
        {keyword && (
          <span className="search-result-badge">
            <Icon name={icons.film} size={16} color={theme.colors.textSecondary} />
            {results.length} kết quả
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="section-title">Kết quả tìm kiếm</h2>

        {loading && <LoadingSpinner text="Đang tìm kiếm..." />}

        {!loading && results.length === 0 && keyword && (
          <div className="state-message error">
            <Icon name={icons.warning} size={20} color={theme.colors.error} />
            Không tìm thấy kết quả phù hợp.
          </div>
        )}

        {!loading && !keyword && (
          <div className="state-message info">
            <Icon name={icons.search} size={20} color={theme.colors.textMuted} />
            Bắt đầu gõ để tìm kiếm phim yêu thích của bạn.
          </div>
        )}

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
      </div>
    </div>
  );
}
