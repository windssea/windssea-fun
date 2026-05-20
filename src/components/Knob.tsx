import React, { useRef, useState } from 'react';

interface KnobProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  step?: number;
  defaultValue?: number;
}

const Knob: React.FC<KnobProps> = ({
  label,
  min,
  max,
  value,
  onChange,
  unit = '',
  step = 1,
  defaultValue,
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const startYRef = useRef<number>(0);
  const startValueRef = useRef<number>(0);
  const lastTapRef = useRef<number>(0);

  // Convert value to degrees (from -135deg to +135deg, total 270deg arc)
  const valToDeg = (val: number) => {
    const ratio = (val - min) / (max - min);
    return -135 + ratio * 270;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    
    // Check for double tap / double click
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY && defaultValue !== undefined) {
      onChange(defaultValue);
      setIsDragging(false);
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    setIsDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = value;
    knobRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    if (!knobRef.current) return;

    const deltaY = startYRef.current - e.clientY;
    // Sensitivity: 160px drag covers the entire range
    const range = max - min;
    const valueDelta = (deltaY / 160) * range;
    const rawVal = startValueRef.current + valueDelta;
    
    // Align with step and clamp
    const steppedVal = Math.round(rawVal / step) * step;
    const clampedVal = Math.max(min, Math.min(max, steppedVal));
    
    onChange(clampedVal);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    knobRef.current?.releasePointerCapture(e.pointerId);
  };

  // Handle scroll wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -Math.sign(e.deltaY) * step * 2;
    const newVal = Math.max(min, Math.min(max, value + delta));
    onChange(newVal);
  };

  // Render ticks
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const deg = -135 + i * 27;
    const rad = ((deg - 90) * Math.PI) / 180;
    const x1 = 30 + Math.cos(rad) * 23;
    const y1 = 30 + Math.sin(rad) * 23;
    const x2 = 30 + Math.cos(rad) * 27;
    const y2 = 30 + Math.sin(rad) * 27;
    
    const active = valToDeg(value) >= deg;

    ticks.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? '#00ff66' : 'var(--color-terminal-gray)'}
        strokeWidth={active ? 1.5 : 1}
        className="transition-colors duration-150"
      />
    );
  }

  const currentDeg = valToDeg(value);

  return (
    <div className="flex flex-col items-center select-none">
      <span className="text-[9px] text-terminal-inactive tracking-widest font-bold mb-1.5 uppercase">
        {label}
      </span>
      
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-16 h-16 relative cursor-ns-resize flex items-center justify-center touch-none group"
      >
        {/* Ticks and outer rings */}
        <svg className="w-full h-full absolute inset-0">
          {ticks}
        </svg>

        {/* Knob Body */}
        <div 
          className={`w-10 h-10 rounded-full border-2 bg-gradient-to-br from-[#2a303b] to-[#12161a] shadow-lg flex items-center justify-center transition-all duration-100
            ${isDragging ? 'border-terminal-green scale-102 shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'border-[#4a5568] group-hover:border-[#718096]'}`}
          style={{ transform: `rotate(${currentDeg}deg)` }}
        >
          {/* Metallic face */}
          <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-[#1a1f26] to-[#2d3748] relative flex items-center justify-center">
            {/* Pointer Dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-green shadow-[0_0_4px_#00ff41] absolute top-1 left-1/2 -translate-x-1/2" />
            {/* Subtle center pin */}
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-gray-700" />
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-baseline gap-0.5">
        <span className="text-[10px] text-terminal-green font-bold tracking-tight glow-text min-w-[20px] text-center">
          {value}
        </span>
        <span className="text-[8px] text-terminal-inactive font-bold">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default Knob;
