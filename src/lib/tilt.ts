/**
 * Single source of "tilt" for every parallax layer: the mouse on desktop, the
 * gyroscope on phones/tablets. Components subscribe and get normalized
 * (x, y) in roughly [-0.5, 0.5], so the same parallax math works for both.
 *
 * iOS 13+ requires DeviceOrientationEvent.requestPermission() from a user
 * gesture — call enableGyro() from a button (see GyroPrompt).
 */

type TiltCb = (x: number, y: number) => void;

type PermissionCapableDOE = {
  requestPermission?: () => Promise<PermissionState | string>;
};

const subs = new Set<TiltCb>();
let x = 0;
let y = 0;
let listening = false;
let gyroAttached = false;
let baseBeta: number | null = null;
let baseGamma: number | null = null;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

function emit() {
  for (const cb of subs) cb(x, y);
}

function onMouse(e: MouseEvent) {
  x = e.clientX / window.innerWidth - 0.5;
  y = e.clientY / window.innerHeight - 0.5;
  emit();
}

function onOrientation(e: DeviceOrientationEvent) {
  const { beta, gamma } = e;
  if (beta == null || gamma == null) return;
  // First reading calibrates "neutral" to however the user is holding it.
  if (baseBeta === null || baseGamma === null) {
    baseBeta = beta;
    baseGamma = gamma;
    return;
  }
  // ~35° of tilt covers the full parallax range
  x = clamp((gamma - baseGamma) / 35, -1, 1) * 0.5;
  y = clamp((beta - baseBeta) / 35, -1, 1) * 0.5;
  emit();
}

function attachGyro() {
  if (gyroAttached || typeof window === "undefined") return;
  gyroAttached = true;
  window.addEventListener("deviceorientation", onOrientation, {
    passive: true,
  });
}

function start() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("mousemove", onMouse, { passive: true });
  // Android / anything that doesn't gate the sensor: attach right away.
  if (!needsGyroPermission()) attachGyro();
}

/** True on iOS 13+, where the sensor needs an explicit user-gesture grant. */
export function needsGyroPermission(): boolean {
  if (typeof window === "undefined") return false;
  const DOE = window.DeviceOrientationEvent as unknown as
    | PermissionCapableDOE
    | undefined;
  return typeof DOE?.requestPermission === "function";
}

/** Must be called from a user gesture on iOS. Resolves true if motion is live. */
export async function enableGyro(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const DOE = window.DeviceOrientationEvent as unknown as
    | PermissionCapableDOE
    | undefined;
  if (typeof DOE?.requestPermission === "function") {
    try {
      const res = await DOE.requestPermission();
      if (res !== "granted") return false;
    } catch {
      return false;
    }
  }
  attachGyro();
  return true;
}

/** Subscribe to tilt updates. Returns an unsubscribe function. */
export function subscribeTilt(cb: TiltCb): () => void {
  start();
  subs.add(cb);
  cb(x, y);
  return () => {
    subs.delete(cb);
  };
}
