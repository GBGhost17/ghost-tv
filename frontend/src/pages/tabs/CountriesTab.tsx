import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OFFICIAL_COUNTRIES } from '../../services/api';
import type { CategoryItem } from '../../services/api';
import { Icon, icons } from '../../components/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { theme } from '../../styles/theme';

const COUNTRY_FLAGS: { [slug: string]: string } = {
  'au-my': 'circle-flags:us',
  'anh': 'circle-flags:gb',
  'trung-quoc': 'circle-flags:cn',
  'indonesia': 'circle-flags:id',
  'viet-nam': 'circle-flags:vn',
  'phap': 'circle-flags:fr',
  'hong-kong': 'circle-flags:hk',
  'han-quoc': 'circle-flags:kr',
  'nhat-ban': 'circle-flags:jp',
  'thai-lan': 'circle-flags:th',
  'dai-loan': 'circle-flags:tw',
  'nga': 'circle-flags:ru',
  'ha-lan': 'circle-flags:nl',
  'philippines': 'circle-flags:ph',
  'an-do': 'circle-flags:in',
  'quoc-gia-khac': 'circle-flags:un',
};

function CountryBox({ country }: { country: CategoryItem }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const flagIcon = COUNTRY_FLAGS[country.slug] || icons.country;

  const handleClick = () => {
    navigate(`/movies/category/country/${country.slug}?name=${encodeURIComponent(country.name)}`);
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
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: isHovered ? `0 0 12px ${theme.colors.accent}40` : theme.shadow.sm,
        transition: `all ${theme.transition.normal}`,
      }}>
        <Icon
          name={flagIcon}
          size={42}
        />
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, textAlign: 'center' }}>
        {country.name}
      </span>
    </div>
  );
}

export function CountriesTab() {
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
        icon={icons.country}
        title="Quốc gia sản xuất"
        subtitle="Khám phá kho phim đa dạng từ nhiều quốc gia khác nhau!"
      />

      {/* Grid of Country Boxes ONLY */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '16px',
          width: '100%',
        }}
      >
        {OFFICIAL_COUNTRIES.map((country) => (
          <CountryBox key={country.slug} country={country} />
        ))}
      </div>
    </div>
  );
}
