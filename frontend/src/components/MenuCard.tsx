// src/components/MenuCard.tsx
import React, { useState } from 'react';

interface MenuCardProps {
  title: string;
  subtitle: string;
  icon: string;
  onEnter: () => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ title, subtitle, icon, onEnter }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onEnter}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '400px',
        height: '250px',
        borderRadius: '16px',
        border: '4px solid #334155',
        transform: isHovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered ? '0 18px 34px rgba(0, 0, 0, 0.45)' : '0 4px 6px rgba(0,0,0,0.3)',
        borderColor: isHovered ? '#38bdf8' : '#334155',
        backgroundColor: isHovered ? '#111c32' : '#0f172a',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      <span style={{ fontSize: '48px' }}>{icon}</span>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '5px' }}>{title}</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8' }}>{subtitle}</p>
      </div>
    </div>
  );
};