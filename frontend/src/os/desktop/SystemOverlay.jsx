import React, { useEffect, useState, useRef } from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import TerminalApp from '../../apps/terminal/TerminalApp';
import ProjectsApp from '../../apps/projects/ProjectsApp';
import SkillsApp from '../../apps/skills/SkillsApp';
import AIAgentApp from '../../apps/ai-agent/AIAgentApp';
import ContactApp from '../../apps/contact/ContactApp';
import DreamsApp from '../../apps/dreams/DreamsApp';
import PersonalizeApp from '../../apps/personalize/PersonalizeApp';

export default function SystemOverlay() {
  const os = localStorage.getItem('selectedOS') || 'windows';
  const isMac = os === 'macos';
  const { openApp } = useWindowManager();
  
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Mac Spotlight: Ctrl+K
      if (isMac && e.ctrlKey && e.code === 'KeyK') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Win Run: Ctrl+Shift+X
      else if (!isMac && e.ctrlKey && e.shiftKey && e.code === 'KeyX') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMac, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    
    const appRegistry = [
      { keywords: ['terminal', 'cmd', 'command'], app: { id: 'terminal', title: 'System Terminal', defaultWidth: 650, defaultHeight: 450, component: TerminalApp } },
      { keywords: ['projects', 'project', 'portfolio'], app: { id: 'projects', title: 'Projects Explorer', defaultWidth: 800, defaultHeight: 600, component: ProjectsApp } },
      { keywords: ['skills', 'skill', 'tech', 'stack'], app: { id: 'skills', title: 'Skills Matrix', defaultWidth: 700, defaultHeight: 500, component: SkillsApp } },
      { keywords: ['ai', 'agent', 'chat', 'bot'], app: { id: 'ai-agent', title: 'Ankit AI Representative', defaultWidth: 450, defaultHeight: 600, component: AIAgentApp } },
      { keywords: ['dreams', 'story', 'journey', 'timeline'], app: { id: 'dreams', title: 'Broken Dreams Timeline', defaultWidth: 700, defaultHeight: 700, component: DreamsApp } },
      { keywords: ['personalize', 'settings', 'wallpaper', 'theme'], app: { id: 'personalize', title: 'Personalization', defaultWidth: 500, defaultHeight: 400, component: PersonalizeApp } },
      { keywords: ['contact', 'message', 'mail', 'email'], app: { id: 'contact', title: 'Contact Me', defaultWidth: 500, defaultHeight: 650, component: ContactApp } }
    ];

    const match = appRegistry.find(entry => entry.keywords.some(kw => q.includes(kw)));
    
    if (match) {
      openApp(match.app);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  if (isMac) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.2)' }} onClick={() => setIsOpen(false)}>
        <div 
          onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, 0)', width: '600px', backgroundColor: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '12px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '16px', color: '#888' }}>🔍</span>
            <input 
              ref={inputRef}
              type="text" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder="Spotlight Search" 
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1.8rem', outline: 'none' }}
              spellCheck="false"
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    );
  }

  // Windows Run Dialog
  return (
    <div style={{ position: 'fixed', bottom: '60px', left: '20px', zIndex: 10000 }}>
      {/* Click outside simulation not strictly needed here, just float it like real windows run */}
      <div 
        style={{ width: '400px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', padding: '12px', fontFamily: 'Segoe UI, sans-serif' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '2.5rem', marginRight: '16px', color: '#0078d7' }}>⊞</span>
          <div>
            <div style={{ fontWeight: 'normal', fontSize: '1.1rem', color: '#000', marginBottom: '4px' }}>Run</div>
            <div style={{ fontSize: '0.85rem', color: '#333' }}>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ color: '#000', minWidth: '40px', fontSize: '0.9rem' }}>Open:</label>
          <input 
            ref={inputRef}
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            style={{ flex: 1, padding: '4px 8px', border: '1px solid #999', borderRadius: '2px', outlineColor: '#0078d7', color: '#000' }}
            spellCheck="false"
            autoComplete="off"
          />
        </form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
          <button onClick={handleSubmit} style={{ padding: '4px 24px', backgroundColor: '#e1e1e1', border: '1px solid #adadad', cursor: 'pointer', color: '#000', borderRadius: '2px' }}>OK</button>
          <button onClick={() => setIsOpen(false)} style={{ padding: '4px 24px', backgroundColor: '#e1e1e1', border: '1px solid #adadad', cursor: 'pointer', color: '#000', borderRadius: '2px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
