'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Wrench, Plug, Settings, Package } from 'lucide-react';

const ICONS = [Wrench, Plug, Settings, Package];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function Services() {
  const t = useTranslations('services');
  const items = t.raw('items') as { key: string; title: string; description: string }[];

  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
          className="max-w-3xl mb-16"
        >
          <p className="eyebrow text-copper mb-3">
            {t('title')}
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-navy-950 tracking-[-.04em] leading-[1.02]">
            {t('subtitle')}
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.key}
                variants={card}
                className="group bg-cream rounded-[1.75rem] p-7 border border-cream-dark hover:border-navy-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-64 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5 group-hover:bg-brand-blue transition-colors duration-300">
                  <Icon className="text-brand-blue group-hover:text-white transition-colors duration-300" size={22} />
                </div>
                <span className="text-xs font-black text-navy-300 ml-auto -mt-14 mb-10">0{i + 1}</span>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
