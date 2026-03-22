import React, { createContext, useReducer, useState } from 'react';
import { windowReducer, initialWindowState } from './WindowReducer';

export const WindowContext = createContext(null);

export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);

  const [desktopShortcuts, setDesktopShortcuts] = useState(() => {
    const saved = localStorage.getItem('macShortcuts'); // kept name for backwards compat
    if (saved) return JSON.parse(saved);
    return ['projects', 'skills', 'ai-agent', 'dreams', 'browser', 'terminal', 'personalize', 'contact'];
  });

  const [osSettings, setOsSettings] = useState(() => {
    const saved = localStorage.getItem('osSettings');
    return saved ? JSON.parse(saved) : { dockSize: 60, dockAutoHide: false };
  });

  const updateOsSettings = (newSettings) => {
    const merged = { ...osSettings, ...newSettings };
    setOsSettings(merged);
    localStorage.setItem('osSettings', JSON.stringify(merged));
  };

  const addDesktopShortcut = (appId) => {
    if (!desktopShortcuts.includes(appId)) {
      const next = [...desktopShortcuts, appId];
      setDesktopShortcuts(next);
      localStorage.setItem('macShortcuts', JSON.stringify(next));
    }
  };

  const removeDesktopShortcut = (appId) => {
    const next = desktopShortcuts.filter(id => id !== appId);
    setDesktopShortcuts(next);
    localStorage.setItem('macShortcuts', JSON.stringify(next));
  };

  return (
    <WindowContext.Provider value={{ 
      state, dispatch, desktopShortcuts, addDesktopShortcut, removeDesktopShortcut,
      osSettings, updateOsSettings 
    }}>
      {children}
    </WindowContext.Provider>
  );
}
