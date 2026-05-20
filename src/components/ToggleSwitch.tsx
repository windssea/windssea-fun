import React from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  const handleToggle = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <div 
      onClick={handleToggle}
      className={`px-2.5 py-2 flex flex-col items-center select-none cursor-pointer rounded-md transition-colors duration-150 active:bg-terminal-dim/30 group
        ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
    >
      <span className="text-[9px] text-terminal-inactive tracking-widest font-bold mb-2 uppercase select-none transition-colors group-hover:text-terminal-green/70">
        {label}
      </span>
      
      <div 
        className={`w-8 h-14 bg-gradient-to-b from-[#111317] to-[#1e232b] border border-gray-800 rounded-md p-1 flex flex-col justify-between items-center relative shadow-inner transition-colors duration-150
          ${disabled ? '' : 'border-gray-800'}`}
      >
        {/* Slot track */}
        <div className="w-1.5 h-8 bg-black rounded-full absolute top-3 left-1/2 -translate-x-1/2 border border-gray-900 shadow-inner" />
        
        {/* LED indicator at the top */}
        <div className="w-2.5 h-1.5 flex items-center justify-center mb-1">
          <div 
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300
              ${checked 
                ? 'bg-terminal-green shadow-[0_0_8px_#00ff41] scale-110' 
                : 'bg-red-800 shadow-none scale-100'}`} 
          />
        </div>

        {/* Toggle lever */}
        <div className="h-8 w-full relative flex items-center justify-center z-10">
          <div 
            className={`w-5 h-5 rounded-full border border-gray-600 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 shadow-md flex items-center justify-center transition-all duration-200 absolute
              ${checked ? 'top-0' : 'top-3'}`}
          >
            {/* Lever Knob detail */}
            <div className="w-3.5 h-1 bg-[#888] rounded-sm opacity-60" />
          </div>
        </div>

        {/* Labels ON / OFF */}
        <span className="text-[7px] text-terminal-inactive font-bold mt-1 uppercase scale-90 select-none">
          {checked ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};

export default ToggleSwitch;
