import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICIAL_COUNTRIES, fetchMoviesByCategory } from '../../services/api';
import type { MovieItem } from '../../services/api';
import { MovieCard } from '../../components/MovieCard';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { theme } from '../../styles/theme';

import { useDraggableScroll } from '../../hooks/useDraggableScroll';

let globalCountryCache: { [slug: string]: MovieItem[] } = {};
export function clearCountryCache() { globalCountryCache = {}; }

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
      <Icon name={icons.globe} size={32} color={isHovered ? theme.colors.accent : theme.colors.textSecondary} />
      <span style={{ fontSize: '14px', fontWeight: 600, textAlign: 'center', lineHeight: 1.4 }}>
        Xem tất cả<br />{label}
      </span>
    </div>
  );
}

function CountryRow({ country, movies }: { country: { name: string; slug: string }; movies: MovieItem[] }) {
  const scrollRef = useDraggableScroll<HTMLDivElement>();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <h2 className="section-title section-title-accent">{country.name}</h2>
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
          label={country.name}
          onEnter={() => navigate(`/movies/category/country/${country.slug}?name=${encodeURIComponent(country.name)}`)}
        />
      </div>
    </div>
  );
}

export function CountriesTab() {
  const [countryData, setCountryData] = useState<{ [slug: string]: MovieItem[] }>(globalCountryCache);
  const [loading, setLoading] = useState(Object.keys(globalCountryCache).length === 0);

  useEffect(() => {
    if (Object.keys(globalCountryCache).length > 0) { setLoading(false); return; }

    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      const results: { [slug: string]: MovieItem[] } = {};

      for (let i = 0; i < OFFICIAL_COUNTRIES.length; i += 3) {
        const batch = OFFICIAL_COUNTRIES.slice(i, i + 3);
        await Promise.all(batch.map(async (c) => {
          try {
            const res = await fetchMoviesByCategory('country', c.slug, 1);
            if (res?.items?.length) results[c.slug] = res.items.slice(0, 6);
          } catch { /* skip failed country */ }
        }));
        if (isMounted) setCountryData({ ...results });
      }

      if (isMounted) { globalCountryCache = results; setLoading(false); }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: '36px',
      width: '100%', boxSizing: 'border-box',
    }}>
      <PageHeader icon={icons.country} title="Quốc gia" subtitle="Khám phá phim theo quốc gia sản xuất." />

      {loading && Object.keys(countryData).length === 0 && <LoadingSpinner />}

      {OFFICIAL_COUNTRIES.map((country) => {
        const movies = countryData[country.slug] || [];
        if (movies.length === 0) return null;
        return <CountryRow key={country.slug} country={country} movies={movies} />;
      })}
    </div>
  );
}
