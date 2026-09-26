import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';
import type { MovieItem } from '../services/api';
import { Icon, icons } from './Icon';
import { theme } from '../styles/theme';

export function HeaderSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }
    setLoading(true);
    setIsOpen(true);
    try {
      const res = await searchMovies(keyword);
      setResults(res?.items?.slice(0, 6) ?? []);
    } catch (err) {
      console.error('Lỗi live search:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    navigate(`/movies/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectMovie = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/player/${slug}`);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* Search Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: isFocused ? theme.colors.bgElevated : theme.colors.bgSecondary,
          border: '1px solid',
          borderColor: isFocused ? theme.colors.accent : theme.colors.borderLight,
          borderRadius: theme.radius.full,
          padding: '4px 14px',
          boxShadow: isFocused ? `0 0 12px ${theme.colors.accent}30` : 'none',
          transition: `all ${theme.transition.normal}`,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <button
          type="submit"
          aria-label="Submit search"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: isFocused ? theme.colors.accent : theme.colors.textMuted,
            marginRight: '8px',
          }}
        >
          <Icon name={icons.search} size={18} color={isFocused ? theme.colors.accent : theme.colors.textMuted} />
        </button>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0 && query.trim()) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Tìm tên phim..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: theme.colors.textPrimary,
            fontSize: '13.5px',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            aria-label="Clear search"
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: theme.colors.textMuted,
            }}
          >
            <Icon name={icons.clear} size={16} color={theme.colors.textMuted} />
          </button>
        )}
      </form>

      {/* Dropdown Live Results */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            backgroundColor: theme.colors.bgElevated,
            border: `1px solid ${theme.colors.borderLight}`,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadow.lg,
            zIndex: 1000,
            overflow: 'hidden',
            maxHeight: '380px',
            overflowY: 'auto',
            backdropFilter: 'blur(12px)',
          }}
        >
          {loading ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: theme.colors.textMuted,
                fontSize: '13px',
              }}
            >
              Đang tìm kiếm phim...
            </div>
          ) : results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  padding: '8px 14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: theme.colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  backgroundColor: theme.colors.bgPrimary,
                }}
              >
                Gợi ý cho "{query}"
              </div>
              {results.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie.slug)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${theme.colors.border}`,
                    transition: `background-color ${theme.transition.fast}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src={movie.thumb_url}
                    alt={movie.name}
                    style={{
                      width: '38px',
                      height: '52px',
                      objectFit: 'cover',
                      borderRadius: theme.radius.sm,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: theme.colors.textPrimary,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {movie.name}
                    </div>
                    {movie.current_episode && (
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: theme.colors.accent,
                          marginTop: '2px',
                        }}
                      >
                        {movie.current_episode}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div
                onClick={() => handleSubmit()}
                style={{
                  padding: '10px',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: theme.colors.accent,
                  cursor: 'pointer',
                  backgroundColor: theme.colors.bgPrimary,
                  transition: `background-color ${theme.transition.fast}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.bgPrimary;
                }}
              >
                Xem tất cả kết quả cho "{query}" →
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: theme.colors.textMuted,
                fontSize: '13px',
              }}
            >
              Không tìm thấy phim phù hợp.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
