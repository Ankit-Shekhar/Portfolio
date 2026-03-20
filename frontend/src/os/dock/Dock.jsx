import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import ProjectsApp from '../../apps/projects/ProjectsApp';
import SkillsApp from '../../apps/skills/SkillsApp';
import AIAgentApp from '../../apps/ai-agent/AIAgentApp';
import ContactApp from '../../apps/contact/ContactApp';
import DreamsApp from '../../apps/dreams/DreamsApp';
import TerminalApp from '../../apps/terminal/TerminalApp';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';

export default function Dock() {
  const { windows, focusApp, minimizeApp, openApp } = useWindowManager();

  const apps = [
    { id: 'projects', title: 'Projects Explorer', icon: '📁', component: ProjectsApp, w: 800, h: 600 },
    { id: 'skills', title: 'Skills Matrix', icon: '⚙️', component: SkillsApp, w: 700, h: 500 },
    { id: 'ai-agent', title: 'Ankit AI', icon: '🤖', component: AIAgentApp, w: 450, h: 600 },
    { id: 'dreams', title: 'Story Journey', icon: '📖', component: DreamsApp, w: 700, h: 700 },
    { id: 'terminal', title: 'Terminal', icon: '💻', component: TerminalApp, w: 650, h: 450 },
    { id: 'personalize', title: 'Settings', icon: '🖥️', component: PersonalizeApp, w: 500, h: 400 },
    { id: 'contact', title: 'Contact Me', icon: '✉️', component: ContactApp, w: 500, h: 650 },
  ];

  const handleAppClick = (appConfig) => {
    const existingWindow = windows.find(w => w.id === appConfig.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        focusApp(existingWindow.id);
      } else {
        minimizeApp(existingWindow.id);
      }
    } else {
      openApp({
        id: appConfig.id,
        title: appConfig.title,
        defaultWidth: appConfig.w,
        defaultHeight: appConfig.h,
        component: appConfig.component
      });
    }
  };

  return (
    <div className="os-dock-container">
      <div className="os-dock" style={{ padding: '8px 16px', gap: '16px' }}>
        {apps.map(app => {
          const isOpen = windows.some(w => w.id === app.id);
          const isMinimized = windows.some(w => w.id === app.id && w.isMinimized);
          
          return (
            <div 
              key={app.id} 
              className={`dock-item`}
              onClick={() => handleAppClick(app)}
              title={app.title}
              style={{ 
                fontSize: '2.5rem', 
                width: '60px', height: '60px', 
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
    </div>
  );
}
