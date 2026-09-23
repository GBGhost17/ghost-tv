import React from 'react';
import { MovieCard } from './MovieCard';
import type { MovieItem } from '../services/api';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface HorizontalMovieRowProps {
  title: string;
  movies: MovieItem[];
  onSelectMovie: (slug: string) => void;
}

export const HorizontalMovieRow: React.FC<HorizontalMovieRowProps> = ({ title, movies, onSelectMovie }) => {
  const scrollRef = useDraggableScroll<HTMLDivElement>();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc' }}>{title}</h2>
      <div ref={scrollRef} className="horizontal-scroll">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.name}
            thumbUrl={movie.thumb_url}
            onEnter={() => onSelectMovie(movie.slug)}
          />
        ))}
      </div>
    </div>
  );
};