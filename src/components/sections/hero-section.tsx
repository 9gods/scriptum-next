"use client";

import { Github } from "lucide-react";
import { AnimatedPen } from "../animations/animated-pen";
import { FlickeringParticles } from "../animations/flickering-particles";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { AnimatedText } from "../animations/animated-text";

export const HeroSection = () => {
  const authors = [
    "Giovane Comelli",
    "Rafael Gonçalves",
    "Eduarda Kacprzak",
    "Giullia Villanova",
    "Maria Eduarda Kolitski",
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <ModeToggle className="absolute top-4 right-4" />
      <FlickeringParticles className="absolute inset-0 invert dark:invert-0 dark:opacity-10 opacity-20" />
      {/*
      <h1 className="absolute top-1/6 left-1/6 -skew-10 select-none font-styled text-[22vw] leading-none">
        Scriptum
      </h1> */}
      <div className="absolute top-1/6 left-1/6 -skew-10">
        <AnimatedText />
      </div>

      <header className="absolute bottom-0 left-0 m-24 max-w-md rounded border bg-muted p-6 shadow-2xl font-mono">
        <p>
          Boas-vindas ao <strong>Scriptum</strong>, um lugar onde você pode
          criar e desenvolver suas ideias.
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button type="button">Entrar no Scriptum</Button>

          <Button variant="ghost" asChild>
            <a
              href="https://github.com/9gods/scriptum-next"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </Button>
        </div>
      </header>

      <footer className="absolute bottom-0 right-0 m-24 max-w-md rounded border bg-muted p-6 shadow-2xl font-mono">
        <h2 className="mb-1 font-bold">Autores</h2>
        <ul className="space-y-0.5">
          {authors.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </footer>

      <AnimatedPen />
    </section>
  );
};
