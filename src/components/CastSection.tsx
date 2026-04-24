import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { MagneticButton } from './MagneticButton';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CastCard = ({ 
  name, 
  role, 
  description,
  image, 
  index 
}: { 
  name: string, 
  role: string, 
  description: string,
  image: string,
  index: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -20;
    const rotateY = ((x - centerX) / centerX) * 20;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "cast-card relative rounded-xl overflow-hidden aspect-[2/3] w-full max-w-[300px] bg-neutral-900 transition-all duration-300 ease-out opacity-0 translate-y-[50px]",
        "group cursor-pointer hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
      )}
    >
      {/* Base border */}
      <div className="absolute inset-0 rounded-xl border border-neutral-800 z-10 transition-colors group-hover:border-transparent pointer-events-none" />

      {/* Dynamic Glowing Edge */}
      <div 
        className="absolute inset-0 rounded-xl z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(250, 50, 50, 0.8), transparent 50%)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          padding: '2px'
        }}
      />

      {/* Dynamic Glow (Inner) */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 mix-blend-screen z-10"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(220, 38, 38, 0.15), transparent 40%)`
        }}
      />
      
      {/* Image Plate */}
      <div className="absolute inset-x-0 top-0 bottom-1/3 bg-neutral-800">
         <img src={image} referrerPolicy="no-referrer" alt={name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
         <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
      </div>

      {/* Info Plate */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-wider">{name}</h3>
        <div className="group/tooltip relative w-fit">
          <p className="text-red-500 text-sm font-mono tracking-widest cursor-help inline-block border-b border-dashed border-red-500/50 hover:border-red-500 transition-colors uppercase pb-0.5">{role}</p>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 w-56 opacity-0 group-hover/tooltip:opacity-100 translate-y-2 group-hover/tooltip:translate-y-0 transition-all duration-300 pointer-events-none z-30">
            <div className="bg-[#0a0a0a]/90 border border-neutral-800 text-neutral-300 text-xs leading-relaxed p-3 rounded-md shadow-2xl backdrop-blur-md shadow-red-900/10 font-sans normal-case">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CastSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.cast-card', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const cast = [
    { name: "Miles Morales", role: "Spider-Man", description: "The teenager from Brooklyn bitten by a radioactive spider.", image: "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=1000&auto=format&fit=crop" },
    { name: "Gwen Stacy", role: "Ghost-Spider", description: "Drummer, multidimensional traveler, and skilled fighter.", image: "https://images.unsplash.com/photo-1516528387618-afa90b13e000?q=80&w=1000&auto=format&fit=crop" },
    { name: "Miguel O'Hara", role: "Spider-Man 2099", description: "Leader of the Spider-Society, hailing from Nueva York.", image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop" },
    { name: "Peter B. Parker", role: "Spider-Man", description: "A slightly jaded but experienced mentor figure.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop" },
    { name: "Hobie Brown", role: "Spider-Punk", description: "An anarchist, anti-establishment Spider-Man with a guitar.", image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1000&auto=format&fit=crop" }
  ];

  return (
    <section ref={containerRef} className="relative w-full min-h-screen py-32 px-6 lg:px-24 flex flex-col items-center bg-gradient-to-b from-transparent via-[#050510]/80 to-[#050510] z-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase">
           Across the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Multiverse</span>
        </h2>
        <p className="mt-4 text-neutral-400 font-mono tracking-widest text-sm uppercase">Enter the Cast</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-20 w-full max-w-6xl">
        {cast.map((c, i) => (
           <CastCard key={i} {...c} index={i} />
        ))}
      </div>

      <div className="mt-40 mb-20 flex justify-center w-full">
         <MagneticButton className="text-xl px-12 py-6">
           Secure Your Ticket
         </MagneticButton>
      </div>
    </section>
  );
};
