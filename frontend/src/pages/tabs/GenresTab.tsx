import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICIAL_GENRES } from '../../services/api';
import type { CategoryItem } from '../../services/api';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { theme } from '../../styles/theme';

const GENRE_ICONS: { [slug: string]: string } = {
  'hanh-dong': 'mdi:sword-cross',
  'phieu-luu': 'mdi:compass-outline',
  'hoat-hinh': 'mdi:sparkles',
  'phim-hai': 'mdi:emoticon-lol-outline',
  'hinh-su': 'mdi:police-badge-outline',
  'tai-lieu': 'mdi:video-vintage',
  'chinh-kich': 'mdi:drama-masks',
  'gia-dinh': 'mdi:home-heart',
  'gia-tuong': 'mdi:wand',
  'lich-su': 'mdi:pillar',
  'kinh-di': 'mdi:ghost-outline',
  'phim-nhac': 'mdi:music',
  'bi-an': 'mdi:incognito',
  'lang-man': 'mdi:heart-outline',
  'khoa-hoc-vien-tuong': 'mdi:rocket-launch-outline',
  'gay-can': 'mdi:lightning-bolt-outline',
  'chien-tranh': 'mdi:shield-cross',
  'tam-ly': 'mdi:brain',
  'tinh-cam': 'mdi:cards-heart',
  'co-trang': 'mdi:castle',
  'mien-tay': 'mdi:hat-fedora',
};

function GenreBox({ genre }: { genre: CategoryItem }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const iconName = GENRE_ICONS[genre.slug] || icons.genres;

  const handleClick = () => {
    navigate(`/movies/category/genre/${genre.slug}?name=${encodeURIComponent(genre.name)}`);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '24px 18px',
        borderRadius: theme.radius.xl,
        backgroundColor: isHovered ? theme.colors.bgHover : theme.colors.bgPrimary,
        border: '2px solid',
        borderColor: isHovered ? theme.colors.accent : theme.colors.border,
        color: isHovered ? theme.colors.accent : theme.colors.textPrimary,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: `all ${theme.transition.normal}`,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? theme.shadow.lg : theme.shadow.sm,
        userSelect: 'none',
        minHeight: '120px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        backgroundColor: isHovered ? `${theme.colors.accent}25` : theme.colors.bgSecondary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `background-color ${theme.transition.normal}`,
      }}>
        <Icon
          name={iconName}
          size={28}
          color={isHovered ? theme.colors.accent : theme.colors.textSecondary}
        />
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, textAlign: 'center' }}>
        {genre.name}
      </span>
    </div>
  );
}

export function GenresTab() {
  return (
    <div
      className="page-enter-fast"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <PageHeader
        icon={icons.genres}
        title="Thể loại phim"
        subtitle="Khám phá kho phim đa dạng với nhiều thể loại khác nhau"
      />

      {/* Grid of Genre Boxes ONLY */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
          width: '100%',
        }}
      >
        {OFFICIAL_GENRES.map((genre) => (
          <GenreBox key={genre.slug} genre={genre} />
        ))}
      </div>
    </div>
  );
}
