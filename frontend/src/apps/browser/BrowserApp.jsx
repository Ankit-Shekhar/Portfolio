import React, { useState } from 'react';

export default function BrowserApp() {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Main_Page');
  const [input, setInput] = useState('https://en.wikipedia.org/wiki/Main_Page');

  const handleNav = (e) => {
    e.preventDefault();
    let finalUrl = input;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#fff' }}>
      <div style={{ display: 'flex', padding: '8px', gap: '8px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc', alignItems: 'center' }}>
        <button onClick={() => { setUrl('https://en.wikipedia.org/wiki/Main_Page'); setInput('https://en.wikipedia.org/wiki/Main_Page'); }} style={{ padding: '4px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', fontSize: '1rem' }}>🏠</button>
        <button onClick={() => setUrl(url)} style={{ padding: '4px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff', fontSize: '1rem' }}>🔄</button>
        <form onSubmit={handleNav} style={{ flex: 1, display: 'flex' }}>
          <input 
            type="text" 
            value={input} 
            onChange={e => setInput(e.target.value)}
            style={{ flex: 1, padding: '6px 16px', borderRadius: '16px', border: '1px solid #ccc', outline: 'none', fontSize: '0.9rem' }}
            spellCheck="false"
          />
        </form>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe 
          src={url} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          title="browser"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
}
