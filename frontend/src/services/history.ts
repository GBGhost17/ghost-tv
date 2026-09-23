import type { MovieDetailData } from './api';

export interface WatchHistoryItem {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
  episode_name: string;
  timestamp: number;
}

const STORAGE_KEY = 'ghost_tv_watch_history';
const MAX_ITEMS = 20;

export function getHistory(): WatchHistoryItem[] {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Lỗi khi đọc lịch sử xem từ localStorage:', error);
    return [];
  }
}

export function saveToHistory(movie: MovieDetailData, episodeName: string): void {
  if (!movie || !movie.slug) return;

  try {
    const currentHistory = getHistory();
    const movieId = movie.id || movie.slug;

    // Filter out existing record if movie already exists
    const filteredHistory = currentHistory.filter(
      (item) => item.id !== movieId && item.slug !== movie.slug
    );

    const newItem: WatchHistoryItem = {
      id: movieId,
      name: movie.name,
      slug: movie.slug,
      thumb_url: movie.thumb_url,
      episode_name: episodeName || '',
      timestamp: Date.now(),
    };

    // Prepend updated item to index 0 and limit to 20 items max
    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Lỗi khi lưu lịch sử xem vào localStorage:', error);
  }
}
