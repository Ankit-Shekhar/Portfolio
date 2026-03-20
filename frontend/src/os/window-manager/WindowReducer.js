export const initialWindowState = {
  windows: [], // Array of open windows { id, title, isMinimized, isMaximized, zIndex, defaultWidth, defaultHeight }
  activeWindowId: null,
};

export function windowReducer(state, action) {
  switch (action.type) {
    case 'OPEN_WINDOW': {
      // If already open, focus it
      const existing = state.windows.find((w) => w.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          windows: state.windows.map((w) =>
            w.id === action.payload.id ? { ...w, isMinimized: false, zIndex: getHighestZIndex(state.windows) + 1 } : w
          ),
          activeWindowId: action.payload.id,
        };
      }
      
      return {
        ...state,
        windows: [
          ...state.windows,
          {
            ...action.payload,
            isMinimized: false,
            isMaximized: false,
            zIndex: getHighestZIndex(state.windows) + 1,
          },
        ],
        activeWindowId: action.payload.id,
      };
    }

    case 'CLOSE_WINDOW': {
      const newWindows = state.windows.filter((w) => w.id !== action.payload.id);
      return {
        ...state,
        windows: newWindows,
        activeWindowId: state.activeWindowId === action.payload.id ? getTopWindowId(newWindows) : state.activeWindowId,
      };
    }

    case 'FOCUS_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id ? { ...w, zIndex: getHighestZIndex(state.windows) + 1, isMinimized: false } : w
        ),
        activeWindowId: action.payload.id,
      };
    }

    case 'MINIMIZE_WINDOW': {
      const newWindows = state.windows.map((w) =>
        w.id === action.payload.id ? { ...w, isMinimized: true } : w
      );
      return {
        ...state,
        windows: newWindows,
        activeWindowId: state.activeWindowId === action.payload.id ? getTopWindowId(newWindows) : state.activeWindowId,
      };
    }

    case 'MAXIMIZE_WINDOW': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id ? { ...w, isMaximized: !w.isMaximized } : w
        ),
      };
    }

    default:
      return state;
  }
}

function getHighestZIndex(windows) {
  return windows.reduce((max, w) => Math.max(max, w.zIndex || 0), 0);
}

function getTopWindowId(windows) {
  const visible = windows.filter((w) => !w.isMinimized);
  if (visible.length === 0) return null;
  const top = visible.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current));
  return top.id;
}
