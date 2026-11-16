import { Gamepad2, Info, RotateCcw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Hero, RecommendedCounter } from '../types/meta';
import { HeroAvatar } from './HeroAvatar';

interface CounterRecommendationBoxProps {
  selectedEnemies: Hero[];
  recommendations: RecommendedCounter[];
  patchVersion: string;
  portraitOverrides?: Record<string, string>;
  onClearSelection: () => void;
}

export function CounterRecommendationBox({
  selectedEnemies,
  recommendations,
  patchVersion,
  portraitOverrides,
  onClearSelection,
}: CounterRecommendationBoxProps) {
  const [activeCounterId, setActiveCounterId] = useState<string | null>(null);

  useEffect(() => {
    if (
      activeCounterId &&
      !recommendations.some((rec) => rec.hero.id === activeCounterId)
    ) {
      setActiveCounterId(null);
    }
  }, [recommendations, activeCounterId]);

  const activeDetail =
    recommendations.find((r) => r.hero.id === activeCounterId) ?? null;

  return (
    <section
      aria-label="คำแนะนำตัวละครแก้ทาง"
      className="rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] px-5 py-6 sm:px-8 sm:py-7 text-center"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="inline-flex items-center justify-center gap-2.5 text-base sm:text-lg font-bold text-[#1E293B]">
          <Gamepad2 className="h-5 w-5 text-sky-500 shrink-0" aria-hidden="true" />
          <span>ควรหยิบตัวอะไรมาแก้ทางดี?</span>
        </h2>

        {selectedEnemies.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>
              กำลังวิเคราะห์ตัวแก้ทางสำหรับ{' '}
              <strong className="font-semibold text-slate-700">
                {selectedEnemies.map((h) => h.name).join(', ')}
              </strong>{' '}
              ในแพตช์ {patchVersion}
            </span>
            <button
              type="button"
              onClick={onClearSelection}
              className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 hover:border-sky-300 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>ล้างที่เลือก</span>
            </button>
          </div>
        )}
      </div>

      {selectedEnemies.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          คลิกเลือกฮีโร่ฝั่งตรงข้ามด้านบน 1 ตัวขึ้นไป เพื่อดูตัวแก้ทางที่แนะนำในแพตช์ล่าสุด
        </p>
      ) : recommendations.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          ยังไม่มีข้อมูลตัวแก้ทางสำหรับฮีโร่ที่เลือก สามารถเพิ่มข้อมูลได้ในหน้าตั้งค่า
        </p>
      ) : (
        <div className="mt-5">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {recommendations.map((rec) => {
              const isInspecting = activeCounterId === rec.hero.id;
              return (
                <button
                  key={rec.hero.id}
                  type="button"
                  aria-expanded={isInspecting}
                  onClick={() =>
                    setActiveCounterId((prev) =>
                      prev === rec.hero.id ? null : rec.hero.id
                    )
                  }
                  className={`inline-flex items-center gap-2 rounded-full pl-1.5 pr-3.5 py-1.5 text-sm font-bold text-white transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-h-[40px] ${
                    isInspecting
                      ? 'bg-[#3B82F6] ring-4 ring-sky-200 shadow-sm'
                      : 'bg-[#60A5FA] hover:bg-[#3B82F6] shadow-xs'
                  }`}
                >
                  <HeroAvatar
                    hero={rec.hero}
                    size="pill"
                    portraitOverride={portraitOverrides?.[rec.hero.id]}
                  />
                  <span className="whitespace-nowrap drop-shadow-[0_1px_1px_rgba(15,23,42,0.16)]">
                    {rec.hero.name}
                  </span>
                  {selectedEnemies.length > 1 && rec.targets.length > 1 && (
                    <span className="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
                      {rec.targets.length}/{selectedEnemies.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-slate-500 inline-flex items-center gap-1">
            <Info className="h-3.5 w-3.5 text-sky-500 shrink-0" aria-hidden="true" />
            <span>คลิกที่ชื่อตัวละครแนะนำด้านบนเพื่อดูเหตุผลว่าทำไมถึงแก้ทางได้ในแพตช์นี้</span>
          </p>

          {/* Explanation Tooltip / Popover Card */}
          {activeDetail && (
            <div
              role="region"
              aria-label={`เหตุผลที่ ${activeDetail.hero.name} แก้ทางได้`}
              className="mx-auto mt-4 max-w-2xl rounded-xl border border-[#CBD5E1] bg-white p-4 text-left shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <HeroAvatar
                    hero={activeDetail.hero}
                    size="pill"
                    portraitOverride={portraitOverrides?.[activeDetail.hero.id]}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">
                      ทำไม {activeDetail.hero.name} ถึงแก้ทางได้ดี ({activeDetail.hero.role})
                    </h3>
                    <p className="text-xs text-slate-500">
                      ข้อมูลอ้างอิงแพตช์ {patchVersion}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCounterId(null)}
                  aria-label="ปิดคำอธิบายตัวแก้ทาง"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-3 divide-y divide-slate-100">
                {activeDetail.targets.map((target) => (
                  <li key={target.enemyHero.id} className="py-2 first:pt-1 last:pb-0 text-xs sm:text-sm">
                    <span className="font-semibold text-sky-600">
                      แก้ทาง {target.enemyHero.name}:
                    </span>{' '}
                    <span className="text-slate-700 leading-relaxed">
                      {target.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
