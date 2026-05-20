import React from 'react';

interface Props {
  currentChar: string;
  sequence: string;
  text: string;
}

const LetterDisplay: React.FC<Props> = ({ currentChar, sequence, text }) => {
  return (
    <div className="w-full border border-[#1a2c1a] bg-[#070b09] rounded-md p-2.5 sm:p-4 relative overflow-hidden shadow-inner flex flex-col gap-2 sm:gap-3.5">
      {/* Scanline overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 255, 18, 1) 50%, rgba(0, 0, 0, 0) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* Left Side: CRT Single Character Monitor */}
        <div className="relative flex-shrink-0">
          <span className="absolute -top-2 left-1.5 px-1 bg-[#070b09] text-[6px] sm:text-[7px] text-terminal-green opacity-70 tracking-widest font-mono select-none">
            DEC_CHAR
          </span>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-terminal-green bg-[#0d1610] rounded flex items-center justify-center relative shadow-[0_0_10px_rgba(0,255,65,0.15)] overflow-hidden">
            {/* Retro grid lines inside the character box */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(transparent_0%,rgba(0,0,0,0.8)_100%)] grid grid-cols-4 grid-rows-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-terminal-green" />
              ))}
            </div>

            {/* Corner Bracket decorations */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-terminal-green opacity-40" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-terminal-green opacity-40" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-terminal-green opacity-40" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-terminal-green opacity-40" />

            {/* Pulsing Active Letter */}
            <span className="text-2xl sm:text-3xl font-black font-mono text-terminal-green glow-text drop-shadow-[0_0_8px_#00ff66]">
              {currentChar || <span className="opacity-15">?</span>}
            </span>
          </div>
        </div>

        {/* Right Side: Active Pulse Sequence and Decoded Sentence */}
        <div className="flex-1 flex flex-col justify-between h-12 sm:h-16 py-0.5">
          {/* Signal buffer bar */}
          <div className="flex flex-col gap-1">
            <span className="text-[6px] sm:text-[7px] text-terminal-inactive font-mono tracking-widest uppercase">
              Signal Input Buffer
            </span>
            <div className="w-full h-5.5 sm:h-6 border border-[#162719] bg-[#090f0b] rounded flex items-center px-2 gap-1.5 overflow-x-auto scrollbar-none relative shadow-inner">
              {sequence.length === 0 ? (
                <span className="text-[7px] sm:text-[8px] text-terminal-inactive font-mono tracking-widest uppercase animate-pulse select-none">
                  [ Standby // Listen Key ]
                </span>
              ) : (
                <div className="flex gap-1.5 items-center">
                  {sequence.split('').map((s, i) => (
                    <div 
                      key={i} 
                      className={`h-2.5 rounded transition-all duration-300 shadow-[0_0_6px_#00ff66] bg-terminal-green
                        ${s === '.' ? 'w-2.5 rounded-full' : 'w-7 rounded-sm'}`} 
                    />
                  ))}
                  {/* Blinking input caret */}
                  <div className="w-1.5 h-3 bg-terminal-green animate-pulse shadow-[0_0_4px_#00ff66]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Console LCD Teletype Panel */}
      <div className="border border-[#142317] bg-[#050907] rounded p-2.5 relative shadow-inner flex flex-col gap-1">
        <div className="flex justify-between items-center text-[7px] text-terminal-inactive tracking-widest uppercase select-none">
          <span>TX_MESSAGE_TERMINAL</span>
          <span className="text-terminal-green opacity-50">STATUS: TRANSMITTING</span>
        </div>
        
        <div className="w-full min-h-[28px] flex items-center justify-between gap-4 font-mono font-bold">
          {/* Decoded Text area */}
          <div className="text-terminal-green text-sm flex-1 tracking-wider break-all glow-text flex items-center select-all">
            {text ? (
              <span>{text}</span>
            ) : (
              <span className="opacity-20 text-[11px] uppercase select-none tracking-widest">
                No signal transmitted. Initiate code.
              </span>
            )}
            <span className="w-2.5 h-3.5 bg-terminal-green inline-block ml-1 animate-pulse shadow-[0_0_5px_#00ff66]" />
          </div>

          {/* String length indicator */}
          <span className="text-[8px] text-terminal-inactive flex-shrink-0 select-none">
            LEN: {text.replace(/\s/g, '').length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LetterDisplay;
