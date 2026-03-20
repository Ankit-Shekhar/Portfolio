import { useContext } from 'react';
import { WindowContext } from '../os/window-manager/WindowContext';

export function useWindowManager() {
  const context = useContext(WindowContext);
  
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowProvider');
  }

  const { state, dispatch } = context;

  const openApp = (appConfig) => dispatch({ type: 'OPEN_WINDOW', payload: appConfig });
  const closeApp = (id) => dispatch({ type: 'CLOSE_WINDOW', payload: { id } });
  const focusApp = (id) => dispatch({ type: 'FOCUS_WINDOW', payload: { id } });
  const minimizeApp = (id) => dispatch({ type: 'MINIMIZE_WINDOW', payload: { id } });
  const maximizeApp = (id) => dispatch({ type: 'MAXIMIZE_WINDOW', payload: { id } });

  return {
    windows: state.windows,
    activeWindowId: state.activeWindowId,
    openApp,
    closeApp,
    focusApp,
    minimizeApp,
    maximizeApp,
  };
}
