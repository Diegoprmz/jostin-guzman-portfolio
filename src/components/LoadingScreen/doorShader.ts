/**
 * Full-screen shader for the loading screen: two dark door panels that
 * slide apart (driven by uProgress) revealing a volumetric light beam with
 * animated god-ray streaks. One shader renders both the doors and the light.
 */

export const doorVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const doorFragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uProgress;
  uniform float uTime;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    float p = uProgress;
    float dx = abs(uv.x - 0.5);
    float gap = mix(0.006, 0.60, p);

    vec3 col;

    if (dx < gap) {
      // --- Light beam through the opening ---
      float edge = 1.0 - smoothstep(0.0, gap, dx);
      float t = uTime * 0.2;
      float rays = noise(vec2(uv.x * 40.0, uv.y * 3.0 - t * 2.0))
                 + 0.5 * noise(vec2(uv.x * 90.0 + 7.0, uv.y * 5.0 - t * 3.0));
      rays = mix(0.7, 1.2, rays / 1.5);
      float vfall = smoothstep(0.0, 0.4, uv.y) * smoothstep(1.0, 0.6, uv.y);
      vfall = mix(0.5, 1.0, vfall);
      float intensity = edge * rays * vfall * (0.3 + 0.7 * p);
      vec3 lightCol = mix(vec3(1.0, 0.95, 0.84), vec3(0.82, 0.90, 1.0), 0.3);
      col = lightCol * intensity * 1.7;
      col += lightCol * pow(edge, 3.0) * 0.7 * p;
    } else {
      // --- Door panel ---
      float d2 = dx - gap;
      float rim = exp(-d2 * 20.0) * (0.35 + 0.85 * p);
      vec3 doorCol = vec3(0.015, 0.015, 0.02);
      doorCol += 0.008 * noise(vec2(uv.x * 4.0, uv.y * 200.0));
      vec3 rimCol = mix(vec3(1.0, 0.94, 0.82), vec3(0.80, 0.90, 1.0), 0.3);
      col = doorCol + rimCol * rim;
    }

    // Vignette
    float vig = smoothstep(1.15, 0.35, distance(uv, vec2(0.5)));
    col *= mix(0.82, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;
