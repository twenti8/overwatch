import { Pencil } from 'lucide-react';
import type { PatchEntry, PatchType, SpotlightFilter } from '../types/patch';
import { filterChangesByCategory, formatThaiDateTime } from '../utils/patchLogic';

interface LatestPatchSpotlightProps {
  patch: PatchEntry | null;
  activeFilter: SpotlightFilter;
  onSelectFilter: (filter: SpotlightFilter) => void;
  onEditPatch: (patch: PatchEntry) => void;
}

const FILTER_TABS: SpotlightFilter[] = [
  'ทั้งหมด',
  'เนื้อหาใหม่',
  'ปรับสมดุล',
  'แก้บั๊ก',
];

function getPatchTypeColor(type: PatchType): string {
  switch (type) {
    case 'แพตช์ใหญ่':
      return 'text-emerald-400';
    case 'ปรับสมดุล':
      return 'text-sky-400';
    case 'Hotfix':
      return 'text-amber-400';
  }
}

function getCategoryColor(category: SpotlightFilter): string {
  switch (category) {
    case 'เนื้อหาใหม่':
      return 'text-emerald-400';
    case 'ปรับสมดุล':
      return 'text-sky-400';
    case 'แก้บั๊ก':
      return 'text-amber-400';
    default:
      return 'text-slate-300';
  }
}

export function LatestPatchSpotlight({
  patch,
  activeFilter,
  onSelectFilter,
  onEditPatch,
}: LatestPatchSpotlightProps) {
  if (!patch) {
    return (
      <section
        id="latest-patch"
        className="rounded-xl border border-white/[0.08] bg-[#131822] p-6 sm:p-8"
      >
        <p className="text-sm text-slate-400">ยังไม่มีข้อมูลแพตช์ล่าสุดในระบบ</p>
      </section>
    );
  }

  const visibleChanges = filterChangesByCategory(patch.changes, activeFilter);

  const countForTab = (tab: SpotlightFilter): number => {
    if (tab === 'ทั้งหมด') return patch.changes.length;
    return patch.changes.filter((c) => c.category === tab).length;
  };

  return (
    <section
      id="latest-patch"
      aria-labelledby="spotlight-heading"
      className="rounded-xl border border-white/[0.09] bg-[#131822] p-5 sm:p-8"
    >
      {/* Top Meta Row: Clean Unboxed Typography */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm">
          <span className={`font-semibold ${getPatchTypeColor(patch.type)}`}>
            {patch.type}
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <span className="font-mono font-semibold text-slate-100 tabular-nums">
            {patch.version}
          </span>
          <span className="text-slate-600" aria-hidden="true">
            ·
          </span>
          <time
            dateTime={patch.releasedAt}
            className="font-mono text-slate-400 tabular-nums"
          >
            {formatThaiDateTime(patch.releasedAt)}
          </time>
          {patch.sourceLabel && (
            <>
              <span className="text-slate-600" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-400">{patch.sourceLabel}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => onEditPatch(patch)}
          aria-label={`แก้ไขแพตช์ ${patch.version}`}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-white/[0.05] hover:text-slate-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          <span>แก้ไขแพตช์นี้</span>
        </button>
      </div>

      {/* Hero Title & Concise Summary */}
      <div className="mt-4 max-w-4xl">
        <h1
          id="spotlight-heading"
          className="text-xl sm:text-2xl lg:text-[28px] font-semibold leading-snug tracking-tight text-slate-50 [text-wrap:balance]"
        >
          {patch.title}
        </h1>
        <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-slate-300">
          {patch.summary}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div
          role="tablist"
          aria-label="กรองรายละเอียดแพตช์ตามหมวดหมู่"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#0B0E14] p-1 border border-white/[0.06]"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            const count = countForTab(tab);
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectFilter(tab)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isActive ? 'text-slate-900/80' : 'text-slate-500'
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 tabular-nums">
          แสดง {visibleChanges.length} จาก {patch.changes.length} รายการเปลี่ยนแปลง
        </p>
      </div>

      {/* Changes List (Hairline dividers, no nested cards) */}
      {visibleChanges.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">
            ไม่มีรายการเปลี่ยนแปลงในหมวดหมู่ &ldquo;{activeFilter}&rdquo; สำหรับแพตช์นี้
          </p>
          <button
            type="button"
            onClick={() => onSelectFilter('ทั้งหมด')}
            className="mt-3 text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4 cursor-pointer"
          >
            แสดงทั้งหมด
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-white/[0.06]">
          {visibleChanges.map((item) => (
            <li
              key={item.id}
              className="py-4 first:pt-4 last:pb-1 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-1.5 md:gap-6 items-baseline"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${getCategoryColor(item.category)}`}
                >
                  {item.category}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-medium text-slate-100">
                  {item.target}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
