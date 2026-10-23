import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, HTMLMotionProps, AnimatePresence } from 'motion/react';

// ==========================================
// ACCESSIBILITY: REDUCED MOTION DETECTOR
// ==========================================
export const usePrefersReducedMotion = (): boolean => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
};

// ==========================================
// 1. TOP SCROLL PROGRESS BAR
// ==========================================
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 origin-left shadow-xs pointer-events-none"
      style={{ scaleX }}
    />
  );
};

// ==========================================
// 2. SMOOTH NUMERICAL STAT COUNTER
// ==========================================
interface AnimatedCounterProps {
  value: number;
  duration?: number; // in milliseconds
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1100,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(prefersReduced ? value : 0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(value);
      return;
    }

    // Set up IntersectionObserver so counter only fires when visible
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number | null = null;
          const startVal = 0;
          const endVal = value;

          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (endVal - startVal) * easeOut;
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(endVal);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.15 }
    );

    const el = elementRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [value, duration, prefersReduced, hasAnimated]);

  return (
    <span ref={elementRef} className={`tabular-nums font-mono ${className}`}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

// ==========================================
// 3. DASHBOARD STAT CARD (STAGGER + LIFT)
// ==========================================
interface DashboardStatCardProps extends HTMLMotionProps<'div'> {
  title: string;
  value: number | string;
  numericValue?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  subtext?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  numericValue,
  decimals = 0,
  prefix = '',
  suffix = '',
  icon: Icon,
  iconColor = 'text-indigo-600 dark:text-indigo-400',
  subtext,
  badge,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18, scale: 0.99 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      whileHover={{
        y: -5,
        boxShadow: '0 12px 24px -8px rgba(15, 23, 42, 0.10)',
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onClick={onClick}
      className={`p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors duration-200 group relative ${
        onClick ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700' : ''
      } ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
        <span className="truncate">{title}</span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 group-hover:scale-110 transition-transform duration-200 shrink-0">
            <Icon className={`w-4 h-4 ${iconColor} transition-colors`} />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white tracking-tight">
          {numericValue !== undefined ? (
            <AnimatedCounter
              value={numericValue}
              decimals={decimals}
              prefix={prefix}
              suffix={suffix}
            />
          ) : (
            <span>{value}</span>
          )}
        </p>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {subtext && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
          {subtext}
        </div>
      )}
    </motion.div>
  );
};

// ==========================================
// 4. ANIMATED PROGRESS BAR
// ==========================================
interface AnimatedProgressBarProps {
  value: number; // 0 to 100
  height?: string;
  color?: string;
  trackColor?: string;
  className?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  height = 'h-2',
  color = 'bg-indigo-600 dark:bg-indigo-500',
  trackColor = 'bg-slate-100 dark:bg-slate-800',
  className = ''
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full ${height} ${trackColor} rounded-full overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? { width: `${clampedValue}%` } : { width: '0%' }}
        whileInView={{ width: `${clampedValue}%` }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
};

// ==========================================
// 5. ANIMATED BAR ITEM (VERTICAL CHART BARS)
// ==========================================
interface AnimatedBarItemProps {
  percentage: number; // 0 to 100
  color?: string;
  hoverColor?: string;
  delay?: number;
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedBarItem: React.FC<AnimatedBarItemProps> = ({
  percentage,
  color = 'bg-indigo-600 dark:bg-indigo-500',
  hoverColor = 'hover:bg-indigo-500',
  delay = 0,
  className = '',
  children
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const clamped = Math.min(Math.max(percentage, 2), 100);

  return (
    <div className={`w-full h-full flex flex-col justify-end items-center relative ${className}`}>
      <motion.div
        initial={prefersReduced ? { scaleY: 1 } : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.65,
          delay,
          ease: [0.16, 1, 0.3, 1]
        }}
        style={{
          height: `${clamped}%`,
          transformOrigin: 'bottom'
        }}
        className={`w-full rounded-t-sm sm:rounded-t-md ${color} ${hoverColor} transition-colors duration-200 shadow-xs relative`}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ==========================================
// 6. ANIMATED CIRCULAR PROGRESS INDICATOR
// ==========================================
interface AnimatedCircularProgressProps {
  percentage: number; // 0 to 100
  size?: number; // width & height in px
  strokeWidth?: number;
  strokeColor?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 7,
  strokeColor = '#6366f1',
  trackColor = 'currentColor',
  label,
  sublabel,
  className = ''
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const clamped = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="none"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={prefersReduced ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {/* Centered label inside circle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
          {label || `${clamped}%`}
        </span>
        {sublabel && (
          <span className="text-[9px] text-slate-500 font-medium -mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 7. SECTION HEADING WITH GENTLE TEXT REVEAL
// ==========================================
interface SectionHeadingProps {
  tag?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  center?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  center = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`space-y-3 ${center ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}
    >
      {tag && (
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          {tag}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

// ==========================================
// 8. REVEAL ON SCROLL (FADE + SLIDE)
// ==========================================
interface RevealOnScrollProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.55,
  distance = 24,
  className = '',
  once = true,
  ...props
}) => {
  const prefersReduced = usePrefersReducedMotion();

  const getInitialPosition = () => {
    if (prefersReduced) return { x: 0, y: 0 };
    switch (direction) {
      case 'up': return { y: distance, x: 0 };
      case 'down': return { y: -distance, x: 0 };
      case 'left': return { x: distance, y: 0 };
      case 'right': return { x: -distance, y: 0 };
      case 'none': return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  return (
    <motion.div
      initial={{ opacity: 0, ...initialPos }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: prefersReduced ? 0.01 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 9. STAGGER CONTAINER & STAGGER ITEM
// ==========================================
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.08,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<HTMLMotionProps<'div'>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.99 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.48,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 10. INTERACTIVE CARD (HOVER LIFT 4-6PX)
// ==========================================
interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  scale?: number;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  hoverY = -5,
  scale = 1.01,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{
        y: hoverY,
        scale,
        transition: { duration: 0.22, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.985 }}
      className={`transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 11. INTERACTIVE CTA BUTTON
// ==========================================
interface InteractiveCTAButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glow';
}

export const InteractiveCTAButton: React.FC<InteractiveCTAButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.025,
        y: -1.5,
        transition: { type: 'spring', stiffness: 400, damping: 20 }
      }}
      whileTap={{
        scale: 0.97,
        transition: { type: 'spring', stiffness: 500, damping: 25 }
      }}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// 12. GENTLE FLOATING BADGE / ILLUSTRATION
// ==========================================
interface FloatingBadgeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
}

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  children,
  delay = 0,
  duration = 5,
  yOffset = 6,
  className = '',
  ...props
}) => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: prefersReduced ? 0 : [0, -yOffset, 0]
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// ==========================================
// 13. SMOOTH TAB CONTENT TRANSITION
// ==========================================
interface TabFadeWrapperProps {
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}

export const TabFadeWrapper: React.FC<TabFadeWrapperProps> = ({
  tabKey,
  children,
  className = ''
}) => {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <motion.div
      key={tabKey}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
