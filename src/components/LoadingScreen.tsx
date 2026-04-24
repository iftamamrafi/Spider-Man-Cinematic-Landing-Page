import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'drawing' | 'filling' | 'glitching' | 'bursting'>('drawing');
  const [dimension, setDimension] = useState('EARTH-???');

  useEffect(() => {
    // 1. Draw for 2 seconds
    // 2. Fill for 0.6 seconds
    // 3. Glitch out for 0.4 seconds
    // 4. Burst to end
    const t1 = setTimeout(() => setPhase('filling'), 2000);
    const t2 = setTimeout(() => setPhase('glitching'), 2600);
    const t3 = setTimeout(() => setPhase('bursting'), 3200);

    const dims = ['EARTH-65', 'EARTH-928', 'EARTH-42', 'EARTH-50101', 'EARTH-138', 'EARTH-199999', 'EARTH-8311'];
    
    // Rapidly change the dimension text while loading
    const textInterval = setInterval(() => {
      setDimension(dims[Math.floor(Math.random() * dims.length)]);
    }, 60);

    // Lock the dimension right before the burst
    const t4 = setTimeout(() => {
      clearInterval(textInterval);
      setDimension('EARTH-1610');
    }, 2600);

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      clearTimeout(t3); 
      clearTimeout(t4);
      clearInterval(textInterval); 
    };
  }, []);

  const spiderPaths = [
    // 2099 Skull Head
    "M50,15 L58,12 L65,18 L62,28 L55,35 L50,38 L45,35 L38,28 L35,18 L42,12 Z",
    // Angry Eye Holes
    "M45,20 L48,22 L45,28 L38,25 Z",
    "M55,20 L52,22 L55,28 L62,25 Z",

    // Sharp Thorax / Upper Body
    "M50,40 L60,45 L55,55 L50,60 L45,55 L40,45 Z",

    // Long Abdomen
    "M50,62 L58,70 L54,95 L50,100 L46,95 L42,70 Z",

    // Legs - Sharp, jagged, reaching upward and outward like 2099
    // Top Left
    "M42,45 L25,25 L10,35 L14,38 L25,30 L40,48 Z",
    // Upper Middle Left
    "M45,55 L20,50 L5,65 L8,68 L22,55 L45,58 Z",
    // Lower Middle Left (pointing down more)
    "M46,65 L25,80 L18,100 L22,102 L28,85 L48,70 Z",
    // Bottom Left
    "M48,75 L35,95 L30,120 L35,122 L40,98 L50,80 Z",

    // Top Right
    "M58,45 L75,25 L90,35 L86,38 L75,30 L60,48 Z",
    // Upper Middle Right
    "M55,55 L80,50 L95,65 L92,68 L78,55 L55,58 Z",
    // Lower Middle Right
    "M54,65 L75,80 L82,100 L78,102 L72,85 L52,70 Z",
    // Bottom Right
    "M52,75 L65,95 L70,120 L65,122 L60,98 L50,80 Z"
  ];

  const getGlitchTransform = () => {
    if (phase === 'glitching') {
      return {
        x: [0, -10, 10, -5, 5, -15, 15, 0],
        y: [0, 5, -5, 10, -10, 5, -5, 0],
        scale: [1, 1.1, 0.9, 1.05, 0.95, 1.1, 0.9, 1],
        filter: [
          'drop-shadow(0 0 15px rgba(220,38,38,0.5))',
          'drop-shadow(-10px 0 0 rgba(0, 255, 255, 0.8)) drop-shadow(10px 0 0 rgba(255, 0, 0, 0.8))',
          'drop-shadow(10px 5px 0 rgba(0, 255, 255, 0.8)) drop-shadow(-10px -5px 0 rgba(255, 0, 0, 0.8))',
          'drop-shadow(0 0 15px rgba(220,38,38,0.5))'
        ]
      };
    }
    if (phase === 'bursting') {
      return { 
        scale: 60,
        filter: 'blur(20px)',
        opacity: 0,
        x: 0,
        y: 0
      };
    }
    return { scale: 1, opacity: 1, filter: 'drop-shadow(0 0 25px rgba(220,38,38,0.7))', x: 0, y: 0 };
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#020205] flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
      animate={{ opacity: phase === 'bursting' ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeIn", delay: 0.2 }}
      onAnimationComplete={(def) => {
        if (def && (def as any).opacity === 0) onComplete();
      }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={getGlitchTransform()}
        transition={
          phase === 'glitching' 
            ? { duration: 0.4, repeat: Infinity, ease: "linear" } 
            : { duration: 1.2, ease: [0.22, 1, 0.36, 1] } // smooth explosive ease for burst
        }
      >
        <svg viewBox="0 0 100 130" className="w-48 h-48 md:w-72 md:h-72 text-red-600">
          {spiderPaths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="transparent"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, fill: "rgba(220, 38, 38, 0)" }}
              animate={{ 
                pathLength: 1,
                fill: phase === 'filling' || phase === 'glitching' || phase === 'bursting' ? "rgba(220, 38, 38, 1)" : "rgba(220, 38, 38, 0)",
                stroke: phase === 'filling' || phase === 'glitching' || phase === 'bursting' ? "rgba(220, 38, 38, 0)" : "rgba(220, 38, 38, 1)"
              }}
              transition={{
                pathLength: { duration: 2.0, ease: "easeInOut", delay: i * 0.08 },
                fill: { duration: 0.5, ease: "easeOut" },
                stroke: { duration: 0.5, ease: "easeOut" }
              }}
            />
          ))}
        </svg>
      </motion.div>

      <motion.div 
        className="absolute bottom-24 flex flex-col items-center gap-2"
        animate={{ opacity: phase === 'bursting' ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="text-red-500 font-mono text-xs md:text-sm tracking-[0.4em] uppercase"
          animate={{ opacity: phase === 'glitching' ? [0, 1, 0, 1] : [0.3, 1, 0.3] }}
          transition={{ 
              opacity: phase === 'glitching'
                ? { duration: 0.2, repeat: Infinity }
                : { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
          }}
        >
          {phase === 'bursting' || phase === 'glitching' ? 'DIMENSION LOCKED' : 'LOCATING DIMENSION...'}
        </motion.div>
        
        <motion.div
           className="text-white font-mono text-lg md:text-xl md:text-2xl font-bold tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
           animate={phase === 'glitching' ? { x: [-2, 2, -1, 1, 0], y: [-1, 1, -2, 2, 0] } : {}}
           transition={{ duration: 0.1, repeat: Infinity }}
        >
          {dimension}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
