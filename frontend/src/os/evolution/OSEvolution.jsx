import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../../styles/evolution.css';

export default function OSEvolution() {
  const navigate = useNavigate();
  const selectedOS = localStorage.getItem('selectedOS') || 'windows';
  const containerRef = useRef(null);

  const windowsTimeline = [
    { name: 'Windows XP', year: '2001', color: '#003399' },
    { name: 'Windows 7', year: '2009', color: '#0055aa' },
    { name: 'Windows 10', year: '2015', color: '#0078d7' },
    { name: 'Windows 11', year: '2021', color: '#00a4ef' },
    { name: 'Booting Desktop...', year: '', color: '#000000' }
  ];

  const macOSTimeline = [
    { name: 'Mac OS X', year: '2001', color: '#333333' },
    { name: 'macOS High Sierra', year: '2017', color: '#444444' },
    { name: 'macOS Big Sur', year: '2020', color: '#555555' },
    { name: 'macOS Sonoma', year: '2023', color: '#666666' },
    { name: 'Booting Desktop...', year: '', color: '#000000' }
  ];

  const timeline = selectedOS === 'macos' ? macOSTimeline : windowsTimeline;

  const { scrollYProgress } = useScroll({ container: containerRef });

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      if (v >= 0.999) {
        navigate('/desktop');
      }
    });
  }, [scrollYProgress, navigate]);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', overflowY: 'auto', backgroundColor: '#000', position: 'relative' }}>
      {/* Tall dummy div to establish scrolling limits */}
      <div style={{ height: `${timeline.length * 100}vh` }}></div>

      {/* Sticky frames overlayed on top that react to the scroll progress */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none' }}>
        {timeline.map((os, index) => {
          const step = 1 / (timeline.length - 1);
          
          // Map scroll progress to opacity.
          const opacity = useTransform(
            scrollYProgress,
            [
              index === 0 ? 0 : Math.max(0, index * step - 0.15),
              index * step,
              index === timeline.length - 1 ? 1 : Math.min(1, index * step + 0.15)
            ],
            [0, 1, 0]
          );

          // Map scroll progress to subtle scaling.
          const scale = useTransform(
            scrollYProgress,
            [Math.max(0, index * step - 0.2), Math.min(1, index * step + 0.2)],
            [0.9, 1.1]
          );

          return (
            <motion.div
              key={os.name}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: os.color,
                opacity,
                scale
              }}
            >
              <div className="evolution-content">
                <h1 className="evolution-title">{os.name}</h1>
                <p className="evolution-year">{os.year}</p>
                {index === 0 && (
                  <div style={{ marginTop: '20px', fontSize: '1rem', opacity: 0.7, animation: 'bounce 2s infinite' }}>
                    Scroll down to evolve
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
