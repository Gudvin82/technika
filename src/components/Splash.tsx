import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const theme = useStore((s) => s.theme);
  const isNeon = theme === 'neon';
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setCanSkip(true), 1000);
    const autoTimer = setTimeout(onComplete, 4500);
    
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(autoTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (canSkip) {
      onComplete();
    }
  };

  // Particles for 3D effect
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 2,
  }));

  // Circuit lines for tech effect
  const circuitLines = [
    { x1: '10%', y1: '20%', x2: '30%', y2: '20%', delay: 0 },
    { x1: '30%', y1: '20%', x2: '30%', y2: '40%', delay: 0.2 },
    { x1: '70%', y1: '30%', x2: '90%', y2: '30%', delay: 0.4 },
    { x1: '70%', y1: '30%', x2: '70%', y2: '50%', delay: 0.6 },
    { x1: '20%', y1: '70%', x2: '40%', y2: '70%', delay: 0.8 },
    { x1: '60%', y1: '80%', x2: '85%', y2: '80%', delay: 1 },
  ];

  return (
    <motion.div
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-center z-50 cursor-pointer overflow-hidden',
        isNeon
          ? 'bg-gradient-to-br from-slate-950 via-purple-950/90 to-slate-950'
          : 'bg-gradient-to-br from-slate-900 via-blue-900/80 to-slate-900'
      )}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleSkip}
    >
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.1), transparent)',
            height: '200%',
          }}
          animate={{ y: ['-50%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Circuit lines animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {circuitLines.map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={isNeon ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.4)'}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{ 
              delay: line.delay + 1, 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
          />
        ))}
        {circuitLines.map((line, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={line.x2}
            cy={line.y2}
            r="4"
            fill={isNeon ? 'rgba(6, 182, 212, 0.6)' : 'rgba(59, 130, 246, 0.6)'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ 
              delay: line.delay + 1.5, 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 3.5 
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={cn(
            'absolute rounded-full',
            isNeon ? 'bg-cyan-400' : 'bg-blue-400'
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: isNeon 
              ? `0 0 ${p.size * 3}px rgba(6, 182, 212, 0.8)` 
              : `0 0 ${p.size * 3}px rgba(59, 130, 246, 0.8)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Main glow orbs */}
      <motion.div
        className={cn(
          'absolute w-96 h-96 rounded-full blur-3xl',
          isNeon ? 'bg-cyan-500/30' : 'bg-blue-500/30'
        )}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: '10%', left: '0%' }}
      />
      <motion.div
        className={cn(
          'absolute w-80 h-80 rounded-full blur-3xl',
          isNeon ? 'bg-purple-500/30' : 'bg-indigo-500/30'
        )}
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        style={{ bottom: '10%', right: '0%' }}
      />
      <motion.div
        className={cn(
          'absolute w-64 h-64 rounded-full blur-3xl',
          isNeon ? 'bg-pink-500/20' : 'bg-purple-500/20'
        )}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ top: '40%', left: '30%' }}
      />

      {/* Central logo area */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* 3D Hexagon with glow */}
        <motion.div
          className="relative mb-6"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ perspective: 1000 }}
        >
          {/* Outer ring */}
          <motion.div
            className={cn(
              'w-28 h-28 rounded-3xl flex items-center justify-center relative',
              isNeon
                ? 'bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500'
                : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600'
            )}
            style={{
              boxShadow: isNeon
                ? '0 0 60px rgba(6, 182, 212, 0.6), 0 0 100px rgba(147, 51, 234, 0.4), inset 0 0 30px rgba(255,255,255,0.1)'
                : '0 0 60px rgba(59, 130, 246, 0.5), 0 0 100px rgba(99, 102, 241, 0.3)',
            }}
            animate={{
              boxShadow: isNeon
                ? [
                    '0 0 60px rgba(6, 182, 212, 0.6), 0 0 100px rgba(147, 51, 234, 0.4)',
                    '0 0 80px rgba(6, 182, 212, 0.8), 0 0 120px rgba(147, 51, 234, 0.6)',
                    '0 0 60px rgba(6, 182, 212, 0.6), 0 0 100px rgba(147, 51, 234, 0.4)',
                  ]
                : [
                    '0 0 60px rgba(59, 130, 246, 0.5), 0 0 100px rgba(99, 102, 241, 0.3)',
                    '0 0 80px rgba(59, 130, 246, 0.7), 0 0 120px rgba(99, 102, 241, 0.5)',
                    '0 0 60px rgba(59, 130, 246, 0.5), 0 0 100px rgba(99, 102, 241, 0.3)',
                  ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Inner icon */}
            <motion.span 
              className="text-5xl relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ⚡
            </motion.span>
            
            {/* Rotating ring effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-white/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute -inset-2 rounded-3xl border border-white/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
          
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute w-3 h-3 rounded-full',
                isNeon ? 'bg-cyan-400' : 'bg-blue-400'
              )}
              style={{
                top: '50%',
                left: '50%',
                marginTop: -6,
                marginLeft: -6,
                boxShadow: isNeon 
                  ? '0 0 10px rgba(6, 182, 212, 0.8)' 
                  : '0 0 10px rgba(59, 130, 246, 0.8)',
              }}
              animate={{
                x: [
                  Math.cos((i * 2 * Math.PI) / 3) * 60,
                  Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 60,
                  Math.cos((i * 2 * Math.PI) / 3 + Math.PI * 2) * 60,
                ],
                y: [
                  Math.sin((i * 2 * Math.PI) / 3) * 60,
                  Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 60,
                  Math.sin((i * 2 * Math.PI) / 3 + Math.PI * 2) * 60,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Brand name with 3D effect */}
        <motion.div
          className="relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl font-black tracking-tight text-white relative z-10"
            style={{
              textShadow: isNeon
                ? '0 0 40px rgba(6, 182, 212, 0.8), 0 0 80px rgba(147, 51, 234, 0.5), 0 4px 0 rgba(0,0,0,0.3)'
                : '0 0 40px rgba(59, 130, 246, 0.6), 0 4px 0 rgba(0,0,0,0.3)',
            }}
          >
            TECH<span className={isNeon ? 'text-cyan-400' : 'text-blue-400'}>ZONE</span>
          </motion.h1>
          
          {/* Reflection */}
          <div 
            className="absolute top-full left-0 right-0 text-5xl font-black tracking-tight opacity-20 transform scale-y-[-1]"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'blur(1px)',
            }}
          >
            TECHZONE
          </div>
        </motion.div>

        {/* Animated neon line with scanner effect */}
        <motion.div
          className="relative mt-4 h-1.5 overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 220 }}
          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              isNeon
                ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500'
            )}
            style={{
              boxShadow: isNeon
                ? '0 0 20px rgba(6, 182, 212, 0.8), 0 0 40px rgba(147, 51, 234, 0.6)'
                : '0 0 20px rgba(59, 130, 246, 0.6)',
            }}
          />
          {/* Scanner effect */}
          <motion.div
            className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            animate={{ x: [-50, 270] }}
            transition={{ delay: 1.3, duration: 1, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>

        {/* Slogan with typing effect */}
        <motion.div
          className="mt-6 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.p
            className={cn(
              'text-lg font-medium tracking-wide',
              isNeon ? 'text-cyan-300/80' : 'text-blue-300/80'
            )}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Техника для победителей
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Skeleton preview cards - more realistic */}
      <motion.div
        className="mt-16 flex gap-4 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'w-24 h-36 rounded-2xl overflow-hidden',
              isNeon ? 'bg-white/5' : 'bg-white/10'
            )}
            animate={{ 
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
          >
            {/* Shimmer effect */}
            <div className="relative w-full h-full">
              <div className={cn('w-full h-20', isNeon ? 'bg-white/5' : 'bg-white/10')} />
              <div className="p-2 space-y-2">
                <div className={cn('h-2 rounded', isNeon ? 'bg-white/10' : 'bg-white/15')} />
                <div className={cn('h-2 w-2/3 rounded', isNeon ? 'bg-white/10' : 'bg-white/15')} />
                <div className={cn('h-4 rounded-lg mt-2', isNeon ? 'bg-white/5' : 'bg-white/10')} />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="mt-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isNeon 
                ? i === 0 ? 'bg-cyan-400' : i === 1 ? 'bg-purple-400' : 'bg-pink-400'
                : 'bg-blue-400'
            )}
            style={{
              boxShadow: isNeon
                ? i === 0 
                  ? '0 0 10px rgba(6, 182, 212, 0.8)' 
                  : i === 1 
                  ? '0 0 10px rgba(147, 51, 234, 0.8)' 
                  : '0 0 10px rgba(236, 72, 153, 0.8)'
                : '0 0 10px rgba(59, 130, 246, 0.6)',
            }}
            animate={{ 
              scale: [1, 1.5, 1], 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
          />
        ))}
      </motion.div>

      {/* Skip hint */}
      <motion.p
        className="absolute bottom-10 text-white/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: canSkip ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        Нажмите, чтобы продолжить
      </motion.p>
    </motion.div>
  );
}
