'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = (next: string) => {
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/') || '/');
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="flex items-center" aria-label="Santi Handyman — home">
          <Image
            src="/santi-handyman-logo.png"
            alt="Santi Handyman"
            width={300}
            height={100}
            className="h-12 w-auto mix-blend-multiply"
            loading="eager"
          />
        </button>

        <div className="hidden md:flex items-center gap-7">
          <button
            onClick={() => scrollTo('services')}
            className="text-sm text-navy-700 hover:text-navy-500 transition-colors"
          >
            {t('services')}
          </button>
          <button onClick={() => scrollTo('why')} className="text-sm text-navy-700 hover:text-navy-500 transition-colors">
            {t('why')}
          </button>
          <button onClick={() => scrollTo('reviews')} className="text-sm text-navy-700 hover:text-navy-500 transition-colors">
            {t('reviews')}
          </button>

          <div className="flex items-center gap-1.5 text-sm">
            <button
              onClick={() => switchLocale('en')}
              className={`font-medium transition-colors ${
                locale === 'en' ? 'text-navy-900 font-bold' : 'text-navy-400 hover:text-navy-700'
              }`}
            >
              EN
            </button>
            <span className="text-navy-300">|</span>
            <button
              onClick={() => switchLocale('es')}
              className={`font-medium transition-colors ${
                locale === 'es' ? 'text-navy-900 font-bold' : 'text-navy-400 hover:text-navy-700'
              }`}
            >
              ES
            </button>
          </div>

          <button
            onClick={() => scrollTo('booking')}
            className="bg-brand-blue text-white text-sm px-5 py-2.5 rounded-full hover:bg-navy-900 transition-colors font-semibold shadow-sm"
          >
            {t('bookNow')}
          </button>
        </div>

        <button
          className="md:hidden text-navy-800 p-1"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-navy-100 px-6 py-5 flex flex-col gap-4">
          <button onClick={() => scrollTo('services')} className="text-left text-navy-800 font-semibold">
            {t('services')}
          </button>
          <button onClick={() => scrollTo('why')} className="text-left text-navy-800 font-semibold">{t('why')}</button>
          <button onClick={() => scrollTo('reviews')} className="text-left text-navy-800 font-semibold">{t('reviews')}</button>
          <button
            onClick={() => scrollTo('booking')}
            className="text-left text-navy-800 font-semibold"
          >
            {t('bookNow')}
          </button>
          <div className="flex gap-4 text-sm pt-1">
            <button
              onClick={() => switchLocale('en')}
              className={locale === 'en' ? 'font-bold text-navy-900' : 'text-navy-500'}
            >
              English
            </button>
            <button
              onClick={() => switchLocale('es')}
              className={locale === 'es' ? 'font-bold text-navy-900' : 'text-navy-500'}
            >
              Español
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
