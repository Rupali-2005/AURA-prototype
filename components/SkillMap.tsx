
import React from 'react';
import { Skill } from '../types';

interface SkillMapProps {
  skills: Skill[];
}

const SkillMap: React.FC<SkillMapProps> = ({ skills }) => {
  const size = 320;
  const center = size / 2;
  const radius = size * 0.35;
  const angleStep = (Math.PI * 2) / (skills.length || 3);

  const getPoint = (score: number, index: number) => {
    const r = (score / 100) * radius;
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = skills.map((s, i) => getPoint(s.score, i));
  const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-visible">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Grids */}
        {[0.25, 0.5, 0.75, 1.0].map(r => (
          <circle 
            key={r}
            cx={center} cy={center} r={r * radius} 
            fill="none" stroke="rgba(212, 175, 55, 0.05)" strokeWidth="1"
            className="axis-circle"
          />
        ))}
        
        {/* Axes */}
        {skills.map((_, i) => {
          const p = getPoint(100, i);
          return (
            <line 
              key={i}
              x1={center} y1={center} x2={p.x} y2={p.y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"
              className="axis-pulse"
            />
          );
        })}

        {/* Skill Area */}
        <polygon 
          points={pointsString}
          fill="rgba(212, 175, 55, 0.15)"
          stroke="#D4AF37"
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="skill-polygon transition-all duration-700 ease-in-out"
        />

        {/* Labels & Nodes */}
        {skills.map((s, i) => {
          const labelPoint = getPoint(125, i);
          const nodePoint = getPoint(s.score, i);
          const isLeft = labelPoint.x < center;
          return (
            <g key={i} className="skill-node-group group cursor-pointer">
              {/* Interactive Node */}
              <circle 
                cx={nodePoint.x} 
                cy={nodePoint.y} 
                r="4" 
                fill="#D4AF37" 
                className="transition-all duration-300 group-hover:r-6 group-hover:filter-[url(#glow)]" 
              />
              <circle 
                cx={nodePoint.x} 
                cy={nodePoint.y} 
                r="8" 
                fill="rgba(212, 175, 55, 0.2)" 
                className="opacity-0 group-hover:opacity-100 transition-opacity animate-ping" 
              />
              
              <text 
                x={labelPoint.x} y={labelPoint.y}
                fill="#94a3b8"
                fontSize="9"
                textAnchor={isLeft ? "end" : "start"}
                className="uppercase font-bold tracking-[0.1em] select-none transition-colors group-hover:fill-[#D4AF37]"
              >
                {s.name}
              </text>
            </g>
          );
        })}

        {/* Center Point */}
        <circle cx={center} cy={center} r="2" fill="#D4AF37" className="animate-pulse" />
      </svg>

      <style>{`
        @keyframes axis-pulse-anim {
          0%, 100% { opacity: 0.1; stroke-width: 1; }
          50% { opacity: 0.3; stroke-width: 1.5; }
        }
        .axis-pulse {
          animation: axis-pulse-anim 4s ease-in-out infinite;
        }
        .skill-polygon {
          filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.2));
        }
        .skill-node-group:hover .skill-polygon {
          stroke-width: 2.5;
        }
      `}</style>
    </div>
  );
};

export default SkillMap;
