import React, { useMemo } from 'react';
import './PaperBackground.css';

const PaperBackground = () => {
  // Generate fixed set of floating paper particles
  const papers = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.5 + (i * 7) % 13) % 96 + 2}%`,
      animationDuration: `${14 + (i % 6) * 3}s`,
      animationDelay: `-${(i * 1.8) % 15}s`,
      size: `${22 + (i % 5) * 8}px`,
      rotation: `${(i * 53) % 360}deg`,
      drift: `${(i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 20)}px`,
      opacity: 0.15 + (i % 4) * 0.08,
      type: i % 3, // 0: page, 1: book, 2: folded paper
    }));
  }, []);

  return (
    <div className="paper-background-container" aria-hidden="true">
      <div className="paper-gradient-overlay" />
      {papers.map((p) => (
        <div
          key={p.id}
          className={`floating-paper paper-type-${p.type}`}
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            '--drift-x': p.drift,
            '--init-rot': p.rotation,
          }}
        >
          {p.type === 0 && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          )}
          {p.type === 1 && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          )}
          {p.type === 2 && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
              <path d="M14 2v4a1 1 0 0 0 1 1h4" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaperBackground;
