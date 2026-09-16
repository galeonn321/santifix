'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowUpRight, CalendarCheck, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const items = [
    { id: 'services', label: t('services') },
    { id: 'why', label: t('why') },
    { id: 'reviews', label: t('reviews') },
  ];

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    const sections = ['hero', 'services', 'why', 'booking', 'reviews']
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .5] });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const switchLocale = (next: string) => {
    if (next === locale) return;
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || '/');
    setOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Main navigation"
        animate={{ y: scrolled ? 0 : 2 }}
        className={`pointer-events-auto mx-auto flex h-[72px] max-w-7xl items-center justify-between rounded-[1.35rem] border px-3 transition-all duration-500 sm:px-4 ${scrolled ? 'border-white/80 bg-white/90 shadow-[0_18px_50px_rgba(0,26,59,.13)] backdrop-blur-xl' : 'border-navy-900/10 bg-white/65 shadow-[0_8px_30px_rgba(0,26,59,.06)] backdrop-blur-md'}`}
      >
        <button onClick={() => goTo('hero')} className="group flex h-14 w-[92px] items-center justify-center overflow-hidden rounded-2xl" aria-label="Santi Handyman — home">
          <Image src="/logo%20Santifyx.png" alt="Santi Handyman" width={1536} height={1024} priority className="h-[62px] w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
        </button>

        <div className="hidden items-center gap-1 rounded-2xl border border-navy-100/80 bg-navy-50/70 p-1.5 lg:flex">
          {items.map(item => (
            <button key={item.id} onClick={() => goTo(item.id)} className={`relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${active === item.id ? 'text-white' : 'text-navy-600 hover:text-navy-950'}`}>
              {active === item.id && <motion.span layoutId="active-nav" className="absolute inset-0 rounded-xl bg-navy-950 shadow-[0_6px_16px_rgba(0,26,59,.2)]" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex rounded-xl border border-navy-100 bg-white p-1 shadow-sm" aria-label="Language">
            {['en', 'es'].map(language => (
              <button key={language} onClick={() => switchLocale(language)} className={`relative rounded-lg px-2.5 py-2 text-[11px] font-black tracking-wider ${locale === language ? 'text-navy-950' : 'text-navy-400 hover:text-navy-700'}`}>
                {locale === language && <motion.span layoutId="active-language" className="absolute inset-0 rounded-lg bg-navy-100" />}
                <span className="relative">{language.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <button onClick={() => goTo('booking')} className="group flex items-center gap-2.5 rounded-2xl bg-brand-blue px-4 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(7,93,232,.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-950">
            <CalendarCheck size={17} />{t('bookNow')}<ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-white shadow-lg md:hidden" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? 'close' : 'menu'} initial={{ opacity: 0, rotate: -20, scale: .8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 20, scale: .8 }}>
              {open ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: .98 }} transition={{ duration: .28, ease: [0.16, 1, 0.3, 1] }} className="pointer-events-auto mx-auto mt-2 max-w-7xl overflow-hidden rounded-[1.5rem] border border-white bg-white/95 p-3 shadow-[0_24px_70px_rgba(0,26,59,.2)] backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {items.map((item, index) => (
                <motion.button key={item.id} onClick={() => goTo(item.id)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .04 + index * .045 }} className={`flex items-center justify-between rounded-2xl px-5 py-4 text-left font-bold ${active === item.id ? 'bg-navy-950 text-white' : 'text-navy-800 hover:bg-navy-50'}`}>
                  {item.label}<ArrowUpRight size={17} />
                </motion.button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-navy-100 pt-3">
              <div className="flex rounded-xl bg-navy-50 p-1">
                {['en', 'es'].map(language => <button key={language} onClick={() => switchLocale(language)} className={`flex-1 rounded-lg py-2.5 text-xs font-black ${locale === language ? 'bg-white text-navy-950 shadow-sm' : 'text-navy-400'}`}>{language.toUpperCase()}</button>)}
              </div>
              <button onClick={() => goTo('booking')} className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-3 py-3 text-sm font-bold text-white"><CalendarCheck size={17} />{t('bookNow')}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
