"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export const AnimatedText = () => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const x = useSpring(rawX, { stiffness: 60, damping: 20 });
  const y = useSpring(rawX, { stiffness: 60, damping: 20 });

  const max = 120;
  const rotate = useTransform(x, [-max, max], [5, -5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * max * 0.2;
      const offsetY = (e.clientY / innerHeight - 0.5) * max * 0.2;
      rawX.set(offsetX);
      rawY.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY]);

  return (
    <motion.h1
      style={{ x, y, rotate }}
      className=" select-none font-styled text-[22vw] leading-none"
    >
      Scriptum
    </motion.h1>
  );
};
