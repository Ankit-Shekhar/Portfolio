import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowManager } from '../../hooks/useWindowManager';
import '../../styles/window.css';

export default function Window({ windowData }) {
  const { id, title, isMinimized, isMaximized, zIndex, defaultWidth, defaultHeight, component: Component } = windowData;
  const { closeApp, minimizeApp, maximizeApp, focusApp, triggerSnapAssist } = useWindowManager();

  const selectedOS = localStorage.getItem('selectedOS') || 'windows';
  
  const [size, setSize] = useState({ width: defaultWidth || 600, height: defaultHeight || 400 });
  const [position, setPosition] = useState({ x: 150 + Math.random() * 50, y: 100 + Math.random() * 50 });

  React.useEffect(() => {
    const handleForceLayout = (e) => {
      if (e.detail.id === id) {
        setPosition({ x: e.detail.layout.x, y: e.detail.layout.y });
        setSize({ width: e.detail.layout.w, height: e.detail.layout.h });
      }
    };
    window.addEventListener('force-window-layout', handleForceLayout);
    return () => window.removeEventListener('force-window-layout', handleForceLayout);
  }, [id]);

  if (isMinimized) return null;

  const renderMacControls = () => (
    <div className="window-controls mac-controls">
      <button className="btn-close" onClick={(e) => { e.stopPropagation(); closeApp(id); }} />
      <button className="btn-minimize" onClick={(e) => { e.stopPropagation(); minimizeApp(id); }} />
      <button className="btn-maximize" onClick={(e) => { e.stopPropagation(); maximizeApp(id); }} />
    </div>
  );

  const renderWinControls = () => (
    <div className="window-controls win-controls">
      <button className="win-btn win-minimize" onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}>—</button>
      <button className="win-btn win-maximize" onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}>{isMaximized ? '❐' : '◻'}</button>
      <button className="win-btn win-close" onClick={(e) => { e.stopPropagation(); closeApp(id); }}>✕</button>
    </div>
  );

  const topOffset = selectedOS === 'macos' ? 24 : 0;
  // Fallback fixed bottom offset for max bounds without needing deep context bindings at render tick
  const bottomOffset = selectedOS === 'macos' ? 80 : 48;

  const maxProps = {
    size: { width: '100%', height: `calc(100vh - ${topOffset}px - ${bottomOffset}px)` },
    position: { x: 0, y: topOffset }
  };

  return (
    <Rnd
      size={isMaximized ? maxProps.size : size}
      position={isMaximized ? maxProps.position : position}
      onDragStop={(e, d) => {
        if(!isMaximized) {
          const w = window.innerWidth;
          const h = window.innerHeight;
          const topOffset = selectedOS === 'macos' ? 24 : 0;
          
          if (d.x <= 10) {
            // Snap Left
            setPosition({ x: 0, y: topOffset });
            setSize({ width: w / 2, height: h - topOffset });
            triggerSnapAssist({ side: 'left', primaryAppId: id });
          } else if (d.x + size.width >= w - 10) {
            // Snap Right
            setPosition({ x: w / 2, y: topOffset });
            setSize({ width: w / 2, height: h - topOffset });
            triggerSnapAssist({ side: 'right', primaryAppId: id });
          } else if (d.y <= topOffset + 10) {
            // Snap Top (Maximize)
            maximizeApp(id);
            triggerSnapAssist(null);
          } else {
            setPosition({ x: d.x, y: d.y });
            triggerSnapAssist(null);
          }
        }
      }}
      onResizeStop={(e, direction, ref, delta, pos) => {
        if(!isMaximized) {
          setSize({ width: ref.style.width, height: ref.style.height });
          setPosition(pos);
        }
      }}
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
      dragHandleClassName="draggable-handle"
      onMouseDown={() => focusApp(id)}
      style={{ zIndex }}
      className={`os-window ${isMaximized ? 'maximized' : ''} ${selectedOS}-theme`}
      minWidth={350}
      minHeight={250}
      bounds="parent"
    >
      <div className={`window-inner ${selectedOS}-window-anim`} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div 
          className={`window-titlebar draggable-handle ${selectedOS}-titlebar`} 
          onDoubleClick={() => maximizeApp(id)}
          style={{ cursor: isMaximized ? 'default' : 'grab' }}
        >
          {selectedOS === 'macos' && renderMacControls()}
          
          <div className={`window-title ${selectedOS}-title`}>{title}</div>
          
          {selectedOS === 'windows' && renderWinControls()}
          {selectedOS === 'macos' && <div className="window-spacer"></div>}
        </div>
        <div className="window-content" onMouseDown={(e) => e.stopPropagation()}>
          {Component ? <Component /> : <div style={{padding: '1.5rem'}}>Content for {title}</div>}
        </div>
      </div>
    </Rnd>
  );
}
