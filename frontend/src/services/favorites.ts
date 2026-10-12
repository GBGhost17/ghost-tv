import { useState, useEffect } from 'react';
import type { MovieItem, MovieDetailData } from './api';

export interface FavoriteMovieItem {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
  current_episode?: string;
  addedAt: number;
}

const STORAGE_KEY = 'ghost_tv_favorite_movies';
export const FAVORITES_CHANGED_EVENT = 'ghost_tv_favorites_changed';

/**
 * Dispatches a custom event to notify all components in current window
 * about changes in the favorites list.
 */
function notifyFavoritesChanged(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  }
}

/**
 * Retrieves list of favorite movies from localStorage.
 */
export function getFavorites(): FavoriteMovieItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Lỗi khi đọc danh sách yêu thích từ localStorage:', error);
    return [];
  }
}

/**
 * Checks whether a movie is in the favorites list by slug or id.
 */
export function isFavorite(slugOrId: string): boolean {
  if (!slugOrId) return false;
  const list = getFavorites();
  return list.some((item) => item.slug === slugOrId || item.id === slugOrId);
}

/**
 * Adds a movie to the favorites list.
 */
export function addFavorite(movie: MovieItem | MovieDetailData | FavoriteMovieItem): boolean {
  if (!movie || !movie.slug) return false;

  try {
    const current = getFavorites();
    const movieId = movie.id || movie.slug;

    // Check if movie already exists
    if (current.some((item) => item.id === movieId || item.slug === movie.slug)) {
      return false;
    }

    const newItem: FavoriteMovieItem = {
      id: movieId,
      name: movie.name,
      slug: movie.slug,
      thumb_url: movie.thumb_url,
      current_episode: movie.current_episode || '',
      addedAt: Date.now(),
    };

    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyFavoritesChanged();
    return true;
  } catch (error) {
    console.error('Lỗi khi thêm phim vào danh sách yêu thích:', error);
    return false;
  }
}

/**
 * Removes a movie from favorites list by slug or id.
 */
export function removeFavorite(slugOrId: string): boolean {
  if (!slugOrId) return false;

  try {
    const current = getFavorites();
    const updated = current.filter((item) => item.slug !== slugOrId && item.id !== slugOrId);

    if (updated.length !== current.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      notifyFavoritesChanged();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Lỗi khi xóa phim khỏi danh sách yêu thích:', error);
    return false;
  }
}

/**
 * Toggles a movie's favorite status. Returns true if now favorited, false if removed.
 */
export function toggleFavorite(movie: MovieItem | MovieDetailData | FavoriteMovieItem): boolean {
  if (!movie || !movie.slug) return false;

  const currentIsFav = isFavorite(movie.slug) || (movie.id && isFavorite(movie.id));
  if (currentIsFav) {
    removeFavorite(movie.slug);
    return false;
  } else {
    addFavorite(movie);
    return true;
  }
}

/**
 * Clears all favorites.
 */
export function clearAllFavorites(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyFavoritesChanged();
  } catch (error) {
    console.error('Lỗi khi dọn sạch danh sách yêu thích:', error);
  }
}

/**
 * Custom hook to reactively subscribe to changes in the favorites list.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovieItem[]>(() => getFavorites());

  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    favorites,
    isFav: (slugOrId: string) => favorites.some((f) => f.slug === slugOrId || f.id === slugOrId),
    toggle: toggleFavorite,
    remove: removeFavorite,
    add: addFavorite,
    clearAll: clearAllFavorites,
  };
}
