import { useMemo } from 'react';
import { MORSE_TREE, MorseNode } from '../data/morseCode';

interface Props {
  path: string;
}

const MorseTree = ({ path }: Props) => {
  const nodes = useMemo(() => {
    const result: { x: number; y: number; char: string | null; active: boolean; faded: boolean }[] = [];
    
    const traverse = (node: MorseNode, x: number, y: number, level: number, currentPath: string) => {
      if (level > 3) return;
      
      const active = path.startsWith(currentPath);
      const faded = path.length > 0 && !active && path.slice(0, currentPath.length - 1) === currentPath.slice(0, currentPath.length - 1);
      
      result.push({ x, y, char: node.char || (level === 0 ? 'START' : ''), active, faded });
      
      const gap = 160 / Math.pow(2, level);
      if (node.dot) traverse(node.dot, x - gap, y + 50, level + 1, currentPath + '.');
      if (node.dash) traverse(node.dash, x + gap, y + 50, level + 1, currentPath + '-');
    };
    
    traverse(MORSE_TREE, 200, 30, 0, '');
    return result;
  }, [path]);

  return (
    <div className="w-full aspect-[4/3] relative">
      <svg viewBox="0 0 400 240" className="w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Simple lines for connections could be added here for more detail */}
        
        {nodes.map((node, i) => (
          <g key={i} className="transition-all duration-300">
            <circle 
              cx={node.x} cy={node.y} r={node.active ? 12 : 8} 
              fill={node.active ? "#0a2a0a" : node.faded ? "#0d1117" : "#111"}
              stroke={node.active ? "#00ff41" : node.faded ? "#111" : "#2a2a2a"}
              strokeWidth={node.active ? 2 : 1}
              filter={node.active ? "url(#glow)" : ""}
            />
            {node.char && (
              <text 
                x={node.x} y={node.y + 4} textAnchor="middle" fontSize={node.active ? "10" : "8"} 
                fill={node.active ? "#00ff41" : node.faded ? "#1a2a1a" : "#444"}
                className="font-bold pointer-events-none transition-all duration-300"
              >
                {node.char}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] opacity-40">
        当前路径: {path.split('').join(' ')}
      </div>
    </div>
  );
};

export default MorseTree;
