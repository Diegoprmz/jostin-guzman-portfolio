"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { floorWaterVert, floorWaterFrag } from "./floorWaterShader";

/**
 * Animated liquid-glass water floor. Fills its container (position it over the
 * cover's floor band). Reduced-motion renders a single static frame.
 */
export function FloorWater({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = { uTime: { value: 0 } };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: floorWaterVert,
      fragmentShader: floorWaterFrag,
      uniforms,
    });
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    let raf = 0;
    const frame = () => {
      uniforms.uTime.value = (performance.now() - t0) / 1000;
      renderer.render(scene, camera);
    };

    if (reduced) {
      frame();
    } else {
      const loop = () => {
        frame();
        raf = requestAnimationFrame(loop);
      };
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
