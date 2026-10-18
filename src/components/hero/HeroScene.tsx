"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOGO_LIME, LOGO_PURPLE, X_MAIN, X_TIP } from "@/lib/logoPaths";

const TIP_COLOR = LOGO_LIME; // lime accent on the small tip of the X

// Brand mark paths, in logo coordinates (see Logo.tsx).
const BOX = { x: 1215, y: 98, w: 610, h: 555 };
const CENTER = { x: 1520, y: 372 };
const UNIT = 0.0099; // logo units -> world units
const UNIT_MOBILE = 0.0078;

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// Rasterise a path and return the filled pixel coordinates (logo space).
function sampleFill(d: string, step: number) {
  const c = document.createElement("canvas");
  c.width = BOX.w;
  c.height = BOX.h;
  const ctx = c.getContext("2d")!;
  ctx.translate(-BOX.x, -BOX.y);
  ctx.fillStyle = "#000";
  ctx.fill(new Path2D(d));
  const img = ctx.getImageData(0, 0, BOX.w, BOX.h).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < BOX.h; y += step)
    for (let x = 0; x < BOX.w; x += step)
      if (img[(y * BOX.w + x) * 4 + 3] > 128) pts.push([x + BOX.x, y + BOX.y]);
  return pts;
}

const vert = /* glsl */ `
  uniform float uTime, uForm, uPR, uAspect, uMouseOn;
  uniform vec2 uMouse; uniform vec3 uMain, uTip; uniform vec2 uOffset;
  attribute vec3 aTarget; attribute float aSeed; attribute float aTipMix;
  varying vec3 vC; varying float vA;
  float h(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
  void main() {
    float t = uTime;
    // Friction: a tangled, jittery cloud.
    float a = aSeed * 6.2831 + t * (0.25 + aSeed * 0.45);
    float r = 2.2 + 4.2 * h(aSeed * 91.0);
    vec3 chaos = vec3(cos(a) * r * 1.5, sin(a * 1.3 + aSeed * 9.0) * r * 0.85, sin(a * 0.7) * r * 0.7);
    chaos += vec3(sin(t * 2.1 + aSeed * 60.0), cos(t * 2.5 + aSeed * 45.0), sin(t * 1.7 + aSeed * 33.0)) * 0.22;

    // Flow: each particle settles into the mark, arriving at its own moment.
    float e = smoothstep(0.0, 1.0, clamp(uForm * 1.7 - aSeed * 0.7, 0.0, 1.0));
    vec3 held = aTarget + vec3(
      sin(t * 0.9 + aTarget.y * 1.6 + aSeed * 6.0),
      cos(t * 0.8 + aTarget.x * 1.4 + aSeed * 5.0),
      sin(t * 0.6 + aSeed * 12.0)) * 0.045;
    vec3 p = mix(chaos, held, e);
    p.xy += uOffset;

    // The cursor pushes particles aside; they flow back when it leaves.
    vec2 d = p.xy - uMouse;
    float f = exp(-dot(d, d) * 2.4) * uMouseOn;
    p.xy += normalize(d + 1e-4) * f * 0.5 * e;
    p.z += f * 0.4;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (2.3 + h(aSeed * 17.0) * 1.5 + f * 2.0) * uPR * (9.5 / -mv.z);
    vC = mix(uMain, uTip, aTipMix) * (0.82 + 0.3 * h(aSeed * 5.0));
    vA = mix(0.5, 0.95, e) * (0.75 + 0.25 * sin(t * 1.4 + aSeed * 30.0));
    gl_Position = projectionMatrix * mv;
  }`;
const frag = /* glsl */ `
  varying vec3 vC; varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vC, vA * smoothstep(0.5, 0.2, r));
  }`;

function MarkParticles({ mobile, active }: { mobile: boolean; active: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { gl, camera } = useThree();
  const intro = useRef(0);
  const pointer = useRef({ x: 0, y: 0, seen: false });

  const geo = useMemo(() => {
    const total = mobile ? 4200 : 9500;
    const main = sampleFill(X_MAIN, 2);
    const tipPts = sampleFill(X_TIP, 2);
    const nTip = Math.round((total * tipPts.length) / (main.length + tipPts.length));
    const pos = new Float32Array(total * 3),
      seed = new Float32Array(total),
      tmix = new Float32Array(total);
    const put = (i: number, pt: [number, number], isTip: number) => {
      pos[i * 3] =
        (pt[0] - CENTER.x) * (mobile ? UNIT_MOBILE : UNIT) + (hash(i * 3.1) - 0.5) * 0.03;
      pos[i * 3 + 1] =
        -(pt[1] - CENTER.y) * (mobile ? UNIT_MOBILE : UNIT) + (hash(i * 7.3) - 0.5) * 0.03;
      pos[i * 3 + 2] = (hash(i * 11.7) - 0.5) * 0.5;
      seed[i] = hash(i * 1.37);
      tmix[i] = isTip;
    };
    for (let i = 0; i < total; i++) {
      const isTip = i < nTip;
      const src = isTip ? tipPts : main;
      put(i, src[Math.floor(hash(i * 5.9) * src.length) % src.length], isTip ? 1 : 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aTipMix", new THREE.BufferAttribute(tmix, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return g;
  }, [mobile]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uPR: { value: 1 },
      uAspect: { value: 1 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseOn: { value: 0 },
      uOffset: { value: new THREE.Vector2(mobile ? 0 : 1.1, mobile ? 0 : 0.7) },
      uMain: { value: new THREE.Color(LOGO_PURPLE) },
      uTip: { value: new THREE.Color(TIP_COLOR) },
    }),
    [mobile],
  );

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY, seen: true };
    };
    const leave = () => {
      pointer.current.seen = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u || !active) return;
    u.uTime.value += dt;
    u.uPR.value = gl.getPixelRatio();
    intro.current = Math.min(1, intro.current + dt / 3.4);

    // Scrolling away lets the mark dissolve back into flow.
    const r = gl.domElement.getBoundingClientRect();
    const away = Math.min(1, Math.max(0, -r.top / (r.height * 0.7)));
    const target = intro.current * (1 - away * 0.9);
    u.uForm.value += (target - u.uForm.value) * (1 - Math.pow(0.002, dt));

    // Pointer in world space, measured against the canvas as it is right now
    // (not a cached rect), and only counted while it is actually over the canvas.
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
    const halfW = halfH * (r.width / r.height);
    const { x, y, seen } = pointer.current;
    const inside = seen && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    if (inside) {
      const wx = ((x - r.left) / r.width - 0.5) * 2 * halfW;
      const wy = -((y - r.top) / r.height - 0.5) * 2 * halfH;
      if (u.uMouseOn.value < 0.02) u.uMouse.value.set(wx, wy);
      u.uMouse.value.lerp(new THREE.Vector2(wx, wy), 1 - Math.pow(0.0005, dt));
    }
    // Influence only fades in once the pointer has settled, and fades out when it leaves.
    const want = inside && intro.current > 0.85 ? 1 : 0;
    u.uMouseOn.value += (want - u.uMouseOn.value) * (1 - Math.pow(0.01, dt));
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene({ active, mobile }: { active: boolean; mobile: boolean }) {
  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9.5], fov: 45 }}
      dpr={mobile ? 1 : [1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      className="!absolute inset-0"
    >
      <MarkParticles mobile={mobile} active={active} />
    </Canvas>
  );
}
