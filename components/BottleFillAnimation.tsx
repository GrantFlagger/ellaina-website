"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const VB_W = 180;
const VB_H = 560;

const FILL_TOP = 140;
const FILL_BOTTOM = 500;

const SPOUT_Y = 46;
const NECK_CENTER_X = 90;

// Straight-sided cylindrical body + tapered shoulder + narrow neck,
// modeled on the real Ellaina bottle photo (not the old rounded-flask shape).
const BOTTLE_OUTLINE =
  "M74,38 L74,84 " +
  "C74,98 66,104 58,120 " +
  "L34,128 L34,508 " +
  "C34,515 40,520 47,520 " +
  "L133,520 " +
  "C140,520 146,515 146,508 " +
  "L146,128 L122,120 " +
  "C114,104 106,98 106,84 " +
  "L106,38 Z";

// Inset ~4px from the outline to represent glass thickness — this is what
// the liquid fill clips against.
const BOTTLE_INTERIOR =
  "M78,42 L78,84 " +
  "C78,96 71,102 64,116 " +
  "L42,124 L42,504 " +
  "C42,510 46,514 52,514 " +
  "L128,514 " +
  "C134,514 138,510 138,504 " +
  "L138,124 L116,116 " +
  "C109,102 102,96 102,84 " +
  "L102,42 Z";

// Teardrop centered on its own local origin — pointed top, rounded bottom
const DROPLET_PATH =
  "M0,-9 C6,-1 9,5 9,9 A9,9 0 1 1 -9,9 C-9,5 -6,-1 0,-9 Z";

export default function BottleFillAnimation() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.4,
  });

  const opacity = useTransform(smoothProgress, [0, 0.06, 0.1], [0, 0, 1]);
  const fillY = useTransform(smoothProgress, [0.1, 0.92], [FILL_BOTTOM, FILL_TOP]);

  // Droplet: hidden by default, only animates spout -> current surface on
  // scroll, then fades out and resets — never a static/looping element.
  const dropY = useMotionValue(SPOUT_Y);
  const dropOpacity = useMotionValue(0);
  const isDripping = useRef(false);
  const dripQueued = useRef(false);

  const runDrip = () => {
    isDripping.current = true;
    const target = fillY.get();

    animate(dropY, [SPOUT_Y, target], { duration: 0.45, ease: "easeIn" });
    animate(dropOpacity, [0, 1, 1, 0], {
      duration: 0.55,
      times: [0, 0.15, 0.75, 1],
      onComplete: () => {
        isDripping.current = false;
        dropY.set(SPOUT_Y);
        if (dripQueued.current) {
          dripQueued.current = false;
          runDrip();
        }
      },
    });
  };

  useMotionValueEvent(smoothProgress, "change", () => {
    if (isDripping.current) {
      dripQueued.current = true;
      return;
    }
    runDrip();
  });

  return (
    <motion.div
      aria-hidden
      style={{ opacity, bottom: "clamp(1rem, 6vh, 2.5rem)" }}
      className="pointer-events-none fixed left-6 z-20 hidden lg:block xl:left-10"
    >
      <svg
        style={{ width: "clamp(56px, 9vmin, 110px)", height: "auto" }}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        fill="none"
      >
        <defs>
          <clipPath id="bottleInterior">
            <path d={BOTTLE_INTERIOR} />
          </clipPath>

          <linearGradient id="oilGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C8A96E" />
            <stop offset="35%" stopColor="#8A9C4A" />
            <stop offset="100%" stopColor="#2C4A1E" />
          </linearGradient>

          <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="42%" stopColor="white" stopOpacity="0.26" />
            <stop offset="58%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Liquid already inside the bottle, clipped to the interior silhouette */}
        <g clipPath="url(#bottleInterior)">
          <motion.g style={{ y: fillY }}>
            <rect x={0} y={0} width={VB_W} height={VB_H} fill="url(#oilGradient)" />

            <motion.path
              d="M -180 0
                 C -160 -4, -120 4, -100 0
                 C -80 -4, -40 4, -20 0
                 C 0 -4, 40 4, 60 0
                 C 80 -4, 120 4, 140 0
                 C 160 -4, 180 4, 180 0
                 L 180 16 L -180 16 Z"
              fill="url(#oilGradient)"
              animate={{ x: [0, 80] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
        </g>

        {/* Droplet: falls from the spout, disappears once it reaches the surface */}
        <motion.g style={{ x: NECK_CENTER_X, y: dropY, opacity: dropOpacity }}>
          <path d={DROPLET_PATH} fill="url(#oilGradient)" />
        </motion.g>

        {/* Foil capsule cap */}
        <rect
          x={66}
          y={18}
          width={48}
          height={22}
          rx={5}
          className="fill-secondary/85 dark:fill-secondary/60"
        />

        {/* Glass outline */}
        <path
          d={BOTTLE_OUTLINE}
          stroke="currentColor"
          strokeWidth={1.4}
          className="text-primary/40 dark:text-cream/30"
        />

        {/* Sheen */}
        <path d={BOTTLE_INTERIOR} fill="url(#glassSheen)" opacity={0.45} />

        {/* Label — always visible, static on the body */}
        <rect
          x={54}
          y={260}
          width={72}
          height={92}
          rx={4}
          fill="#FAF7EF"
          stroke="#C9A45F"
          strokeWidth={0.6}
        />
        <image
          href="/images/logo.png"
          x={62}
          y={276}
          width={56}
          height={24}
          preserveAspectRatio="xMidYMid meet"
        />
        <text
          x={90}
          y={318}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize={5.5}
          letterSpacing={0.8}
          fill="#6B6455"
        >
          EXTRA VIRGIN
        </text>
        <text
          x={90}
          y={328}
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize={5.5}
          letterSpacing={0.8}
          fill="#6B6455"
        >
          OLIVE OIL
        </text>
      </svg>
    </motion.div>
  );
}