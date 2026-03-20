import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/terminal.css';

export default function TerminalLanding() {
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [booting, setBooting] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  
  const bootSequence = [
    "AS-BIOS (C) 2026 Ankit Shekhar Inc.",
    "BIOS Date 03/19/26 21:30:11 Ver 1.00",
    "CPU: Neural Processor @ 4.20GHz",
    "Memory Test : 32768K OK",
    "",
    "Initializing Boot Sequence...",
    "Loading Kernel...",
    "Mounting Virtual Drives...",
    "Starting Network Interfaces: OK",
    "Loading Developer Profile: OK",
    "",
    "> Kernel loaded successfully."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setBooting(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Force focus to input
  useEffect(() => {
    if (!booting) {
      const focusInterval = setInterval(() => inputRef.current?.focus(), 500);
      return () => clearInterval(focusInterval);
    }
  }, [booting]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const val = inputValue.trim().toLowerCase();
      // Parse Windows
      if (['windows', 'win'].includes(val)) {
        localStorage.setItem('selectedOS', 'windows');
        setLines(prev => [...prev, `> Booting Windows environment...`]);
        setTimeout(() => navigate('/evolution'), 800);
      } 
      // Parse macOS
      else if (['mac', 'macos', 'macintosh', 'masos'].includes(val)) {
        localStorage.setItem('selectedOS', 'macos');
        setLines(prev => [...prev, `> Booting macOS environment...`]);
        setTimeout(() => navigate('/evolution'), 800);
      } 
      // Invalid
      else {
        setLines(prev => [...prev, `INVALID OS: "${inputValue}". Please type 'Windows' or 'Mac'.`]);
        setInputValue('');
      }
    }
  };

  return (
    <div className="terminal-container" onClick={() => !booting && inputRef.current?.focus()}>
      {lines.map((text, i) => (
        <div key={i} className="terminal-line">{text}</div>
      ))}
      {!booting && (
        <div className="terminal-input-line">
          <span>{`Please specify the target OS environment (Windows / Mac): `}</span>
          <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            spellCheck="false"
            autoComplete="off"
          />
        </div>
      )}
      {booting && <div className="terminal-cursor">_</div>}
    </div>
  );
}
