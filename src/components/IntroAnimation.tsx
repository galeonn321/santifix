'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const revealTransition = {
  duration: 0.9,
  ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

const markSize = 'clamp(240px, 34vw, 390px)';

export default function IntroAnimation() {
  const [show, setShow] = useState<boolean | null>(null);
  const [split, setSplit] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('santi-handyman-intro-v10')) {
      setShow(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    setShow(true);

    const splitTimer = window.setTimeout(() => setSplit(true), 1300);
    const hideTimer = window.setTimeout(() => {
      document.body.style.overflow = '';
      sessionStorage.setItem('santi-handyman-intro-v10', '1');
      setShow(false);
    }, 2350);

    return () => {
      window.clearTimeout(splitTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  if (show !== true) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden select-none"
    >
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: split ? 0 : 1 }}
        transition={split
          ? { duration: 0.55, delay: 0.25, ease: 'easeOut' }
          : { duration: 0 }}
      />

      <motion.div
        className="absolute inset-y-0 left-0 w-[50.05%] bg-white will-change-transform"
        animate={{ x: split ? '-100%' : '0%' }}
        transition={revealTransition}
      />
      <motion.div
        className="absolute inset-y-0 right-0 w-[50.05%] bg-white will-change-transform"
        animate={{ x: split ? '100%' : '0%' }}
        transition={revealTransition}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 z-10"
        style={{
          width: markSize,
          height: markSize,
          marginLeft: `calc(${markSize} / -2)`,
          marginTop: `calc(${markSize} / -2)`,
          clipPath: 'inset(0 50% 0 0)',
        }}
        initial={{ opacity: 0, x: -44, scale: 0.84 }}
        animate={split
          ? { opacity: 0.85, x: '-62vw', scale: 1.06 }
          : { opacity: 1, x: 0, scale: 1 }}
        transition={split
          ? revealTransition
          : { duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/santi-handyman-mark.svg"
          alt=""
          className="h-full w-full object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-10"
        style={{
          width: markSize,
          height: markSize,
          marginLeft: `calc(${markSize} / -2)`,
          marginTop: `calc(${markSize} / -2)`,
          clipPath: 'inset(0 0 0 50%)',
        }}
        initial={{ opacity: 0, x: 44, scale: 0.84 }}
        animate={split
          ? { opacity: 0.85, x: '62vw', scale: 1.06 }
          : { opacity: 1, x: 0, scale: 1 }}
        transition={split
          ? revealTransition
          : { duration: 0.72, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/santi-handyman-mark.svg"
          alt=""
          className="h-full w-full object-contain"
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 h-44 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-brand-orange shadow-[0_0_22px_rgba(255,100,19,.55)]"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={split
          ? { opacity: 0, scaleY: 1.8 }
          : { opacity: 1, scaleY: 1 }}
        transition={split
          ? { duration: 0.35, ease: 'easeOut' }
          : { duration: 0.35, delay: 0.82, ease: 'easeOut' }}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 z-20 h-1 bg-gradient-to-r from-brand-blue via-brand-orange to-navy-900"
        initial={{ scaleX: 0, transformOrigin: 'center' }}
        animate={{ scaleX: split ? 0 : 1 }}
        transition={{ duration: split ? 0.3 : 1.1, ease: 'easeOut' }}
      />
    </div>
  );
}
