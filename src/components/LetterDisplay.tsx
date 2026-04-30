interface Props {
  currentChar: string;
  sequence: string;
  text: string;
}

const LetterDisplay = ({ currentChar, sequence, text }: Props) => (
  <div className="w-full flex items-center gap-4 py-6 border-y border-terminal-gray">
    <div className="w-11 h-11 border border-terminal-green flex items-center justify-center text-2xl glow">
      {currentChar}
    </div>
    <div className="flex-1 flex gap-1 items-center overflow-hidden">
      {sequence.split('').map((s, i) => (
        <div key={i} className={`bg-terminal-green glow h-2 flex-shrink-0 ${s === '.' ? 'w-2 rounded-full' : 'w-6 rounded-sm'}`} />
      ))}
    </div>
    <div className="text-terminal-green text-opacity-60 text-right truncate max-w-[120px] font-bold">
      {text}<span className="animate-pulse">_</span>
    </div>
  </div>
);

export default LetterDisplay;
