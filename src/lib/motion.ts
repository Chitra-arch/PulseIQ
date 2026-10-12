import type { Variants } from "framer-motion";

export const fadeUp: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } } };
export const fadeIn: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } };
export const scaleIn: Variants = { hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 280, damping: 25 } } };
export const staggerContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } } };
export const slideIn: Variants = { hidden: { opacity: 0, x: -18 }, visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };