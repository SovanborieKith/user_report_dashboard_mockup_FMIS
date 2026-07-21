import { useEffect, useRef } from "react";

type Theme = "light" | "dark";

interface ParticleBackgroundProps {
  theme?: Theme;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  depth: number;
  pulse: number;
  pulseSpeed: number;
}

const CONFIG = {
  desktopCount: 118,
  mobileCount: 40,
  maxLinkDistance: 165,
  mouseLinkDistance: 145,
  baseSpeed: 0.52,
  maxParticles: 165,
  clickParticles: 8,
};

const THEME_COLORS: Record<
  Theme,
  {
    particle: string;
    line: string;
    glow: string;
  }
> = {
  light: {
    particle: "2, 132, 199",
    line: "14, 165, 233",
    glow: "3, 105, 161",
  },
  dark: {
    particle: "255, 255, 255",
    line: "14, 165, 233",
    glow: "3, 105, 161",
  },
};

function createParticle(
  width: number,
  height: number,
  x?: number,
  y?: number,
): Particle {
  const depth = Math.random() * 0.8 + 0.5;
  const angle = Math.random() * Math.PI * 2;
  const speed = CONFIG.baseSpeed * depth * (0.55 + Math.random() * 0.75);

  return {
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: 0.7 + depth * 1.25,
    opacity: 0.7 + depth * 0.7,
    depth,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.01 + Math.random() * 0.008,
  };
}

export default function ParticleBackground({
  theme = "light",
  className,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const themeRef = useRef<Theme>(theme);

  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let lastFrameTime = performance.now();
    let isVisible = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const targetParticleCount = () =>
      width < 768 ? CONFIG.mobileCount : CONFIG.desktopCount;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const desiredCount = targetParticleCount();

      if (particles.length < desiredCount) {
        particles.push(
          ...Array.from(
            { length: desiredCount - particles.length },
            () => createParticle(width, height),
          ),
        );
      } else if (particles.length > desiredCount) {
        particles = particles.slice(0, desiredCount);
      }

      for (const particle of particles) {
        particle.x = Math.min(Math.max(particle.x, 0), width);
        particle.y = Math.min(Math.max(particle.y, 0), height);
      }
    };

    particles = Array.from(
      { length: targetParticleCount() },
      () => createParticle(width, height),
    );

    resize();

    const draw = (now: number) => {
      const delta = Math.min((now - lastFrameTime) / 16, 2);
      lastFrameTime = now;

      context.clearRect(0, 0, width, height);

      const colors = THEME_COLORS[themeRef.current];
      const reducedMotion = prefersReducedMotion.matches;

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx * delta;
          particle.y += particle.vy * delta;
          particle.pulse += particle.pulseSpeed * delta;
        }

        // Soft wrapping looks smoother than bouncing at the viewport edges.
        const margin = 20;
        if (particle.x < -margin) particle.x = width + margin;
        if (particle.x > width + margin) particle.x = -margin;
        if (particle.y < -margin) particle.y = height + margin;
        if (particle.y > height + margin) particle.y = -margin;

        const pulseOpacity =
          particle.opacity * (0.86 + Math.sin(particle.pulse) * 0.14);

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(${colors.particle}, ${pulseOpacity})`;
        context.shadowBlur = 7 * particle.depth;
        context.shadowColor = `rgba(${colors.glow}, ${0.16 * particle.depth
          })`;
        context.fill();
      }

      context.shadowBlur = 0;

      // Draw links only between nearby particles.
      for (let i = 0; i < particles.length; i += 1) {
        const current = particles[i];

        for (let j = i + 1; j < particles.length; j += 1) {
          const next = particles[j];
          const dx = current.x - next.x;
          const dy = current.y - next.y;
          const distanceSquared = dx * dx + dy * dy;
          const maxDistanceSquared =
            CONFIG.maxLinkDistance * CONFIG.maxLinkDistance;

          if (distanceSquared >= maxDistanceSquared) continue;

          const distance = Math.sqrt(distanceSquared);
          const depth = Math.min(current.depth, next.depth);
          const alpha =
            (1 - distance / CONFIG.maxLinkDistance) *
            0.13 *
            depth;

          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(next.x, next.y);
          context.strokeStyle = `rgba(${colors.line}, ${alpha})`;
          context.lineWidth = 0.55;
          context.stroke();
        }

        if (mouseRef.current) {
          const dx = current.x - mouseRef.current.x;
          const dy = current.y - mouseRef.current.y;
          const distanceSquared = dx * dx + dy * dy;
          const maxDistanceSquared =
            CONFIG.mouseLinkDistance * CONFIG.mouseLinkDistance;

          if (distanceSquared < maxDistanceSquared) {
            const distance = Math.sqrt(distanceSquared);
            const alpha =
              (1 - distance / CONFIG.mouseLinkDistance) *
              0.24 *
              current.depth;

            context.beginPath();
            context.moveTo(current.x, current.y);
            context.lineTo(mouseRef.current.x, mouseRef.current.y);
            context.strokeStyle = `rgba(${colors.line}, ${alpha})`;
            context.lineWidth = 0.65;
            context.stroke();
          }
        }
      }

      if (isVisible) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const startAnimation = () => {
      cancelAnimationFrame(animationRef.current);
      lastFrameTime = performance.now();
      animationRef.current = requestAnimationFrame(draw);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = null;
    };

    const onClick = (event: MouseEvent) => {
      if (prefersReducedMotion.matches) return;
      if (particles.length >= CONFIG.maxParticles) return;

      const amount = Math.min(
        CONFIG.clickParticles,
        CONFIG.maxParticles - particles.length,
      );

      particles.push(
        ...Array.from(
          { length: amount },
          () => createParticle(width, height, event.clientX, event.clientY),
        ),
      );
    };

    const onVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";

      if (isVisible) {
        startAnimation();
      } else {
        cancelAnimationFrame(animationRef.current);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);

    startAnimation();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: theme === "dark" ? 0.8 : 0.48,
        transition: "opacity 300ms ease",
      }}
    />
  );
}