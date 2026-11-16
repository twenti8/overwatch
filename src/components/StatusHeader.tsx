import { RefreshCw, Settings, Sparkles } from 'lucide-react';
import type { PatchEntry, SyncSettings, SyncStatusState } from '../types/patch';
import { formatRelativeMinutesThai, formatThaiDateTime } from '../utils/patchLogic';

interface StatusHeaderProps {
  latestPatch: PatchEntry | null;
  syncSettings: SyncSettings;
  syncStatus: SyncStatusState;
  nowMs: number;
  onSyncNow: () => void;
  onSimulatePatch: () => void;
  onOpenSettings: () => void;
}

export function StatusHeader({
  latestPatch,
  syncSettings,
  syncStatus,
  nowMs,
  onSyncNow,
  onSimulatePatch,
  onOpenSettings,
}: StatusHeaderProps) {
  const relativeChecked = formatRelativeMinutesThai(syncStatus.lastCheckedAt, nowMs);
  const updatedText = latestPatch
    ? formatThaiDateTime(latestPatch.releasedAt)
    : 'ยังไม่มีข้อมูลอัปเดต';

  const syncStateLabel = !syncSettings.autoSyncEnabled
    ? 'ปิดใช้งาน'
    : syncStatus.connectionState === 'fallback'
      ? 'โหมดสำรองข้อมูล (ออฟไลน์/CORS)'
      : 'เปิดใช้งาน';

  return (
    <>
      <header className="border-b border-white/[0.08] bg-[#0B0E14] sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5">
          {/* Zone 1: Brand Title */}
          <a
            href="#top"
            className="font-semibold tracking-tight text-lg sm:text-xl text-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
          >
            [OVERWATCH]
          </a>

          {/* Zone 2: Clean Single-Line Nav Links */}
          <nav
            aria-label="เมนูหลัก"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400"
          >
            <a
              href="#latest-patch"
              className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              แพตช์ล่าสุด
            </a>
            <a
              href="#patch-history"
              className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              ประวัติอัปเดต
            </a>
            <a
              href="#patch-summary"
              className="hover:text-slate-100 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              สรุปสถิติแพตช์
            </a>
          </nav>

          {/* Zone 3: 1 Primary Settings Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenSettings}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-[#131822] px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-200 hover:border-emerald-500/40 hover:text-white transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
            >
              <Settings className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>ตั้งค่าการดึงข้อมูล</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Status & Auto-Sync Bar */}
      <section
        aria-label="สถานะแพตช์และระบบซิงค์อัตโนมัติ"
        className="border-b border-white/[0.06] bg-[#10141D]"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Version + Timestamp + Live Polling Indicator */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      syncSettings.autoSyncEnabled
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono tabular-nums">
                    อัปเดตล่าสุด: Patch {latestPatch?.version ?? '-'}
                  </span>
                </span>
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <span className="text-xs sm:text-sm text-slate-300 font-mono tabular-nums">
                  อัปเดตเมื่อ: {updatedText}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                <span>
                  ระบบซิงค์อัตโนมัติ:{' '}
                  <strong
                    className={
                      syncSettings.autoSyncEnabled
                        ? 'font-medium text-emerald-400'
                        : 'font-medium text-slate-300'
                    }
                  >
                    {syncStateLabel}
                  </strong>
                </span>
                {syncSettings.autoSyncEnabled && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="tabular-nums">
                      เช็กทุก {syncSettings.pollingIntervalMinutes} นาที
                    </span>
                  </>
                )}
                <span aria-hidden="true">•</span>
                <span className="tabular-nums">ตรวจสอบล่าสุดเมื่อ {relativeChecked}</span>
                {syncStatus.lastSyncMessage && (
                  <>
                    <span aria-hidden="true">•</span>
                    <span className="text-slate-300">{syncStatus.lastSyncMessage}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onSyncNow}
                disabled={syncStatus.isSyncing}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 cursor-pointer"
              >
                <RefreshCw
                  className={`h-4 w-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>{syncStatus.isSyncing ? 'กำลังตรวจสอบ...' : 'เช็กอัปเดตทันที'}</span>
              </button>

              <button
                type="button"
                onClick={onSimulatePatch}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-[#131822] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-100 hover:border-emerald-400/50 hover:bg-[#19202D] transition-colors whitespace-nowrap shrink-0 min-h-[44px] sm:min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>จำลองเกมอัปเดต</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
