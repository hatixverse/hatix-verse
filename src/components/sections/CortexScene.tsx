/* eslint-disable react-hooks/immutability */
"use client";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { LOGO_LIME } from "@/lib/logoPaths";

const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* ---------- the core: a sphere of particles that assembles out of noise ---------- */
const coreVert = /* glsl */ `
  uniform float uTime, uForm, uPR, uMouseOn; uniform vec2 uMouse;
  attribute vec3 aTarget; attribute float aSeed;
  varying vec3 vC; varying float vA;
  float h(float n){ return fract(sin(n * 127.1 + 311.7) * 43758.5453); }
  void main() {
    float t = uTime;
    float a = aSeed * 6.2831 + t * (0.2 + aSeed * 0.4);
    float r = 2.6 + 4.0 * h(aSeed * 91.0);
    vec3 chaos = vec3(cos(a) * r * 1.3, sin(a * 1.3 + aSeed * 9.0) * r * 0.8, sin(a * 0.7) * r);
    chaos += vec3(sin(t * 2.0 + aSeed * 60.0), cos(t * 2.4 + aSeed * 45.0), sin(t * 1.6 + aSeed * 30.0)) * 0.2;

    float e = smoothstep(0.0, 1.0, clamp(uForm * 1.7 - aSeed * 0.7, 0.0, 1.0));
    vec3 dir = normalize(aTarget);
    float breathe = sin(dot(dir, vec3(3.1, 2.3, 1.7)) * 3.0 + t * 1.3) * 0.5 + sin(dir.y * 6.0 - t * 0.9) * 0.5;
    vec3 held = aTarget + dir * breathe * 0.07;
    vec3 p = mix(chaos, held, e);

    vec3 w = (modelMatrix * vec4(p, 1.0)).xyz;
    vec2 d = w.xy - uMouse;
    float f = exp(-dot(d, d) * 1.6) * uMouseOn;
    w.xy += normalize(d + 1e-4) * f * 0.55;
    w.z += f * 0.5;

    vec4 mv = viewMatrix * vec4(w, 1.0);
    gl_PointSize = (2.4 + h(aSeed * 17.0) * 1.8 + f * 2.5) * uPR * (9.0 / -mv.z);
    float front = smoothstep(-1.4, 1.4, w.z);
    vec3 purple = vec3(0.37, 0.09, 0.92);
    vec3 lav = vec3(0.60, 0.51, 1.0);
    vC = mix(purple, lav, 0.35 + 0.65 * front);
    if (h(aSeed * 3.7) > 0.985) vC = vec3(0.78, 1.0, 0.24);
    vA = mix(0.25, 0.95, e) * (0.35 + 0.65 * front);
    gl_Position = projectionMatrix * mv;
  }`;
const pointFrag = /* glsl */ `
  varying vec3 vC; varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(vC, vA * smoothstep(0.5, 0.15, r));
  }`;

function Core({ mobile, active }: { mobile: boolean; active: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const n = mobile ? 3000 : 7500;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = ga * i;
      const R = 1.2 + (hash(i * 2.3) - 0.5) * 0.08;
      pos[i * 3] = Math.cos(th) * rad * R;
      pos[i * 3 + 1] = y * R;
      pos[i * 3 + 2] = Math.sin(th) * rad * R;
      seed[i] = hash(i * 1.37);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return g;
  }, [mobile]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uPR: { value: 1 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseOn: { value: 0 },
    }),
    [],
  );
  // Shared via userData so the rig can feed time, form and pointer into every layer.
  useFrame((st) => {
    const u = mat.current?.uniforms;
    const d = st.scene.userData as { time: number; form: number; mouse: THREE.Vector2; on: number };
    if (!u || !active || !d) return;
    u.uTime.value = d.time;
    u.uForm.value = d.form;
    u.uPR.value = st.gl.getPixelRatio();
    u.uMouse.value.copy(d.mouse);
    u.uMouseOn.value = d.on;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={coreVert}
        fragmentShader={pointFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- orbital rings with light pulses running along them ---------- */
const ringVert = /* glsl */ `
  uniform float uTime, uForm, uPR, uSpeed, uOffset;
  attribute float aT; attribute float aSeed;
  varying vec3 vC; varying float vA;
  void main() {
    float head = fract(uTime * uSpeed + uOffset);
    float dd = abs(fract(aT - head + 0.5) - 0.5);
    float glow = smoothstep(0.09, 0.0, dd);
    vec3 p = position * smoothstep(0.0, 1.0, clamp(uForm * 1.3 - 0.25, 0.0, 1.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.6 + glow * 4.5 + aSeed * 0.8) * uPR * (9.0 / -mv.z);
    vec3 base = vec3(0.60, 0.51, 1.0);
    vec3 lime = vec3(0.78, 1.0, 0.24);
    vC = mix(base, lime, glow);
    vA = (0.22 + glow * 0.9) * smoothstep(0.1, 0.6, uForm);
    gl_Position = projectionMatrix * mv;
  }`;

function Ring({
  radius,
  tilt,
  speed,
  spin,
  offset,
  count,
  active,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  spin: number;
  offset: number;
  count: number;
  active: boolean;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const grp = useRef<THREE.Group>(null);
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const t = new Float32Array(count);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const rr = radius + (hash(i * 4.1 + radius) - 0.5) * 0.07;
      pos[i * 3] = Math.cos(a) * rr;
      pos[i * 3 + 1] = Math.sin(a) * rr;
      pos[i * 3 + 2] = (hash(i * 7.9 + radius) - 0.5) * 0.06;
      t[i] = i / count;
      seed[i] = hash(i * 2.7);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aT", new THREE.BufferAttribute(t, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return g;
  }, [count, radius]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uPR: { value: 1 },
      uSpeed: { value: speed },
      uOffset: { value: offset },
    }),
    [speed, offset],
  );
  useFrame((st) => {
    const u = mat.current?.uniforms;
    const d = st.scene.userData as { time: number; form: number };
    if (!u || !active || !d) return;
    u.uTime.value = d.time;
    u.uForm.value = d.form;
    u.uPR.value = st.gl.getPixelRatio();
    if (grp.current) grp.current.rotation.z = d.time * spin;
  });
  return (
    <group rotation={tilt}>
      <group ref={grp}>
        <points geometry={geo} frustumCulled={false}>
          <shaderMaterial
            ref={mat}
            vertexShader={ringVert}
            fragmentShader={pointFrag}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}

/* ---------- satellites: the kinds of AI, with DOM labels that follow them ---------- */
function Satellites({
  labels,
  active,
}: {
  labels: React.RefObject<(HTMLElement | null)[]>;
  active: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const meshes = useRef<(THREE.Group | null)[]>([]);
  const v = useMemo(() => new THREE.Vector3(), []);
  const count = 6;
  const R = 2.55;
  useFrame((st) => {
    const d = st.scene.userData as { time: number; form: number };
    if (!active || !d) return;
    const size = st.size;
    for (let i = 0; i < count; i++) {
      const m = meshes.current[i];
      const el = labels.current?.[i];
      if (!m) continue;
      const a = (i / count) * Math.PI * 2 + d.time * 0.14;
      m.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      m.scale.setScalar(Math.max(0.001, d.form));
      m.getWorldPosition(v);
      const z = v.z;
      v.project(st.camera);
      if (el) {
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -165%)`;
        el.style.opacity = String(
          Math.min(1, d.form) * (0.3 + 0.7 * THREE.MathUtils.smoothstep(z, -2, 2)),
        );
      }
    }
  });
  return (
    <group ref={rig} rotation={[1.05, 0.25, 0.2]}>
      {Array.from({ length: count }, (_, i) => (
        <group
          key={i}
          ref={(g) => {
            meshes.current[i] = g;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.075, 14, 14]} />
            <meshBasicMaterial color={LOGO_LIME} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 14, 14]} />
            <meshBasicMaterial color={LOGO_LIME} transparent opacity={0.16} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- rig: shared clock, intro, pointer ---------- */
function Rig({
  mobile,
  active,
  labels,
}: {
  mobile: boolean;
  active: boolean;
  labels: React.RefObject<(HTMLElement | null)[]>;
}) {
  const group = useRef<THREE.Group>(null);
  const { gl, scene, camera } = useThree();
  const pointer = useRef({ x: 0, y: 0, seen: false });
  const intro = useRef(0);
  const target = useMemo(() => new THREE.Vector2(), []);

  useEffect(() => {
    scene.userData = { time: 0, form: 0, mouse: new THREE.Vector2(99, 99), on: 0 };
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
  }, [scene]);

  useFrame((_, dt) => {
    if (!active) return;
    const d = scene.userData as { time: number; form: number; mouse: THREE.Vector2; on: number };
    d.time += dt;
    intro.current = Math.min(1, intro.current + dt / 3.2);
    d.form = intro.current;

    const r = gl.domElement.getBoundingClientRect();
    const cam = camera as THREE.PerspectiveCamera;
    const halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
    const halfW = halfH * (r.width / r.height);
    const { x, y, seen } = pointer.current;
    const inside = seen && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    let nx = 0;
    let ny = 0;
    if (inside) {
      nx = ((x - r.left) / r.width - 0.5) * 2;
      ny = -((y - r.top) / r.height - 0.5) * 2;
      target.set(nx * halfW, ny * halfH);
      if (d.on < 0.02) d.mouse.copy(target);
      d.mouse.lerp(target, 1 - Math.pow(0.0005, dt));
    }
    d.on += ((inside && intro.current > 0.85 ? 1 : 0) - d.on) * (1 - Math.pow(0.01, dt));

    const g = group.current;
    if (g) {
      const k = 1 - Math.pow(0.003, dt);
      g.rotation.y += (nx * 0.45 + d.time * 0.08 - g.rotation.y) * k * 0.4;
      g.rotation.x += (-ny * 0.25 + 0.15 - g.rotation.x) * k;
    }
  });

  return (
    <group ref={group}>
      <Core mobile={mobile} active={active} />
      <Ring
        radius={2.0}
        tilt={[1.25, 0.1, 0]}
        speed={0.16}
        spin={0.05}
        offset={0}
        count={mobile ? 500 : 900}
        active={active}
      />
      <Ring
        radius={2.55}
        tilt={[1.05, 0.25, 0.2]}
        speed={0.11}
        spin={-0.04}
        offset={0.4}
        count={mobile ? 700 : 1300}
        active={active}
      />
      <Ring
        radius={3.15}
        tilt={[0.55, -0.35, 0.5]}
        speed={0.08}
        spin={0.03}
        offset={0.7}
        count={mobile ? 800 : 1500}
        active={active}
      />
      <Satellites labels={labels} active={active} />
    </group>
  );
}

export default function CortexScene({
  active,
  mobile,
  labels,
}: {
  active: boolean;
  mobile: boolean;
  labels: React.RefObject<(HTMLElement | null)[]>;
}) {
  return (
    <Canvas
      aria-hidden
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9.5], fov: 42 }}
      dpr={mobile ? 1 : [1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Rig mobile={mobile} active={active} labels={labels} />
    </Canvas>
  );
}
