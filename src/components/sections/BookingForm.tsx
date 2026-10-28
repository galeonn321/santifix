'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { PROJECT_CATEGORIES } from '@/lib/contentful';

const SERVICES = ['Repairs', 'Installation', 'Maintenance', 'Assembly'];
const AREAS = [
  'Bathroom', 'Kitchen', 'Living Room', 'Bedroom',
  'Basement', 'Attic', 'Garage', 'Deck',
  'Porch', 'Closet', 'Doors', 'Windows',
  'Interior Walls', 'Exterior Walls', 'Gutters', 'Other Areas',
];

type Urgency = 'asap' | 'quote' | '';
type Status = 'idle' | 'loading' | 'success' | 'error';

interface Form {
  service: string;
  areas: string[];
  urgency: Urgency;
  description: string;
  name: string;
  email: string;
  phone: string;
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 30 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.22 } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -30, transition: { duration: 0.18 } }),
};

export default function BookingForm() {
  const t = useTranslations('booking');
  const servicesT = useTranslations('services');
  const areasT = useTranslations('areas');
  const serviceLabels = (servicesT.raw('items') as { title: string }[]).map(item => item.title);
  const areaLabels = areasT.raw('list') as string[];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>({
    service: '', areas: [], urgency: '',
    description: '', name: '', email: '', phone: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [website, setWebsite] = useState('');
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    const onProjectRequest = (event: Event) => {
      const detail = (event as CustomEvent<{ category: string; projectName: string }>).detail;
      if (!detail || typeof detail.projectName !== 'string') return;
      const index = PROJECT_CATEGORIES.findIndex(category => category === detail.category);
      if (index < 0) return;
      setForm(previous => ({
        ...previous,
        service: SERVICES[index],
        description: [previous.description, servicesT('projectInquiry', { title: detail.projectName })].filter(Boolean).join('\n'),
      }));
      startedAt.current ??= Date.now();
      setDir(1);
      setStep(1);
      setStatus('idle');
    };
    window.addEventListener('portfolio:request', onProjectRequest);
    return () => window.removeEventListener('portfolio:request', onProjectRequest);
  }, [servicesT]);

  const go = (next: 1 | 2 | 3) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleArea = (area: string) =>
    setForm(p => ({
      ...p,
      areas: p.areas.includes(area) ? p.areas.filter(a => a !== area) : [...p.areas, area],
    }));

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website, startedAt: startedAt.current ?? 0 }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const canNext1 = form.service !== '';
  const canNext2 = form.areas.length > 0;
  const canSubmit = form.urgency !== '' && form.name.trim() !== '' && (form.email.trim() !== '' || form.phone.trim() !== '');

  return (
    <section id="booking" className="relative py-28 bg-navy-950 overflow-hidden">
      <div className="paper-grid absolute inset-0 opacity-[.06]" />
      <div className="relative max-w-3xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center mb-12"
        >
          <p className="eyebrow text-brand-orange mb-3">
            {t('title')}
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-[-.04em] leading-tight mb-3">
            {t('subtitle')}
          </h2>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  n < step ? 'bg-brand-blue text-white'
                  : n === step ? 'bg-brand-blue text-white ring-4 ring-brand-blue/20'
                  : 'bg-navy-800 text-navy-300 border border-navy-700'
                }`}
              >
                {n < step ? <CheckCircle size={14} /> : n}
              </div>
              {n < 3 && (
                <div className={`w-10 h-px transition-colors duration-300 ${n < step ? 'bg-brand-blue' : 'bg-navy-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] p-6 sm:p-9 shadow-[0_30px_80px_rgba(0,0,0,.25)] overflow-hidden">
          <div className="absolute -left-[10000px]" aria-hidden="true">
            <label htmlFor="company-website">Website</label>
            <input
              id="company-website"
              name="website"
              type="text"
              value={website}
              onChange={event => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="text-green-500" size={30} />
              </div>
              <h3 className="text-xl font-bold text-navy-900">{t('step3.success')}</h3>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait" custom={dir}>
              {step === 1 && (
                <motion.div key="s1" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                  <h3 className="text-lg font-bold text-navy-900 mb-1">{t('step1.title')}</h3>
                  <p className="text-navy-500 text-sm mb-6">{t('step1.subtitle')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {SERVICES.map((s, index) => (
                      <button
                        key={s}
                        onClick={() => {
                          startedAt.current ??= Date.now();
                          setForm(p => ({ ...p, service: s }));
                        }}
                        className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                          form.service === s
                            ? 'border-brand-blue bg-brand-blue/5'
                            : 'border-cream-dark hover:border-navy-300'
                        }`}
                      >
                        <span className="font-semibold text-navy-900 text-sm">{serviceLabels[index]}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => go(2)}
                      disabled={!canNext1}
                      className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-40 hover:bg-navy-900 transition-colors"
                    >
                      {t('next')} <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                  <h3 className="text-lg font-bold text-navy-900 mb-1">{t('step2.title')}</h3>
                  <p className="text-navy-500 text-sm mb-6">{t('step2.subtitle')}</p>
                  <div className="flex flex-wrap gap-2">
                    {AREAS.map((area, index) => (
                      <button
                        key={area}
                        onClick={() => toggleArea(area)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                          form.areas.includes(area)
                            ? 'bg-brand-blue text-white border-brand-blue'
                            : 'bg-white text-navy-700 border-navy-200 hover:border-navy-400'
                        }`}
                      >
                        {areaLabels[index]}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={() => go(1)}
                      className="flex items-center gap-2 text-navy-700 px-5 py-3 rounded-full text-sm font-semibold hover:bg-navy-50 transition-colors"
                    >
                      <ChevronLeft size={16} /> {t('back')}
                    </button>
                    <button
                      onClick={() => go(3)}
                      disabled={!canNext2}
                      className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-full text-sm font-semibold disabled:opacity-40 hover:bg-navy-900 transition-colors"
                    >
                      {t('next')} <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit">
                  <h3 className="text-lg font-bold text-navy-900 mb-1">{t('step3.title')}</h3>
                  <p className="text-navy-500 text-sm mb-6">{t('step3.subtitle')}</p>

                  <p className="text-xs font-semibold text-navy-700 uppercase tracking-wider mb-3">{t('step3.urgency')}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {(['asap', 'quote'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setForm(p => ({ ...p, urgency: u }))}
                        className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          form.urgency === u
                            ? 'border-brand-blue bg-brand-blue/5 text-navy-900'
                            : 'border-cream-dark text-navy-600 hover:border-navy-300'
                        }`}
                      >
                        {t(`step3.${u}`)}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider block mb-1.5">
                        {t('step3.description')}
                      </label>
                      <textarea
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        placeholder={t('step3.descriptionPlaceholder')}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-600 resize-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider block mb-1.5">
                        {t('step3.name')}
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder={t('step3.namePlaceholder')}
                        className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-600 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider block mb-1.5">
                          {t('step3.email')}
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder={t('step3.emailPlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-600 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider block mb-1.5">
                          {t('step3.phone')}
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder={t('step3.phonePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-navy-200 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-navy-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-500 text-sm mb-4">{t('step3.error')}</p>
                  )}

                  <div className="flex justify-between">
                    <button
                      onClick={() => go(2)}
                      className="flex items-center gap-2 text-navy-700 px-5 py-3 rounded-full text-sm font-semibold hover:bg-navy-50 transition-colors"
                    >
                      <ChevronLeft size={16} /> {t('back')}
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || status === 'loading'}
                      className="bg-brand-blue text-white px-7 py-3 rounded-full text-sm font-semibold disabled:opacity-40 hover:bg-navy-900 transition-colors"
                    >
                      {status === 'loading' ? t('step3.submitting') : t('step3.submit')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
