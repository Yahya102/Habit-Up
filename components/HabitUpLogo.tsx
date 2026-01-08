
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const HabitUpLogo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "h-6",
    md: "h-10",
    lg: "h-20",
    xl: "h-32"
  };

  return (
    <div className={`inline-flex items-center ${sizes[size]} ${className}`}>
      <svg 
        viewBox="0 0 280 120" 
        className="h-full w-auto drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Habit Text */}
        <text 
          x="10" 
          y="85" 
          fill="#22c55e" 
          fontFamily="Outfit, sans-serif" 
          fontWeight="700" 
          fontSize="65" 
          letterSpacing="-1"
        >
          Habit
        </text>

        {/* Up Text */}
        <text 
          x="175" 
          y="85" 
          fill="#22c55e" 
          fontFamily="Outfit, sans-serif" 
          fontWeight="700" 
          fontSize="65" 
          letterSpacing="-1"
        >
          Up
        </text>

        {/* Integrated Arrow on the 'p' */}
        <path 
          d="M245 85 L245 40 L230 40 L255 15 L280 40 L265 40 L265 85 Z" 
          fill="#22c55e" 
        />

        {/* Sprouting Leaves */}
        <g transform="translate(200, 15) scale(0.8)">
          <path 
            d="M0 20 C10 0 30 0 40 20 C30 40 10 40 0 20Z" 
            fill="url(#leafGradient)" 
            transform="rotate(-45 20 20)"
          />
          <path 
            d="M30 10 C40 -10 60 -10 70 10 C60 30 40 30 30 10Z" 
            fill="url(#leafGradient)" 
            transform="rotate(-15 50 10)"
          />
          <path 
            d="M-30 10 C-20 -10 0 -10 10 10 C0 30 -20 30 -30 10Z" 
            fill="url(#leafGradient)" 
            transform="rotate(-75 -10 10)"
          />
        </g>

        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default HabitUpLogo;
