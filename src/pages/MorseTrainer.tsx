import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MorseButton from '../components/MorseButton';
import MorseTree from '../components/MorseTree';
import { useMorseInput } from '../hooks/useMorseInput';
import { MORSE_MAP } from '../data/morseCode';

const MorseTrainer = () => {
  const navigate = useNavigate();
  
  // Power modulator switch state (defaults to active)
  const [powerOn, setPowerOn] = useState(true);

  // Ergonomically adjusted WPM: Set to 8 for a highly forgiving, slow, and relaxed pacing experience for children
  const wpm = 8; 
  const frequency = 400; // Comfortable, warm wood-block harmonic pitch (A4 flat)
  const volume = 45; // Clean comfort level volume

  // Decoded text buffers
  const [text, setText] = useState('');
  const [lastChar, setLastChar] = useState('');
  const [morseHistory, setMorseHistory] = useState<string[]>([]);

  // Pristine high-fidelity acoustic plucks for power change notifications
  const playPowerSound = (on: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const t = audioCtx.currentTime;
      if (on) {
        // High-end upward chime sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(261.63, t); // C4
        osc.frequency.exponentialRampToValueAtTime(523.25, t + 0.18); // C5
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.18);
      } else {
        // High-end downward melting chord sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392.00, t); // G4
        osc.frequency.exponentialRampToValueAtTime(130.81, t + 0.22); // C3
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.22);
      }
    } catch (e) {
      // AudioContext protection
    }
  };

  const handlePowerChange = () => {
    const nextPower = !powerOn;
    setPowerOn(nextPower);
    playPowerSound(nextPower);
    if (!nextPower) {
      setLastChar('');
    }
  };

  // Dispatch decoder commit events
  const onCommit = useCallback((seq: string) => {
    if (!powerOn) return;
    const char = MORSE_MAP[seq] || '?';
    setLastChar(char);
    if (char !== '?') {
      setText(prev => prev + char);
      setMorseHistory(prev => [...prev, seq]);
      
      // Clean soft crystalline bell pluck on character success
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, t); // B5 crystal chime
        gain.gain.setValueAtTime(0.015, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
      } catch (e) {}
    }
  }, [powerOn]);

  const onSpace = useCallback(() => {
    if (!powerOn) return;
    setText(prev => prev.endsWith(' ') ? prev : prev + ' ');
    setMorseHistory(prev => prev.length > 0 && prev[prev.length - 1] !== '/' ? [...prev, '/'] : prev);
  }, [powerOn]);

  // Connect Input Hook using relaxed pacing metrics
  const { sequence, previewPath, isPressing, startPress, endPress } = useMorseInput({
    onCommit,
    onSpace,
    wpm,
    frequency,
    volume: volume / 100,
    soundEnabled: powerOn,
    hapticEnabled: powerOn,
  });

  // Physical Spacebar Keybindings
  useEffect(() => {
    if (!powerOn) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (e.repeat) return;
        startPress();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        endPress();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [powerOn, startPress, endPress]);

  // Pristine ascending xylophone sweep on console clear
  const clearConsole = () => {
    if (!powerOn) return;
    setText('');
    setMorseHistory([]);
    setLastChar('');
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6 acoustic chords
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const t = audioCtx.currentTime + index * 0.04;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch(e) {}
  };



  // Realtime predicted character calculation
  const activePrediction = sequence ? (MORSE_MAP[sequence] || '') : '';

  return (
    <div className="h-[100dvh] w-screen flex flex-col p-3 sm:p-4 max-w-lg mx-auto select-none bg-terminal-bg text-terminal-text relative font-sans overflow-hidden">
      
      {/* Sleek, Modern Oatmeal Casing chassis (Nordic minimalist style) */}
      <div className="border border-terminal-gray/40 bg-white rounded-2xl p-3 sm:p-4 shadow-sm relative flex-1 flex flex-col gap-3 overflow-hidden h-full">
        
        {/* Playful structural corner rivets representing micro-hardware */}
        <div className="absolute top-2.5 left-2.5 w-1 h-1 rounded-full bg-terminal-gray/60 pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-1 h-1 rounded-full bg-terminal-gray/60 pointer-events-none" />
        <div className="absolute bottom-2.5 left-2.5 w-1 h-1 rounded-full bg-terminal-gray/60 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-1 h-1 rounded-full bg-terminal-gray/60 pointer-events-none" />

        {/* Minimalist Top Control Dashboard */}
        <header className="flex justify-between items-center border-b border-terminal-gray/30 pb-3 pt-1 px-1 relative select-none flex-shrink-0">
          <button 
            onClick={() => navigate('/')} 
            className="text-[10px] font-bold bg-white hover:bg-terminal-bg text-terminal-text border border-terminal-gray/40 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-90 flex items-center gap-1.5 shadow-sm"
          >
            ◀ 返回首页 / BACK
          </button>
          
          <div className="flex flex-col items-center">
            <h1 className="text-xs sm:text-sm font-extrabold text-terminal-text tracking-wider flex items-center gap-1 select-none">
              🌲 莫尔斯二进制译码控制台
            </h1>
            <span className="text-[8px] sm:text-[9px] text-terminal-inactive font-bold tracking-wider mt-0.5 select-none uppercase font-mono">
              REALTIME BINARY MAPPING TERMINAL
            </span>
          </div>

          {/* Premium Synthesizer-style Hardware Toggle Slider */}
          <div 
            onClick={handlePowerChange}
            className="flex items-center gap-2.5 cursor-pointer active:scale-95 select-none hover:opacity-95 bg-terminal-dim/30 border border-terminal-gray/30 px-3 py-1 rounded-xl shadow-sm"
          >
            <div className="flex flex-col items-end scale-90 sm:scale-100 origin-right select-none">
              <span className="text-[7.5px] text-terminal-inactive font-extrabold tracking-wider uppercase font-mono">MODULATOR</span>
              <span className={`text-[8.5px] font-black tracking-normal uppercase ${powerOn ? 'text-terminal-green' : 'text-terminal-inactive'}`}>
                {powerOn ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
            {/* Minimal slider toggle */}
            <div 
              className={`w-7 h-4.5 rounded-full p-0.5 transition-colors duration-200 shadow-inner border border-terminal-gray/40 flex items-center
                ${powerOn ? 'bg-terminal-green' : 'bg-terminal-dim'}`}
            >
              <div 
                className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 shadow-sm
                  ${powerOn ? 'translate-x-3' : 'translate-x-0'}`}
              />
            </div>
          </div>
        </header>

        {/* 2. Expanded Geometric Morse Tree Area */}
        <section className={`flex-1 min-h-0 flex flex-col transition-all duration-300 ${powerOn ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
          <div className="flex-1 min-h-0 w-full relative flex items-center justify-center transition-all duration-300">
            <MorseTree path={powerOn ? previewPath : ''} />
          </div>
        </section>
        
        {/* 3. Split HUD Decoded Panels */}
        <section className={`flex-shrink-0 flex flex-col gap-2.5 transition-all duration-300 ${powerOn ? 'opacity-100' : 'opacity-10 pointer-events-none'}`}>
          
          {/* Panel 1: Morse Code History Panel (Global Morse Codes) */}
          <div className="border border-terminal-gray/30 bg-terminal-dim/15 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[9px] text-terminal-inactive font-extrabold tracking-wider select-none font-mono">
              <span className="flex items-center gap-1">📟 历史摩斯码输入 / MORSE INPUT RECORD</span>
              {lastChar && (
                <span className="text-terminal-green bg-terminal-green/10 border border-terminal-green/20 px-2 py-0.5 rounded text-[8px] font-black">
                  上一录入字符: {lastChar}
                </span>
              )}
            </div>
            
            <div className="w-full h-11 bg-white border border-terminal-gray/20 rounded-lg flex items-center px-3 gap-2 overflow-x-auto shadow-inner whitespace-nowrap scrollbar-thin">
              {morseHistory.length > 0 || sequence ? (
                <div className="flex gap-2 items-center">
                  {morseHistory.map((seq, idx) => {
                    if (seq === '/') {
                      return (
                        <span key={idx} className="text-terminal-inactive/60 font-black text-sm px-1.5 select-none font-sans">
                          /
                        </span>
                      );
                    }
                    return (
                      <span 
                        key={idx} 
                        className="text-terminal-green font-black text-lg bg-terminal-green/5 border border-terminal-green/20 px-2 py-0.5 rounded-lg shadow-sm font-sans select-none tracking-tight flex items-center"
                      >
                        {seq.split('').map(s => s === '.' ? '•' : '—').join('')}
                      </span>
                    );
                  })}
                  {sequence && (
                    <span 
                      className="text-terminal-orange font-black text-lg bg-terminal-orange/5 border border-terminal-orange/20 px-2 py-0.5 rounded-lg shadow-sm font-sans select-none tracking-tight flex items-center gap-1 animate-pulse"
                    >
                      {sequence.split('').map(s => s === '.' ? '•' : '—').join('')}
                      <span className="w-1.5 h-3.5 bg-terminal-orange inline-block animate-pulse rounded-sm flex-shrink-0" />
                    </span>
                  )}
                  {!sequence && (
                    <span className="w-1.5 h-4 bg-terminal-green inline-block animate-pulse rounded flex-shrink-0" />
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-terminal-inactive/55 font-bold select-none tracking-wide">
                  [ 等待电键敲击输入摩斯电码... // STANDBY ]
                </span>
              )}
            </div>
          </div>

          {/* Panel 2: Translated Sentence Panel (Compiled Alphanumeric Output) */}
          <div className="border border-terminal-gray/30 bg-terminal-dim/15 rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5 shadow-sm">
            <div className="flex justify-between items-center text-[9px] text-terminal-inactive font-extrabold tracking-wider select-none font-mono">
              <span>📜 已编译译码文本 / TRANSLATED SENTENCE</span>
              <span className="text-terminal-inactive">字符长度: {text.replace(/\s/g, '').length}</span>
            </div>
            
            <div className="w-full min-h-12 bg-white border border-terminal-gray/20 rounded-lg flex items-center justify-between p-2 sm:p-2.5 gap-3 shadow-inner">
              <div className="flex-1 min-w-0 text-sm sm:text-base font-extrabold text-terminal-text tracking-wide break-all flex items-center select-all leading-normal font-sans">
                {text || activePrediction ? (
                  <div className="flex items-center flex-wrap gap-0.5">
                    <span>{text}</span>
                    {activePrediction && (
                      <span className="text-terminal-orange animate-pulse font-black font-sans select-none">
                        {activePrediction}
                      </span>
                    )}
                    {/* Active blinking cursor matching state */}
                    <span className={`w-1.5 h-4 inline-block ml-1 animate-pulse rounded flex-shrink-0 ${sequence ? 'bg-terminal-orange' : 'bg-terminal-green'}`} />
                  </div>
                ) : (
                  <span className="text-terminal-inactive/55 text-xs select-none font-bold">
                    暂无编译文本。请使用下方电键发送信号...
                  </span>
                )}
              </div>
              
              {/* Tactical Buttons */}
              <div className="flex gap-2 flex-shrink-0 select-none">
                <button 
                  onClick={clearConsole}
                  title="清空文本与输入历史"
                  className="text-lg bg-white hover:bg-terminal-bg text-terminal-text border border-terminal-gray/40 rounded-xl cursor-pointer transition-all duration-150 active:scale-90 shadow-sm flex items-center justify-center w-11 h-11"
                >
                  🧹
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Sleek synth key button */}
        <section className="flex-shrink-0">
          <MorseButton 
            isPressing={isPressing && powerOn} 
            onStart={startPress} 
            onEnd={endPress} 
            disabled={!powerOn}
          />
        </section>

      </div>
    </div>
  );
};

export default MorseTrainer;
