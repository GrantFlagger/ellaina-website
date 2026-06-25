"use client";

/*
 * HeroJourney — a scroll-driven cinematic R3F experience.
 *
 * A tall 600vh <section> drives the scroll. Inside it, a sticky full-viewport
 * canvas stays pinned while the user scrolls through five chapters, each mapped
 * to a slice of scroll progress (0→1):
 *
 *   0.0–0.2  The Grove      — procedural olive trees, sunny sky, golden light
 *   0.2–0.4  The Harvest    — a single olive falls from the canopy (spring + spin)
 *   0.4–0.6  The Mill       — stone press with rotating millstone + oil drip
 *   0.6–0.8  Liquid Gold    — additive shader-driven amber stream against dark
 *   0.8–1.0  Your Table     — warm kitchen, a transmission-glass bottle scales in
 *
 * The R3F scene reads the latest scroll value from a ref (updated by framer's
 * useMotionValueEvent) inside useFrame, lerping camera, sky, fog and lighting
 * between five keyframes every frame. All text overlays are plain HTML driven
 * by framer-motion + useLanguage translations.
 */

import { useRef, useState, useMemo, useLayoutEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

/* ------------------------------------------------------------------ helpers */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = THREE.MathUtils.lerp;
// Smoother (Ken Perlin) easing for the per-segment blend.
const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

/* -------------------------------------------------------- scene keyframes */

// Each chapter's objects live at a distinct point along +X so the fog cleanly
// isolates one chapter at a time as the camera flies between them.
const camPos = [
  new THREE.Vector3(0, 5, 15),
  new THREE.Vector3(1.4, 4.6, 6.5),
  new THREE.Vector3(40, 3.2, 8.5),
  new THREE.Vector3(80, 2.4, 7),
  new THREE.Vector3(120, 3, 8),
];
const camLook = [
  new THREE.Vector3(0, 4, 0),
  new THREE.Vector3(0.5, 3.4, 0),
  new THREE.Vector3(40, 1.6, 0),
  new THREE.Vector3(80, 1.6, 0),
  new THREE.Vector3(120, 1.5, 0),
];

const bgColors = ["#8ec5e6", "#a9cfe0", "#b7a37e", "#160a02", "#34210f"].map(
  (c) => new THREE.Color(c),
);
const dirColors = ["#ffe9b0", "#ffe3a0", "#fff0d0", "#ff8a3c", "#ffd9a0"].map(
  (c) => new THREE.Color(c),
);
const dirInt = [1.7, 1.6, 1.3, 0.5, 0.85];

// Olive-oil bottle silhouette, revolved with LatheGeometry.
const bottleProfile = (
  [
    [0, 0],
    [0.22, 0],
    [0.23, 0.05],
    [0.21, 0.55],
    [0.2, 0.9],
    [0.18, 1.0],
    [0.1, 1.22],
    [0.075, 1.28],
    [0.072, 1.65],
    [0.08, 1.7],
  ] as [number, number][]
).map(([x, y]) => new THREE.Vector2(x, y));

/* --------------------------------------------------------------- olive tree */

function Tree({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const leavesRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Instanced leaf positions, scattered through a handful of canopy blobs.
  const leaves = useMemo(() => {
    const blobs: [number, number, number, number][] = [
      [0, 5, 0, 2.2],
      [1.3, 4.6, 0.4, 1.5],
      [-1.2, 4.7, -0.3, 1.6],
      [0.3, 6, -0.2, 1.4],
      [0.6, 4.2, 1, 1.2],
    ];
    const out: [number, number, number, number][] = [];
    for (const [bx, by, bz, br] of blobs) {
      for (let i = 0; i < 30; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const r = br * Math.cbrt(Math.random());
        out.push([
          bx + r * Math.sin(ph) * Math.cos(th),
          by + r * Math.cos(ph),
          bz + r * Math.sin(ph) * Math.sin(th),
          0.3 + Math.random() * 0.35,
        ]);
      }
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    const mesh = leavesRef.current;
    if (!mesh) return;
    leaves.forEach((l, i) => {
      dummy.position.set(l[0], l[1], l[2]);
      dummy.scale.setScalar(l[3]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [leaves, dummy]);

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.32, 0.5, 4, 12]} />
        <meshStandardMaterial color="#5a4632" roughness={0.9} />
      </mesh>
      <mesh position={[0.7, 3.6, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.12, 0.2, 2, 8]} />
        <meshStandardMaterial color="#5a4632" roughness={0.9} />
      </mesh>
      <mesh position={[-0.7, 3.7, 0.2]} rotation={[0, 0, 0.8]}>
        <cylinderGeometry args={[0.1, 0.18, 1.8, 8]} />
        <meshStandardMaterial color="#5a4632" roughness={0.9} />
      </mesh>
      <mesh position={[0.1, 4, 0.8]} rotation={[0.7, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 1.6, 8]} />
        <meshStandardMaterial color="#5a4632" roughness={0.9} />
      </mesh>
      <instancedMesh
        ref={leavesRef}
        args={[
          undefined as unknown as THREE.BufferGeometry,
          undefined as unknown as THREE.Material,
          leaves.length,
        ]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#5b7d3a" roughness={0.85} flatShading />
      </instancedMesh>
    </group>
  );
}

function Grove() {
  return (
    <group>
      <Tree position={[0, 0, 0]} scale={1} />
      <Tree position={[-4.5, 0, -3.5]} scale={0.72} />
      <Tree position={[4.8, 0, -4.5]} scale={0.82} />
    </group>
  );
}

/* ----------------------------------------------------- chapter 2: the olive */

function FallingOlive({
  fall,
  scrollRef,
}: {
  fall: MotionValue<number>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = scrollRef.current;
    mesh.visible = s > 0.12 && s < 0.46;
    // Spring value overshoots slightly past 1 → a small bounce at the ground.
    const f = Math.min(fall.get(), 1.06);
    mesh.position.y = lerp(5.2, 0.32, f);
    mesh.rotation.x = f * 9;
    mesh.rotation.z = f * 6;
  });
  return (
    <mesh ref={ref} position={[0.5, 5.2, 0.6]} scale={[0.18, 0.26, 0.18]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#3b4a1e" roughness={0.45} />
    </mesh>
  );
}

/* -------------------------------------------------------- chapter 3: the mill */

function Mill({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const stone = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (stone.current) stone.current.rotation.y += d * 1.1;
    if (group.current) {
      const s = scrollRef.current;
      group.current.visible = s > 0.32 && s < 0.66;
    }
  });
  return (
    <group ref={group} position={[40, 0, 0]}>
      {/* basin */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.9, 1.9, 0.6, 32]} />
        <meshStandardMaterial color="#9b9488" roughness={0.95} />
      </mesh>
      {/* trough ring */}
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.16, 16, 48]} />
        <meshStandardMaterial color="#7d766a" roughness={0.85} />
      </mesh>
      {/* center post */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 1.7, 12]} />
        <meshStandardMaterial color="#5a5048" roughness={0.8} />
      </mesh>
      {/* rotating edge-runner millstone */}
      <mesh ref={stone} position={[0, 0.78, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.35, 32]} />
        <meshStandardMaterial color="#8a8276" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------- shared physical oil */

function OilMaterial() {
  return (
    <meshPhysicalMaterial
      color="#c8920a"
      roughness={0.04}
      metalness={0}
      transmission={0.88}
      ior={1.47}
      thickness={0.05}
      attenuationColor="#d4a017"
      attenuationDistance={0.3}
    />
  );
}

/* -------------------------------------- instanced physical oil droplets */

function OilDroplets({
  scrollRef,
  top,
  floor,
  visFrom,
  visTo,
  spawn,
  vMin = 0.5,
  vMax = 1.0,
  count = 400,
}: {
  scrollRef: React.MutableRefObject<number>;
  top: number;
  floor: number;
  visFrom: number;
  visTo: number;
  spawn: () => { x: number; z: number };
  vMin?: number;
  vMax?: number;
  count?: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const drops = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const p = spawn();
        return {
          x: p.x,
          z: p.z,
          y: floor + Math.random() * (top - floor),
          v: vMin + Math.random() * (vMax - vMin),
          r: Math.random() * Math.PI * 2,
        };
      }),
    // seeded once; positions are advanced imperatively in useFrame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, d) => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = scrollRef.current;
    const vis = s > visFrom && s < visTo;
    mesh.visible = vis;
    if (!vis) return;
    const dt = Math.min(d, 0.05);
    for (let i = 0; i < count; i++) {
      const drop = drops[i];
      drop.y -= drop.v * dt;
      if (drop.y < floor) {
        const p = spawn();
        drop.x = p.x;
        drop.z = p.z;
        drop.y = top;
        drop.v = vMin + Math.random() * (vMax - vMin);
      }
      dummy.position.set(drop.x, drop.y, drop.z);
      dummy.rotation.set(0, 0, Math.sin(drop.r + drop.y * 3) * 0.25);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={ref}
      args={[
        undefined as unknown as THREE.BufferGeometry,
        undefined as unknown as THREE.Material,
        count,
      ]}
    >
      <capsuleGeometry args={[0.012, 0.04, 4, 8]} />
      <OilMaterial />
    </instancedMesh>
  );
}

/* ------------------------------------ continuous physical pour stream */

function PourStream({
  scrollRef,
  x,
  top,
  bottom,
  visFrom,
  visTo,
}: {
  scrollRef: React.MutableRefObject<number>;
  x: number;
  top: number;
  bottom: number;
  visFrom: number;
  visTo: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const counter = useRef(0);

  const curve = useMemo(() => {
    const pts = Array.from(
      { length: 5 },
      (_, i) => new THREE.Vector3(x, lerp(top, bottom, i / 4), 0),
    );
    return new THREE.CatmullRomCurve3(pts);
  }, [x, top, bottom]);

  const initialGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 24, 0.02, 8, false),
    [curve],
  );

  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const s = scrollRef.current;
    const vis = s > visFrom && s < visTo;
    mesh.visible = vis;
    if (!vis) return;
    counter.current += 1;
    if (counter.current % 4 === 0) {
      const pts = curve.points;
      for (let i = 0; i < 5; i++) {
        const edge = i === 0 || i === 4;
        pts[i].set(
          x + (edge ? 0 : (Math.random() - 0.5) * 0.06),
          lerp(top, bottom, i / 4),
          edge ? 0 : (Math.random() - 0.5) * 0.06,
        );
      }
      const geo = new THREE.TubeGeometry(curve, 24, 0.02, 8, false);
      mesh.geometry.dispose();
      mesh.geometry = geo;
    }
  });

  return (
    <mesh ref={ref} geometry={initialGeo}>
      <OilMaterial />
    </mesh>
  );
}

/* --------------------------------------------- chapter 5: the table + bottle */

function TableScene({
  bottle,
  scrollRef,
}: {
  bottle: MotionValue<number>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const bottleRef = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = scrollRef.current > 0.74;
    if (bottleRef.current) {
      const v = bottle.get();
      bottleRef.current.scale.setScalar(Math.max(0.0001, v));
    }
  });

  const legs: [number, number][] = [
    [1.7, 0.9],
    [1.7, -0.9],
    [-1.7, 0.9],
    [-1.7, -0.9],
  ];

  return (
    <group ref={group} position={[120, 0, 0]}>
      {/* table top */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[4, 0.22, 2.4]} />
        <meshStandardMaterial color="#6b4423" roughness={0.6} />
      </mesh>
      {legs.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.65, z]}>
          <cylinderGeometry args={[0.11, 0.11, 1.4, 12]} />
          <meshStandardMaterial color="#54331a" roughness={0.7} />
        </mesh>
      ))}

      {/* bottle — scales in from zero */}
      <group ref={bottleRef} position={[0, 1.51, 0]} scale={0.0001}>
        {/* outer glass shell */}
        <mesh>
          <latheGeometry args={[bottleProfile, 32]} />
          <BottleGlass />
        </mesh>
        {/* inner oil fill — nested for refractive depth */}
        <mesh scale={[0.9, 0.96, 0.9]} position={[0, 0.015, 0]}>
          <latheGeometry args={[bottleProfile, 32]} />
          <meshPhysicalMaterial
            color="#7a5c0a"
            roughness={0.22}
            metalness={0}
            transmission={0.45}
            ior={1.46}
            thickness={0.5}
            attenuationColor="#caa029"
            attenuationDistance={0.4}
          />
        </mesh>
        {/* cap */}
        <mesh position={[0, 1.74, 0]}>
          <cylinderGeometry args={[0.092, 0.092, 0.12, 24]} />
          <meshStandardMaterial color="#1c1c14" roughness={0.5} />
        </mesh>
      </group>

      {/* contact shadow grounding the bottle on the table */}
      <ContactShadows
        position={[0, 1.52, 0]}
        scale={2.2}
        opacity={0.5}
        blur={2}
        far={2.2}
        resolution={512}
        color="#1a1208"
      />
    </group>
  );
}

function BottleGlass() {
  return (
    <meshPhysicalMaterial
      color="#162810"
      roughness={0.02}
      metalness={0}
      transmission={0.94}
      ior={1.5}
      thickness={0.7}
      envMapIntensity={3}
      attenuationColor="#90b050"
      attenuationDistance={0.35}
      side={THREE.DoubleSide}
    />
  );
}

/* -------------------------------------------------- the scene orchestration */

function Experience({
  scrollRef,
  fall,
  bottle,
  active,
}: {
  scrollRef: React.MutableRefObject<number>;
  fall: MotionValue<number>;
  bottle: MotionValue<number>;
  active: number;
}) {
  const { camera, scene } = useThree();
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const tableLight = useRef<THREE.PointLight>(null);

  // Persistent scratch objects so we never allocate inside the frame loop.
  const lookCurrent = useMemo(() => camLook[0].clone(), []);
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const tmpCol = useMemo(() => new THREE.Color(), []);
  const dCol = useMemo(() => new THREE.Color(), []);
  const bg = useMemo(() => new THREE.Color(bgColors[0]), []);
  const fog = useMemo(() => new THREE.Fog(bgColors[0].getHex(), 10, 34), []);

  useLayoutEffect(() => {
    scene.background = bg;
    scene.fog = fog;
  }, [scene, bg, fog]);

  useFrame(() => {
    const s = scrollRef.current;
    const seg = Math.min(4, Math.floor(s * 5));
    const next = Math.min(4, seg + 1);
    const e = smoother(clamp01(s * 5 - seg));

    // camera position + look-at
    tmpPos.copy(camPos[seg]).lerp(camPos[next], e);
    camera.position.lerp(tmpPos, 0.06);
    tmpLook.copy(camLook[seg]).lerp(camLook[next], e);
    lookCurrent.lerp(tmpLook, 0.06);
    camera.lookAt(lookCurrent);

    // sky + fog blend
    tmpCol.copy(bgColors[seg]).lerp(bgColors[next], e);
    bg.copy(tmpCol);
    fog.color.copy(tmpCol);

    // directional (sun) light blend
    if (dirRef.current) {
      dCol.copy(dirColors[seg]).lerp(dirColors[next], e);
      dirRef.current.color.copy(dCol);
      dirRef.current.intensity = lerp(dirInt[seg], dirInt[next], e);
    }

    // warm kitchen point light fades in across the final chapter
    if (tableLight.current) {
      tableLight.current.intensity = clamp01((s - 0.8) / 0.2) * 7;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight ref={dirRef} position={[6, 14, 6]} intensity={1.7} />
      <pointLight
        ref={tableLight}
        position={[120, 3.4, 2.5]}
        color="#ffb060"
        intensity={0}
        distance={20}
        decay={2}
      />

      {/* image-based lighting — sunset for the grove/harvest/mill, warm
          apartment interior for the final table chapter */}
      <Suspense fallback={null}>
        {active === 4 ? (
          <Environment preset="apartment" />
        ) : (
          <Environment preset="sunset" />
        )}
      </Suspense>

      {/* shared ground spanning every chapter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[60, 0, 0]}>
        <planeGeometry args={[500, 220]} />
        <meshStandardMaterial color="#6e5d3f" roughness={1} />
      </mesh>

      <Grove />
      <FallingOlive fall={fall} scrollRef={scrollRef} />
      <Mill scrollRef={scrollRef} />

      {/* chapter 3 — oil dripping from the mill's trough ring */}
      <OilDroplets
        scrollRef={scrollRef}
        top={1.05}
        floor={0.45}
        visFrom={0.34}
        visTo={0.64}
        vMin={0.4}
        vMax={0.9}
        spawn={() => {
          const a = Math.random() * Math.PI * 2;
          const r = 1.5 + Math.random() * 0.25;
          return { x: 40 + Math.cos(a) * r, z: Math.sin(a) * r };
        }}
      />

      {/* chapter 4 — liquid gold pouring downward */}
      <OilDroplets
        scrollRef={scrollRef}
        top={4.6}
        floor={-0.1}
        visFrom={0.56}
        visTo={0.86}
        vMin={1.2}
        vMax={2.2}
        spawn={() => ({
          x: 80 + (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5,
        })}
      />
      <PourStream
        scrollRef={scrollRef}
        x={80}
        top={4.6}
        bottom={0}
        visFrom={0.56}
        visTo={0.86}
      />

      <TableScene bottle={bottle} scrollRef={scrollRef} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.55} intensity={1.0} />
        <Vignette offset={0.3} darkness={0.65} />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------- the overlays */

export default function HeroJourney() {
  const { lang } = useLanguage();
  const t = translations[lang].journey;
  const scenes = t.scenes;

  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const sceneRef = useRef(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring values for the olive fall (chapter 2) and bottle scale (chapter 5),
  // read inside the R3F frame loop via .get().
  const fall = useSpring(0, { stiffness: 70, damping: 12, mass: 1 });
  const bottle = useSpring(0, { stiffness: 120, damping: 16 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
    fall.set(clamp01((v - 0.2) / 0.2));
    bottle.set(clamp01((v - 0.8) / 0.2));
    const sc = Math.min(4, Math.floor(v * 5));
    if (sc !== sceneRef.current) {
      sceneRef.current = sc;
      setActive(sc);
    }
  });

  const goToScene = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const p = (i + 0.5) / 5;
    const top = el.offsetTop + p * (el.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const scene = scenes[active];

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-[#8ec5e6]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          className="!absolute inset-0"
          camera={{ position: [0, 5, 15], fov: 42 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
        >
          <Experience
            scrollRef={scrollRef}
            fall={fall}
            bottle={bottle}
            active={active}
          />
        </Canvas>

        {/* gold progress bar */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="absolute left-0 top-0 z-30 h-[3px] w-full origin-left bg-secondary"
        />

        {/* chapter text */}
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-20 sm:px-12 sm:pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl"
              >
                <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.32em] text-secondary">
                  {scene.eyebrow}
                </p>
                <h2 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                  {scene.title}
                </h2>
                <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/75 sm:text-base">
                  {scene.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* scene dot navigation */}
        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3.5 sm:right-8">
          {scenes.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToScene(i)}
              aria-label={sc.title}
              className="pointer-events-auto flex h-3 w-3 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  active === i
                    ? "h-3 w-3 bg-secondary"
                    : "h-2 w-2 bg-white/35 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        {/* scroll hint — first chapter only */}
        <AnimatePresence>
          {active === 0 && (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5"
            >
              <span className="font-body text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
                {t.scrollHint}
              </span>
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5 text-white/55" strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA — final chapter only */}
        <AnimatePresence>
          {active === 4 && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="pointer-events-none absolute inset-x-0 bottom-10 z-20 flex justify-center"
            >
              <a
                href="/shop"
                className="pointer-events-auto rounded-full bg-secondary px-9 py-4 font-body text-sm font-semibold tracking-wide text-bark shadow-xl transition-all duration-200 hover:bg-white hover:text-primary active:scale-95"
              >
                {t.cta}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
