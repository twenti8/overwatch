import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface MetaToastData {
  id: string;
  title: string;
  detail?: string;
}

interface MetaToastProps {
  toast: MetaToastData | null;
  onDismiss: () => void;
}

export function MetaToast({ toast, onDismiss }: MetaToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [toast]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50"
    >
      {toast && (
        <div
          key={toast.id}
          role="status"
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border border-sky-200 bg-white p-4 shadow-lg transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#1E293B]">{toast.title}</p>
            {toast.detail && (
              <p className="mt-0.5 text-xs text-slate-500">{toast.detail}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="ปิดการแจ้งเตือน"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
