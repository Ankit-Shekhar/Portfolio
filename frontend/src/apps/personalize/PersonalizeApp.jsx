import React, { useState } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';

export default function PersonalizeApp() {
  const os = localStorage.getItem('selectedOS') || 'windows';
  const { osSettings, updateOsSettings } = useWindowManager();
  
  const wallpapers = {
    windows: [
      { id: 'windows-wallpaper', name: 'Windows Bloom', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop' },
      { id: 'win-wp-2', name: 'Dark Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop' },
      { id: 'win-wp-3', name: 'Neon Curves', url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=600&auto=format&fit=crop' },
      { id: 'win-wp-4', name: 'Aero Glass', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop' }
    ],
    macos: [
      { id: 'macos-wallpaper', name: 'Monterey Graphic', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop' },
      { id: 'mac-wp-2', name: 'Big Sur Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop' },
      { id: 'mac-wp-3', name: 'Desert Night', url: 'https://images.unsplash.com/photo-1502481854376-0f9c2c62e5b7?q=80&w=600&auto=format&fit=crop' },
      { id: 'mac-wp-4', name: 'Sonoma Horizon', url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop' }
    ]
  };

  const list = wallpapers[os];
  const [selected, setSelected] = useState(localStorage.getItem('wallpaperClass') || `${os}-wallpaper`);

  const handleSelect = (id) => {
    setSelected(id);
    localStorage.setItem('wallpaperClass', id);
    window.dispatchEvent(new Event('wallpaper-changed'));
  };

  return (
    <div className="app-container p-6" style={{ color: '#fff', overflowY: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Personalization</h2>
      <p style={{ marginBottom: '16px', color: '#a1a1aa' }}>Select a wallpaper for your {os === 'windows' ? 'Windows' : 'macOS'} desktop.</p>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {list.map(wp => (
          <div 
            key={wp.id}
            onClick={() => handleSelect(wp.id)}
            style={{
              width: '180px',
              height: '120px',
              borderRadius: '8px',
              backgroundImage: `url(${wp.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: selected === wp.id ? '4px solid #3b82f6' : '4px solid transparent',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              transition: 'transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              position: 'absolute', bottom: 0, width: '100%', 
              backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', 
              fontSize: '0.8rem', padding: '4px', textAlign: 'center',
              borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px'
            }}>
              {wp.name}
            </div>
          </div>
        ))}
      </div>

      {os === 'macos' && (
        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', maxWidth: '400px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '24px' }}>Dock Behaviors</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.1rem' }}>Automatically hide and show the Dock</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={osSettings?.dockAutoHide || false}
                onChange={e => updateOsSettings({ dockAutoHide: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#3b82f6' }}
              />
            </label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.1rem' }}>Dock Scale Size</span>
            <select 
              value={osSettings?.dockSize || 60}
              onChange={e => updateOsSettings({ dockSize: Number(e.target.value) })}
              style={{ 
                padding: '6px 12px', borderRadius: '6px', background: '#333', 
                color: '#fff', border: '1px solid #555', fontSize: '1rem', outline: 'none' 
              }}
            >
              <option value={40}>Small</option>
              <option value={60}>Medium</option>
              <option value={80}>Large</option>
              <option value={100}>Extra Large</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
