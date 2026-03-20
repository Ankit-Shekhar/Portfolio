import React, { useEffect, useState } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import '../../styles/desktop.css';

export default function WindowsTaskbar() {
  const { windows, focusApp, minimizeApp } = useWindowManager();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="windows-taskbar">
      <div className="start-button">⊞</div>
      <div className="taskbar-apps">
        {windows.map(w => (
          <div 
            key={w.id} 
            className={`taskbar-item ${!w.isMinimized ? 'active' : ''}`}
            onClick={() => w.isMinimized ? focusApp(w.id) : minimizeApp(w.id)}
          >
            <span className="taskbar-icon">{w.title.substring(0, 1)}</span>
            <span className="taskbar-label">{w.title}</span>
          </div>
        ))}
      </div>
      <div className="taskbar-tray">
        <span>{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <span style={{ marginLeft: '12px' }}>{time.toLocaleDateString()}</span>
      </div>
    </div>
  );
}
