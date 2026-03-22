import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import ProjectsApp from '../../apps/projects/ProjectsApp';
import SkillsApp from '../../apps/skills/SkillsApp';
import AIAgentApp from '../../apps/ai-agent/AIAgentApp';
import ContactApp from '../../apps/contact/ContactApp';
import DreamsApp from '../../apps/dreams/DreamsApp';
import TerminalApp from '../../apps/terminal/TerminalApp';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';
import BrowserApp from '../../apps/browser/BrowserApp';

export default function Dock() {
  const { windows, focusApp, minimizeApp, openApp, addDesktopShortcut, osSettings } = useWindowManager();
  const [contextMenu, setContextMenu] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const dockSize = osSettings?.dockSize || 60;
  const autoHide = osSettings?.dockAutoHide || false;

  const apps = [
    { id: 'projects', title: 'Projects', icon: '📁', component: ProjectsApp, w: 800, h: 600 },
    { id: 'skills', title: 'Skills', icon: '🛠️', component: SkillsApp, w: 700, h: 500 },
    { id: 'ai-agent', title: 'AI Chat', icon: '💬', component: AIAgentApp, w: 450, h: 600 },
    { id: 'dreams', title: 'Story', icon: '🧭', component: DreamsApp, w: 700, h: 700 },
    { id: 'browser', title: 'Safari', icon: '🌐', component: BrowserApp, w: 1000, h: 700 }, // Using globe since it's shared config, technically mac uses Safari.
    { id: 'terminal', title: 'Terminal', icon: '👨‍💻', component: TerminalApp, w: 650, h: 450 },
    { id: 'personalize', title: 'Settings', icon: '⚙️', component: PersonalizeApp, w: 500, h: 400 },
    { id: 'contact', title: 'Mail', icon: '✉️', component: ContactApp, w: 500, h: 650 },
  ];

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleAppClick = (appConfig) => {
    const existingWindow = windows.find(w => w.id === appConfig.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        focusApp(existingWindow.id);
      } else {
        minimizeApp(existingWindow.id);
      }
    } else {
      openApp({ id: appConfig.id, title: appConfig.title, defaultWidth: appConfig.w, defaultHeight: appConfig.h, component: appConfig.component });
    }
  };

  const handleRightClick = (e, app) => {
    if (localStorage.getItem('selectedOS') !== 'macos') return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY - 40, app });
  };

  return (
    <div 
      className="os-dock-container"
      style={{
        position: 'absolute', bottom: 0, width: '100%', height: '80px', display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 11000
      }}
    >
      <div 
        style={{ position: 'absolute', bottom: 0, width: '100%', height: '80px', pointerEvents: 'auto' }} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      />
      <div 
        className="os-dock" 
        style={{ 
          padding: '8px 16px', gap: '16px', pointerEvents: 'auto',
          transform: autoHide && !isHovered ? 'translateY(150%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2)', // bouncy unfold hook
          alignSelf: 'flex-end', marginBottom: '8px'
        }}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)}
      >
        {apps.map(app => {
          const isOpen = windows.some(w => w.id === app.id);
          const isMinimized = windows.some(w => w.id === app.id && w.isMinimized);
          
          return (
            <div 
              key={app.id} 
              className={`dock-item`}
              onClick={() => handleAppClick(app)}
              onContextMenu={(e) => handleRightClick(e, app)}
              title={app.title}
              style={{ 
                fontSize: `${dockSize * 0.45}px`, 
                width: `${dockSize}px`, height: `${dockSize}px`, 
                background: 'transparent', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative' 
              }}
            >
              {app.icon}
              {isOpen && !isMinimized && (
                <div style={{ position: 'absolute', bottom: '-8px', width: '5px', height: '5px', background: '#ccc', borderRadius: '50%' }}></div>
              )}
            </div>
          );
        })}
      </div>

      {contextMenu && (
        <div style={{
          position: 'fixed', left: contextMenu.x, top: contextMenu.y,
          backgroundColor: 'rgba(40,40,40,0.95)', backdropFilter: 'blur(10px)',
          border: '1px solid #555', borderRadius: '6px', padding: '4px',
          color: '#fff', fontSize: '14px', zIndex: 12001, boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          pointerEvents: 'auto', minWidth: '150px'
        }}>
          <div 
            onClick={() => addDesktopShortcut(contextMenu.app.id)}
            style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', transition: 'background-color 0.1s' }}
            onMouseEnter={e => e.target.style.backgroundColor = '#0066cc'}
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            Add to Desktop (Shortcut)
          </div>
        </div>
      )}
    </div>
  );
}
