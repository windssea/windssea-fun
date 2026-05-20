import { useState, useEffect, useRef } from 'react';

// Advanced industrial audio engine for synthesized radio sine wave & mechanical switch clacks
class AudioEngine {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private chimeOsc: OscillatorNode | null = null;
  private chimeGain: GainNode | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public startTone(freq: number, vol: number) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopTone();

    const t = this.ctx.currentTime;

    // 1. Warm Kalimba body (sine wave, sustains softly while holding down)
    this.osc = this.ctx.createOscillator();
    this.gain = this.ctx.createGain();
    this.osc.type = 'sine';
    this.osc.frequency.setValueAtTime(freq, t);
    
    // Smooth envelope: 8ms attack to make it warm and avoid clicks
    this.gain.gain.setValueAtTime(0, t);
    this.gain.gain.linearRampToValueAtTime(vol * 0.15, t + 0.008);

    this.osc.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    
    this.osc.start(t);

    // 2. High Chime Mallet Strike (triangle wave transient, decays quickly in 0.08s)
    this.chimeOsc = this.ctx.createOscillator();
    this.chimeGain = this.ctx.createGain();
    this.chimeOsc.type = 'triangle';
    this.chimeOsc.frequency.setValueAtTime(freq * 2.01, t); // Double frequency harmonic strike
    
    this.chimeGain.gain.setValueAtTime(0, t);
    this.chimeGain.gain.linearRampToValueAtTime(vol * 0.08, t + 0.004);
    this.chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    this.chimeOsc.connect(this.chimeGain);
    this.chimeGain.connect(this.ctx.destination);
    
    this.chimeOsc.start(t);
  }

  public stopTone() {
    const t = this.ctx ? this.ctx.currentTime : 0;

    // Stop main oscillator with a gentle wooden wood-decay ring
    if (this.osc && this.gain && this.ctx) {
      try {
        const stopTime = t + 0.04; // 40ms resonance decay
        this.gain.gain.cancelScheduledValues(t);
        this.gain.gain.setValueAtTime(this.gain.gain.value, t);
        this.gain.gain.exponentialRampToValueAtTime(0.001, stopTime);
        this.osc.stop(stopTime);
      } catch (e) {
        // Ignore errors if oscillator already stopped
      }
      this.osc = null;
      this.gain = null;
    }

    // Stop chime oscillator if running
    if (this.chimeOsc && this.chimeGain && this.ctx) {
      try {
        this.chimeOsc.stop(t);
      } catch (e) {
        // Ignore errors
      }
      this.chimeOsc = null;
      this.chimeGain = null;
    }
  }

  public playClick(type: 'down' | 'up', vol: number) {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'down') {
      // Warm, cozy hollow marimba wood block tap on press down
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.03);

      gain.gain.setValueAtTime(vol * 0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.start(t);
      osc.stop(t + 0.03);
    } else {
      // Soft release spring/bubble sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.02);

      gain.gain.setValueAtTime(vol * 0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.start(t);
      osc.stop(t + 0.02);
    }
  }
}

const audioEngine = new AudioEngine();

interface HookParams {
  onCommit: (seq: string) => void;
  onSpace: () => void;
  wpm: number;
  frequency: number;
  volume: number;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export const useMorseInput = ({
  onCommit,
  onSpace,
  wpm,
  frequency,
  volume,
  soundEnabled,
  hapticEnabled,
}: HookParams) => {
  const [sequence, setSequence] = useState<string>('');
  const [previewPath, setPreviewPath] = useState<string>('');
  const [isPressing, setIsPressing] = useState(false);
  const [lastPressDuration, setLastPressDuration] = useState<number>(0);
  
  const pressStartRef = useRef<number>(0);
  const commitTimerRef = useRef<any>(null);
  const spaceTimerRef = useRef<any>(null);
  const previewTimerRef = useRef<any>(null);

  const U = 1200 / wpm;
  const dashBoundary = 2.2 * U; // Forgiving dot/dash threshold (e.g. 176ms)

  const clearTimers = () => {
    if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
    if (spaceTimerRef.current) clearTimeout(spaceTimerRef.current);
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
  };

  const startPress = () => {
    if (isPressing) return;
    setIsPressing(true);
    pressStartRef.current = Date.now();
    
    clearTimers();

    // Immediately preview the dot path on press down
    setPreviewPath(sequence + '.');

    // Set a timer to dynamically switch to the dash path in real-time
    previewTimerRef.current = setTimeout(() => {
      setPreviewPath(sequence + '-');
    }, dashBoundary);

    if (soundEnabled) {
      audioEngine.startTone(frequency, volume);
      audioEngine.playClick('down', volume);
    }
    
    if (hapticEnabled && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const endPress = () => {
    if (!isPressing) return;
    setIsPressing(false);

    clearTimers();

    if (soundEnabled) {
      audioEngine.stopTone();
      audioEngine.playClick('up', volume);
    }

    const duration = Date.now() - pressStartRef.current;
    setLastPressDuration(duration);

    // Decision boundary between dot and dash
    const bit = duration < dashBoundary ? '.' : '-';
    const nextSeq = sequence + bit;
    setSequence(nextSeq);
    setPreviewPath(nextSeq);
  };

  // Run inactivity timers
  useEffect(() => {
    if (!isPressing && sequence.length > 0) {
      clearTimers();
      
      // Relaxed letter commit inactivity: 4.8 * U gives children generous breathing room (e.g. 720ms at WPM=8)
      const letterCommitDelay = 4.8 * U;
      
      commitTimerRef.current = setTimeout(() => {
        onCommit(sequence);
        setSequence('');
        setPreviewPath('');

        if (hapticEnabled && navigator.vibrate) {
          navigator.vibrate([20, 40, 20]);
        }

        // Relaxed word space delay: 4.8 * U (total 9.6 * U, e.g. 1440ms) before auto-spacing
        const wordSpaceDelay = 4.8 * U;
        spaceTimerRef.current = setTimeout(() => {
          onSpace();
        }, wordSpaceDelay);

      }, letterCommitDelay);
    }
    
    return clearTimers;
  }, [sequence, isPressing, U, onCommit, onSpace, hapticEnabled]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopTone();
    };
  }, []);

  return { 
    sequence, 
    previewPath,
    isPressing, 
    startPress, 
    endPress, 
    lastPressDuration,
    unitTime: U
  };
};

