import React, { useRef, useEffect } from 'react';

interface OscilloscopeProps {
  isPressing: boolean;
  wpm: number;
  powerOn: boolean;
}

const Oscilloscope: React.FC<OscilloscopeProps> = ({ isPressing, wpm, powerOn }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<number[]>([]);
  const animationRef = useRef<number | null>(null);

  // Unit time U in ms
  const U = 1200 / wpm;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Initialize history with 0s if empty
    if (historyRef.current.length === 0) {
      historyRef.current = new Array(width).fill(0);
    }

    const render = () => {
      // Clear with dark, retro phosphor background
      ctx.fillStyle = '#050806';
      ctx.fillRect(0, 0, width, height);

      // Draw faint phosphor background grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.05)';
      ctx.lineWidth = 0.5;

      // Draw vertical grids every 20px
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Draw horizontal grids
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (!powerOn) {
        // Draw dead line with static noise when powered off
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        
        for (let x = 0; x < width; x++) {
          // Add a tiny bit of decaying static noise
          const noise = (Math.random() - 0.5) * 1.5;
          ctx.lineTo(x, height / 2 + noise);
        }
        ctx.stroke();
        
        // Draw "OFFLINE" indicator
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('SYS_OFFLINE', 10, 15);
        
        animationRef.current = requestAnimationFrame(render);
        return;
      }

      // If powered on, add current state to history
      // We push the value to the history. High level = 1, Low level = 0
      historyRef.current.push(isPressing ? 1 : 0);
      if (historyRef.current.length > width) {
        historyRef.current.shift();
      }

      // Draw standard time labels at bottom
      ctx.fillStyle = 'rgba(0, 255, 65, 0.35)';
      ctx.font = '7px monospace';
      ctx.fillText(`WPM: ${wpm} | UNIT(1U): ${Math.round(U)}ms | DOT: <${Math.round(2 * U)}ms`, 8, height - 6);

      // Draw calibrated threshold indicators on screen (dotted guide lines)
      // Dot length threshold (2U)
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
      ctx.setLineDash([2, 4]);
      
      // Draw the scrolling signal wave
      ctx.setLineDash([]); // Reset dash
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 6;
      
      ctx.beginPath();
      
      const waveHeight = 22; // Height of pulse
      const baseline = height - 20; // Bottom line
      
      // Iterate through history and draw line segments
      for (let i = 0; i < historyRef.current.length; i++) {
        const val = historyRef.current[i];
        // Scale sample to wave vertical coordinates
        const y = baseline - val * waveHeight;
        
        if (i === 0) {
          ctx.moveTo(i, y);
        } else {
          // To draw perfect sharp square-wave vertical edges:
          const prevVal = historyRef.current[i - 1];
          if (val !== prevVal) {
            const prevY = baseline - prevVal * waveHeight;
            ctx.lineTo(i, prevY); // draw vertical riser
          }
          ctx.lineTo(i, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow glow

      // Draw sweeping radar target indicator at the very leading edge (right)
      if (isPressing) {
        ctx.fillStyle = '#00ff66';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(width - 2, baseline - waveHeight, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Faint sweeping CRT phosphor shine overlay
      ctx.fillStyle = 'rgba(0, 255, 65, 0.02)';
      ctx.fillRect(0, 0, width, height);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPressing, wpm, U, powerOn]);

  return (
    <div className="w-full h-16 border border-[#1a2c1a] bg-[#050806] rounded-md overflow-hidden relative shadow-inner">
      {/* Glare and curvature styling overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
      <canvas 
        ref={canvasRef} 
        width={380} 
        height={60} 
        className="w-full h-full block"
      />
    </div>
  );
};

export default Oscilloscope;
