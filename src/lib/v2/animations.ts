import type { Variants } from "motion/react";

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.6 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
