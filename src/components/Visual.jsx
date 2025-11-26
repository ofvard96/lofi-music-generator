import React, { useEffect, useRef } from 'react';
import './Visual.css';

export function Visual({ isPlaying, mood }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth * 2; // Retina
    const height = canvas.height = canvas.offsetHeight * 2;

    ctx.scale(2, 2);

    // Particle system for ambient feel
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width / 2,
        y: Math.random() * height / 2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3
      });
    }

    let time = 0;

    const draw = () => {
      // Gradient background based on mood
      const color1 = mood < 0.5
        ? `rgba(20, 15, 35, 1)` // Darker for melancholic
        : `rgba(30, 25, 45, 1)`; // Lighter for chill

      const color2 = mood < 0.5
        ? `rgba(40, 25, 50, 1)`
        : `rgba(50, 40, 70, 1)`;

      const gradient = ctx.createLinearGradient(0, 0, 0, height / 2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width / 2, height / 2);

      // Draw window scene
      drawWindow(ctx, width / 4, height / 4, time, mood);

      // Animate particles
      if (isPlaying) {
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around
          if (p.x < 0) p.x = width / 2;
          if (p.x > width / 2) p.x = 0;
          if (p.y < 0) p.y = height / 2;
          if (p.y > height / 2) p.y = 0;

          // Draw particle
          ctx.fillStyle = `rgba(200, 180, 150, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        time += 0.01;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, mood]);

  return (
    <div className="visual-container">
      <canvas ref={canvasRef} className="visual-canvas" />
      <div className="visual-overlay">
        <div className="title">lofi generator</div>
        <div className="subtitle">endless procedural beats</div>
      </div>
    </div>
  );
}

function drawWindow(ctx, centerX, centerY, time, mood) {
  const size = 150;

  // Window frame
  ctx.strokeStyle = 'rgba(80, 60, 50, 0.8)';
  ctx.lineWidth = 8;
  ctx.strokeRect(centerX - size / 2, centerY - size / 2, size, size);

  // Window panes
  ctx.strokeStyle = 'rgba(60, 45, 35, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size / 2);
  ctx.lineTo(centerX, centerY + size / 2);
  ctx.moveTo(centerX - size / 2, centerY);
  ctx.lineTo(centerX + size / 2, centerY);
  ctx.stroke();

  // "Outside" glow (city lights)
  const glowIntensity = mood > 0.5 ? 0.3 : 0.15;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
  gradient.addColorStop(0, `rgba(200, 150, 100, ${glowIntensity})`);
  gradient.addColorStop(1, 'rgba(200, 150, 100, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);

  // Animated rain drops
  if (mood < 0.5) {
    for (let i = 0; i < 5; i++) {
      const x = centerX - size / 2 + (i * size / 5) + (Math.sin(time + i) * 10);
      const y = centerY - size / 2 + ((time * 50 + i * 30) % size);

      ctx.strokeStyle = 'rgba(150, 180, 200, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + 10);
      ctx.stroke();
    }
  }
}
