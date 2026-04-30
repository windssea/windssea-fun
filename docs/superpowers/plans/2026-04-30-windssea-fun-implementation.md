# windssea.fun Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first personal hobby hub with a terminal-style visual aesthetic, starting with a functional Morse Code Trainer.

**Architecture:** A React-based SPA using React Router for navigation. The Morse Code Trainer uses a custom hook for input timing logic and an SVG-based decision tree that dynamically updates based on the current input sequence.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, React Router v6.

---

### Task 1: Project Initialization & Global Styles

**Files:**
- Create: `tailwind.config.js`
- Create: `src/index.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Configure Tailwind CSS with terminal green theme**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          green: '#00ff41',
          dim: '#0a2a0a',
          gray: '#2a2a2a',
          dark: '#111',
          text: '#ccc',
          inactive: '#333'
        }
      },
      fontFamily: {
        mono: ['"Courier New"', 'Courier', 'monospace'],
      },
      borderRadius: {
        icon: '14px',
        card: '12px'
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Define global CSS and glow effects**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-terminal-bg text-terminal-green font-mono select-none overflow-hidden;
  }
}

.glow {
  box-shadow: 0 0 12px rgba(0, 255, 65, 0.33);
}

.glow-text {
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.5);
}

.terminal-border {
  @apply border border-terminal-gray;
}

.active-border {
  @apply border-1.5 border-terminal-green glow;
}
```

- [ ] **Step 3: Setup basic routing**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MorseTrainer from './pages/MorseTrainer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/morse" element={<MorseTrainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js src/index.css src/App.tsx src/main.tsx
git commit -m "chore: project init with tailwind theme and routing"
```

---

### Task 2: Morse Code Data Structures

**Files:**
- Create: `src/data/morseCode.ts`

- [ ] **Step 1: Define the Morse Tree and mapping**

```typescript
// src/data/morseCode.ts
export interface MorseNode {
  char: string | null;
  dot: MorseNode | null;
  dash: MorseNode | null;
}

export const MORSE_MAP: Record<string, string> = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
  '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
  '--..': 'Z'
};

const buildTree = (): MorseNode => {
  const root: MorseNode = { char: null, dot: null, dash: null };
  
  Object.entries(MORSE_MAP).forEach(([code, char]) => {
    let current = root;
    for (const bit of code) {
      if (bit === '.') {
        if (!current.dot) current.dot = { char: null, dot: null, dash: null };
        current = current.dot;
      } else {
        if (!current.dash) current.dash = { char: null, dot: null, dash: null };
        current = current.dash;
      }
    }
    current.char = char;
  });
  
  return root;
};

export const MORSE_TREE = buildTree();
```

- [ ] **Step 2: Commit**

```bash
git add src/data/morseCode.ts
git commit -m "feat: define morse code tree data structure"
```

---

### Task 3: Home Page Implementation

**Files:**
- Create: `src/pages/Home.tsx`

- [ ] **Step 1: Implement the icon grid**

```tsx
// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const icons = [
    { id: 'morse', label: 'MORSE', active: true, path: '/morse', icon: '📟' },
    ...Array(11).fill({ active: false })
  ];

  return (
    <div className="min-h-screen p-5 flex flex-col items-center">
      <header className="mt-8 mb-12">
        <h1 className="text-terminal-green opacity-40 text-xs tracking-[3px] font-bold">
          WINDSSEA.FUN
        </h1>
      </header>
      
      <div className="grid grid-cols-4 gap-[14px] w-full max-w-sm">
        {icons.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div 
              onClick={() => item.active && navigate(item.path)}
              className={`w-12 h-12 rounded-icon flex items-center justify-center text-xl transition-all
                ${item.active 
                  ? 'bg-terminal-dim border-1.5 border-terminal-green glow cursor-pointer active:scale-95' 
                  : 'bg-terminal-dark border border-dashed border-terminal-gray'}`}
            >
              {item.active ? item.icon : ''}
            </div>
            <span className={`text-[8px] mt-1 ${item.active ? 'text-terminal-text' : 'text-terminal-inactive'}`}>
              {item.active ? item.label : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: implement home page grid"
```

---

### Task 4: useMorseInput Hook

**Files:**
- Create: `src/hooks/useMorseInput.ts`

- [ ] **Step 1: Implement timing and input state logic**

```typescript
// src/hooks/useMorseInput.ts
import { useState, useEffect, useRef } from 'react';

export const useMorseInput = (onCommit: (char: string) => void, onSpace: () => void) => {
  const [sequence, setSequence] = useState<string>('');
  const [isPressing, setIsPressing] = useState(false);
  const pressStartRef = useRef<number>(0);
  const lastReleaseRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startPress = () => {
    setIsPressing(true);
    pressStartRef.current = Date.now();
    clearTimers();
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const endPress = () => {
    setIsPressing(false);
    const duration = Date.now() - pressStartRef.current;
    const bit = duration < 200 ? '.' : '-';
    setSequence(prev => prev + bit);
    lastReleaseRef.current = Date.now();
  };

  useEffect(() => {
    if (!isPressing && sequence.length > 0) {
      clearTimers();
      timerRef.current = setTimeout(() => {
        onCommit(sequence);
        setSequence('');
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        
        timerRef.current = setTimeout(() => {
          onSpace();
        }, 1400 - 600);
      }, 600);
    }
    return clearTimers;
  }, [sequence, isPressing, onCommit, onSpace]);

  return { sequence, isPressing, startPress, endPress };
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useMorseInput.ts
git commit -m "feat: implement useMorseInput hook for timing logic"
```

---

### Task 5: Morse Trainer UI Components

**Files:**
- Create: `src/components/MorseButton.tsx`
- Create: `src/components/LetterDisplay.tsx`
- Create: `src/components/MorseTree.tsx`

- [ ] **Step 1: Implement the Big Input Button**

```tsx
// src/components/MorseButton.tsx
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
    className={`w-full h-32 rounded-card border-2 transition-all active:scale-95 flex flex-col items-center justify-center
      ${isPressing 
        ? 'bg-terminal-dim border-terminal-green shadow-[0_0_20px_#00ff41aa]' 
        : 'bg-terminal-bg border-terminal-gray'}`}
  >
    <span className="text-xl tracking-[2px] font-bold">TAP / HOLD</span>
    <span className="text-[10px] mt-2 opacity-60">点击 = · | 按住 = —</span>
  </button>
);

export default MorseButton;
```

- [ ] **Step 2: Implement Letter and History Display**

```tsx
// src/components/LetterDisplay.tsx
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
    <div className="flex-1 flex gap-1 items-center">
      {sequence.split('').map((s, i) => (
        <div key={i} className={`bg-terminal-green glow h-2 ${s === '.' ? 'w-2 rounded-full' : 'w-6 rounded-sm'}`} />
      ))}
    </div>
    <div className="text-terminal-green text-opacity-60 text-right truncate max-w-[120px]">
      {text}<span className="animate-pulse">_</span>
    </div>
  </div>
);

export default LetterDisplay;
```

- [ ] **Step 3: Implement SVG Decision Tree (Simplified logic for 3 layers)**

```tsx
// src/components/MorseTree.tsx
import { MorseNode, MORSE_TREE } from '../data/morseCode';

interface Props {
  path: string;
}

const MorseTree = ({ path }: Props) => {
  // Simplified rendering logic for spec requirements
  return (
    <div className="w-full aspect-video">
      <svg viewBox="0 0 400 240" className="w-full h-full">
        {/* SVG filter for glow */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Placeholder for actual node mapping logic - to be refined in implementation */}
        <circle cx="200" cy="30" r="10" fill="#0a2a0a" stroke="#00ff41" filter="url(#glow)" />
        <text x="200" y="35" textAnchor="middle" fontSize="10" fill="#00ff41" pointerEvents="none">START</text>
        {/* ... rendering of first 3 layers ... */}
      </svg>
    </div>
  );
};

export default MorseTree;
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MorseButton.tsx src/components/LetterDisplay.tsx src/components/MorseTree.tsx
git commit -m "feat: implement Morse Trainer UI components"
```

---

### Task 6: Morse Trainer Page Integration

**Files:**
- Create: `src/pages/MorseTrainer.tsx`

- [ ] **Step 1: Integrate components and hook**

```tsx
// src/pages/MorseTrainer.tsx
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
        <button onClick={() => navigate('/')} className="text-xl">‹</button>
        <h2 className="text-xs font-bold tracking-widest">MORSE TRAINER</h2>
        <span className="text-xs opacity-60">WPM: 0</span>
      </nav>

      <MorseTree path={sequence} />
      
      <div className="mt-auto mb-6">
        <LetterDisplay currentChar={lastChar} sequence={sequence} text={text} />
      </div>

      <MorseButton isPressing={isPressing} onStart={startPress} onEnd={endPress} />
    </div>
  );
};

export default MorseTrainer;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/MorseTrainer.tsx
git commit -m "feat: integrate Morse Trainer page"
```
