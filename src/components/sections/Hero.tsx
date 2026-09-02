'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, CheckCircle2, Clock3, MapPin, Star } from 'lucide-react';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  },
});

export default function Hero() {
  const t = useTranslations('hero');
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const cardWidth = useTransform(scrollYProgress, [0, 0.72], ['100vw', '95vw']);
  const cardHeight = useTransform(scrollYProgress, [0, 0.72], ['100svh', '95svh']);
  const cardRadius = useTransform(scrollYProgress, [0, 0.72], ['0rem', '2.25rem']);
  const cardShadow = useTransform(
    scrollYProgress,
    [0, 0.72],
    ['0 0 0 rgba(0,26,59,0)', '0 30px 90px rgba(0,26,59,.24)'],
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -14]);

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section ref={heroRef} id="hero" className="relative h-[145svh] bg-cream">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <motion.div
          style={{
            width: reduceMotion ? '95vw' : cardWidth,
            height: reduceMotion ? '95svh' : cardHeight,
            borderRadius: reduceMotion ? '2.25rem' : cardRadius,
            boxShadow: reduceMotion ? '0 30px 90px rgba(0,26,59,.24)' : cardShadow,
          }}
          className="relative isolate overflow-hidden bg-navy-950"
        >
          <motion.div
            style={{ scale: reduceMotion ? 1 : imageScale }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/hero-image.avif"
              alt={t('imageAlt')}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center] sm:object-center"
            />
          </motion.div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,18,40,.91)_0%,rgba(0,24,52,.73)_38%,rgba(0,20,43,.24)_68%,rgba(0,15,33,.16)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,12,28,.34)_0%,transparent_34%,rgba(0,12,28,.56)_100%)]" />
          <div className="absolute inset-0 opacity-[.12] [background-image:radial-gradient(rgba(255,255,255,.8)_0.6px,transparent_0.6px)] [background-size:5px_5px]" />

          <motion.div
            style={{ y: reduceMotion ? 0 : contentY }}
            className="relative z-10 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-end px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-14 lg:pb-12 xl:px-20"
          >
            <div className="max-w-[820px]">
              <motion.h1
                {...fadeUp(0.08)}
                className="max-w-[800px] whitespace-pre-line text-[clamp(3rem,8vw,7rem)] font-black leading-[.9] tracking-[-.06em] text-white"
              >
                {t('headline')}
              </motion.h1>

              <motion.p
                {...fadeUp(0.17)}
                className="mt-5 max-w-xl text-base leading-relaxed text-white/72 sm:mt-6 sm:text-lg lg:text-xl"
              >
                {t('subtext')}
              </motion.p>

              <motion.div {...fadeUp(0.26)} className="mt-7 flex flex-col gap-3 min-[430px]:flex-row sm:mt-8">
                <motion.button
                  type="button"
                  onClick={scrollToBooking}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-black text-navy-950 shadow-[0_14px_36px_rgba(0,0,0,.2)] transition-colors hover:bg-copper hover:text-white sm:px-7 sm:py-4 sm:text-base"
                >
                  {t('bookNow')}
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={scrollToServices}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-colors hover:border-white/50 hover:bg-white/15 sm:px-7 sm:py-4 sm:text-base"
                >
                  {t('viewServices')}
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              {...fadeUp(0.35)}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/14 pt-5 text-[.72rem] font-bold text-white/68 sm:mt-9 sm:gap-x-7 sm:text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <Star size={16} className="fill-copper text-copper" aria-hidden="true" />
                {t('thumbtackReviews')}
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-copper" aria-hidden="true" />
                {t('jobsDone')}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} className="text-copper" aria-hidden="true" />
                {t('response')}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-copper" aria-hidden="true" />
                Austin, TX
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
