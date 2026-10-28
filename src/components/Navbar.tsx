'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, MapPin, Menu, X } from 'lucide-react';

const navItems = [
  { id: 'services', label: 'services', number: '01' },
  { id: 'why', label: 'why', number: '02' },
  { id: 'reviews', label: 'reviews', number: '03' },
] as const;

const spring = { type: 'spring', stiffness: 380, damping: 34 } as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const updateNavigation = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);

        const activationLine = window.innerHeight * 0.34;
        const currentSection = navItems.find(({ id }) => {
          const section = document.getElementById(id);
          if (!section) return false;
          const bounds = section.getBoundingClientRect();
          return bounds.top <= activationLine && bounds.bottom > activationLine;
        });

        setActiveSection(currentSection?.id ?? null);
      });
    };

    updateNavigation();
    window.addEventListener('scroll', updateNavigation, { passive: true });
    window.addEventListener('resize', updateNavigation);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateNavigation);
      window.removeEventListener('resize', updateNavigation);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    desktopQuery.addEventListener('change', closeAtDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      desktopQuery.removeEventListener('change', closeAtDesktop);
    };
  }, [open]);

  const switchLocale = (nextLocale: 'en' | 'es') => {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    setOpen(false);
    router.push(segments.join('/') || '/');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    setOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <motion.nav
        aria-label={t('ariaLabel')}
        initial={false}
        animate={{
          opacity: 1,
          y: scrolled ? 0 : 6,
          scale: 1,
          marginTop: scrolled ? 12 : 16,
        }}
        transition={reduceMotion ? { duration: 0 } : { ...spring, opacity: { duration: 0.4 } }}
        className={`pointer-events-auto relative mx-auto flex h-[4.5rem] w-fit max-w-[calc(100vw-1.5rem)] items-center gap-3 px-2.5 transition-[background-color,border-color,box-shadow,border-radius,backdrop-filter] duration-500 sm:max-w-[calc(100vw-2.5rem)] sm:px-3.5 ${
          scrolled
            ? 'rounded-[1.4rem] border border-white/80 bg-white/88 shadow-[0_18px_60px_rgba(0,26,59,.14),0_2px_8px_rgba(0,26,59,.06)] backdrop-blur-2xl'
            : 'rounded-none border border-transparent bg-transparent shadow-none backdrop-blur-none'
        }`}
      >
        <button
          type="button"
          onClick={() => scrollTo('hero')}
          className="group flex min-w-0 items-center gap-2.5 rounded-xl pr-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 sm:gap-3"
          aria-label="Santi Handyman, home"
        >
          <motion.span
            whileHover={reduceMotion ? undefined : { rotate: -5, scale: 1.06 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
            transition={spring}
            className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[.9rem] transition-colors duration-500 sm:size-12 ${
              scrolled
                ? 'bg-[linear-gradient(145deg,#f7fbff,#e7f0fb)] shadow-[inset_0_0_0_1px_rgba(7,93,232,.09)]'
                : 'bg-white/70'
            }`}
          >
            <Image src="/santi-handyman-mark.svg" alt="" width={48} height={48} className="size-9 sm:size-10" priority />
            <span className="absolute inset-x-2 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-copper transition-transform duration-300 group-hover:scale-x-100" />
          </motion.span>
          <span className="hidden leading-none min-[390px]:block">
            <span className={`block whitespace-nowrap text-[.82rem] font-black tracking-[.18em] transition-colors duration-500 sm:text-[.9rem] ${
              scrolled ? 'text-navy-950' : 'text-white'
            }`}>
              SANTI
            </span>
            <span className={`mt-1 block whitespace-nowrap text-[.64rem] font-extrabold tracking-[.12em] transition-colors duration-500 sm:text-[.7rem] ${
              scrolled ? 'text-brand-blue' : 'text-copper'
            }`}>
              HANDYMAN
            </span>
          </span>
        </button>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <div className={`flex items-center rounded-full p-1 transition-colors duration-500 ${
            scrolled ? 'border border-navy-100/80 bg-navy-50/75' : 'border border-transparent bg-transparent'
          }`}>
            {navItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <motion.button
                  type="button"
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className={`relative rounded-full px-4 py-2.5 text-[.82rem] font-bold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                    active
                      ? 'text-navy-950'
                      : scrolled
                        ? 'text-navy-600 hover:text-navy-950'
                        : 'text-white/78 hover:text-white'
                  }`}
                  aria-current={active ? 'location' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav-section"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_3px_12px_rgba(0,37,79,.11)]"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10">{t(item.label)}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 px-2 xl:flex">
            <span className="relative flex size-2">
              {!reduceMotion && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className={`whitespace-nowrap text-[.68rem] font-extrabold uppercase tracking-[.12em] transition-colors duration-500 ${
              scrolled ? 'text-navy-500' : 'text-white/70'
            }`}>
              {t('availability')}
            </span>
          </div>

          <div className="flex items-center rounded-full border border-navy-100 bg-white/70 p-1 text-[.7rem] font-black">
            {(['en', 'es'] as const).map((language) => (
              <button
                type="button"
                key={language}
                onClick={() => switchLocale(language)}
                className={`relative rounded-full px-2.5 py-2 uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                  locale === language ? 'text-white' : 'text-navy-400 hover:text-navy-800'
                }`}
                aria-pressed={locale === language}
              >
                {locale === language && (
                  <motion.span
                    layoutId="active-language"
                    className="absolute inset-0 rounded-full bg-navy-950"
                    transition={spring}
                  />
                )}
                <span className="relative z-10">{language}</span>
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            onClick={() => scrollTo('booking')}
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            className="group relative isolate flex items-center gap-2 overflow-hidden rounded-full bg-brand-blue px-5 py-3 text-[.82rem] font-extrabold text-white shadow-[0_8px_24px_rgba(7,93,232,.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            <span className="absolute inset-0 -z-10 translate-y-full bg-navy-950 transition-transform duration-300 ease-out group-hover:translate-y-0" />
            <span>{t('bookNow')}</span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
          </motion.button>
        </div>

        <motion.button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((current) => !current)}
          whileTap={reduceMotion ? undefined : { scale: 0.92 }}
          className="ml-auto flex size-11 items-center justify-center rounded-xl bg-navy-950 text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 lg:hidden"
          aria-label={open ? t('close') : t('menu')}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'menu'}
              initial={reduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label={t('close')}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
              className="pointer-events-auto fixed inset-0 -z-10 cursor-default bg-navy-950/35 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              id="mobile-navigation"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0 } : spring}
              className="pointer-events-auto mx-auto mt-2 max-h-[calc(100dvh-6.75rem)] max-w-3xl overflow-y-auto rounded-[1.75rem] border border-white/10 bg-navy-950 p-3 text-white shadow-[0_28px_80px_rgba(0,26,59,.35)] lg:hidden"
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.08 }}
                className="flex items-center justify-between rounded-[1.15rem] border border-white/8 bg-white/5 px-4 py-3"
              >
                <span className="flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.14em] text-white/65">
                  <MapPin size={14} className="text-copper" /> Austin, Texas
                </span>
                <span className="flex items-center gap-2 text-[.68rem] font-extrabold uppercase tracking-[.12em] text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> {t('available')}
                </span>
              </motion.div>

              <div className="px-2 py-5">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    initial={reduceMotion ? false : { opacity: 0, x: -22 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={reduceMotion ? { duration: 0 } : { delay: 0.1 + index * 0.07, ...spring }}
                    className="group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                  >
                    <span className="font-mono text-[.65rem] font-bold text-copper">{item.number}</span>
                    <span className="text-[clamp(1.55rem,7vw,2.25rem)] font-black tracking-[-.04em] text-white">
                      {t(item.label)}
                    </span>
                    <ArrowUpRight
                      size={22}
                      className="ml-auto text-white/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-copper"
                      aria-hidden="true"
                    />
                  </motion.button>
                ))}
              </div>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <div className="grid grid-cols-2 rounded-[1.1rem] bg-white/7 p-1">
                  {(['en', 'es'] as const).map((language) => (
                    <button
                      type="button"
                      key={language}
                      onClick={() => switchLocale(language)}
                      className={`relative rounded-[.9rem] px-4 py-3 text-xs font-black uppercase tracking-[.12em] ${
                        locale === language ? 'text-navy-950' : 'text-white/55'
                      }`}
                      aria-pressed={locale === language}
                    >
                      {locale === language && (
                        <motion.span layoutId="mobile-active-language" className="absolute inset-0 rounded-[.9rem] bg-white" transition={spring} />
                      )}
                      <span className="relative z-10">{language === 'en' ? 'English' : 'Español'}</span>
                    </button>
                  ))}
                </div>

                <motion.button
                  type="button"
                  onClick={() => scrollTo('booking')}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="flex items-center justify-center gap-3 rounded-[1.1rem] bg-copper px-6 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(255,100,19,.2)]"
                >
                  {t('bookNow')} <ArrowUpRight size={18} aria-hidden="true" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
