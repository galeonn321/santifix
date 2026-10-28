'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, Camera, MapPin, MoveHorizontal, Package, Plug, Settings, Wrench, X } from 'lucide-react';
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/lib/contentful';

const ICONS = { repairs: Wrench, installation: Plug, maintenance: Settings, assembly: Package };

function BeforeAfter({ project }: { project: Project }) {
  const t = useTranslations('services');
  const [position, setPosition] = useState(50);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const moveDivider = (clientX: number) => {
    const bounds = comparisonRef.current?.getBoundingClientRect();
    if (!bounds?.width) return;
    setPosition(Math.max(0, Math.min(100, (clientX - bounds.left) / bounds.width * 100)));
  };
  return (
    <div
      ref={comparisonRef}
      onPointerDown={event => {
        if (event.target instanceof HTMLInputElement) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        moveDivider(event.clientX);
      }}
      onPointerMove={event => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) moveDivider(event.clientX);
      }}
      className="relative h-[48svh] min-h-64 w-full cursor-ew-resize touch-pan-y select-none overflow-hidden bg-navy-950 focus-within:ring-4 focus-within:ring-inset focus-within:ring-copper sm:h-[64svh]"
    >
      <Image src={project.afterImage.url} alt={project.afterImage.description || `${t('after')}: ${project.projectName}`} fill sizes="(min-width: 1440px) 1400px, 100vw" className="object-contain" draggable={false} />
      <div className="pointer-events-none absolute inset-0 bg-navy-950" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={project.beforeImage.url} alt={project.beforeImage.description || `${t('before')}: ${project.projectName}`} fill sizes="(min-width: 1440px) 1400px, 100vw" className="object-contain" draggable={false} />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-4 sm:p-6">
        <span className="rounded-full bg-navy-950/80 px-4 py-2 text-xs font-bold text-white backdrop-blur">{t('before')}</span>
        <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-navy-950">{t('after')}</span>
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-copper text-white shadow-xl"><MoveHorizontal size={22} /></span>
      </div>
      <input type="range" min="0" max="100" value={position} onChange={event => setPosition(Number(event.target.value))} aria-label={t('comparisonLabel', { title: project.projectName })} className="absolute inset-x-0 bottom-5 mx-auto h-8 w-3/4 cursor-ew-resize accent-copper sm:w-1/2" />
    </div>
  );
}

function ProjectModal({ project, categoryName, onClose }: { project: Project; categoryName: string; onClose: () => void }) {
  const t = useTranslations('services');
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  const requestSimilar = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('portfolio:request', { detail: { category: project.category, projectName: project.projectName } }));
    window.requestAnimationFrame(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  };

  return createPortal(
    <dialog ref={dialogRef} aria-labelledby="project-modal-title" aria-describedby="project-modal-description" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[94svh] w-[calc(100%-1rem)] max-w-[1400px] overflow-y-auto overscroll-contain rounded-3xl border-0 bg-white p-0 text-navy-950 shadow-2xl backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm sm:w-[calc(100%-3rem)]">
      <div>
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-navy-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-8">
          <div className="min-w-0"><p className="eyebrow text-copper">{categoryName}</p><h3 id="project-modal-title" className="mt-1 text-xl font-black tracking-tight sm:text-2xl">{project.projectName}</h3></div>
          <button type="button" autoFocus onClick={onClose} aria-label={t('closeProject')} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-950 transition-colors hover:bg-navy-100 focus-visible:outline-2 focus-visible:outline-brand-blue"><X size={22} /></button>
        </div>
        <BeforeAfter project={project} />
        <div className="p-5 sm:p-8">
          <p className="text-center text-xs font-semibold text-navy-500">{t('dragHint')}</p>
          <div className="mt-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="max-w-3xl">
              {project.location && <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-blue"><MapPin size={15} />{project.location}</p>}
              <p id="project-modal-description" className="whitespace-pre-line text-base leading-relaxed text-navy-600">{project.description}</p>
            </div>
            <button type="button" onClick={requestSimilar} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3.5 text-sm font-bold text-white hover:bg-navy-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">{t('requestSimilar')}<ArrowRight size={17} /></button>
          </div>
          {project.gallery.length > 0 && <div className="mt-9"><h4 className="eyebrow mb-4 text-navy-500">{t('morePhotos')}</h4><div className="grid gap-4 sm:grid-cols-2">{project.gallery.map((image, index) => <Image key={`${image.url}-${index}`} src={image.url} alt={image.description || image.title || t('projectPhoto', { title: project.projectName, number: index + 1 })} width={image.width} height={image.height} sizes="(min-width: 1440px) 660px, (min-width: 640px) 45vw, 100vw" className="h-auto w-full rounded-2xl bg-navy-50" />)}</div></div>}
        </div>
      </div>
    </dialog>, document.body,
  );
}

export default function ServicesExplorer({ projects }: { projects: Project[] }) {
  const t = useTranslations('services');
  const categories = t.raw('items') as { key: ProjectCategory; title: string; description: string }[];
  const [category, setCategory] = useState<ProjectCategory>('repairs');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const selectedCategory = categories.find(item => item.key === category)!;
  const visibleProjects = projects.filter(project => project.category === category);

  return (
    <section id="services" className="relative overflow-hidden bg-cream py-24 sm:py-28">
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1fr_.65fr] lg:gap-16">
          <div><p className="eyebrow mb-3 text-copper">{t('portfolioEyebrow')}</p><h2 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-.045em] text-navy-950 sm:text-5xl lg:text-6xl">{t('subtitle')}</h2></div>
          <p className="border-l-2 border-copper/35 pl-5 text-base leading-relaxed text-navy-600">{t('exploreIntro')}</p>
        </div>
        <div className="grid items-start gap-7 lg:grid-cols-[260px_1fr] lg:gap-10">
          <aside className="min-w-0 lg:sticky lg:top-28">
            <p className="eyebrow mb-4 text-navy-400">{t('chooseCategory')}</p>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col" role="group" aria-label={t('chooseCategory')}>
              {PROJECT_CATEGORIES.map(key => {
                const item = categories.find(item => item.key === key)!;
                const Icon = ICONS[key];
                const active = key === category;
                const count = projects.filter(project => project.category === key).length;
                return <button key={key} type="button" aria-pressed={active} aria-controls="portfolio-gallery" onClick={() => setCategory(key)} className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${active ? 'border-navy-950 bg-navy-950 text-white shadow-lg' : 'border-navy-100 bg-white text-navy-600 hover:border-navy-300'}`}><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-copper text-white' : 'bg-navy-50 text-brand-blue'}`}><Icon size={19} /></span><span className="flex-1"><span className="block text-sm font-bold">{item.title}</span><span className={`mt-1 block text-xs ${active ? 'text-white/60' : 'text-navy-400'}`}>{t('projectCountShort', { count })}</span></span><ArrowUpRight size={16} className="hidden lg:block" /></button>;
              })}
            </div>
          </aside>
          <div id="portfolio-gallery" className="min-w-0">
            <div className="mb-6 border-b border-navy-100 pb-5"><h3 className="text-2xl font-black tracking-tight text-navy-950">{selectedCategory.title}</h3><p className="mt-2 text-sm leading-relaxed text-navy-500">{selectedCategory.description}</p><p role="status" className="mt-3 text-xs font-bold text-brand-blue">{t('projectCountShort', { count: visibleProjects.length })}</p></div>
            {visibleProjects.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map(project => <button type="button" key={project.id} onClick={() => setSelectedProject(project)} aria-label={t('openProject', { title: project.projectName })} aria-haspopup="dialog" className="group overflow-hidden rounded-2xl border border-navy-100 bg-white text-left shadow-sm transition-shadow hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
                <div className="relative aspect-[4/3] overflow-hidden bg-navy-100"><Image src={project.afterImage.url} alt={project.afterImage.description || project.projectName} fill sizes="(min-width: 1440px) 340px, (min-width: 1280px) 25vw, (min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />{project.featured && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[.65rem] font-black uppercase tracking-wider text-navy-950">{t('featured')}</span>}<span className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-white text-navy-950 shadow-lg transition-colors group-hover:bg-copper group-hover:text-white"><ArrowUpRight size={18} /></span></div>
                <div className="p-4"><h4 className="text-base font-bold leading-snug text-navy-950">{project.projectName}</h4>{project.location && <p className="mt-2 flex items-center gap-1.5 text-xs text-navy-500"><MapPin size={13} />{project.location}</p>}<p className="mt-4 text-xs font-bold text-brand-blue">{t('viewTransformation')}</p></div>
              </button>)}
            </div> : <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-navy-200 bg-white/75 px-6 py-12 text-center"><Camera size={32} className="mb-5 text-copper" /><p className="text-xl font-black text-navy-950">{t('noProjects')}</p><p className="mt-3 max-w-md text-sm leading-relaxed text-navy-500">{t('noProjectsHint')}</p></div>}
          </div>
        </div>
      </div>
      {selectedProject && <ProjectModal key={selectedProject.id} project={selectedProject} categoryName={categories.find(item => item.key === selectedProject.category)!.title} onClose={() => setSelectedProject(null)} />}
    </section>
  );
}
