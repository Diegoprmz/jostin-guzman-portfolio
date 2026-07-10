"use client";

import { useEffect, useRef } from "react";
import {
  baseVertex,
  splatShader,
  advectionShader,
  divergenceShader,
  curlShader,
  vorticityShader,
  pressureShader,
  gradientSubtractShader,
  clearShader,
  displayShader,
} from "./fluidShaders";

const SIM_RESOLUTION = 96;
const DYE_RESOLUTION = 384;
const DENSITY_DISSIPATION = 1.1;
const VELOCITY_DISSIPATION = 0.25;
const PRESSURE = 0.8;
const PRESSURE_ITERATIONS = 18;
const CURL = 26;
const SPLAT_RADIUS = 0.22;
const SPLAT_FORCE = 5500;
const WARM_DYE = { r: 0.42, g: 0.33, b: 0.22 };

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach: (id: number) => number;
};
type DoubleFBO = {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap: () => void;
};
type Program = {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  bind: () => void;
};

/**
 * Interactive GPU fluid (Navier-Stokes). Fills its container; move the cursor
 * to stir the liquid. Gracefully renders nothing if WebGL2/float RTs are
 * unavailable (the light cover shows through).
 */
export function FluidWater({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
      return; // unsupported -> cover shows through
    }
    const glc = gl;

    // ---- GL helpers ----
    const compile = (type: number, src: string) => {
      const sh = glc.createShader(type)!;
      glc.shaderSource(sh, src);
      glc.compileShader(sh);
      if (!glc.getShaderParameter(sh, glc.COMPILE_STATUS)) {
        console.error("fluid shader:", glc.getShaderInfoLog(sh));
      }
      return sh;
    };
    const vertex = compile(glc.VERTEX_SHADER, baseVertex);
    const makeProgram = (fragSrc: string): Program => {
      const program = glc.createProgram()!;
      glc.attachShader(program, vertex);
      glc.attachShader(program, compile(glc.FRAGMENT_SHADER, fragSrc));
      glc.linkProgram(program);
      if (!glc.getProgramParameter(program, glc.LINK_STATUS)) {
        console.error("fluid link:", glc.getProgramInfoLog(program));
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = glc.getProgramParameter(program, glc.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = glc.getActiveUniform(program, i)!.name;
        uniforms[name] = glc.getUniformLocation(program, name);
      }
      return { program, uniforms, bind: () => glc.useProgram(program) };
    };

    const programs = {
      splat: makeProgram(splatShader),
      advection: makeProgram(advectionShader),
      divergence: makeProgram(divergenceShader),
      curl: makeProgram(curlShader),
      vorticity: makeProgram(vorticityShader),
      pressure: makeProgram(pressureShader),
      gradient: makeProgram(gradientSubtractShader),
      clear: makeProgram(clearShader),
      display: makeProgram(displayShader),
    };

    // ---- fullscreen quad ----
    const vbo = glc.createBuffer();
    glc.bindBuffer(glc.ARRAY_BUFFER, vbo);
    glc.bufferData(
      glc.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      glc.STATIC_DRAW,
    );
    const ibo = glc.createBuffer();
    glc.bindBuffer(glc.ELEMENT_ARRAY_BUFFER, ibo);
    glc.bufferData(
      glc.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      glc.STATIC_DRAW,
    );
    glc.vertexAttribPointer(0, 2, glc.FLOAT, false, 0, 0);
    glc.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target === null) {
        glc.viewport(0, 0, glc.drawingBufferWidth, glc.drawingBufferHeight);
        glc.bindFramebuffer(glc.FRAMEBUFFER, null);
      } else {
        glc.viewport(0, 0, target.width, target.height);
        glc.bindFramebuffer(glc.FRAMEBUFFER, target.fbo);
      }
      glc.drawElements(glc.TRIANGLES, 6, glc.UNSIGNED_SHORT, 0);
    };

    const RGBA16F = glc.RGBA16F;
    const createFBO = (w: number, h: number): FBO => {
      glc.activeTexture(glc.TEXTURE0);
      const texture = glc.createTexture()!;
      glc.bindTexture(glc.TEXTURE_2D, texture);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.LINEAR);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.LINEAR);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
      glc.texImage2D(
        glc.TEXTURE_2D, 0, RGBA16F, w, h, 0, glc.RGBA, glc.HALF_FLOAT, null,
      );
      const fbo = glc.createFramebuffer()!;
      glc.bindFramebuffer(glc.FRAMEBUFFER, fbo);
      glc.framebufferTexture2D(
        glc.FRAMEBUFFER, glc.COLOR_ATTACHMENT0, glc.TEXTURE_2D, texture, 0,
      );
      glc.viewport(0, 0, w, h);
      glc.clear(glc.COLOR_BUFFER_BIT);
      return {
        texture, fbo, width: w, height: h,
        texelSizeX: 1 / w, texelSizeY: 1 / h,
        attach(id: number) {
          glc.activeTexture(glc.TEXTURE0 + id);
          glc.bindTexture(glc.TEXTURE_2D, texture);
          return id;
        },
      };
    };
    const createDoubleFBO = (w: number, h: number): DoubleFBO => {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        width: w, height: h, texelSizeX: 1 / w, texelSizeY: 1 / h,
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t; },
      } as DoubleFBO;
    };

    const getResolution = (res: number) => {
      let aspect = glc.drawingBufferWidth / glc.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      aspect = Math.min(aspect, 3);
      const min = Math.round(res);
      const max = Math.round(res * aspect);
      return glc.drawingBufferWidth > glc.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
    };

    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curl: FBO;
    let pressure: DoubleFBO;

    const initFramebuffers = () => {
      const simRes = getResolution(SIM_RESOLUTION);
      const dyeRes = getResolution(DYE_RESOLUTION);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height);
      velocity = createDoubleFBO(simRes.width, simRes.height);
      divergence = createFBO(simRes.width, simRes.height);
      curl = createFBO(simRes.width, simRes.height);
      pressure = createDoubleFBO(simRes.width, simRes.height);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        return true;
      }
      return false;
    };

    resizeCanvas();
    initFramebuffers();

    // ---- simulation steps ----
    const u = (p: Program, name: string) => p.uniforms[name] ?? null;

    const step = (dt: number) => {
      glc.disable(glc.BLEND);

      programs.curl.bind();
      glc.uniform2f(u(programs.curl, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.curl, "uVelocity"), velocity.read.attach(0));
      blit(curl);

      programs.vorticity.bind();
      glc.uniform2f(u(programs.vorticity, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.vorticity, "uVelocity"), velocity.read.attach(0));
      glc.uniform1i(u(programs.vorticity, "uCurl"), curl.attach(1));
      glc.uniform1f(u(programs.vorticity, "curl"), CURL);
      glc.uniform1f(u(programs.vorticity, "dt"), dt);
      blit(velocity.write);
      velocity.swap();

      programs.divergence.bind();
      glc.uniform2f(u(programs.divergence, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.divergence, "uVelocity"), velocity.read.attach(0));
      blit(divergence);

      programs.clear.bind();
      glc.uniform2f(u(programs.clear, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.clear, "uTexture"), pressure.read.attach(0));
      glc.uniform1f(u(programs.clear, "value"), PRESSURE);
      blit(pressure.write);
      pressure.swap();

      programs.pressure.bind();
      glc.uniform2f(u(programs.pressure, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.pressure, "uDivergence"), divergence.attach(0));
      for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
        glc.uniform1i(u(programs.pressure, "uPressure"), pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      programs.gradient.bind();
      glc.uniform2f(u(programs.gradient, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.gradient, "uPressure"), pressure.read.attach(0));
      glc.uniform1i(u(programs.gradient, "uVelocity"), velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      programs.advection.bind();
      glc.uniform2f(u(programs.advection, "texelSize"), velocity.texelSizeX, velocity.texelSizeY);
      glc.uniform1i(u(programs.advection, "uVelocity"), velocity.read.attach(0));
      glc.uniform1i(u(programs.advection, "uSource"), velocity.read.attach(0));
      glc.uniform1f(u(programs.advection, "dt"), dt);
      glc.uniform1f(u(programs.advection, "dissipation"), VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      glc.uniform2f(u(programs.advection, "texelSize"), dye.texelSizeX, dye.texelSizeY);
      glc.uniform1i(u(programs.advection, "uVelocity"), velocity.read.attach(0));
      glc.uniform1i(u(programs.advection, "uSource"), dye.read.attach(1));
      glc.uniform1f(u(programs.advection, "dissipation"), DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      glc.disable(glc.BLEND);
      programs.display.bind();
      glc.uniform1i(u(programs.display, "uTexture"), dye.read.attach(0));
      blit(null);
    };

    const splat = (x: number, y: number, dx: number, dy: number, mag: number) => {
      const aspect = canvas.width / canvas.height;
      programs.splat.bind();
      glc.uniform1i(u(programs.splat, "uTarget"), velocity.read.attach(0));
      glc.uniform1f(u(programs.splat, "aspectRatio"), aspect);
      glc.uniform2f(u(programs.splat, "point"), x, y);
      glc.uniform3f(u(programs.splat, "color"), dx, dy, 0);
      glc.uniform1f(u(programs.splat, "radius"), SPLAT_RADIUS / 100);
      blit(velocity.write);
      velocity.swap();

      glc.uniform1i(u(programs.splat, "uTarget"), dye.read.attach(0));
      glc.uniform3f(
        u(programs.splat, "color"),
        WARM_DYE.r * mag, WARM_DYE.g * mag, WARM_DYE.b * mag,
      );
      blit(dye.write);
      dye.swap();
    };

    // ---- pointer + auto seeding ----
    const pointer = { x: 0, y: 0, px: 0, py: 0, down: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      if (!pointer.down) {
        pointer.px = x;
        pointer.py = y;
        pointer.down = true;
      }
      const dx = (pointer.x - pointer.px) * SPLAT_FORCE;
      const dy = (pointer.y - pointer.py) * SPLAT_FORCE;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) splat(x, y, dx, dy, 1.0);
    };
    window.addEventListener("pointermove", onMove);

    // gentle auto-splats so the liquid is alive without a cursor
    let autoTimer = 0;
    const autoSplat = () => {
      const x = 0.2 + Math.random() * 0.6;
      const y = 0.35 + Math.random() * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const force = SPLAT_FORCE * 0.35;
      splat(x, y, Math.cos(angle) * force, Math.sin(angle) * force, 0.7);
    };
    for (let i = 0; i < 4; i++) autoSplat(); // initial seed

    // ---- loop ----
    let raf = 0;
    let last = performance.now();
    autoTimer = performance.now();
    const frame = () => {
      const now = performance.now();
      let dt = (now - last) / 1000;
      dt = Math.min(dt, 0.016666);
      last = now;
      if (resizeCanvas()) initFramebuffers();
      if (now - autoTimer > 900) {
        autoTimer = now;
        autoSplat();
      }
      step(dt);
      render();
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      const ext = glc.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
