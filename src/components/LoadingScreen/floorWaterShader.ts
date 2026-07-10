/**
 * Floor water: a calm, glassy liquid surface that reflects the warm door
 * light with gentle ocean-like ripples. White base so it blends seamlessly
 * into the light cover; the reflection is strongest near the top (the wall
 * base, where the light spills) and toward the left (the door side).
 */

export const floorWaterVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const floorWaterFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    float u = vUv.x;
    float v = vUv.y;               // 1 = top (near wall base), 0 = bottom
    float t = uTime * 0.28;

    // layered gentle waves (flow)
    float w = sin(u * 6.0  + t * 1.1) * 0.5
            + sin(u * 10.0 - t * 0.7 + v * 2.5) * 0.3
            + sin(v * 5.0  + t * 0.5) * 0.2;

    // warm reflection: strongest near the top and the left (the door)
    float vfall = smoothstep(0.0, 1.0, v);
    float hx = clamp((u - 0.15) / 0.85, 0.0, 1.0);
    float hbias = 1.0 - smoothstep(0.0, 1.0, hx) * 0.7;
    float refl = vfall * hbias;
    refl *= 0.55 + 0.45 * sin(u * 5.0 + w * 2.2 + t * 1.3);
    refl = clamp(refl, 0.0, 1.0);

    vec3 white = vec3(1.0);
    vec3 warm = vec3(1.0, 0.88, 0.72);
    vec3 col = mix(white, warm, refl * 0.55);

    // liquid-glass specular glints
    float glint = pow(max(0.0, sin(u * 34.0 + w * 3.5 + t * 2.4) * 0.5 + 0.5), 26.0);
    col += glint * vfall * 0.22;

    gl_FragColor = vec4(col, 1.0);
  }
`;
