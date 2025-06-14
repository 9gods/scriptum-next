"use client";

import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

export const FlickeringParticles = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const squareSize = 4;
  const gridGap = 6;
  const flickerChance = 0.3;
  const color = "#ffffff";
  const maxOpacity = 1;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  const toRGBA = useCallback((c: string) => {
    const ctx = document.createElement("canvas").getContext("2d")!;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r},${g},${b},`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const ctx = canvas.getContext("2d")!;
    const rgbaBase = toRGBA(color);

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.floor(width / (squareSize + gridGap));
      rows = Math.floor(height / (squareSize + gridGap));
      squares = new Float32Array(cols * rows).map(
        () => Math.random() * maxOpacity,
      );
    };

    let cols = 0,
      rows = 0,
      squares = new Float32Array(0);
    resize();
    new ResizeObserver(resize).observe(container);

    let last = 0;
    const draw = (t: number) => {
      if (!isInView) return;
      const dt = (t - last) / 1000;
      last = t;

      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * dt)
          squares[i] = Math.random() * maxOpacity;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const alpha = squares[i * rows + j];
          ctx.fillStyle = `${rgbaBase}${alpha})`;
          ctx.fillRect(
            i * (squareSize + gridGap) * dpr,
            j * (squareSize + gridGap) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          );
        }
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }, [squareSize, gridGap, flickerChance, color, maxOpacity, isInView, toRGBA]);

  return (
    <div
      ref={containerRef}
      className={clsx("pointer-events-none absolute inset-0", className)}
      {...props}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};
