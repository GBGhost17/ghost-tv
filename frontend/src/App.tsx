import { Routes, Route, useLocation } from 'react-router-dom';
import { HomeScreen } from './pages/HomeScreen';
import { MovieLayout } from './pages/MovieLayout';
import { HomeTab } from './pages/tabs/HomeTab';
import { SearchTab } from './pages/tabs/SearchTab';
import { GenresTab } from './pages/tabs/GenresTab';
import { CountriesTab } from './pages/tabs/CountriesTab';
import { SingleMoviesTab } from './pages/tabs/SingleMoviesTab';
import { SeriesMoviesTab } from './pages/tabs/SeriesMoviesTab';
import { CategoryDetailScreen } from './pages/CategoryDetailScreen';
import { PlayerScreen } from './pages/PlayerScreen';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/movies" element={<MovieLayout />}>
        <Route index element={<HomeTab />} />
        <Route path="search" element={<SearchTab />} />
        <Route path="single" element={<SingleMoviesTab />} />
        <Route path="series" element={<SeriesMoviesTab />} />
        <Route path="genres" element={<GenresTab />} />
        <Route path="countries" element={<CountriesTab />} />
        <Route path="category/:type/:slug" element={<CategoryDetailScreen />} />
      </Route>
      <Route path="/player/:slug" element={<PlayerScreen />} />
    </Routes>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
