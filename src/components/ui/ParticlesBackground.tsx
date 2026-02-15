"use client";

import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="fixed inset-0 z-0 pointer-events-none hidden md:block" // Solo visible en PC
      init={particlesInit}
      options={{
        fullScreen: { enable: false }, // Para que respete el contenedor
        background: {
          color: { value: "transparent" },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble", // Efecto sutil al pasar el mouse
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 200,
              duration: 2,
              opacity: 0.8,
              size: 5,
            },
          },
        },
        particles: {
          color: {
            value: ["#ec4899", "#fbbf24", "#f472b6"], // Rosas y Dorado
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce", // Rebotan suavemente en los bordes
            },
            random: true,
            speed: 0.5, // Movimiento muy lento y relajante
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 40, // Cantidad de estrellitas
          },
          opacity: {
            value: { min: 0.1, max: 0.5 }, // Transparencia variable
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
            }
          },
          shape: {
            type: ["circle", "star"], // Mezcla de círculos y estrellas
          },
          size: {
            value: { min: 1, max: 4 }, // Tamaños variados
          },
        },
        detectRetina: true,
      }}
    />
  );
}