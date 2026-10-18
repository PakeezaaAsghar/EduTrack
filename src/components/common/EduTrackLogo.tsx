import React from 'react';

interface EduTrackLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'auto' | 'light' | 'dark'; // 'light' means light text on dark backgrounds
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export const EduTrackLogo: React.FC<EduTrackLogoProps> = ({
  size = 'md',
  theme = 'auto',
  showText = true,
  showSubtitle = true,
  subtitle = 'Academic Management',
  className = '',
  onClick,
}) => {
  // Dimensions based on size
  const iconSizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-14 h-14 rounded-2xl',
  }[size];

  const svgDimensions = {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 34,
  }[size];

  const titleSizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-extrabold',
    xl: 'text-3xl font-extrabold',
  }[size];

  const subtitleSizeClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs',
  }[size];

  // Theme text colors
  const primaryTextColor = 
    theme === 'light' 
      ? 'text-white' 
      : theme === 'dark' 
      ? 'text-slate-900' 
      : 'text-slate-900 dark:text-white';

  const subtitleColor = 
    theme === 'light' 
      ? 'text-slate-400' 
      : theme === 'dark' 
      ? 'text-slate-500' 
      : 'text-slate-400 dark:text-slate-400';

  return (
    <div 
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Bespoke Geometric Logo Mark */}
      <div 
        className={`${iconSizeClasses} bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 shrink-0 relative overflow-hidden group transition-transform duration-200 hover:scale-[1.03]`}
      >
        {/* Subtle inner reflection shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/25 pointer-events-none" />

        {/* Custom Vector Icon: Open Knowledge Wings + Upward Track + Achievement Spark */}
        <svg 
          width={svgDimensions} 
          height={svgDimensions} 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-xs"
        >
          {/* Cap Crown / Knowledge Diamond */}
          <path 
            d="M16 4L4 10.5L16 17L28 10.5L16 4Z" 
            fill="white" 
            fillOpacity="0.95"
          />
          {/* Cap Underside / Depth */}
          <path 
            d="M16 17L4 10.5V13.5L16 20L28 13.5V10.5L16 17Z" 
            fill="#C7D2FE" 
            fillOpacity="0.75"
          />
          {/* Ascending Academic Track Chevron Left */}
          <path 
            d="M9 16.5V22.5C9 24.8 12.1 27 16 27C19.9 27 23 24.8 23 22.5V16.5L16 20.5L9 16.5Z" 
            fill="white" 
            fillOpacity="0.88"
          />
          {/* Tassel & Scholastic Achievement Spark */}
          <path 
            d="M26.5 12V20C26.5 20.8 25.5 21.5 24.5 21.5C23.5 21.5 22.5 20.8 22.5 20V12.7" 
            stroke="#FDE047" 
            strokeWidth="1.75" 
            strokeLinecap="round"
          />
          <circle cx="24.5" cy="22" r="1.5" fill="#FACC15" />
          {/* Star Sparkle on Crest */}
          <path 
            d="M16 7L16.8 9.2L19 10L16.8 10.8L16 13L15.2 10.8L13 10L15.2 9.2L16 7Z" 
            fill="#FEF08A"
          />
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="leading-tight">
          <div className={`${titleSizeClasses} tracking-tight whitespace-nowrap flex items-baseline`}>
            <span className={primaryTextColor}>Edu</span>
            <span className="text-indigo-600 dark:text-indigo-400 bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Track
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-0.5 inline-block shrink-0 animate-pulse" />
          </div>
          {showSubtitle && (
            <span className={`${subtitleSizeClasses} ${subtitleColor} font-mono tracking-wider uppercase block -mt-0.5`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
