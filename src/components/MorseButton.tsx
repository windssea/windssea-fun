interface Props {
  isPressing: boolean;
  onStart: () => void;
  onEnd: () => void;
}

const MorseButton = ({ isPressing, onStart, onEnd }: Props) => (
  <button
    onPointerDown={onStart}
    onPointerUp={onEnd}
    onPointerLeave={() => isPressing && onEnd()}
    className={`w-full h-32 rounded-card border-2 transition-all active:scale-95 flex flex-col items-center justify-center touch-none
      ${isPressing 
        ? 'bg-terminal-dim border-terminal-green shadow-[0_0_20px_#00ff41aa]' 
        : 'bg-terminal-bg border-terminal-gray'}`}
  >
    <span className="text-xl tracking-[2px] font-bold">TAP / HOLD</span>
    <span className="text-[10px] mt-2 opacity-60">点击 = · | 按住 = —</span>
  </button>
);

export default MorseButton;
