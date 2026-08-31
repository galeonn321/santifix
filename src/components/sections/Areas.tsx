'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Home, MapPin } from 'lucide-react';

export default function Areas() {
  const t = useTranslations('areas');
  const list = t.raw('list') as string[];

  return (
    <section id="areas" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="grid md:grid-cols-[.9fr_1.1fr] gap-8 md:items-end mb-14"
        >
          <div>
            <p className="eyebrow text-copper mb-4">{t('eyebrow')}</p>
            <h2 className="text-4xl md:text-6xl font-black text-navy-950 tracking-[-.04em] leading-[1.02]">
              {t('title')}
            </h2>
          </div>
          <p className="text-navy-600 text-lg md:text-xl leading-relaxed md:max-w-lg md:ml-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-[.72fr_1.28fr] gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-h-72 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue to-navy-900 p-8 text-white"
          >
            <div className="paper-grid absolute inset-0 opacity-10" />
            <Home size={54} strokeWidth={1.25} className="relative mb-16 text-brand-blue-light" />
            <p className="relative text-3xl font-black tracking-tight leading-tight mb-4">{t('cardTitle')}</p>
            <span className="relative inline-flex items-center gap-2 text-sm font-bold"><MapPin size={16}/>{t('cardLocation')}</span>
            <ArrowUpRight className="absolute right-7 top-7 text-white/80" />
          </motion.div>
          <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-[2rem] bg-white p-5 sm:p-7 border border-cream-dark"
        >
          {list.map(area => (
            <motion.span
              key={area}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
              }}
              className="group flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-navy-800 hover:bg-navy-50 transition-colors cursor-default"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-navy-200 group-hover:bg-copper transition-colors" />{area}
            </motion.span>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
