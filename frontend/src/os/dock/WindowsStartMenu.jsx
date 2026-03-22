import React, { useEffect } from 'react';

export default function WindowsStartMenu({ closeMenu, apps, handleAppClick }) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const startMenu = document.getElementById('start-menu');
      if (startMenu && !startMenu.contains(e.target) && e.target.closest) {
        // Exclude the taskbar Start button from triggering close if it's the target
        const isStartBtn = e.target.closest('div[title="Start"]') || e.target.tagName.toLowerCase() === 'svg' || e.target.tagName.toLowerCase() === 'path';
        if (!isStartBtn) closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeMenu]);

  return (
    <div 
      id="start-menu"
      style={{
        position: 'absolute', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '650px', backgroundColor: 'rgba(243,243,243,0.92)',
        backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.7)', borderRadius: '8px', zIndex: 10001,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', fontFamily: '"Segoe UI", sans-serif', color: '#222'
      }}
    >
      <div style={{ padding: '32px 32px 0 32px' }}>
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <input 
            type="text" 
            placeholder="Type here to search" 
            style={{ 
              width: '100%', padding: '12px 16px', paddingLeft: '40px', borderRadius: '24px', 
              border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
              outline: 'none', fontSize: '14px', boxSizing: 'border-box'
            }} 
          />
          <span style={{ position: 'absolute', left: '16px', top: '12px', color: '#0078D7' }}>🔍</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Pinned</h3>
          <button style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.1)', color: '#444', cursor: 'pointer', fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '4px' }}>All apps {'>'}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '32px' }}>
          {apps.map(app => (
            <div 
              key={app.id} 
              onClick={() => { handleAppClick(app); closeMenu(); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '12px 4px', borderRadius: '4px', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '2.2rem', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}>{app.icon}</span>
              <span style={{ fontSize: '12px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', color: '#333' }}>{app.title}</span>
            </div>
          ))}
        </div>

        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Recommended</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.05)' }} onClick={() => {handleAppClick(apps.find(a=>a.id==='browser')); closeMenu();}}>
            <span style={{ fontSize: '2rem' }}>⛅</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>72°F Partly Cloudy</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Local Weather</div>
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.05)' }} onClick={() => {handleAppClick(apps.find(a=>a.id==='browser')); closeMenu();}}>
            <span style={{ fontSize: '2rem' }}>📰</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>Tech Stocks Surge</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Global News</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom User Area */}
      <div style={{ marginTop: 'auto', backgroundColor: 'rgba(0,0,0,0.03)', padding: '16px 32px', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity=0.8} onMouseLeave={e => e.currentTarget.style.opacity=1}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0078D7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#222' }}>Ankit Shekhar</span>
        </div>
        <button title="Power" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#555', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#E81123'} onMouseLeave={e => e.target.style.color = '#555'}>⏻</button>
      </div>
    </div>
  );
}
