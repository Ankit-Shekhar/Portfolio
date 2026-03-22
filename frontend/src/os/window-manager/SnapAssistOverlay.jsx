import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';

export default function SnapAssistOverlay() {
  const { windows, snapAssistState, triggerSnapAssist, setWindowLayout } = useWindowManager();
  
  if (!snapAssistState) return null;

  const { side, primaryAppId } = snapAssistState; // side is where the primary app snapped. We show picker on the OPPOSITE side.
  // We want to show a grid of the other available open apps.
  const availableApps = windows.filter(w => w.id !== primaryAppId && !w.isMinimized);
  
  if (availableApps.length === 0) return null; // Nothing to snap

  const os = localStorage.getItem('selectedOS') || 'windows';
  const topOffset = os === 'macos' ? 24 : 0;
  
  const pickerStyle = {
    position: 'absolute',
    top: topOffset + 10,
    bottom: 10,
    left: side === 'left' ? 'calc(50% + 10px)' : '10px',
    right: side === 'right' ? 'calc(50% + 10px)' : '10px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    zIndex: 10005,
    padding: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    alignContent: 'flex-start',
    overflowY: 'auto'
  };

  const handleSelectApp = (appId) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = side === 'left' ? w / 2 : 0;
    
    window.dispatchEvent(new CustomEvent('force-window-layout', {
      detail: { id: appId, layout: { x, y: topOffset, w: w / 2, h: h - topOffset } }
    }));
    triggerSnapAssist(null);
  };

  // Close snap assist if user clicks on the empty background of the picker
  const handleBackgroundClick = (e) => {
    if (e.target.id === 'snap-picker') triggerSnapAssist(null);
  };

  return (
    <div id="snap-picker" style={pickerStyle} onClick={handleBackgroundClick}>
      <h3 style={{ width: '100%', color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.5)', marginTop: 0, fontWeight: 500 }}>Select a window to fill this side</h3>
      {availableApps.map(app => (
        <div 
          key={app.id}
          onClick={() => handleSelectApp(app.id)}
          style={{
            width: '180px', height: '140px', backgroundColor: 'rgba(255,255,255,0.7)',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 0.1s, background 0.1s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; }}
        >
          <span style={{ fontSize: '3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{app.title.includes('Terminal') ? '💻' : app.title.includes('Browser') ? '🌐' : '📁'}</span>
          <span style={{ marginTop: '12px', fontWeight: 600, color: '#333', fontSize: '13px' }}>{app.title}</span>
        </div>
      ))}
    </div>
  );
}
