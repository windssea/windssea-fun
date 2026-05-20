import React from 'react';

interface Props {
  isPressing: boolean;
  onStart: () => void;
  onEnd: () => void;
  disabled?: boolean;
}

const MorseButton: React.FC<Props> = ({ isPressing, onStart, onEnd, disabled = false }) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onStart();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    onEnd();
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (disabled) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (err) {}
    onEnd();
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (disabled || e.pointerType === 'touch') return;
    if (isPressing) {
      onEnd();
    }
  };

  return (
    <div className="w-full flex flex-col gap-1.5 select-none">
      {/* Key Telemetry Header */}
      <div className="flex justify-between items-center w-full px-2 text-[9px] text-terminal-inactive font-bold tracking-wider uppercase select-none">
        <span>⚙️ 信号调制物理电键 // MODULATION KEY</span>
        <span className={`transition-colors duration-150 font-extrabold ${isPressing ? 'text-terminal-orange' : 'text-terminal-inactive'}`}>
          {isPressing ? '• [调制中 ON] •' : '○ [就绪 STANDBY]'}
        </span>
      </div>

      {/* Synth-Chassis Outer Slot (Groove casing surrounding the key) */}
      <div className="w-full bg-terminal-dim/30 border border-terminal-gray/30 p-1 rounded-2xl shadow-inner">
        {/* Sleek, Low-Profile Synth Tactile Key */}
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerLeave}
          onContextMenu={(e) => e.preventDefault()}
          className={`w-full h-20 rounded-[12px] relative flex items-center justify-center touch-none overflow-hidden select-none cursor-pointer transition-all duration-100 active:scale-[0.99]
            ${isPressing 
              ? 'bg-terminal-green/90 border border-terminal-green/90 shadow-[0_1px_0px_0px_#192d39,0_2px_4px_rgba(44,75,94,0.1)] translate-y-[2px]' 
              : 'bg-terminal-green border border-terminal-green shadow-[0_3px_0px_0px_#192d39,0_4px_10px_rgba(44,75,94,0.15)] hover:bg-terminal-green/95 active:translate-y-[1.5px]'}
            ${disabled ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {/* Subtle anti-glare sleek lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5 pointer-events-none" />

          {/* Internal alignment frames representing modular keycaps */}
          <div 
            className={`absolute inset-1 border rounded-[8px] flex flex-col items-center justify-center transition-all duration-100 pointer-events-none
              ${isPressing 
                ? 'border-white/15 bg-white/5' 
                : 'border-white/20 bg-transparent'}`}
          >
            <div className="flex items-center justify-center text-center gap-2 select-none pointer-events-none z-10">
              {/* Minimal geometric status dot */}
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-150
                ${isPressing ? 'bg-terminal-orange animate-ping' : 'bg-white/40'}`} 
              />

              {/* Main Key Text */}
              <span className="text-[14px] font-black tracking-[0.2em] text-white uppercase font-sans">
                {isPressing ? 'TRANSMITTING' : '按住或敲击发射电波'}
              </span>

              {/* Minimal geometric tag */}
              <span className="text-[9px] font-bold text-white/50 bg-white/10 px-1.5 py-0.5 rounded font-mono select-none">
                SPACE
              </span>
            </div>
          </div>

          {/* Clean architectural side markings */}
          <div className="absolute left-3 w-1 h-3 border-l border-white/20 pointer-events-none" />
          <div className="absolute right-3 w-1 h-3 border-r border-white/20 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default MorseButton;
