import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICIAL_GENRES, fetchMoviesByCategory } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { theme } from '../../styles/theme';

import { useDraggableScroll } from '../../hooks/useDraggableScroll';

let globalGenreCache: { [slug: string]: MovieItem[] } = {};
export function clearGenreCache() { globalGenreCache = {}; }

function ViewAllButton({ label, onEnter }: { label: string; onEnter: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onEnter}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        flex: '0 0 180px', height: '280px',
        border: '2px dashed',
        borderColor: isHovered ? theme.colors.accent : theme.colors.borderLight,
        borderRadius: theme.radius.md,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
        cursor: 'pointer',
        color: isHovered ? theme.colors.textPrimary : theme.colors.textSecondary,
        transition: `all ${theme.transition.smooth}`,
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadow.md : 'none',
        backgroundColor: isHovered ? theme.colors.bgHover : theme.colors.bgSecondary,
      }}
    >
      <Icon name={icons.forward} size={32} color={isHovered ? theme.colors.accent : theme.colors.textSecondary} />
      <span style={{ fontSize: '14px', fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
        Xem tất cả<br />{label}
      </span>
    </div>
  );
}

function GenreRow({ genre, movies }: { genre: { name: string; slug: string }; movies: MovieItem[] }) {
  const scrollRef = useDraggableScroll<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 className="section-title section-title-accent">{genre.name}</h2>
      <div ref={scrollRef} className="horizontal-scroll">
        {movies.map((movie) => (
          <div key={movie.id} style={{ flex: '0 0 auto' }}>
            <MovieCard
              title={movie.name}
              thumbUrl={movie.thumb_url}
              onEnter={() => navigate(`/player/${movie.slug}`)}
            />
          </div>
        ))}
        <ViewAllButton
          label={genre.name}
          onEnter={() => navigate(`/movies/category/genre/${genre.slug}?name=${encodeURIComponent(genre.name)}`)}
        />
      </div>
    </div>
  );
}

export function GenresTab() {
  const [genreData, setGenreData] = useState<{ [slug: string]: MovieItem[] }>(globalGenreCache);
  const [loading, setLoading] = useState(Object.keys(globalGenreCache).length === 0);

  useEffect(() => {
    if (Object.keys(globalGenreCache).length > 0) { setLoading(false); return; }

    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const results: { [slug: string]: MovieItem[] } = {};

      for (let i = 0; i < OFFICIAL_GENRES.length; i += 3) {
        const batch = OFFICIAL_GENRES.slice(i, i + 3);
        await Promise.all(batch.map(async (g) => {
          try {
            const res = await fetchMoviesByCategory('genre', g.slug, 1);
            if (res?.items?.length) results[g.slug] = res.items.slice(0, 6);
          } catch { /* skip failed genre */ }
        }));
        if (isMounted) setGenreData({ ...results });
      }

      if (isMounted) { globalGenreCache = results; setLoading(false); }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '36px',
      width: '100%', boxSizing: 'border-box',
    }}>
      <PageHeader icon={icons.genres} title="Thể loại" subtitle="Khám phá phim theo thể loại yêu thích." />

      {loading && Object.keys(genreData).length === 0 && <LoadingSpinner />}

      {OFFICIAL_GENRES.map((genre) => {
        const movies = genreData[genre.slug] || [];
        if (movies.length === 0) return null;
        return <GenreRow key={genre.slug} genre={genre} movies={movies} />;
      })}
    </div>
  );
}
