'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronRight,
  Hammer,
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
  initialProjectId?: string;
}

const randomItem = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function BeforeAfter({ project }: { project: Project }) {
  const t = useTranslations('services');
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const updateFromPointer = (clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, nextPosition)));
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        updateFromPointer(event.clientX);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          updateFromPointer(event.clientX);
        }
      }}
      className="group/comparison relative h-[430px] cursor-ew-resize select-none overflow-hidden bg-navy-900 touch-pan-y sm:h-[540px] lg:h-full lg:min-h-[680px]"
    >
      <Image
        src={project.afterImage.url}
        alt={project.afterImage.description || `${t('after')}: ${project.title}`}
        fill
        priority={project.featured}
        draggable={false}
        sizes="(min-width: 1024px) 68vw, 100vw"
        className="pointer-events-none object-cover"
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={project.beforeImage.url}
          alt={project.beforeImage.description || `${t('before')}: ${project.title}`}
          fill
          priority={project.featured}
          draggable={false}
          sizes="(min-width: 1024px) 68vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/42 via-transparent to-navy-950/15" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
        <span className="rounded-full bg-navy-950/78 px-3.5 py-2 text-[.67rem] font-black uppercase tracking-[.14em] text-white backdrop-blur-md">
          {t('before')}
        </span>
        <span className="rounded-full bg-white/92 px-3.5 py-2 text-[.67rem] font-black uppercase tracking-[.14em] text-navy-950 backdrop-blur-md">
          {t('after')}
        </span>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,26,59,.16),0_0_32px_rgba(0,0,0,.28)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white bg-copper text-white shadow-2xl transition-transform group-active/comparison:scale-95 sm:size-14">
          <MoveHorizontal size={20} strokeWidth={2.4} aria-hidden="true" />
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-4 sm:p-6">
        <span className="flex items-center gap-2 rounded-full border border-white/20 bg-navy-950/76 px-4 py-2 text-[.68rem] font-bold text-white/90 backdrop-blur-md">
          <MoveHorizontal size={14} aria-hidden="true" />
          {t('dragHint')}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={t('comparisonLabel', { title: project.title })}
        className="sr-only"
      />
    </div>
  );
}

export default function ServicesExplorer({
  categories,
  serviceTypes,
  projects,
  initialProjectId,
}: ServicesExplorerProps) {
  const t = useTranslations('services');
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  const initialProject = projects.find((project) => project.id === initialProjectId) ?? projects[0];
  const initialType = serviceTypes.find((serviceType) => serviceType.id === initialProject?.serviceTypeId);
  const initialCategory = categories.find((category) => category.id === initialType?.categoryId) ?? categories[0];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategory?.id ?? null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(initialType?.id ?? null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProject?.id ?? null);

  const availableTypes = useMemo(
    () => serviceTypes.filter((serviceType) => serviceType.categoryId === selectedCategoryId),
    [selectedCategoryId, serviceTypes],
  );

  const availableProjects = useMemo(
    () => projects.filter((project) => project.serviceTypeId === selectedTypeId),
    [projects, selectedTypeId],
  );

  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const selectedType = serviceTypes.find((serviceType) => serviceType.id === selectedTypeId);
  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  const projectCountForCategory = (categoryId: string) => {
    const typeIds = new Set(
      serviceTypes
        .filter((serviceType) => serviceType.categoryId === categoryId)
        .map((serviceType) => serviceType.id),
    );
    return projects.filter((project) => typeIds.has(project.serviceTypeId)).length;
  };

  const chooseCategory = (categoryId: string) => {
    const categoryTypes = serviceTypes.filter((serviceType) => serviceType.categoryId === categoryId);
    const categoryTypeIds = new Set(categoryTypes.map((serviceType) => serviceType.id));
    const categoryProjects = projects.filter((project) => categoryTypeIds.has(project.serviceTypeId));
    const nextProject = categoryProjects.length > 0 ? randomItem(categoryProjects) : undefined;
    const nextType = nextProject
      ? categoryTypes.find((serviceType) => serviceType.id === nextProject.serviceTypeId)
      : categoryTypes[0];

    setSelectedCategoryId(categoryId);
    setSelectedTypeId(nextType?.id ?? null);
    setSelectedProjectId(nextProject?.id ?? null);
  };

  const chooseType = (serviceTypeId: string) => {
    const typeProjects = projects.filter((project) => project.serviceTypeId === serviceTypeId);
    setSelectedTypeId(serviceTypeId);
    setSelectedProjectId(typeProjects.length > 0 ? randomItem(typeProjects).id : null);
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
      <div className="paper-grid absolute inset-0 opacity-40" />
      <div className="absolute -right-36 top-20 size-[30rem] rounded-full bg-brand-blue/6 blur-3xl" />
      <div className="absolute -left-32 bottom-24 size-[24rem] rounded-full bg-copper/7 blur-3xl" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-11 grid items-end gap-6 lg:grid-cols-[1fr_.72fr] lg:gap-16"
        >
          <div>
            <p className="eyebrow mb-3 text-copper">{t('title')}</p>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-[-.045em] text-navy-950 sm:text-5xl lg:text-6xl">
              {t('subtitle')}
            </h2>
          </div>
          <p className="border-l-2 border-copper/35 pl-5 text-base leading-relaxed text-navy-600 sm:text-lg">
            {t('exploreIntro')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_90px_rgba(0,26,59,.16)] lg:grid lg:min-h-[680px] lg:grid-cols-[minmax(300px,34%)_1fr] lg:rounded-[2.5rem]"
        >
          <aside className="relative flex flex-col bg-white p-5 sm:p-7 lg:max-h-[760px] lg:overflow-y-auto lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-copper">{t('portfolioEyebrow')}</p>
                <p className="mt-2 text-sm text-navy-500">{t('chooseCategory')}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-950 text-sm font-black text-white">
                {projects.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {categories.map((category) => {
                const Icon = ICONS[category.icon as keyof typeof ICONS] ?? Hammer;
                const active = category.id === selectedCategoryId;
                const projectCount = projectCountForCategory(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => chooseCategory(category.id)}
                    aria-pressed={active}
                    className={`group rounded-2xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                      active
                        ? 'border-navy-950 bg-navy-950 text-white shadow-lg'
                        : 'border-navy-100 bg-cream text-navy-950 hover:border-navy-300 hover:bg-white'
                    }`}
                  >
                    <span className={`mb-3 flex size-9 items-center justify-center rounded-xl ${active ? 'bg-copper text-white' : 'bg-white text-brand-blue shadow-sm'}`}>
                      <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <span className="block text-sm font-black leading-tight">{category.name}</span>
                    <span className={`mt-1 block text-[.64rem] font-bold uppercase tracking-[.1em] ${active ? 'text-white/48' : 'text-navy-400'}`}>
                      {t('projectCountShort', { count: projectCount })}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-6 h-px bg-navy-100" />

            <div>
              <p className="mb-3 text-[.68rem] font-black uppercase tracking-[.15em] text-navy-400">
                {t('chooseType')}
              </p>
              {availableTypes.length > 0 ? (
                <div className="space-y-2">
                  {availableTypes.map((serviceType) => {
                    const active = serviceType.id === selectedTypeId;
                    const count = projects.filter((project) => project.serviceTypeId === serviceType.id).length;

                    return (
                      <button
                        key={serviceType.id}
                        type="button"
                        onClick={() => chooseType(serviceType.id)}
                        aria-pressed={active}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                          active
                            ? 'bg-brand-blue/8 text-brand-blue'
                            : 'text-navy-600 hover:bg-navy-50 hover:text-navy-950'
                        }`}
                      >
                        <span>{serviceType.name}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-[.68rem] text-navy-400">{count}</span>
                          <ChevronRight size={15} className={active ? 'text-brand-blue' : 'text-navy-300'} aria-hidden="true" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl bg-navy-50 p-4 text-sm leading-relaxed text-navy-500">{t('noTypesHint')}</p>
              )}
            </div>

            {availableProjects.length > 1 && (
              <div className="mt-6 border-t border-navy-100 pt-5">
                <p className="mb-3 text-[.68rem] font-black uppercase tracking-[.15em] text-navy-400">
                  {t('selectProject')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableProjects.map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      aria-label={project.title}
                      aria-pressed={project.id === selectedProjectId}
                      className={`flex size-9 items-center justify-center rounded-full text-xs font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue ${
                        project.id === selectedProjectId
                          ? 'bg-copper text-white'
                          : 'bg-navy-50 text-navy-500 hover:bg-navy-100'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {selectedProject && (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.28 }}
                  className="mt-auto pt-7"
                >
                  <div className="border-t border-navy-100 pt-6">
                    <div className="flex items-center gap-2 text-[.66rem] font-black uppercase tracking-[.13em] text-copper">
                      {selectedProject.featured && <span>{t('featured')}</span>}
                      {selectedProject.featured && selectedType && <span className="size-1 rounded-full bg-navy-200" />}
                      {selectedType && <span className="text-navy-400">{selectedType.name}</span>}
                    </div>
                    <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-.035em] text-navy-950">
                      {selectedProject.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-600">{selectedProject.summary}</p>

                    {(selectedProject.location || selectedProject.completedAt) && (
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-navy-500">
                        {selectedProject.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-brand-blue" aria-hidden="true" />
                            {selectedProject.location}
                          </span>
                        )}
                        {selectedProject.completedAt && (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={13} className="text-brand-blue" aria-hidden="true" />
                            {formattedDate(selectedProject.completedAt)}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={scrollToBooking}
                      className="group mt-5 inline-flex items-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white transition-colors hover:bg-copper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-4"
                    >
                      {t('requestSimilar')}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

          <div className="relative overflow-hidden bg-navy-950">
            <AnimatePresence mode="wait">
              {selectedProject ? (
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.42 }}
                  className="h-full"
                >
                  <BeforeAfter project={selectedProject} />
                </motion.div>
              ) : (
                <motion.div
                  key={`${selectedCategoryId}-${selectedTypeId}-empty`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="paper-grid flex h-[430px] flex-col items-center justify-center bg-navy-950 px-8 text-center sm:h-[540px] lg:h-full lg:min-h-[680px]"
                >
                  <span className="mb-5 flex size-16 items-center justify-center rounded-[1.3rem] bg-copper text-white shadow-[0_16px_38px_rgba(255,100,19,.25)]">
                    <Camera size={27} aria-hidden="true" />
                  </span>
                  <p className="text-2xl font-black tracking-[-.03em] text-white">{t('noProjects')}</p>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/52">
                    {selectedCategory ? t('noProjectsHint') : t('startHint')}
                  </p>
                  <button
                    type="button"
                    onClick={scrollToBooking}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-navy-950 transition-colors hover:bg-copper hover:text-white"
                  >
                    {t('requestSimilar')}
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
