import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

export const MagneticButton = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      whileTap={{ scale: 0.95 }}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative rounded-full px-8 py-4 font-bold text-white uppercase tracking-widest overflow-hidden group",
        "border border-red-500/50 shadow-[0_0_20px_rgba(220,38,38,0.4)]",
        className
      )}
    >
      <span className="relative z-10 pointer-events-none drop-shadow-md">{children}</span>
      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-40 transition-opacity blur-md" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-900/20 rounded-full backdrop-blur-sm" />
    </motion.button>
  );
};
