import React from 'react';
import Wallpaper from './Wallpaper';
import DesktopIcons from './DesktopIcons';
import WindowManager from '../window-manager/WindowManager';
import Dock from '../dock/Dock';
import WindowsTaskbar from '../dock/WindowsTaskbar';
import SystemOverlay from './SystemOverlay';
import MacMenuBar from './MacMenuBar';
import SnapAssistOverlay from '../window-manager/SnapAssistOverlay';
import { WindowProvider } from '../window-manager/WindowContext';
import '../../styles/desktop.css';

export default function Desktop() {
  const selectedOS = localStorage.getItem('selectedOS') || 'windows';

  return (
    <WindowProvider>
      <div className={`desktop-environment ${selectedOS}-desktop`}>
        {selectedOS === 'macos' && <MacMenuBar />}
        <Wallpaper os={selectedOS} />
        <DesktopIcons os={selectedOS} />
        <SystemOverlay />
        <SnapAssistOverlay />
        <WindowManager />
        {selectedOS === 'macos' ? <Dock /> : <WindowsTaskbar />}
      </div>
    </WindowProvider>
  );
}
