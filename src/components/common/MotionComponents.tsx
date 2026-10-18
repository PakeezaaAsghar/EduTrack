import React from 'react';
import { motion, useScroll, useSpring, HTMLMotionProps } from 'motion/react';

// Top Scroll Progress Bar
export const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 origin-left shadow-xs"
      style={{ scaleX }}
    />
  );
};

// Reveal on Scroll Wrapper (Fade + Slide)
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
  distance = 28,
  className = '',
  once = true,
  ...props
}) => {
  const getInitialPosition = () => {
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
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for Grids
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

// Stagger Item (Child of StaggerContainer)
export const StaggerItem: React.FC<HTMLMotionProps<'div'>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
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

// Interactive Animated Card with Hover Lift, Border Glow & Scale
interface InteractiveCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  scale?: number;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  hoverY = -6,
  scale = 1.012,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: hoverY, 
        scale,
        transition: { duration: 0.22, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      className={`transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Interactive CTA Button with Spring Hover & Tap Feedback
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
        scale: 1.035, 
        y: -1.5,
        transition: { type: 'spring', stiffness: 400, damping: 15 }
      }}
      whileTap={{ 
        scale: 0.96,
        transition: { type: 'spring', stiffness: 500, damping: 20 }
      }}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Floating FloatingBadge for ambient movement
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
  duration = 4.5,
  yOffset = 8,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -yOffset, 0] 
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
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
