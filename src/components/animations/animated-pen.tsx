"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

export const AnimatedPen = () => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 80, damping: 18 });
  const y = useSpring(rawY, { stiffness: 80, damping: 18 });

  const max = 120;
  const rotate = useTransform(x, [-max, max], [8, -8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * max * 1;
      const offsetY = (e.clientY / innerHeight - 0.5) * max * 1;
      rawX.set(offsetX);
      rawY.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ x, y, rotate }}
    >
      <Image
        src="/pen_asset.png"
        alt="Caneta clássica preta com ponta prateada"
        width={500}
        height={500}
        priority
        className="rotate-180 z-10 scale-150 select-none absolute drop-shadow-2xl drop-shadow-black/50 dark:drop-shadow-black -bottom-1/3"
      />
    </motion.div>
  );
};
