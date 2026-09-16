'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

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
<<<<<<< HEAD
    if (sessionStorage.getItem('santi-handyman-intro-v13')) {
      setShow(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    setShow(true);

    const splitTimer = window.setTimeout(() => setSplit(true), 1550);
    const hideTimer = window.setTimeout(() => {
      document.body.style.overflow = '';
      sessionStorage.setItem('santi-handyman-intro-v13', '1');
      setShow(false);
    }, 2400);
=======
    let splitTimer: number | undefined;
    let hideTimer: number | undefined;
    const initializeTimer = window.setTimeout(() => {
      if (sessionStorage.getItem('santi-handyman-intro-v10')) {
        setShow(false);
        return;
      }

      document.body.style.overflow = 'hidden';
      setShow(true);
      splitTimer = window.setTimeout(() => setSplit(true), 1300);
      hideTimer = window.setTimeout(() => {
        document.body.style.overflow = '';
        sessionStorage.setItem('santi-handyman-intro-v10', '1');
        setShow(false);
      }, 2350);
    }, 0);
>>>>>>> b1ab14939fcd6e214e0f10769dab79b6bf6d3068

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
<<<<<<< HEAD
        <motion.img
          src="/santi-handyman-mark.svg"
          alt=""
          className="h-36 w-36 object-contain sm:h-44 sm:w-44"
          initial={{ opacity: 0, y: 22, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
=======
        <Image
          src="/santi-handyman-mark.svg"
          alt=""
          width={512}
          height={512}
          className="h-full w-full object-contain"
>>>>>>> b1ab14939fcd6e214e0f10769dab79b6bf6d3068
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
<<<<<<< HEAD
    </motion.div>
=======

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
        <Image
          src="/santi-handyman-mark.svg"
          alt=""
          width={512}
          height={512}
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
>>>>>>> b1ab14939fcd6e214e0f10769dab79b6bf6d3068
  );
}
