import React, { useEffect, useState } from 'react';

const SnowBackground: React.FC = () => {
  const [flakes, setFlakes] = useState<Array<{ id: number; left: string; size: string; duration: string; delay: string }>>([]);

  useEffect(() => {
    // Generate static snowflakes to avoid re-rendering calculation
    const count = 50;
    const newFlakes = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      size: `${Math.random() * 0.4 + 0.2}rem`,
      duration: `${Math.random() * 5 + 5}s`,
      delay: `${Math.random() * 5}s`,
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute rounded-full bg-white opacity-70"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950 pointer-events-none" />
    </div>
  );
};

export default SnowBackground;