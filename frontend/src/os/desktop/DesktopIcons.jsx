import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import ProjectsApp from '../../apps/projects/ProjectsApp';
import SkillsApp from '../../apps/skills/SkillsApp';
import AIAgentApp from '../../apps/ai-agent/AIAgentApp';
import ContactApp from '../../apps/contact/ContactApp';
import DreamsApp from '../../apps/dreams/DreamsApp';
import TerminalApp from '../../apps/terminal/TerminalApp';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';

export default function DesktopIcons({ os }) {
  const { openApp } = useWindowManager();

  if (os === 'macos') return null; // macOS exclusively uses the bottom Dock in our design

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

  return (
    <div className="desktop-icons-container">
      {apps.map((app) => (
        <div key={app.id} className="desktop-icon" onDoubleClick={app.action}>
          <div className="icon-image">{app.icon}</div>
          <span>{app.title}</span>
        </div>
      ))}
    </div>
  );
}
