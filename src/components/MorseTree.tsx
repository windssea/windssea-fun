import { useMemo } from 'react';
import { MORSE_TREE } from '../data/morseCode';
import type { MorseNode } from '../data/morseCode';

interface Props {
  path: string;
}

const MorseTree = ({ path }: Props) => {
  const { nodeList, lineList } = useMemo(() => {
    const nodes: { id: string; x: number; y: number; char: string | null; active: boolean; faded: boolean; level: number }[] = [];
    const lines: { fromX: number; fromY: number; toX: number; toY: number; active: boolean; type: '.' | '-' }[] = [];
    
    const traverse = (node: MorseNode, x: number, y: number, level: number, currentPath: string) => {
      if (level > 4) return;
      
      const active = path.startsWith(currentPath) && (path.length >= currentPath.length || currentPath === '');
      const faded = path.length > 0 && !active && path.slice(0, currentPath.length - 1) === currentPath.slice(0, currentPath.length - 1);
      
      nodes.push({ id: currentPath, x, y, char: node.char || (level === 0 ? 'START' : ''), active, faded, level });
      
      // Vertical step size adjusted to perfectly match 540x500 aspect ratio and fill the container height
      const getStepY = (lvl: number) => {
        if (lvl === 0) return 55; // Root to Level 1
        if (lvl === 1) return 65; // Level 1 to Level 2
        if (lvl === 2) return 90; // Level 2 to Level 3
        return 115;               // Level 3 to Level 4 (leaves vertical expansion)
      };
      
      // Horizontal gap optimized for a 540px width container (aspect ratio matching)
      const getGap = (lvl: number) => {
        if (lvl === 0) return 124; // Root to Level 1 (E/T)
        if (lvl === 1) return 62;  // Level 1 to Level 2 (I/A...)
        if (lvl === 2) return 31;  // Level 2 to Level 3 (S/U...)
        return 16;                 // Level 3 to Level 4 (H/V...)
      };
      
      const gap = getGap(level);
      const stepY = getStepY(level);
      
      if (node.dot) {
        const nextX = x - gap;
        const childPath = currentPath + '.';
        const childActive = path.startsWith(childPath) && path.length >= childPath.length;
        
        let childY = y + stepY;
        if (level === 2) {
          // Level 3 dot child staggered up
          childY = y + stepY - 18;
        } else if (level === 3) {
          // Level 4 dot child staggered up by 36px to achieve 100% overlap prevention
          childY = y + stepY - 36;
        }
        
        lines.push({
          fromX: x, fromY: y,
          toX: nextX, toY: childY,
          active: childActive,
          type: '.'
        });
        traverse(node.dot, nextX, childY, level + 1, childPath);
      }
      
      if (node.dash) {
        const nextX = x + gap;
        const childPath = currentPath + '-';
        const childActive = path.startsWith(childPath) && path.length >= childPath.length;
        
        let childY = y + stepY;
        if (level === 2) {
          // Level 3 dash child staggered down
          childY = y + stepY + 18;
        } else if (level === 3) {
          // Level 4 dash child staggered down by 36px to achieve 100% overlap prevention
          childY = y + stepY + 36;
        }
        
        lines.push({
          fromX: x, fromY: y,
          toX: nextX, toY: childY,
          active: childActive,
          type: '-'
        });
        traverse(node.dash, nextX, childY, level + 1, childPath);
      }
    };
    
    // Position root starting at y = 40 to leave a comfortable top clearance (y-r = 40-23 = 17px)
    // Center point in a 540px wide canvas is 270
    traverse(MORSE_TREE, 270, 40, 0, '');
    return { nodeList: nodes, lineList: lines };
  }, [path]);

  // Premium Cool-Metallic palette (Active colors illuminate in anodized cool tones)
  const getNodeColor = (level: number, active: boolean) => {
    if (!active) return '#ffffff'; // Inactive: clean pure white
    if (level === 0) return '#2c4b5e'; // Active Root: Deep surgical steel-blue
    if (level === 1) return '#2c4b5e'; // Level 1: Deep surgical steel-blue
    if (level === 2) return '#3b7db0'; // Level 2: Cool Anodized Cobalt Accent Blue
    if (level === 3) return '#4f6f80'; // Level 3: Soft Slate Blue
    return '#627d98'; // Level 4: Brushed Zinc Gray-Blue
  };

  const getNodeStroke = (level: number, active: boolean) => {
    if (!active) return '#bac6d3'; // Inactive: elegant silver outline
    if (level === 0) return '#1d3442';
    if (level === 1) return '#1d3442';
    if (level === 2) return '#2b5f88';
    if (level === 3) return '#3a5462';
    return '#496075';
  };

  return (
    <div className="w-full h-full relative border border-terminal-gray/40 bg-white rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
      
      {/* Decorative background grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#d0d9e2_1px,transparent_1px)] [background-size:16px_16px] opacity-45 pointer-events-none" />

      {/* Optimized viewBox="0 0 540 500" to perfectly fit taller container ratios, making the entire tree 1.5x larger */}
      <svg viewBox="0 0 540 500" className="w-full h-full p-2.5 z-10">
        <defs>
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <style>{`
          @keyframes activeWirePulse {
            0%, 100% { stroke-opacity: 0.95; }
            50% { stroke-opacity: 0.6; }
          }
          .active-branch {
            animation: activeWirePulse 2s ease-in-out infinite;
          }
        `}</style>
        
        {/* Curved Tree Stems - Thin, precise modern geometric lines */}
        {lineList.map((line, i) => {
          const pathString = `M ${line.fromX} ${line.fromY} C ${line.fromX} ${(line.fromY + line.toY) / 2}, ${line.toX} ${(line.fromY + line.toY) / 2}, ${line.toX} ${line.toY}`;
          return (
            <g key={`wire-${i}`}>
              <path
                d={pathString}
                fill="none"
                stroke={line.active ? '#2c4b5e' : '#d0d9e2'}
                strokeWidth={line.active ? 2.5 : 1.2}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {line.active && (
                <path
                  d={pathString}
                  fill="none"
                  stroke="#2c4b5e"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  className="active-branch"
                  opacity={0.8}
                />
              )}
            </g>
          );
        })}
        
        {/* Sleek Node Circles with integrated letters and last-bit codes inside */}
        {nodeList.map((node) => {
          const isRoot = node.level === 0;
          const isLevel4 = node.level === 4;
          const isTargetedLeaf = path === node.id && node.id !== '';

          // Highly maximized, child-friendly sizes for absolute visual clarity and comfort
          let radius = 24;
          let fontSize = 22;

          if (isRoot) {
            radius = 23;
            fontSize = 18;
          } else if (node.level === 1) {
            radius = node.active ? 28 : 27;
            fontSize = 25;
          } else if (node.level === 2) {
            radius = node.active ? 26 : 25;
            fontSize = 22;
          } else if (node.level === 3) {
            radius = node.active ? 23 : 22;
            fontSize = 19;
          } else if (isLevel4) {
            radius = node.active ? 19.5 : 18.5;
            fontSize = 17;
          }

          const nodeColor = getNodeColor(node.level, node.active);
          const nodeStroke = getNodeStroke(node.level, node.active);

          // Get single last symbol (• or —)
          const lastBit = node.id.slice(-1) === '.' ? '•' : '—';

          return (
            <g 
              key={`node-${node.id}`} 
              className="transition-all duration-300"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            >
              {/* Subtle pulsing background ring around active targeted leaf */}
              {isTargetedLeaf && (
                <circle 
                  cx={node.x} cy={node.y} r={radius + 8} 
                  fill="none" stroke="#3b7db0" strokeWidth={1} 
                  className="animate-ping opacity-30"
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              )}

              {/* Node Body Circle */}
              <circle 
                cx={node.x} 
                cy={node.y} 
                r={radius} 
                fill={nodeColor}
                stroke={nodeStroke}
                strokeWidth={node.active ? 2.0 : 1.0}
                filter={node.active ? 'url(#soft-glow)' : ''}
                className="transition-all duration-300 shadow-sm"
              />
              
              {/* Start ▲ Icon for Root Node */}
              {isRoot && (
                <text 
                  x={node.x} 
                  y={node.y} 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  fontSize={fontSize} 
                  fontWeight="bold"
                  fill={node.active ? '#ffffff' : '#1f2d3d'}
                  opacity={node.active ? 1.0 : node.faded ? 0.75 : 0.45}
                  className="font-sans pointer-events-none transition-all duration-300 select-none"
                >
                  ▲
                </text>
              )}

              {/* Letter Label - Positioned upper half of circle */}
              {node.char && !isRoot && (
                <text 
                  x={node.x} 
                  y={node.y - radius * 0.28} 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  fontSize={radius * 0.85} 
                  fontWeight="bold"
                  fill={node.active ? '#ffffff' : '#1f2d3d'}
                  opacity={node.active ? 1.0 : node.faded ? 0.75 : 0.45}
                  className="font-sans pointer-events-none transition-all duration-300 select-none"
                >
                  {node.char}
                </text>
              )}

              {/* Morse Code (• or —) - Custom SVG shapes centered in the bottom half of circle to prevent overlap */}
              {node.char && !isRoot && (
                lastBit === '•' ? (
                  <circle
                    cx={node.x}
                    cy={node.y + radius * 0.35}
                    r={radius * 0.16}
                    fill={node.active ? '#ffffff' : '#2c4b5e'}
                    opacity={node.active ? 1.0 : node.faded ? 0.75 : 0.45}
                    className="pointer-events-none transition-all duration-300 select-none"
                  />
                ) : (
                  <rect
                    x={node.x - (radius * 0.52) / 2}
                    y={node.y + radius * 0.35 - (radius * 0.14) / 2}
                    width={radius * 0.52}
                    height={radius * 0.14}
                    rx={radius * 0.07}
                    fill={node.active ? '#ffffff' : '#2c4b5e'}
                    opacity={node.active ? 1.0 : node.faded ? 0.75 : 0.45}
                    className="pointer-events-none transition-all duration-300 select-none"
                  />
                )
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default MorseTree;

