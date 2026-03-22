import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowManager } from '../../hooks/useWindowManager';
import ProjectsApp from '../../apps/projects/ProjectsApp';
import SkillsApp from '../../apps/skills/SkillsApp';
import AIAgentApp from '../../apps/ai-agent/AIAgentApp';
import ContactApp from '../../apps/contact/ContactApp';
import DreamsApp from '../../apps/dreams/DreamsApp';
import TerminalApp from '../../apps/terminal/TerminalApp';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';
import BrowserApp from '../../apps/browser/BrowserApp';

export default function DesktopIcons({ os }) {
  const { openApp, desktopShortcuts } = useWindowManager();
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const apps = [
    { 
      id: 'projects', title: 'Projects', icon: '📁', 
      action: () => openApp({ id: 'projects', title: 'Projects Explorer', defaultWidth: 800, defaultHeight: 600, component: ProjectsApp }) 
    },
    { 
      id: 'skills', title: 'Skills', icon: '⚙️', 
      action: () => openApp({ id: 'skills', title: 'Skills Matrix', defaultWidth: 700, defaultHeight: 500, component: SkillsApp }) 
    },
    { 
      id: 'ai-agent', title: 'AI Agent', icon: '🤖', 
      action: () => openApp({ id: 'ai-agent', title: 'Ankit AI Representative', defaultWidth: 450, defaultHeight: 600, component: AIAgentApp }) 
    },
    { 
      id: 'dreams', title: 'Story', icon: '📖', 
      action: () => openApp({ id: 'dreams', title: 'Broken Dreams Timeline', defaultWidth: 700, defaultHeight: 700, component: DreamsApp }) 
    },
    { 
      id: 'browser', title: 'Edge Browser', icon: '🌐', 
      action: () => openApp({ id: 'browser', title: 'Web Browser', defaultWidth: 1000, defaultHeight: 700, component: BrowserApp }) 
    },
    { 
      id: 'terminal', title: 'Terminal', icon: '💻', 
      action: () => openApp({ id: 'terminal', title: 'System Terminal', defaultWidth: 650, defaultHeight: 450, component: TerminalApp }) 
    },
    { 
      id: 'personalize', title: 'Settings', icon: '🖥️', 
      action: () => openApp({ id: 'personalize', title: 'Personalization', defaultWidth: 500, defaultHeight: 400, component: PersonalizeApp }) 
    },
    { 
      id: 'contact', title: 'Contact', icon: '✉️', 
      action: () => openApp({ id: 'contact', title: 'Contact Me', defaultWidth: 500, defaultHeight: 650, component: ContactApp }) 
    },
  ];

  const visibleApps = apps.filter(a => desktopShortcuts.includes(a.id));

  const BlueFolder = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.4))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const YellowFolder = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="#facc15" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.5))' }}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  );

  const FolderIcon = os === 'macos' ? BlueFolder : YellowFolder;

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      {visibleApps.map((app, index) => {
        // macOS typically stacks on right, Windows typically stacks on left
        const startX = os === 'macos' ? windowSize.w - 100 : 20;
        const startY = os === 'macos' ? 60 + (index * 110) : 20 + (index * 100);

        return (
          <Rnd
            key={app.id}
            default={{ x: startX, y: startY, width: 80, height: 90 }}
            bounds="parent"
            enableResizing={false}
            style={{ pointerEvents: 'auto' }}
          >
            <div 
              className="desktop-icon" 
              onDoubleClick={app.action} 
              style={{ 
                width: '100%', height: '100%', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', justifyContent: 'center', cursor: 'default'
              }}
            >
              <FolderIcon />
              <span style={{ 
                fontWeight: os === 'macos' ? 500 : 400, 
                marginTop: '4px', 
                background: os === 'macos' ? 'rgba(0,0,0,0.4)' : 'transparent', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                textShadow: os === 'windows' ? '0 1px 3px rgba(0,0,0,0.8)' : 'none',
                color: '#fff',
                fontSize: '0.85rem',
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {app.title}
              </span>
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
