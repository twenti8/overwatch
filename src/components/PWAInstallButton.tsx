import { Download, Share, X } from 'lucide-react';
import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { OverwatchEmblem } from './OverwatchEmblem';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={() => void install()}
        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-xs font-semibold text-sky-700 hover:border-[#60A5FA] hover:bg-sky-100 transition-colors cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
      >
        <Download className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
        <span>ติดตั้งแอปลงหน้าจอหลัก</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#60A5FA] hover:text-[#1E293B] transition-colors cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
        >
          <Share className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
          <span>เพิ่มลงหน้าจอโฮม</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
            role="presentation"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ios-install-title"
              className="w-full max-w-sm rounded-2xl border border-[#E2E8F0] bg-white p-5 text-left text-[#1E293B] shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-white shadow-xs">
                    <OverwatchEmblem className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 id="ios-install-title" className="text-sm font-bold text-[#1E293B]">
                      เพิ่ม OW2 Meta ลงหน้าจอโฮม
                    </h3>
                    <p className="text-xs text-slate-500">สำหรับ iPhone และ iPad (Safari)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label="ปิดคำแนะนำการติดตั้ง"
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ol className="mt-4 space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  1. แตะปุ่ม <strong className="text-slate-800">แชร์ (Share)</strong> ที่แถบด้านล่างหรือด้านบนของ Safari
                </li>
                <li>
                  2. เลื่อนลงแล้วเลือก{' '}
                  <strong className="text-slate-800">เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)</strong>
                </li>
                <li>
                  3. แตะ <strong className="text-slate-800">เพิ่ม (Add)</strong> เพื่อใช้งานเป็นแอปเต็มหน้าจอ
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#60A5FA] py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#3B82F6] transition-colors cursor-pointer"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
