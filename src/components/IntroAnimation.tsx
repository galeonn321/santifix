'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const exitTransition = {
  duration: 0.85,
  ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

export default function IntroAnimation() {
  // Start visible so the intro is already present in the server-rendered HTML.
  // Waiting for useEffect here exposes the page for one frame before hydration.
  const [show, setShow] = useState(true);
  const [split, setSplit] = useState(false);

  useEffect(() => {
    let splitTimer: number | undefined;
    let hideTimer: number | undefined;
    const initializeTimer = window.setTimeout(() => {
      if (sessionStorage.getItem('santi-handyman-intro-v13')) {
        setShow(false);
        return;
      }

      document.body.style.overflow = 'hidden';

      splitTimer = window.setTimeout(() => setSplit(true), 1550);
      hideTimer = window.setTimeout(() => {
        document.body.style.overflow = '';
        sessionStorage.setItem('santi-handyman-intro-v13', '1');
        setShow(false);
      }, 2400);
    }, 0);

    return () => {
      window.clearTimeout(initializeTimer);
      window.clearTimeout(splitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  if (show !== true) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] flex select-none items-center justify-center overflow-hidden bg-white"
      initial={false}
      animate={{ y: split ? '-100%' : '0%' }}
      transition={exitTransition}
    >
      <motion.div
        className="relative flex flex-col items-center justify-center px-6"
        animate={{ opacity: split ? 0.85 : 1, y: split ? -24 : 0 }}
        transition={split ? { duration: 0.35, ease: 'easeOut' } : { duration: 0 }}
      >
        <motion.img
          src="/santi-handyman-mark.svg"
          alt=""
          className="h-36 w-36 object-contain sm:h-44 sm:w-44"
          initial={{ opacity: 0, y: 22, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.p
          className="mt-6 text-center text-[clamp(1.45rem,5vw,3rem)] font-extrabold tracking-[.13em] text-navy-950"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .45, ease: [0.16, 1, 0.3, 1] }}
        >
          SANTI HANDYMAN
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
