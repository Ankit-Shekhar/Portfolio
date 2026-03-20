import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import '../../styles/apps.css';

export default function DreamsApp() {
  const containerRef = useRef(null);

  const dreamsTimeline = [
    { year: 'Childhood Dream', title: 'The Air Force', desc: 'Wanted to soar the skies. Did not expect the turbulence of standard education.', color: '#1e3a8a' }, // blue-900
    { year: 'Early Years', title: 'Academic Struggles', desc: 'Felt lost in traditional systems. Realized conventional paths were not designed for me.', color: '#7f1d1d' }, // red-900
    { year: 'Discovery', title: 'Hello World', desc: 'Wrote my first line of code. Found a new world where pure logic builds reality.', color: '#14532d' }, // green-900
    { year: '2025', title: 'Building AroundU', desc: 'Created my first major complex architecture. Explored hyper-local, real-time networking.', color: '#581c87' }, // pink-900
    { year: 'Present', title: 'AI Portfolio OS', desc: 'Fusing backend architecture with interactive storytelling to build a true digital representation of my skills.', color: '#09090b' }, // zinc-950
  ];

  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflowY: 'auto', backgroundColor: '#000', position: 'relative' }}>
      {/* Tall dummy div to establish scrolling limits inside the app window */}
      <div style={{ height: `${dreamsTimeline.length * 100}%` }}></div>

      {/* Sticky frames overlayed on top that react to the scroll progress */}
      <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <h1 style={{ position: 'absolute', top: '20px', left: 0, width: '100%', textAlign: 'center', zIndex: 10, fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Scroll down to explore my journey
        </h1>
        {dreamsTimeline.map((dream, index) => {
          const step = 1 / (dreamsTimeline.length - 1);
          
          // Map scroll progress to opacity.
          const opacity = useTransform(
            scrollYProgress,
            [
              index === 0 ? 0 : Math.max(0, index * step - 0.15),
              index * step,
              index === dreamsTimeline.length - 1 ? 1 : Math.min(1, index * step + 0.15)
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
              key={dream.title}
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backgroundColor: dream.color,
                opacity,
                scale,
                padding: '40px',
                boxSizing: 'border-box',
                textAlign: 'center'
              }}
            >
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{dream.title}</h2>
              <h3 style={{ fontSize: '1.2rem', color: '#cbd5e1', margin: '0 0 20px 0' }}>{dream.year}</h3>
              <p style={{ fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6, color: '#e4e4e7' }}>{dream.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
