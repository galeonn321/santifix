'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ArrowRight, CheckCircle2, Clock3, MapPin, Star, Wrench } from 'lucide-react';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export default function Hero() {
  const t = useTranslations('hero');

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-[820px] lg:min-h-screen flex flex-col justify-center bg-cream pt-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="paper-grid absolute inset-y-0 right-0 w-1/2 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
        <div className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl w-full mx-auto px-5 sm:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.08fr_.92fr] items-center gap-16">
        <div className="max-w-3xl">
          <motion.p
            {...fadeUp(0)}
            className="eyebrow inline-flex items-center gap-2 text-copper mb-6"
          >
            {t('tagline')}
          </motion.p>

          <motion.h1
            {...fadeUp(0.12)}
            className="text-[clamp(3.3rem,7vw,6.5rem)] font-black text-navy-950 leading-[.94] tracking-[-.055em] mb-7 whitespace-pre-line"
          >
            {t('headline')}
          </motion.h1>

          <motion.p
            {...fadeUp(0.24)}
            className="text-lg md:text-xl text-navy-600 leading-relaxed mb-9 max-w-xl"
          >
            {t('subtext')}
          </motion.p>

          <motion.div {...fadeUp(0.36)} className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('booking')}
              className="group bg-brand-blue text-white px-7 py-4 rounded-full text-base font-bold hover:bg-navy-900 transition-all duration-200 shadow-[0_12px_30px_rgba(0,37,79,.18)] hover:-translate-y-0.5 inline-flex items-center gap-3"
            >
              {t('bookNow')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('booking')}
              className="border border-navy-300 bg-white/60 text-navy-800 px-7 py-4 rounded-full text-base font-bold hover:border-navy-800 transition-all duration-200"
            >
              {t('getQuote')}
            </button>
          </motion.div>
          <motion.div {...fadeUp(0.48)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-600">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-copper" />{t('insured')}</span>
            <span className="inline-flex items-center gap-2"><Clock3 size={17} className="text-copper" />{t('response')}</span>
            <span className="inline-flex items-center gap-2"><MapPin size={17} className="text-copper" />Austin, TX</span>
          </motion.div>
        </div>
        <motion.div {...fadeUp(0.25)} className="relative hidden lg:block">
          <div className="relative mx-auto aspect-[4/5] max-w-[470px] rounded-[2.5rem] bg-navy-900 overflow-hidden shadow-[0_32px_80px_rgba(11,24,48,.25)]">
            <div className="paper-grid absolute inset-0 opacity-10" />
            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full border-[52px] border-brand-blue" />
            <div className="absolute inset-x-10 top-12 flex justify-between items-start">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur"><Wrench className="text-brand-blue-light" size={30}/></div>
              <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70">AUSTIN LOCAL</span>
            </div>
            <div className="absolute inset-x-10 bottom-12">
              <p className="text-brand-blue-light eyebrow mb-3">{t('cardEyebrow')}</p>
              <p className="text-4xl font-black leading-tight tracking-tight text-white">{t('cardTitle')}</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4"><p className="text-3xl font-black text-navy-900">5.0</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(i=><Star key={i} size={12} className="fill-copper text-copper"/>)}</div></div>
                <div className="rounded-2xl bg-brand-blue p-4 text-white"><p className="text-3xl font-black">10</p><p className="text-xs font-bold mt-1">{t('reviewsCount')}</p></div>
              </div>
            </div>
          </div>
          <div className="absolute -left-4 top-1/2 rounded-2xl bg-white p-4 shadow-xl flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50"><CheckCircle2 className="text-green-600" size={20}/></span><span><b className="block text-sm text-navy-900">{t('jobDone')}</b><span className="text-xs text-navy-400">{t('today')}</span></span></div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
