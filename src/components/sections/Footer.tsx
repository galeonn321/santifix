'use client';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
          <div>
            <div className="bg-white rounded-xl inline-block p-2 mb-3">
              <Image
                src="/santi-handyman-logo.png"
                alt="Santi Handyman"
                width={300}
                height={100}
                className="h-14 w-auto"
              />
            </div>
            <p className="text-navy-300 text-sm max-w-xs">{t('tagline')}</p>
            <div className="flex items-center gap-1.5 mt-3 text-navy-400 text-sm">
              <MapPin size={14} />
              <span>{t('location')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="#booking"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-white hover:text-navy-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              {t('cta')} <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="border-t border-navy-800 pt-8">
          <p className="text-navy-500 text-xs text-center">
            © {year} Santi Handyman. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
