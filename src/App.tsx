import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion, useTransform, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import Lenis from 'lenis';
import { SceneContent } from './components/ThreeScene';
import { CastSection } from './components/CastSection';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const scrollRef = useRef<number>(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only pass the first section scroll progress down to the 3D scene (e.g. 0 to 0.5 overall)
    // We want the dolly shot to finish by the time they hit the Cast Section
    scrollRef.current = Math.min(1, latest * 2);
  });

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
      return;
    }
    
    document.body.style.overflow = '';
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    setLenis(l);
    return () => l.destroy();
  }, [isLoading]);

  useEffect(() => {
    if (!lenis) return;
    const animate = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [lenis]);

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const blurValue = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(10px)"]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="relative w-full bg-[#050510] font-sans selection:bg-red-500 selection:text-white" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s ease-in' }}>
        {/* 3D Background - Fixed underneath */}
      <div className="fixed inset-0 z-0">
        <Canvas gl={{ antialias: false, alpha: false }} dpr={[1, 1.5]}>
          <color attach="background" args={['#050510']} />
          <SceneContent scrollRef={scrollRef} />
          
          <EffectComposer>
             <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
             <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002] as any} opacity={0.5} />
             <Noise premultiply blendFunction={BlendFunction.ADD} opacity={0.15} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pointer-events-none z-10 px-4">
        <motion.div 
           style={{ opacity: titleOpacity, y: titleY, scale: titleScale, filter: blurValue }}
           className="text-center flex flex-col items-center"
        >
          <motion.h1 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
             className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 uppercase tracking-tighter"
          >
            SPIDER-MAN
          </motion.h1>
          <motion.h2
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.8 }}
             className="text-red-500 text-xl md:text-3xl tracking-[0.3em] uppercase font-bold mt-2"
          >
            Into the Web
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-neutral-400 mt-8 font-mono text-sm tracking-widest max-w-md"
          >
            A CINEMATIC WEBGL EXPERIENCE
          </motion.p>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 2, duration: 1 }}
           style={{ opacity: titleOpacity }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
           <span className="text-white text-xs font-mono tracking-widest uppercase">Scroll</span>
           <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent overflow-hidden">
             <motion.div
                animate={{ y: [0, 48] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-1/2 bg-red-500"
             />
           </div>
        </motion.div>
      </section>

      {/* Fill space so scrolling happens */}
      <div className="h-[50vh] pointer-events-none z-10" />

      {/* Cast Section */}
      <CastSection />

      {/* Footer */}
      <footer className="relative z-10 w-full pt-32 pb-12 bg-[#020205] border-t border-neutral-900 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative flex flex-col items-center w-full max-w-5xl px-6"
        >
          {/* Subtle bg glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-40 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-12">
             <div className="w-16 md:w-32 h-[1px] bg-gradient-to-r from-transparent to-red-500/50" />
             <p className="text-neutral-500 font-mono tracking-widest text-xs md:text-sm uppercase z-10">
               End of the Line
             </p>
             <div className="w-16 md:w-32 h-[1px] bg-gradient-to-l from-transparent to-red-500/50" />
          </div>
          
          <div className="z-10 flex flex-col items-center gap-3 mb-20 text-center">
            <p className="text-neutral-400 font-sans tracking-[0.2em] uppercase text-xs">
              Designed & Developed by
            </p>
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0px 0px 4px rgba(220,38,38,0.2))",
                  "drop-shadow(0px 0px 16px rgba(220,38,38,0.8))",
                  "drop-shadow(0px 0px 4px rgba(220,38,38,0.2))"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="font-black tracking-[0.2em] uppercase text-2xl md:text-4xl mt-2"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-800">
                Iftamam Mortaza Rafi
              </span>
            </motion.div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mb-8" />

          <div className="w-full flex flex-col md:flex-row items-center justify-between z-10 text-neutral-600 font-mono tracking-widest text-[10px] md:text-xs uppercase gap-4">
            <p>© {new Date().getFullYear()} Spider-Man Experience</p>
            <p>All Rights Reserved.</p>
          </div>
        </motion.div>
      </footer>
    </div>
    </>
  );
}

export default App;
