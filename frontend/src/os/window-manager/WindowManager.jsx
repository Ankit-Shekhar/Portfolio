import React from 'react';
import { useWindowManager } from '../../hooks/useWindowManager';
import Window from './Window';

export default function WindowManager() {
  const { windows } = useWindowManager();

  return (
    <>
      {windows.map((w) => (
        <Window key={w.id} window={w} />
      ))}
    </>
  );
}
