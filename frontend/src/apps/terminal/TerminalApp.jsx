import React, { useState, useRef, useEffect } from 'react';

export default function TerminalApp() {
  const os = localStorage.getItem('selectedOS') || 'windows';
  const isWin = os === 'windows';
  
  const [history, setHistory] = useState([
    { type: 'output', text: `AS-OS System Terminal [Version 2.4.1]` },
    { type: 'output', text: `(c) Ankit Shekhar. All rights reserved.` },
    { type: 'output', text: `\nType 'help' for a list of commands.` }
  ]);
  const [inputVal, setInputVal] = useState('');
  const endRef = useRef(null);
  
  const promptStr = isWin ? `C:\\Users\\ankit\\portfolio>` : `ankit@macbook-pro:~ $`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputVal.trim();
      setHistory(prev => [...prev, { type: 'input', text: `${promptStr} ${cmd}` }]);
      setInputVal('');
      
      const lowerCmd = cmd.toLowerCase();
      
      if (lowerCmd === 'clear' || lowerCmd === 'cls') {
        setHistory([{ type: 'output', text: `AS-OS System Terminal cleared.` }]);
      } else if (lowerCmd === 'help') {
        setHistory(prev => [...prev, { type: 'output', text: 'Commands: cd, ls, dir, clear, whoami, chg wallppr' }]);
      } else if (lowerCmd.startsWith('cd')) {
        setHistory(prev => [...prev, { type: 'output', text: 'Directory navigation locked in simulation runtime.' }]);
      } else if (lowerCmd === 'ls' || lowerCmd === 'dir') {
        setHistory(prev => [...prev, { type: 'output', text: 'src/  public/  README.md  package.json' }]);
      } else if (lowerCmd === 'whoami') {
        setHistory(prev => [...prev, { type: 'output', text: 'ankit.shekhar_admin' }]);
      } else if (lowerCmd === 'chg wallppr') {
        setHistory(prev => [...prev, { type: 'wallpaper-picker' }]);
      } else if (cmd.length > 0) {
        setHistory(prev => [...prev, { type: 'error', text: `'${cmd}' is not recognized as an internal or external command.` }]);
      }
    }
  };

  const handleSetWallpaper = (id) => {
    if (window.confirm("Are you sure you want to change your wallpaper?")) {
      localStorage.setItem('wallpaperClass', id);
      window.dispatchEvent(new Event('wallpaper-changed'));
      setHistory(prev => [...prev, { type: 'output', text: `> OK: Wallpaper changed successfully [ID: ${id}]` }]);
    }
  };

  const getWallpaperName = (num) => {
    const names = {
      1: 'System Default',
      2: 'Abstract Dark',
      3: 'Neon Contrast',
      4: 'Glass Flow'
    };
    return names[num];
  };

  return (
    <div style={{ backgroundColor: '#0c0c0c', color: isWin ? '#cccccc' : '#33ff00', fontFamily: 'monospace', padding: '12px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }} onClick={() => document.getElementById('terminal-input').focus()}>
      {history.map((line, i) => (
        <div key={i} style={{ marginBottom: '6px' }}>
          {line.type === 'input' && <div>{line.text}</div>}
          {line.type === 'output' && <div style={{ whiteSpace: 'pre-wrap' }}>{line.text}</div>}
          {line.type === 'error' && <div style={{ color: '#ff5555' }}>{line.text}</div>}
          {line.type === 'wallpaper-picker' && (
            <div style={{ marginTop: '12px', marginBottom: '12px', padding: '12px', border: '1px solid #333', borderRadius: '4px' }}>
              <div style={{ marginBottom: '8px', color: '#fff' }}>[SYSTEM] Select a new wallpaper pattern:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map(num => {
                  const prefix = isWin ? 'win' : 'mac';
                  const wpid = num === 1 ? `${os}-wallpaper` : `${prefix}-wp-${num}`;
                  return (
                    <button 
                      key={wpid}
                      onClick={(e) => { e.stopPropagation(); handleSetWallpaper(wpid); }}
                      style={{ padding: '6px 12px', background: '#333', color: '#fff', border: '1px solid #555', cursor: 'pointer', borderRadius: '4px', fontSize: '13px' }}
                    >
                      {getWallpaperName(num)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', marginTop: '6px' }}>
        <span style={{ marginRight: '8px' }}>{promptStr}</span>
        <input 
          id="terminal-input"
          autoFocus
          type="text" 
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          style={{ background: 'transparent', border: 'none', color: isWin ? '#cccccc' : '#33ff00', outline: 'none', flex: 1, fontFamily: 'monospace', fontSize: '1rem' }}
          spellCheck="false"
          autoComplete="off"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
}
