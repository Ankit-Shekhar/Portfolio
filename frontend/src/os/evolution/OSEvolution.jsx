import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../../styles/evolution.css';

gsap.registerPlugin(ScrollTrigger);

const imageModules = import.meta.glob('../../Windows-Evolution/*.png', { eager: true });
const imageKeys = Object.keys(imageModules).sort();
const windowsFrames = imageKeys.map(key => imageModules[key].default);

export default function OSEvolution() {
  const navigate = useNavigate();
  const selectedOS = localStorage.getItem('selectedOS') || 'windows';

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {selectedOS === 'windows' ? <WindowsCanvasEvolution navigate={navigate} /> : <MacOSEvolution navigate={navigate} />}
    </>
  );
}

function WindowsCanvasEvolution({ navigate }) {
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);

  const images = useMemo(() => {
    return windowsFrames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const drawScaledImage = (img) => {
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const ratio = Math.min(cw / img.width, ch / img.height);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const drawX = (cw - drawW) / 2;
      const drawY = (ch - drawH) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawScaledImage(images[Math.round(frameControl.frame)]);
    };

    window.addEventListener('resize', resize);
    if (images[0].complete) resize();
    else images[0].onload = resize;

    const frameControl = { frame: 0 };

    let ctxGsap = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trackRef.current,
        scroller: scrollerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (textRef.current) gsap.set(textRef.current, { opacity: Math.max(0, 1 - self.progress * 15) });
          if (canvasRef.current) gsap.set(canvasRef.current, { opacity: self.progress > 0.98 ? 0 : 1 });
          if (self.progress >= 0.99) navigate('/desktop');
        },
        onLeave: () => navigate('/desktop')
      });

      gsap.to(frameControl, {
        frame: windowsFrames.length - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: trackRef.current,
          scroller: scrollerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1, // Near instant frame updates
        },
        onUpdate: () => drawScaledImage(images[Math.round(frameControl.frame)])
      });
    }, scrollerRef);

    return () => {
      window.removeEventListener('resize', resize);
      ctxGsap.revert();
    };
  }, [images, navigate]);

  return (
    <div ref={scrollerRef} className="hide-scrollbar" style={{ width: '100vw', height: '100vh', backgroundColor: '#000', overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Invisible track forces native scrolling without GSAP javascript pinning computation */}
      <div ref={trackRef} style={{ width: '100%', height: '800vh' }}>
        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          <div ref={textRef} style={{
            position: 'absolute', bottom: '60px', left: 0, right: 0, textAlign: 'center',
            color: 'white', fontFamily: '"Segoe UI", sans-serif', pointerEvents: 'none'
          }}>
            <div style={{ fontSize: '1.2rem', animation: 'bounce 2s infinite', opacity: 0.8, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Scroll down to evolve
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacOSEvolution({ navigate }) {
  const scrollerRef = useRef(null);
  const trackRef = useRef(null);

  const macOSTimeline = [
    { name: 'Mac OS X', year: '2001', color: '#111' },
    { name: 'macOS High Sierra', year: '2017', color: '#222' },
    { name: 'macOS Big Sur', year: '2020', color: '#333' },
    { name: 'macOS Sonoma', year: '2023', color: '#444' },
    { name: 'Booting Desktop...', year: '', color: '#000' }
  ];

  useEffect(() => {
    let ctxGsap = gsap.context(() => {
      const panels = gsap.utils.toArray('.mac-panel');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current,
          scroller: scrollerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            if (self.progress >= 0.99) navigate('/desktop');
          },
          onLeave: () => navigate('/desktop')
        }
      });

      panels.forEach((panel, i) => {
        if (i > 0) tl.fromTo(panel, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power1.inOut' });
        if (i < panels.length - 1) tl.to(panel, { opacity: 0, scale: 1.2, duration: 1, ease: 'power1.inOut' }, "-=0.5");
      });
    }, scrollerRef);

    return () => ctxGsap.revert();
  }, [navigate]);

  return (
    <div ref={scrollerRef} className="hide-scrollbar" style={{ width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#000' }}>
      <div ref={trackRef} style={{ width: '100%', height: '400vh' }}>
        <div style={{ position: 'sticky', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
          {macOSTimeline.map((os, index) => (
            <div key={os.name} className="mac-panel" style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              backgroundColor: os.color, color: 'white', opacity: index === 0 ? 1 : 0
            }}>
              <div className="evolution-content">
                <h1 className="evolution-title">{os.name}</h1>
                <p className="evolution-year">{os.year}</p>
                {index === 0 && (
                  <div style={{ marginTop: '20px', fontSize: '1rem', opacity: 0.7, animation: 'bounce 2s infinite' }}>Scroll down to evolve</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
