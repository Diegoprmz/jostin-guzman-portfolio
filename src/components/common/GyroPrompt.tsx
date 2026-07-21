"use client";

import { useEffect, useState } from "react";
import { enableGyro, needsGyroPermission } from "@/lib/tilt";

/**
 * iOS gates the motion sensor behind a user gesture, so on phones/tablets that
 * require it we ask once, right after the intro: "activate the full
 * experience". Accepting wires the gyroscope into every parallax layer.
 */
export function GyroPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("gyroAsked")) return;
    } catch {
      /* ignore */
    }
    if (!needsGyroPermission()) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    // let the intro curtain play first
    const t = window.setTimeout(() => setShow(true), 2400);
    return () => window.clearTimeout(t);
  }, []);

  const remember = () => {
    try {
      sessionStorage.setItem("gyroAsked", "1");
    } catch {
      /* ignore */
    }
  };

  // requestPermission must run inside the gesture — call it first.
  const accept = () => {
    void enableGyro();
    remember();
    setShow(false);
  };
  const dismiss = () => {
    remember();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-5 sm:items-center">
      <div className="absolute inset-0 bg-black/55" onClick={dismiss} />
      <div
        className="relative w-full max-w-sm rounded-card border border-white/10 p-6 shadow-elevated"
        style={{
          backdropFilter: "blur(28px) saturate(1.1)",
          WebkitBackdropFilter: "blur(28px) saturate(1.1)",
          background: "rgba(255,255,255,0.06)",
          animation: "card-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          Experiencia completa
        </span>
        <h2 className="mt-2 text-lg font-light text-foreground">
          Activa el movimiento
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Permite el sensor de movimiento para que las escenas reaccionen al
          inclinar tu dispositivo.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={accept}
            className="flex-1 rounded-btn bg-accent px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Aceptar
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-btn border border-white/15 px-4 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
}
