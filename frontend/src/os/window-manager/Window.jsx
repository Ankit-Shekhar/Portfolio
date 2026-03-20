import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowManager } from '../../hooks/useWindowManager';
import '../../styles/window.css';

export default function Window({ window }) {
  const { id, title, isMinimized, isMaximized, zIndex, defaultWidth, defaultHeight, component: Component } = window;
  const { closeApp, minimizeApp, maximizeApp, focusApp } = useWindowManager();

  const selectedOS = localStorage.getItem('selectedOS') || 'windows';
  
  const [size, setSize] = useState({ width: defaultWidth || 600, height: defaultHeight || 400 });
  const [position, setPosition] = useState({ x: 150 + Math.random() * 50, y: 100 + Math.random() * 50 });

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

  return (
    <Rnd
      size={isMaximized ? { width: '100%', height: '100%' } : size}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDragStop={(e, d) => { if(!isMaximized) setPosition({ x: d.x, y: d.y }) }}
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
