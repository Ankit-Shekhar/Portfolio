import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';

export default function MacMenuBar() {
  const { windows, activeWindowId, openApp } = useWindowManager();
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState(null);

  // System settings overlay sliders
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeApp = windows.find(w => w.id === activeWindowId);
  const activeAppName = activeApp ? activeApp.title : 'Finder';

  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  const dayStr = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const toggleMenu = (menuId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuId ? null : menuId);
  };

  useEffect(() => {
    const close = () => setActiveMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const openSettings = () => {
    openApp({ id: 'personalize', title: 'Personalization', defaultWidth: 500, defaultHeight: 400, component: PersonalizeApp });
  };

  const TopMenuItem = ({ label, id, style = {}, onClick }) => (
    <div 
      onClick={(e) => onClick ? onClick(e) : toggleMenu(id, e)}
      style={{
        padding: '0 8px', height: '24px', display: 'flex', alignItems: 'center', cursor: 'default',
        backgroundColor: activeMenu === id ? 'rgba(255,255,255,0.2)' : 'transparent',
        borderRadius: '4px', margin: '0 2px', transition: 'background 0.1s', ...style
      }}
      onMouseEnter={e => { if(activeMenu && activeMenu !== id) setActiveMenu(id) }}
    >
      {label}
    </div>
  );

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '24px', zIndex: 12000,
      backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      color: '#fff', fontSize: '13.5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 8px', boxSizing: 'border-box', boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
      userSelect: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
        <div style={{ position: 'relative' }}>
          <TopMenuItem label="" id="apple" style={{ fontSize: '16px', padding: '0 12px' }} />
          {activeMenu === 'apple' && (
            <div style={{
              position: 'absolute', top: '24px', left: '4px', width: '220px',
              backgroundColor: 'rgba(40,40,40,0.85)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)', padding: '6px', zIndex: 13000
            }}>
              <div style={{ padding: '6px 12px', fontSize: '13px', color: '#fff', cursor: 'default', borderRadius: '4px' }} onMouseEnter={e=>e.target.style.background='#0066cc'} onMouseLeave={e=>e.target.style.background='transparent'}>About This Mac</div>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
              <div onClick={openSettings} style={{ padding: '6px 12px', fontSize: '13px', color: '#fff', cursor: 'default', borderRadius: '4px' }} onMouseEnter={e=>e.target.style.background='#0066cc'} onMouseLeave={e=>e.target.style.background='transparent'}>System Settings...</div>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />
              <div style={{ padding: '6px 12px', fontSize: '13px', color: '#fff', cursor: 'default', borderRadius: '4px' }} onMouseEnter={e=>e.target.style.background='#0066cc'} onMouseLeave={e=>e.target.style.background='transparent'}>Sleep</div>
              <div onClick={() => window.location.reload()} style={{ padding: '6px 12px', fontSize: '13px', color: '#fff', cursor: 'default', borderRadius: '4px' }} onMouseEnter={e=>e.target.style.background='#0066cc'} onMouseLeave={e=>e.target.style.background='transparent'}>Restart...</div>
              <div style={{ padding: '6px 12px', fontSize: '13px', color: '#fff', cursor: 'default', borderRadius: '4px' }} onMouseEnter={e=>e.target.style.background='#0066cc'} onMouseLeave={e=>e.target.style.background='transparent'}>Shut Down...</div>
            </div>
          )}
        </div>
        
        <TopMenuItem label={<strong style={{letterSpacing:'0.3px', padding: '0 4px'}}>{activeAppName}</strong>} id="app" />
        <TopMenuItem label="File" id="file" />
        <TopMenuItem label="Edit" id="edit" />
        <TopMenuItem label="View" id="view" />
        <TopMenuItem label="Window" id="window" />
        <TopMenuItem label="Help" id="help" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 500, height: '100%' }}>
        <TopMenuItem label={<span>{timeStr}</span>} id="time" />
        <TopMenuItem label={<span>100% <span style={{fontSize:'12px', marginLeft:'4px'}}>🔋</span></span>} id="battery" />
        <TopMenuItem label={<span style={{fontSize:'12px'}}>📶</span>} id="wifi" />
        <TopMenuItem label={<span style={{fontSize:'13px'}}>🔍</span>} id="search" onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, code: 'KeyK' })); }} />
        
        <div style={{ position: 'relative' }}>
          <TopMenuItem label={<span style={{fontSize:'13px'}}>🛠️</span>} id="controlcenter" />
          {activeMenu === 'controlcenter' && (
            <div onClick={e => e.stopPropagation()} style={{
              position: 'absolute', top: '30px', right: '4px', width: '300px',
              backgroundColor: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: '20px', zIndex: 13000,
              display: 'flex', flexDirection: 'column', gap: '20px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ccc' }}>Display Brightness</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '16px' }}>☀️</span>
                  <input type="range" min="0" max="100" value={brightness} onChange={e => setBrightness(e.target.value)} style={{ flex: 1, accentColor: '#fff', cursor: 'grab' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ccc' }}>System Volume</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '16px' }}>🔊</span>
                  <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ flex: 1, accentColor: '#fff', cursor: 'grab' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
