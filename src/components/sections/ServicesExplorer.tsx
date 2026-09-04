'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronRight,
  Hammer,
  Images,
  MapPin,
  MoveHorizontal,
  Package,
  Plug,
  Settings,
  Wrench,
} from 'lucide-react';
import type { Project, ServiceCategory, ServiceType } from '@/lib/contentful';

const ICONS = {
  wrench: Wrench,
  plug: Plug,
  settings: Settings,
  package: Package,
} as const;

interface ServicesExplorerProps {
  categories: ServiceCategory[];
  serviceTypes: ServiceType[];
  projects: Project[];
}

function BeforeAfter({ project }: { project: Project }) {
  const t = useTranslations('services');
  const [position, setPosition] = useState(50);

  return (
    <div className="group/comparison relative aspect-[4/3] overflow-hidden bg-navy-900">
      <Image
        src={project.afterImage.url}
        alt={project.afterImage.description || `${t('after')}: ${project.title}`}
        fill
        sizes="(min-width: 1024px) 42vw, 92vw"
        className="object-cover"
      />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={project.beforeImage.url}
          alt={project.beforeImage.description || `${t('before')}: ${project.title}`}
          fill
          sizes="(min-width: 1024px) 42vw, 92vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-navy-950/10" />

      <span className="absolute left-4 top-4 rounded-full bg-navy-950/76 px-3 py-1.5 text-[.66rem] font-black uppercase tracking-[.14em] text-white backdrop-blur-md">
        {t('before')}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[.66rem] font-black uppercase tracking-[.14em] text-navy-950 backdrop-blur-md">
        {t('after')}
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,26,59,.18),0_0_24px_rgba(0,0,0,.22)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-copper text-white shadow-xl">
          <MoveHorizontal size={18} aria-hidden="true" />
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={t('comparisonLabel', { title: project.title })}
        className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
      />

      <span className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-navy-950/72 px-3 py-1.5 text-[.65rem] font-bold text-white/88 opacity-100 backdrop-blur-md transition-opacity sm:opacity-0 sm:group-hover/comparison:opacity-100">
        <MoveHorizontal size={13} aria-hidden="true" />
        {t('dragHint')}
      </span>
    </div>
  );
}

export default function ServicesExplorer({ categories, serviceTypes, projects }: ServicesExplorerProps) {
  const t = useTranslations('services');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);

  const availableTypes = useMemo(
    () => serviceTypes.filter((serviceType) => serviceType.categoryId === selectedCategoryId),
    [selectedCategoryId, serviceTypes],
  );

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const selectedType = availableTypes.find((serviceType) => serviceType.id === selectedTypeId);
  const visibleProjects = useMemo(
    () => projects.filter((project) => project.serviceTypeId === selectedTypeId),
    [projects, selectedTypeId],
  );

  const chooseCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedTypeId(null);
  };

  const projectCountForCategory = (categoryId: string) => {
    const typeIds = new Set(
      serviceTypes
        .filter((serviceType) => serviceType.categoryId === categoryId)
        .map((serviceType) => serviceType.id),
    );
    return projects.filter((project) => typeIds.has(project.serviceTypeId)).length;
  };

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const formattedDate = (date: string) => {
    if (!date) return '';
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-US' : 'en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <section id="services" className="relative overflow-hidden bg-cream py-24 sm:py-28">
      <div className="paper-grid absolute inset-0 opacity-45" />
      <div className="absolute -right-36 top-20 size-[30rem] rounded-full bg-brand-blue/6 blur-3xl" />
      <div className="absolute -left-32 bottom-40 size-[24rem] rounded-full bg-copper/7 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-12 grid items-end gap-7 lg:grid-cols-[1fr_.72fr] lg:gap-16"
        >
          <div>
            <p className="eyebrow mb-3 text-copper">{t('title')}</p>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-[-.045em] text-navy-950 sm:text-5xl lg:text-6xl">
              {t('subtitle')}
            </h2>
          </div>
          <div className="border-l-2 border-copper/35 pl-5 lg:mb-1">
            <p className="text-base leading-relaxed text-navy-600 sm:text-lg">{t('exploreIntro')}</p>
          </div>
        </motion.div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-xs font-black uppercase tracking-[.16em] text-navy-500">{t('chooseCategory')}</p>
          <span className="hidden items-center gap-2 text-xs font-semibold text-navy-400 sm:flex">
            <span className="size-1.5 rounded-full bg-copper" />
            {t('chooseCategoryHint')}
          </span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category, index) => {
            const Icon = ICONS[category.icon as keyof typeof ICONS] ?? Hammer;
            const selected = category.id === selectedCategoryId;
            const projectCount = projectCountForCategory(category.id);
            const typeCount = serviceTypes.filter((serviceType) => serviceType.categoryId === category.id).length;

            return (
              <motion.button
                key={category.id}
                type="button"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.52 } },
                }}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                onClick={() => chooseCategory(category.id)}
                aria-pressed={selected}
                aria-controls="service-projects"
                className={`group relative min-h-72 overflow-hidden rounded-[1.8rem] border p-6 text-left shadow-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-4 ${
                  selected
                    ? 'border-navy-950 bg-navy-950 text-white shadow-[0_24px_60px_rgba(0,26,59,.2)]'
                    : 'border-white bg-white text-navy-950 hover:border-navy-200 hover:shadow-xl'
                }`}
              >
                <span className={`absolute -right-3 -top-8 text-[7rem] font-black leading-none tracking-[-.08em] transition-colors ${selected ? 'text-white/[.045]' : 'text-navy-950/[.035]'}`}>
                  0{index + 1}
                </span>
                <span className={`relative mb-12 flex size-13 items-center justify-center rounded-2xl transition-colors ${selected ? 'bg-copper text-white' : 'bg-brand-blue/9 text-brand-blue group-hover:bg-brand-blue group-hover:text-white'}`}>
                  <Icon size={23} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="relative block text-xl font-black tracking-[-.025em]">{category.name}</span>
                <span className={`relative mt-2 line-clamp-3 block text-sm leading-relaxed ${selected ? 'text-white/62' : 'text-navy-500'}`}>
                  {category.description}
                </span>
                <span className="absolute inset-x-6 bottom-5 flex items-center justify-between gap-3">
                  <span className={`text-[.68rem] font-extrabold uppercase tracking-[.12em] ${selected ? 'text-white/55' : 'text-navy-400'}`}>
                    {t('categoryStats', { types: typeCount, projects: projectCount })}
                  </span>
                  <span className={`flex size-8 items-center justify-center rounded-full transition-all ${selected ? 'rotate-90 bg-white text-navy-950' : 'bg-navy-50 text-navy-700 group-hover:bg-copper group-hover:text-white'}`}>
                    <ChevronRight size={16} aria-hidden="true" />
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              id="service-projects"
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative mt-6 overflow-hidden rounded-[2.25rem] bg-navy-950 px-5 py-7 shadow-[0_30px_90px_rgba(0,26,59,.2)] sm:px-8 sm:py-9 lg:px-10"
            >
              <div className="paper-grid absolute inset-0 opacity-[.07]" />
              <div className="absolute -right-32 -top-32 size-80 rounded-full bg-brand-blue/25 blur-3xl" />
              <div className="absolute -bottom-36 left-1/4 size-72 rounded-full bg-copper/12 blur-3xl" />

              <div className="relative">
                <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
                  <div>
                    <p className="eyebrow mb-2 text-copper">{t('portfolioEyebrow')}</p>
                    <h3 className="text-3xl font-black tracking-[-.035em] text-white sm:text-4xl">
                      {selectedCategory.name}
                    </h3>
                  </div>
                  <p className="max-w-lg text-sm leading-relaxed text-white/58 md:text-right">
                    {t('chooseTypeHint')}
                  </p>
                </div>

                {availableTypes.length > 0 ? (
                  <>
                    <p className="mb-4 text-xs font-black uppercase tracking-[.16em] text-white/52">{t('chooseType')}</p>
                    <div className="flex flex-wrap gap-2.5">
                      {availableTypes.map((serviceType) => {
                        const active = serviceType.id === selectedTypeId;
                        const count = projects.filter((project) => project.serviceTypeId === serviceType.id).length;

                        return (
                          <motion.button
                            key={serviceType.id}
                            type="button"
                            onClick={() => setSelectedTypeId(serviceType.id)}
                            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                            aria-pressed={active}
                            className={`rounded-full border px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper ${
                              active
                                ? 'border-white bg-white text-navy-950'
                                : 'border-white/15 bg-white/[.055] text-white/72 hover:border-white/35 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {serviceType.name}
                            <span className={`ml-2 text-[.68rem] ${active ? 'text-brand-blue' : 'text-white/38'}`}>{count}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <AnimatePresence mode="wait">
                      {!selectedType ? (
                        <motion.div
                          key="type-prompt"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-white/14 bg-white/[.035] px-6 text-center"
                        >
                          <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/8 text-copper">
                            <Images size={22} aria-hidden="true" />
                          </span>
                          <p className="font-bold text-white">{t('selectTypePrompt')}</p>
                          <p className="mt-1 max-w-md text-sm text-white/46">{t('selectTypePromptHint')}</p>
                        </motion.div>
                      ) : visibleProjects.length > 0 ? (
                        <motion.div
                          key={selectedType.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.35 }}
                          className="mt-10"
                        >
                          <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[.14em] text-copper">{t('realProjects')}</p>
                              <h4 className="mt-1 text-2xl font-black tracking-[-.025em] text-white">{selectedType.name}</h4>
                            </div>
                            <p className="text-sm text-white/48">{t('projectCount', { count: visibleProjects.length })}</p>
                          </div>

                          <div className="grid gap-5 lg:grid-cols-2">
                            {visibleProjects.map((project) => (
                              <article key={project.id} className="overflow-hidden rounded-[1.6rem] bg-white shadow-2xl">
                                <BeforeAfter project={project} />
                                <div className="p-5 sm:p-6">
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <h5 className="text-xl font-black tracking-[-.02em] text-navy-950">{project.title}</h5>
                                      <p className="mt-2 text-sm leading-relaxed text-navy-600">{project.summary}</p>
                                    </div>
                                    {project.featured && (
                                      <span className="shrink-0 rounded-full bg-copper/10 px-3 py-1 text-[.62rem] font-black uppercase tracking-[.12em] text-copper">
                                        {t('featured')}
                                      </span>
                                    )}
                                  </div>

                                  {(project.location || project.completedAt) && (
                                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-navy-100 pt-4 text-xs font-semibold text-navy-500">
                                      {project.location && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <MapPin size={14} className="text-brand-blue" aria-hidden="true" />
                                          {project.location}
                                        </span>
                                      )}
                                      {project.completedAt && (
                                        <span className="inline-flex items-center gap-1.5">
                                          <CalendarDays size={14} className="text-brand-blue" aria-hidden="true" />
                                          {formattedDate(project.completedAt)}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={scrollToBooking}
                                    className="group mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue transition-colors hover:text-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-4"
                                  >
                                    {t('requestSimilar')}
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                  </button>
                                </div>
                              </article>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={`empty-${selectedType.id}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-8 flex min-h-56 flex-col items-center justify-center rounded-[1.6rem] border border-white/10 bg-white/[.045] px-6 text-center"
                        >
                          <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-copper text-white shadow-[0_12px_30px_rgba(255,100,19,.24)]">
                            <Camera size={24} aria-hidden="true" />
                          </span>
                          <p className="text-xl font-black text-white">{t('noProjects')}</p>
                          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/52">{t('noProjectsHint')}</p>
                          <button
                            type="button"
                            onClick={scrollToBooking}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-black text-navy-950 transition-colors hover:bg-copper hover:text-white"
                          >
                            {t('requestSimilar')}
                            <ArrowRight size={15} aria-hidden="true" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="flex min-h-56 flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-white/14 bg-white/[.035] px-6 text-center">
                    <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/8 text-copper">
                      <Hammer size={22} aria-hidden="true" />
                    </span>
                    <p className="font-bold text-white">{t('noTypes')}</p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/48">{t('noTypesHint')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedCategory && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-navy-100 bg-white/65 px-4 py-3 text-center text-xs font-bold text-navy-500 backdrop-blur-sm">
            <ChevronRight size={15} className="text-copper" aria-hidden="true" />
            {t('startHint')}
          </div>
        )}
      </div>
    </section>
  );
}
