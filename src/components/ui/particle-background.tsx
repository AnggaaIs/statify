"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  pulse: number;
}

interface ParticleBackgroundProps {
  isPlaying?: boolean;
  intensity?: number;
}

export function ParticleBackground({
  isPlaying = true,
  intensity = 1,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(34, 197, 94, 0.4)", // green-500
      "rgba(59, 130, 246, 0.4)", // blue-500
      "rgba(168, 85, 247, 0.4)", // purple-500
      "rgba(249, 115, 22, 0.4)", // orange-500
      "rgba(236, 72, 153, 0.4)", // pink-500
      "rgba(6, 182, 212, 0.4)", // cyan-500
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.0 * intensity,
      vy: (Math.random() - 0.5) * 1.0 * intensity,
      size: Math.random() * 3 + 1 * intensity,
      opacity: Math.random() * 0.6 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
    });

    const initParticles = () => {
      particlesRef.current = [];
      const baseCount = Math.floor((canvas.width * canvas.height) / 15000);
      const particleCount = Math.min(
        baseCount * (isPlaying ? 1.5 : 0.5),
        isPlaying ? 100 : 50
      );

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle());
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Enhanced pulsing animation when music is playing
      if (isPlaying) {
        particle.pulse += 0.05;
        particle.opacity = 0.3 + Math.sin(particle.pulse) * 0.3;
        particle.size = (1 + Math.sin(particle.pulse * 0.5) * 0.5) * intensity;
      } else {
        particle.opacity +=
          Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.02;
        particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Enhanced glow effect when playing
      if (isPlaying) {
        ctx.shadowBlur = 15 * intensity;
        ctx.shadowColor = particle.color;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawConnections = () => {
      const particles = particlesRef.current;
      ctx.save();

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = isPlaying ? 200 : 150;
          if (distance < maxDistance) {
            const opacity = ((maxDistance - distance) / maxDistance) * 0.2;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = isPlaying
              ? "rgba(34, 197, 94, 0.3)"
              : "rgba(34, 197, 94, 0.1)";
            ctx.lineWidth = isPlaying ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        updateParticle(particle);
        drawParticle(particle);
      });

      if (isPlaying) {
        drawConnections();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, isPlaying, intensity]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-1]"
      style={{ background: "transparent" }}
    />
  );
}
