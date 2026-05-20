import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage('');
    }, 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Pristine high-fidelity acoustic chime pluck sound
  const playClickSound = (freq = 523.25) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Warm organic acoustic sine pluck
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      // Clean harmonic chime transient
      const chimeOsc = audioCtx.createOscillator();
      const chimeGain = audioCtx.createGain();
      chimeOsc.connect(chimeGain);
      chimeGain.connect(audioCtx.destination);

      const t = audioCtx.currentTime;
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      
      chimeOsc.type = 'triangle';
      chimeOsc.frequency.setValueAtTime(freq * 2.0, t);
      chimeGain.gain.setValueAtTime(0.04, t);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      
      osc.start(t);
      chimeOsc.start(t);
      
      osc.stop(t + 0.3);
      chimeOsc.stop(t + 0.06);
    } catch (e) {
      // AudioContext autoplay protection
    }
  };

  const handleLaunch = () => {
    playClickSound(587.33); // High Re (D5) pluck
    setTimeout(() => {
      navigate('/morse');
    }, 180);
  };

  const handleLockedAppTap = (appName: string) => {
    playClickSound(349.23); // Low Fa (F4) pluck for failure feedback
    showToast(`🔒 ${appName} 正在升级中，敬请期待！`);
  };

  return (
    <div className="h-[100dvh] w-screen flex flex-col items-center justify-center p-6 sm:p-8 max-w-lg mx-auto select-none bg-terminal-bg text-terminal-text relative font-sans overflow-hidden">
      
      {/* Decorative floating warm organic blobs to make the wallpaper feel premium and alive */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-terminal-green/5 blur-3xl pointer-events-none float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-terminal-orange/5 blur-3xl pointer-events-none float-slow" style={{ animationDelay: '-3s' }} />

      {/* iOS-style Glassmorphic Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white/95 border border-terminal-gray px-4 py-2.5 rounded-full text-xs text-terminal-text shadow-lg font-bold flex items-center gap-2 z-30 animate-fade-in whitespace-nowrap">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Chassis centered exclusively */}
      <div className="w-full z-10 flex flex-col items-center justify-center my-auto">
        
        {/* Mobile Desktop App Grid (Enlarged Squircle Icons) */}
        <main className="grid grid-cols-3 gap-y-8 gap-x-6 px-4 w-full justify-items-center select-none">
          
          {/* App 1: Morse Decoder (Active!) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={handleLaunch}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-terminal-green flex items-center justify-center text-3xl text-white font-black shadow-md hover:shadow-emerald-950/10 transition-all duration-300 active:scale-90 group-hover:scale-105 border border-terminal-green relative">
              {/* Pulsing Active Badge */}
              <span className="absolute -top-1 -right-1 bg-terminal-orange text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full font-black tracking-normal border border-white shadow-sm animate-pulse">
                LIVE
              </span>
              ▲
            </div>
            <span className="text-[11px] font-bold text-terminal-text mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              信号译码
            </span>
          </div>

          {/* App 2: Synth Modulator (Locked) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleLockedAppTap('频率发生器')}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white border border-terminal-gray/60 flex items-center justify-center text-2xl text-terminal-inactive/60 shadow-sm transition-all duration-300 active:scale-95 group-hover:bg-terminal-dim/30 relative">
              <span className="absolute top-1.5 right-1.5 text-[8px] opacity-60">🔒</span>
              ◈
            </div>
            <span className="text-[11px] font-bold text-terminal-inactive mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              频率发生
            </span>
          </div>

          {/* App 3: Wave Radar (Locked) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleLockedAppTap('示波雷达')}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white border border-terminal-gray/60 flex items-center justify-center text-2xl text-terminal-inactive/60 shadow-sm transition-all duration-300 active:scale-95 group-hover:bg-terminal-dim/30 relative">
              <span className="absolute top-1.5 right-1.5 text-[8px] opacity-60">🔒</span>
              ⏦
            </div>
            <span className="text-[11px] font-bold text-terminal-inactive mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              示波雷达
            </span>
          </div>

          {/* App 4: Handbook Codex (Locked) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleLockedAppTap('点划手册')}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white border border-terminal-gray/60 flex items-center justify-center text-2xl text-terminal-inactive/60 shadow-sm transition-all duration-300 active:scale-95 group-hover:bg-terminal-dim/30 relative">
              <span className="absolute top-1.5 right-1.5 text-[8px] opacity-60">🔒</span>
              📔
            </div>
            <span className="text-[11px] font-bold text-terminal-inactive mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              点划手册
            </span>
          </div>

          {/* App 5: Achievements Badges (Locked) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleLockedAppTap('荣誉勋章')}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white border border-terminal-gray/60 flex items-center justify-center text-2xl text-terminal-inactive/60 shadow-sm transition-all duration-300 active:scale-95 group-hover:bg-terminal-dim/30 relative">
              <span className="absolute top-1.5 right-1.5 text-[8px] opacity-60">🔒</span>
              🏆
            </div>
            <span className="text-[11px] font-bold text-terminal-inactive mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              荣誉勋章
            </span>
          </div>

          {/* App 6: System Configuration (Locked) */}
          <div className="flex flex-col items-center group cursor-pointer" onClick={() => handleLockedAppTap('控制中心')}>
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[22px] bg-white border border-terminal-gray/60 flex items-center justify-center text-2xl text-terminal-inactive/60 shadow-sm transition-all duration-300 active:scale-95 group-hover:bg-terminal-dim/30 relative">
              <span className="absolute top-1.5 right-1.5 text-[8px] opacity-60">🔒</span>
              ⚙️
            </div>
            <span className="text-[11px] font-bold text-terminal-inactive mt-2.5 tracking-wide text-center drop-shadow-sm select-none">
              控制中心
            </span>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Home;
