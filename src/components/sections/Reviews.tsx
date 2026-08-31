'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Star, ExternalLink } from 'lucide-react';

export default function Reviews() {
  const t = useTranslations('reviews');
  const items = t.raw('items') as { name: string; location: string; text: string; rating: number }[];

  return (
    <section id="reviews" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <p className="eyebrow text-copper mb-3">
            {t('title')}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-navy-900 tracking-tight">
            {t('subtitle')}
          </h2>
          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-navy-100 bg-white px-5 py-3 shadow-sm">
            <div className="flex gap-1" aria-label={t('ratingLabel')}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={16} className="fill-copper text-copper" />
              ))}
            </div>
            <span className="h-4 w-px bg-navy-200" />
            <strong className="text-sm text-navy-900">5.0</strong>
            <span className="text-sm text-navy-500">· {t('reviewsCount')}</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {items.map(item => (
            <motion.div
              key={item.name}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-white rounded-[1.75rem] p-7 border border-cream-dark shadow-[0_12px_35px_rgba(19,34,68,.06)]"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-navy-700 text-sm leading-relaxed mb-5">&ldquo;{item.text}&rdquo;</p>
              <div>
                <p className="font-bold text-navy-900 text-sm">{item.name}</p>
                <p className="text-navy-400 text-xs">{item.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="#booking"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900 transition-colors border border-navy-200 px-6 py-3 rounded-full hover:border-navy-400"
          >
            {t('requestService')} <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
