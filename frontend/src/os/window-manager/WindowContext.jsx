import React, { createContext, useReducer } from 'react';
import { windowReducer, initialWindowState } from './WindowReducer';

export const WindowContext = createContext(null);

export function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);

  return (
    <WindowContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowContext.Provider>
  );
}
