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
import WindowsStartMenu from './WindowsStartMenu';

export default function WindowsTaskbar() {
  const { windows, focusApp, minimizeApp, openApp } = useWindowManager();
  const [time, setTime] = useState(new Date());
  const [isStartOpen, setIsStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const apps = [
    { id: 'projects', title: 'Projects', icon: '📁', component: ProjectsApp, w: 800, h: 600 },
    { id: 'skills', title: 'Skills', icon: '⚙️', component: SkillsApp, w: 700, h: 500 },
    { id: 'ai-agent', title: 'AI Agent', icon: '🤖', component: AIAgentApp, w: 450, h: 600 },
    { id: 'dreams', title: 'Story', icon: '📖', component: DreamsApp, w: 700, h: 700 },
    { id: 'browser', title: 'Edge Browser', icon: '🌐', component: BrowserApp, w: 1000, h: 700 },
    { id: 'terminal', title: 'Terminal', icon: '💻', component: TerminalApp, w: 650, h: 450 },
    { id: 'personalize', title: 'Settings', icon: '🖥️', component: PersonalizeApp, w: 500, h: 400 },
    { id: 'contact', title: 'Contact', icon: '✉️', component: ContactApp, w: 500, h: 650 },
  ];

  const handleAppClick = (appConfig) => {
    const existingWindow = windows.find(w => w.id === appConfig.id);
    if (existingWindow) {
      existingWindow.isMinimized ? focusApp(existingWindow.id) : minimizeApp(existingWindow.id);
    } else {
      openApp({ id: appConfig.id, title: appConfig.title, defaultWidth: appConfig.w, defaultHeight: appConfig.h, component: appConfig.component });
    }
  };

  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString();

  return (
    <>
      {isStartOpen && <WindowsStartMenu closeMenu={() => setIsStartOpen(false)} apps={apps} handleAppClick={handleAppClick} />}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: '48px', zIndex: 10000,
        backgroundColor: 'rgba(230,230,230,0.85)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
        borderTop: '1px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', boxSizing: 'border-box', boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        fontFamily: '"Segoe UI", sans-serif'
      }}>
        {/* Left spacer for centering */}
        <div style={{ flex: 1 }}></div>

        {/* Centered App Icons (Windows 11 style) */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {/* Start Button */}
          <div 
            onClick={() => setIsStartOpen(!isStartOpen)}
            style={{ 
              width: '40px', height: '40px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.2s', background: isStartOpen ? 'rgba(255,255,255,0.8)' : 'transparent'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.background = isStartOpen ? 'rgba(255,255,255,0.8)' : 'transparent'}
          >
            {/* Windows 11 Logo SVG */}
            <svg viewBox="0 0 88 88" width="22" height="22">
              <path fill="#00a4ef" d="M0 12.402l35.687-4.86v36.62H0V12.402zM39.69-.328L88 6.456v37.706H39.69V-.328zM0 48.016h35.687v36.62L0 79.775V48.016zM39.69 48.016H88v37.706L39.69 88.5v-40.484z" />
            </svg>
          </div>

          {apps.map(app => {
            const isOpen = windows.some(w => w.id === app.id);
            const isMinimized = windows.some(w => w.id === app.id && w.isMinimized);
            
            return (
              <div 
                key={app.id} 
                onClick={() => handleAppClick(app)}
                title={app.title}
                style={{ 
                  width: '40px', height: '40px', borderRadius: '4px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'background 0.1s', position: 'relative',
                  background: (isOpen && !isMinimized) ? 'rgba(255,255,255,0.8)' : 'transparent'
                }}
                onMouseEnter={e => { if(!isOpen || isMinimized) e.currentTarget.style.background = 'rgba(255,255,255,0.5)' }}
                onMouseLeave={e => { if(!isOpen || isMinimized) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>{app.icon}</span>
                {isOpen && (
                  <div style={{ position: 'absolute', bottom: '2px', width: '16px', height: '3px', background: !isMinimized ? '#0078D7' : '#999', borderRadius: '2px' }}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* System Tray */ }
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontSize: '14px' }}>📶</span>
            <span style={{ fontSize: '14px' }}>🔊</span>
            <span style={{ fontSize: '14px' }}>🔋</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s' }}
               onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontSize: '12px', color: '#111', fontWeight: 500 }}>{timeStr}</span>
            <span style={{ fontSize: '12px', color: '#111' }}>{dateStr}</span>
          </div>
        </div>
      </div>
    </>
  );
}
