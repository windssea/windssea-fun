import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MorseButton from '../components/MorseButton';
import LetterDisplay from '../components/LetterDisplay';
import MorseTree from '../components/MorseTree';
import { useMorseInput } from '../hooks/useMorseInput';
import { MORSE_MAP } from '../data/morseCode';

const MorseTrainer = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [lastChar, setLastChar] = useState('');

  const onCommit = useCallback((seq: string) => {
    const char = MORSE_MAP[seq] || '?';
    setLastChar(char);
    if (char !== '?') setText(prev => prev + char);
  }, []);

  const onSpace = useCallback(() => {
    setText(prev => prev.endsWith(' ') ? prev : prev + ' ');
  }, []);

  const { sequence, isPressing, startPress, endPress } = useMorseInput(onCommit, onSpace);

  return (
    <div className="h-screen flex flex-col p-4 max-w-md mx-auto">
      <nav className="flex justify-between items-center py-2 mb-4">
        <button onClick={() => navigate('/')} className="text-xl px-2">‹</button>
        <h2 className="text-[10px] font-bold tracking-widest opacity-80">MORSE TRAINER</h2>
        <span className="text-[10px] opacity-60">WPM: 0</span>
      </nav>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <MorseTree path={sequence} />
        </div>
        
        <div className="mb-8">
          <LetterDisplay currentChar={lastChar} sequence={sequence} text={text} />
        </div>

        <div className="mb-4">
          <MorseButton isPressing={isPressing} onStart={startPress} onEnd={endPress} />
        </div>
      </div>
    </div>
  );
};

export default MorseTrainer;
