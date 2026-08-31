'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, MapPin, Clock, Star } from 'lucide-react';

const ICONS = [ShieldCheck, MapPin, Clock, Star];

export default function WhySantiHandyman() {
  const t = useTranslations('why');
  const items = t.raw('items') as { title: string; description: string }[];

  return (
    <section id="why" className="relative py-28 bg-navy-950 overflow-hidden">
      <div className="paper-grid absolute inset-0 opacity-[.05]" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mb-16"
        >
          <p className="eyebrow text-brand-orange mb-4">{t('eyebrow')}</p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-[-.04em] leading-[1.02] mb-5">{t('title')}</h2>
          <p className="text-lg text-navy-300 leading-relaxed">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="relative border-b sm:border-r border-white/10 p-7 lg:p-8 last:border-r-0"
              >
                <span className="absolute right-7 top-8 text-xs font-black text-white/20">0{i + 1}</span>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-8">
                  <Icon className="text-brand-blue-light" size={23} />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-navy-300 text-sm leading-relaxed max-w-xs">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
