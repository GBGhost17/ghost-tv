// frontend/src/services/api.ts
import axios from 'axios';

// Read configuration from environment variables (.env)
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || 'https://phim.nguonc.com/api';
const RAW_INTERNAL_URL = import.meta.env.VITE_INTERNAL_API_URL;

const INTERNAL_API_URL = RAW_INTERNAL_URL && RAW_INTERNAL_URL.trim() !== ''
  ? RAW_INTERNAL_URL
  : (import.meta.env.DEV ? 'http://localhost:8000/api' : CONTENT_API_URL);

const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

export const internalApi = axios.create({
  baseURL: INTERNAL_API_URL,
  timeout: API_TIMEOUT,
});

export const contentApi = axios.create({
  baseURL: CONTENT_API_URL,
  timeout: API_TIMEOUT,
});

export interface MovieItem {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
  current_episode: string;
}

export interface CategoryItem {
  name: string;
  slug: string;
}

export const OFFICIAL_GENRES: CategoryItem[] = [
  { name: "Hành Động", slug: "hanh-dong" },
  { name: "Phiêu Lưu", slug: "phieu-luu" },
  { name: "Hoạt Hình", slug: "hoat-hinh" },
  { name: "Hài", slug: "phim-hai" },
  { name: "Hình Sự", slug: "hinh-su" },
  { name: "Tài Liệu", slug: "tai-lieu" },
  { name: "Chính Kịch", slug: "chinh-kich" },
  { name: "Gia Đình", slug: "gia-dinh" },
  { name: "Giả Tưởng", slug: "gia-tuong" },
  { name: "Lịch Sử", slug: "lich-su" },
  { name: "Kinh Dị", slug: "kinh-di" },
  { name: "Nhạc", slug: "phim-nhac" },
  { name: "Bí Ẩn", slug: "bi-an" },
  { name: "Lãng Mạn", slug: "lang-man" },
  { name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" },
  { name: "Gây Cấn", slug: "gay-can" },
  { name: "Chiến Tranh", slug: "chien-tranh" },
  { name: "Tâm Lý", slug: "tam-ly" },
  { name: "Tình Cảm", slug: "tinh-cam" },
  { name: "Cổ Trang", slug: "co-trang" },
  { name: "Miền Tây", slug: "mien-tay" }
];

export const OFFICIAL_COUNTRIES: CategoryItem[] = [
  { name: "Âu Mỹ", slug: "au-my" },
  { name: "Anh", slug: "anh" },
  { name: "Trung Quốc", slug: "trung-quoc" },
  { name: "Indonesia", slug: "indonesia" },
  { name: "Việt Nam", slug: "viet-nam" },
  { name: "Pháp", slug: "phap" },
  { name: "Hồng Kông", slug: "hong-kong" },
  { name: "Hàn Quốc", slug: "han-quoc" },
  { name: "Nhật Bản", slug: "nhat-ban" },
  { name: "Thái Lan", slug: "thai-lan" },
  { name: "Đài Loan", slug: "dai-loan" },
  { name: "Nga", slug: "nga" },
  { name: "Hà Lan", slug: "ha-lan" },
  { name: "Philippines", slug: "philippines" },
  { name: "Ấn Độ", slug: "an-do" },
  { name: "Quốc gia khác", slug: "quoc-gia-khac" }
];

// Regex to detect 18+ / adult movies
const IS_18_PLUS_REGEX = /phim-18|18\+|18plus|phim-nguoi-lon|phim18|18-plus|adult/i;

/**
 * Filter helper to check if a movie item or detail belongs to 18+ genre
 */
export function is18PlusMovie(movie: any): boolean {
  if (!movie) return false;

  if (movie.slug && IS_18_PLUS_REGEX.test(movie.slug)) return true;
  if (movie.name && IS_18_PLUS_REGEX.test(movie.name)) return true;

  if (movie.category && typeof movie.category === 'object') {
    const categories = Object.values(movie.category);
    for (const catGroup of categories as any[]) {
      if (catGroup?.list && Array.isArray(catGroup.list)) {
        for (const item of catGroup.list) {
          if (item.slug && IS_18_PLUS_REGEX.test(item.slug)) return true;
          if (item.name && IS_18_PLUS_REGEX.test(item.name)) return true;
        }
      }
    }
  }

  return false;
}

/**
 * Filter list of movies, removing any 18+ items
 */
export function filter18PlusMovies<T extends { slug?: string; name?: string }>(items: T[] = []): T[] {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => !is18PlusMovie(item));
}

// Response Cache for API calls
const responseCache: { [key: string]: any } = {};

function sanitizeApiResponse(data: any): any {
  if (!data) return data;
  if (Array.isArray(data.items)) {
    return {
      ...data,
      items: filter18PlusMovies(data.items),
    };
  }
  return data;
}

export const fetchMovies = async (page: number = 1) => {
  const cacheKey = `movies_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  const isCustomBackend = INTERNAL_API_URL && INTERNAL_API_URL !== CONTENT_API_URL && !INTERNAL_API_URL.includes('localhost');

  if (isCustomBackend) {
    try {
      const response = await internalApi.get(`/movies?page=${page}`);
      const cleanData = sanitizeApiResponse(response.data);
      responseCache[cacheKey] = cleanData;
      return cleanData;
    } catch (err) {
      console.warn('Lỗi gọi internalApi /movies, fallback sang contentApi:', err);
    }
  }

  try {
    const directRes = await contentApi.get(`/films/phim-moi-cap-nhat?page=${page}`);
    const cleanData = sanitizeApiResponse(directRes.data);
    responseCache[cacheKey] = cleanData;
    return cleanData;
  } catch (err) {
    console.error('Lỗi gọi contentApi /films/phim-moi-cap-nhat:', err);
    return { items: [] };
  }
};

export const fetchSingleMovies = async (page: number = 1) => {
  const cacheKey = `single_movies_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  try {
    const response = await contentApi.get(`/films/danh-sach/phim-le?page=${page}`);
    const cleanData = sanitizeApiResponse(response.data);
    responseCache[cacheKey] = cleanData;
    return cleanData;
  } catch (err) {
    console.error('Lỗi gọi contentApi phim-le:', err);
    return { items: [] };
  }
};

export const fetchSeriesMovies = async (page: number = 1) => {
  const cacheKey = `series_movies_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  try {
    const response = await contentApi.get(`/films/danh-sach/phim-bo?page=${page}`);
    const cleanData = sanitizeApiResponse(response.data);
    responseCache[cacheKey] = cleanData;
    return cleanData;
  } catch (err) {
    console.error('Lỗi gọi contentApi phim-bo:', err);
    return { items: [] };
  }
};

export const fetchMoviesByYear = async (year: string, page: number = 1) => {
  const cacheKey = `year_${year}_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  const isCustomBackend = INTERNAL_API_URL && INTERNAL_API_URL !== CONTENT_API_URL && !INTERNAL_API_URL.includes('localhost');

  if (isCustomBackend) {
    try {
      const response = await internalApi.get(`/movies/year/${year}?page=${page}`);
      const cleanData = sanitizeApiResponse(response.data);
      responseCache[cacheKey] = cleanData;
      return cleanData;
    } catch (err) {
      console.warn(`Lỗi gọi internalApi year [${year}], fallback sang contentApi:`, err);
    }
  }

  try {
    const directRes = await contentApi.get(`/films/nam-phat-hanh/${year}?page=${page}`);
    const cleanData = sanitizeApiResponse(directRes.data);
    responseCache[cacheKey] = cleanData;
    return cleanData;
  } catch (err) {
    console.error(`Lỗi gọi contentApi year [${year}]:`, err);
    return { items: [] };
  }
};

export const fetchMoviesByCategory = async (type: 'genre' | 'country', slug: string, page: number = 1, year?: string) => {
  // Completely block fetching if slug is 18+
  if (type === 'genre' && IS_18_PLUS_REGEX.test(slug)) {
    return { items: [] };
  }

  if (year && year !== 'all') {
    return fetchMoviesByYear(year, page);
  }
  const cacheKey = `${type}_${slug}_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  const isCustomBackend = INTERNAL_API_URL && INTERNAL_API_URL !== CONTENT_API_URL && !INTERNAL_API_URL.includes('localhost');

  if (isCustomBackend) {
    try {
      const response = await internalApi.get(`/movies/${type}/${slug}?page=${page}`);
      const cleanData = sanitizeApiResponse(response.data);
      responseCache[cacheKey] = cleanData;
      return cleanData;
    } catch (err) {
      console.warn(`Lỗi gọi internalApi ${type} [${slug}], fallback sang contentApi:`, err);
    }
  }

  try {
    const endpoint = type === 'genre' ? 'the-loai' : 'quoc-gia';
    const directRes = await contentApi.get(`/films/${endpoint}/${slug}?page=${page}`);
    const cleanData = sanitizeApiResponse(directRes.data);
    responseCache[cacheKey] = cleanData;
    return cleanData;
  } catch (err) {
    console.error(`Lỗi gọi contentApi ${type} [${slug}]:`, err);
    return { items: [] };
  }
};

export const searchMovies = async (keyword: string) => {
  if (!keyword.trim()) return { items: [] };

  try {
    const response = await contentApi.get(`/films/search?keyword=${encodeURIComponent(keyword)}`);
    return sanitizeApiResponse(response.data);
  } catch (err) {
    console.error('Lỗi gọi contentApi search:', err);
    return { items: [] };
  }
};

export interface EpisodeItem {
  name: string;
  slug: string;
  embed: string;
}

export interface ServerEpisodeGroup {
  server_name: string;
  items: EpisodeItem[];
}

export interface CategoryGroup {
  group: { id: string; name: string };
  list: Array<{ id: string; name: string }>;
}

export interface MovieDetailData {
  id: string;
  name: string;
  slug: string;
  original_name?: string;
  thumb_url: string;
  poster_url?: string;
  description: string;
  total_episodes?: number;
  current_episode?: string;
  time?: string;
  quality?: string;
  language?: string;
  director?: string;
  casts?: string;
  category?: { [key: string]: CategoryGroup };
  episodes: ServerEpisodeGroup[];
}

export const fetchMovieDetail = async (slug: string) => {
  if (IS_18_PLUS_REGEX.test(slug)) {
    return null;
  }
  try {
    const response = await contentApi.get(`/film/${slug}`);
    const data = response.data;

    // Check if returned movie is 18+ content
    const movieData = data?.movie || data?.item || data?.data?.item || data?.data?.movie;
    if (movieData && is18PlusMovie(movieData)) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết phim:", error);
    return null;
  }
};