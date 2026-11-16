import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  detail?: string;
}

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(frame);
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
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-[#131822] p-4 shadow-xl transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-50">{toast.title}</p>
            {toast.detail && (
              <p className="mt-0.5 text-xs text-slate-300 font-mono">{toast.detail}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="ปิดการแจ้งเตือน"
            className="rounded p-1 text-slate-400 hover:text-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
