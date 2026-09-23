// frontend/src/services/api.ts
import axios from 'axios';

// Read configuration from environment variables (.env)
const CONTENT_API_URL = import.meta.env.VITE_CONTENT_API_URL || 'https://phim.nguonc.com/api';
const RAW_INTERNAL_URL = import.meta.env.VITE_INTERNAL_API_URL;

// On Production (Vercel) without explicit internal backend, default directly to CONTENT_API_URL to prevent 15s timeout delays
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

// Response Cache for API calls
const responseCache: { [key: string]: any } = {};

export const fetchMovies = async (page: number = 1) => {
  const cacheKey = `movies_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  try {
    const response = await internalApi.get(`/movies?page=${page}`);
    responseCache[cacheKey] = response.data;
    return response.data;
  } catch (err) {
    console.error('Lỗi gọi internalApi /movies:', err);
    try {
      const directRes = await contentApi.get(`/films/danh-sach/phim-moi-cap-nhat?page=${page}`);
      responseCache[cacheKey] = directRes.data;
      return directRes.data;
    } catch {
      return { items: [] };
    }
  }
};

export const fetchSingleMovies = async (page: number = 1) => {
  const cacheKey = `single_movies_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  try {
    const response = await contentApi.get(`/films/danh-sach/phim-le?page=${page}`);
    responseCache[cacheKey] = response.data;
    return response.data;
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
    responseCache[cacheKey] = response.data;
    return response.data;
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

  try {
    const response = await internalApi.get(`/movies/year/${year}?page=${page}`);
    responseCache[cacheKey] = response.data;
    return response.data;
  } catch (err) {
    console.error(`Lỗi gọi API year [${year}]:`, err);
    try {
      const directRes = await contentApi.get(`/films/nam-phat-hanh/${year}?page=${page}`);
      responseCache[cacheKey] = directRes.data;
      return directRes.data;
    } catch {
      return { items: [] };
    }
  }
};

export const fetchMoviesByCategory = async (type: 'genre' | 'country', slug: string, page: number = 1, year?: string) => {
  if (year && year !== 'all') {
    return fetchMoviesByYear(year, page);
  }
  const cacheKey = `${type}_${slug}_page_${page}`;
  if (responseCache[cacheKey]) {
    return responseCache[cacheKey];
  }

  try {
    const response = await internalApi.get(`/movies/${type}/${slug}?page=${page}`);
    responseCache[cacheKey] = response.data;
    return response.data;
  } catch (err) {
    console.error(`Lỗi gọi API ${type} [${slug}]:`, err);
    try {
      const endpoint = type === 'genre' ? 'the-loai' : 'quoc-gia';
      const directRes = await contentApi.get(`/films/${endpoint}/${slug}?page=${page}`);
      responseCache[cacheKey] = directRes.data;
      return directRes.data;
    } catch {
      return { items: [] };
    }
  }
};

export const searchMovies = async (keyword: string) => {
  if (!keyword.trim()) return { items: [] };

  try {
    const response = await contentApi.get(`/films/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
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
  try {
    const response = await contentApi.get(`/film/${slug}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết phim:", error);
    return null;
  }
};