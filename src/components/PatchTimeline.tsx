import { ChevronDown, Pencil, Search, X } from 'lucide-react';
import type { PatchEntry, PatchType, TimelineTypeFilter } from '../types/patch';
import { formatThaiDateTime } from '../utils/patchLogic';

interface PatchTimelineProps {
  patches: PatchEntry[];
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  typeFilter: TimelineTypeFilter;
  onTypeFilterChange: (type: TimelineTypeFilter) => void;
  expandedIds: Record<string, boolean>;
  onToggleExpand: (id: string) => void;
  onEditPatch: (patch: PatchEntry) => void;
  onResetFilters: () => void;
}

const TYPE_FILTERS: TimelineTypeFilter[] = [
  'ทั้งหมด',
  'แพตช์ใหญ่',
  'ปรับสมดุล',
  'Hotfix',
];

function getTypeTextStyle(type: PatchType): string {
  switch (type) {
    case 'แพตช์ใหญ่':
      return 'text-emerald-400';
    case 'ปรับสมดุล':
      return 'text-sky-400';
    case 'Hotfix':
      return 'text-amber-400';
  }
}

function getCategoryLabelColor(category: string): string {
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

export function PatchTimeline({
  patches,
  totalCount,
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  expandedIds,
  onToggleExpand,
  onEditPatch,
  onResetFilters,
}: PatchTimelineProps) {
  return (
    <section id="patch-history" aria-labelledby="timeline-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2
            id="timeline-heading"
            className="text-lg sm:text-xl font-semibold tracking-tight text-slate-50"
          >
            ประวัติแพตช์และไทม์ไลน์อัปเดต
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            บันทึกวันเวลาและรายละเอียดการอัปเดตย้อนหลังทั้งหมด ({totalCount} แพตช์)
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#131822] p-3.5 sm:p-4">
        <div className="relative flex-1 min-w-0">
          <label htmlFor="patch-search-input" className="sr-only">
            ค้นหาแพตช์ตามเวอร์ชันหรือคำสำคัญ
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            id="patch-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาเวอร์ชันหรือคำสำคัญ เช่น v2.3.5, เลเซอร์, บั๊ก..."
            className="w-full rounded-lg border border-white/[0.08] bg-[#0B0E14] py-2.5 pl-9 pr-9 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 min-h-[42px]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="ล้างคำค้นหา"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="กรองประวัติตามประเภทแพตช์"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-[#0B0E14] p-1 border border-white/[0.06] shrink-0"
        >
          {TYPE_FILTERS.map((type) => {
            const isActive = typeFilter === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTypeFilterChange(type)}
                className={`rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chronological Timeline List */}
      {patches.length === 0 ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#131822] px-6 py-12 text-center">
          <p className="text-sm sm:text-base font-medium text-slate-200">
            ไม่พบแพตช์ที่ตรงกับเงื่อนไขการค้นหา
          </p>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            ลองเปลี่ยนคำค้นหาหรือเลือกดูแพตช์ทุกประเภท
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-white/[0.12] bg-[#0B0E14] px-4 py-2 text-xs sm:text-sm font-medium text-emerald-400 hover:border-emerald-400/50 transition-colors cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-[#131822] divide-y divide-white/[0.07]">
          {patches.map((patch, index) => {
            const isExpanded = Boolean(expandedIds[patch.id]);
            const isLatest = index === 0 && !searchQuery && typeFilter === 'ทั้งหมด';

            return (
              <article key={patch.id} className="transition-colors">
                <div className="flex items-start justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={`patch-details-${patch.id}`}
                    onClick={() => onToggleExpand(patch.id)}
                    className="flex flex-1 items-start justify-between gap-4 text-left min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md cursor-pointer group"
                  >
                    <div className="min-w-0 flex-1">
                      {/* Clean Metadata Line */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                        <span className="font-mono font-semibold text-sm text-slate-50 tabular-nums">
                          {patch.version}
                        </span>
                        <span className="text-slate-600" aria-hidden="true">
                          ·
                        </span>
                        <span className={`font-semibold ${getTypeTextStyle(patch.type)}`}>
                          {patch.type}
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
                        {isLatest && (
                          <>
                            <span className="text-slate-600" aria-hidden="true">
                              ·
                            </span>
                            <span className="font-medium text-emerald-400">
                              เวอร์ชันปัจจุบัน
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="mt-1.5 text-sm sm:text-base font-medium text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {patch.title}
                      </h3>

                      <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2">
                        {patch.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 shrink-0 text-xs text-slate-400 group-hover:text-slate-200">
                      <span className="hidden sm:inline tabular-nums">
                        {patch.changes.length} รายการ
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-emerald-400' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditPatch(patch)}
                    aria-label={`แก้ไขรายละเอียด ${patch.version}`}
                    className="mt-0.5 inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/[0.06] hover:text-slate-100 transition-colors shrink-0 min-h-[36px] min-w-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div
                    id={`patch-details-${patch.id}`}
                    className="border-t border-white/[0.06] bg-[#0E131B] px-4 sm:px-6 py-4"
                  >
                    <ul className="space-y-3">
                      {patch.changes.map((change) => (
                        <li
                          key={change.id}
                          className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 text-sm"
                        >
                          <span
                            className={`text-xs font-semibold pt-0.5 ${getCategoryLabelColor(
                              change.category
                            )}`}
                          >
                            {change.category}
                          </span>
                          <div>
                            <p className="font-medium text-slate-200">{change.target}</p>
                            <p className="mt-0.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                              {change.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
