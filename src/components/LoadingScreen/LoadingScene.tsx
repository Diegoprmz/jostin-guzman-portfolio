"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import gsap from "gsap";
import { LogoMark } from "@/components/common/LogoMark";
import { doorVertexShader, doorFragmentShader } from "./doorShader";

/**
 * Cinematic loading screen. A Three.js full-screen shader renders two doors
 * sliding apart to reveal volumetric light; a GSAP timeline drives the door
 * opening and the logo illumination, then navigates to /menu.
 *
 * Debug: append `?hold` to freeze the final frame for inspection.
 */
export function LoadingScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => {});
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const holdParam = new URLSearchParams(window.location.search).get("hold");
    const hold = holdParam !== null;
    const holdValue = parseFloat(holdParam ?? "");
    const holdProgress = Math.min(
      Math.max(Number.isNaN(holdValue) ? 1 : holdValue, 0),
      1,
    );

    // --- Three.js setup ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      // Debug-only: lets the ?hold frame be sampled via readPixels/toDataURL.
      preserveDrawingBuffer: hold,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uProgress: { value: 0 },
      uTime: { value: 0 },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: doorVertexShader,
      fragmentShader: doorFragmentShader,
      uniforms,
    });
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const startTime = performance.now();
    let raf = 0;
    const renderFrame = () => {
      uniforms.uTime.value = (performance.now() - startTime) / 1000;
      renderer.render(scene, camera);
    };
    const loop = () => {
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    router.prefetch("/menu");

    // --- Timeline ---
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setLeaving(true);
      window.setTimeout(() => router.push("/menu"), 650);
    };
    skipRef.current = finish;

    const proxy = { p: 0 };
    const setP = () => {
      uniforms.uProgress.value = proxy.p;
    };

    let tl: gsap.core.Timeline | null = null;
    // Safety net: guarantee we leave the loader even if rAF/timeline stalls
    // (e.g. tab backgrounded mid-intro). finish() is idempotent.
    let safety = 0;

    const litLogo = () => {
      if (!logoRef.current) return;
      logoRef.current.style.opacity = "1";
      logoRef.current.style.transform = "scale(1)";
      logoRef.current.style.filter = "brightness(1.05) blur(0px)";
    };

    if (hold) {
      // Debug: freeze a given progress (?hold=0.4) for pixel inspection.
      uniforms.uProgress.value = holdProgress;
      uniforms.uTime.value = 2.0;
      litLogo();
      renderFrame();
    } else if (reduced) {
      uniforms.uProgress.value = 1;
      litLogo();
      renderFrame();
      window.setTimeout(finish, 1000);
    } else {
      loop();
      tl = gsap.timeline();
      tl.to(proxy, { p: 0.09, duration: 0.7, ease: "power1.out", onUpdate: setP })
        .to(
          proxy,
          { p: 1, duration: 2.0, ease: "power3.inOut", onUpdate: setP },
          ">-0.05",
        )
        .fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.86, filter: "brightness(0.15) blur(5px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "brightness(1.18) blur(0px)",
            duration: 1.5,
            ease: "power2.out",
          },
          "<0.55",
        )
        .to(logoRef.current, {
          filter: "brightness(1) blur(0px)",
          duration: 0.5,
          ease: "power1.out",
        })
        .to({}, { duration: 0.45 });
      if (!hold) {
        tl.call(finish);
        safety = window.setTimeout(finish, 8000);
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
      window.removeEventListener("resize", resize);
      tl?.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-background transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          ref={logoRef}
          className="opacity-0"
          style={{
            filter: "brightness(0.15) blur(5px)",
            willChange: "opacity, transform, filter",
          }}
        >
          <LogoMark
            className="h-44 w-44 drop-shadow-[0_0_55px_rgba(212,175,55,0.45)] sm:h-56 sm:w-56"
            stroke="#0f0f13"
            accent="#1e50c8"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute right-8 bottom-8 z-10 font-mono text-xs uppercase tracking-[0.25em] text-subtle transition-colors hover:text-foreground"
      >
        Saltar
      </button>
    </div>
  );
}
