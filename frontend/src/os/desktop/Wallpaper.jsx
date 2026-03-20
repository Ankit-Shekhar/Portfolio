import React, { useState, useEffect } from 'react';

export default function Wallpaper({ os }) {
  const [bgClass, setBgClass] = useState(localStorage.getItem('wallpaperClass') || `${os}-wallpaper`);

  useEffect(() => {
    const handleWpChange = () => {
      setBgClass(localStorage.getItem('wallpaperClass') || `${os}-wallpaper`);
    };
    window.addEventListener('wallpaper-changed', handleWpChange);
    return () => window.removeEventListener('wallpaper-changed', handleWpChange);
  }, [os]);

  return <div className={`os-wallpaper ${bgClass}`}></div>;
}
