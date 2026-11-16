import { Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type {
  ChangeCategory,
  DataSourceType,
  PatchEntry,
  PatchFormInput,
  PatchType,
  PollingIntervalMinutes,
  SyncSettings,
} from '../types/patch';
import { validatePatchInput } from '../utils/patchLogic';

interface SettingsDrawerProps {
  isOpen: boolean;
  initialTab: 'sync' | 'manual';
  editingPatch: PatchEntry | null;
  settings: SyncSettings;
  onClose: () => void;
  onSaveSettings: (next: SyncSettings, triggerImmediateSync?: boolean) => void;
  onSaveManualPatch: (input: PatchFormInput) => void;
  onResetDefaultData: () => void;
}

const POLLING_OPTIONS: PollingIntervalMinutes[] = [1, 5, 15, 30];
const PATCH_TYPES: PatchType[] = ['แพตช์ใหญ่', 'ปรับสมดุล', 'Hotfix'];
const CHANGE_CATEGORIES: ChangeCategory[] = ['เนื้อหาใหม่', 'ปรับสมดุล', 'แก้บั๊ก'];

function toLocalDatetimeInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function createEmptyPatchForm(): PatchFormInput {
  return {
    version: '',
    title: '',
    type: 'แพตช์ใหญ่',
    releasedAt: toLocalDatetimeInputValue(new Date().toISOString()),
    summary: '',
    changes: [
      {
        category: 'เนื้อหาใหม่',
        target: '',
        description: '',
      },
    ],
  };
}

export function SettingsDrawer({
  isOpen,
  initialTab,
  editingPatch,
  settings,
  onClose,
  onSaveSettings,
  onSaveManualPatch,
  onResetDefaultData,
}: SettingsDrawerProps) {
  const [activeTab, setActiveTab] = useState<'sync' | 'manual'>(initialTab);
  const [draftSettings, setDraftSettings] = useState<SyncSettings>(settings);
  const [patchForm, setPatchForm] = useState<PatchFormInput>(createEmptyPatchForm());
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDraftSettings(settings);
    setActiveTab(editingPatch ? 'manual' : initialTab);
    setFormError(null);

    if (editingPatch) {
      setPatchForm({
        id: editingPatch.id,
        version: editingPatch.version,
        title: editingPatch.title,
        type: editingPatch.type,
        releasedAt: toLocalDatetimeInputValue(editingPatch.releasedAt),
        summary: editingPatch.summary,
        changes: editingPatch.changes.map((c) => ({
          category: c.category,
          target: c.target,
          description: c.description,
        })),
      });
    } else {
      setPatchForm(createEmptyPatchForm());
    }
  }, [isOpen, initialTab, editingPatch, settings]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleSettingsSubmit = (triggerSync: boolean) => {
    onSaveSettings(draftSettings, triggerSync);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validatePatchInput(patchForm);
    if (error) {
      setFormError(error);
      return;
    }
    const isoDate = new Date(patchForm.releasedAt).toISOString();
    onSaveManualPatch({
      ...patchForm,
      releasedAt: isoDate,
    });
    onClose();
  };

  const updateChangeRow = (
    idx: number,
    field: 'category' | 'target' | 'description',
    value: string
  ) => {
    setPatchForm((prev) => ({
      ...prev,
      changes: prev.changes.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row
      ),
    }));
  };

  const addChangeRow = () => {
    setPatchForm((prev) => ({
      ...prev,
      changes: [
        ...prev.changes,
        { category: 'ปรับสมดุล', target: '', description: '' },
      ],
    }));
  };

  const removeChangeRow = (idx: number) => {
    setPatchForm((prev) => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-drawer-title"
        className="flex h-full w-full max-w-xl flex-col border-l border-white/[0.1] bg-[#0E131C] text-slate-100 shadow-2xl"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
          <div>
            <h2
              id="settings-drawer-title"
              className="text-base sm:text-lg font-semibold text-slate-50"
            >
              ตั้งค่าการดึงข้อมูลและจัดการแพตช์
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              ตั้งค่าระบบซิงค์อัตโนมัติ แหล่งข้อมูลภายนอก หรือเพิ่มแพตช์ Day-1 ด้วยตนเอง
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่างตั้งค่า"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="border-b border-white/[0.08] px-5 py-3">
          <div
            role="tablist"
            aria-label="หมวดการตั้งค่า"
            className="grid grid-cols-2 gap-1 rounded-lg bg-[#0B0E14] p-1 border border-white/[0.06]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sync'}
              onClick={() => setActiveTab('sync')}
              className={`rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              ระบบซิงค์ & แหล่งข้อมูล
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'manual'}
              onClick={() => setActiveTab('manual')}
              className={`rounded-md px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'manual'
                  ? 'bg-emerald-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {editingPatch ? `แก้ไข ${editingPatch.version}` : 'เพิ่มแพตช์ด้วยตนเอง'}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {activeTab === 'sync' ? (
            <div className="space-y-6">
              {/* Auto-Sync Polling Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      ระบบซิงค์อัตโนมัติ (Auto-Sync Polling)
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                      ตรวจสอบแพตช์ใหม่อัตโนมัติตามช่วงเวลาที่กำหนด
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draftSettings.autoSyncEnabled}
                    aria-label="เปิดหรือปิดระบบซิงค์อัตโนมัติ"
                    onClick={() =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        autoSyncEnabled: !prev.autoSyncEnabled,
                      }))
                    }
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      draftSettings.autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        draftSettings.autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <span className="block text-xs font-medium text-slate-300 mb-2">
                    ความถี่ในการตรวจสอบอัตโนมัติ
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {POLLING_OPTIONS.map((mins) => {
                      const active = draftSettings.pollingIntervalMinutes === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          disabled={!draftSettings.autoSyncEnabled}
                          onClick={() =>
                            setDraftSettings((prev) => ({
                              ...prev,
                              pollingIntervalMinutes: mins,
                            }))
                          }
                          className={`rounded-lg border px-3 py-2 text-xs sm:text-sm font-mono tabular-nums transition-colors cursor-pointer disabled:opacity-40 ${
                            active
                              ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold'
                              : 'border-white/[0.08] bg-[#131822] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          {mins} นาที
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <hr className="border-white/[0.08]" />

              {/* Real Data Source URL */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    เชื่อมต่อแหล่งข้อมูลจริง (Data Source Endpoint)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-400">
                    รองรับ JSON Endpoint, Google Sheets JSON Feed หรือ Steam News API
                    (หากออฟไลน์หรือติด CORS ระบบจะสลับใช้ข้อมูลภายในเครื่องอัตโนมัติ)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="data-source-type"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    รูปแบบแหล่งข้อมูล
                  </label>
                  <select
                    id="data-source-type"
                    value={draftSettings.dataSourceType}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        dataSourceType: e.target.value as DataSourceType,
                      }))
                    }
                    className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="local">ข้อมูลจำลองภายในเครื่อง (Local State)</option>
                    <option value="custom_json">Custom JSON Endpoint URL</option>
                    <option value="google_sheets">Google Sheets JSON Feed URL</option>
                    <option value="steam_news">Steam News API (ระบุ App ID)</option>
                  </select>
                </div>

                {(draftSettings.dataSourceType === 'custom_json' ||
                  draftSettings.dataSourceType === 'google_sheets') && (
                  <div>
                    <label
                      htmlFor="data-source-url"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      URL ปลายทางข้อมูล (JSON)
                    </label>
                    <input
                      id="data-source-url"
                      type="url"
                      value={draftSettings.dataSourceUrl}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          dataSourceUrl: e.target.value,
                        }))
                      }
                      placeholder={
                        draftSettings.dataSourceType === 'google_sheets'
                          ? 'https://opensheet.elk.sh/SPREADSHEET_ID/Sheet1'
                          : 'https://api.example.com/overwatch/patches.json'
                      }
                      className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {draftSettings.dataSourceType === 'steam_news' && (
                  <div>
                    <label
                      htmlFor="steam-app-id"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Steam App ID (เช่น Overwatch 2 = 2357570)
                    </label>
                    <input
                      id="steam-app-id"
                      type="text"
                      inputMode="numeric"
                      value={draftSettings.steamAppId}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          steamAppId: e.target.value,
                        }))
                      }
                      placeholder="2357570"
                      className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <hr className="border-white/[0.08]" />

              {/* Reset Data Action */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-300">
                    คืนค่าข้อมูลแพตช์เริ่มต้น
                  </p>
                  <p className="text-xs text-slate-500">
                    ลบแพตช์ที่จำลองหรือเพิ่มเองใน Local Storage กลับเป็นข้อมูลตัวอย่าง 4 รายการ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetDefaultData();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>คืนค่าเริ่มต้น</span>
                </button>
              </div>
            </div>
          ) : (
            <form id="manual-patch-form" onSubmit={handleManualSubmit} className="space-y-4">
              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-xs sm:text-sm text-amber-200"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="patch-version-input"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    เลขเวอร์ชัน
                  </label>
                  <input
                    id="patch-version-input"
                    type="text"
                    value={patchForm.version}
                    onChange={(e) =>
                      setPatchForm((prev) => ({ ...prev, version: e.target.value }))
                    }
                    placeholder="เช่น v2.5.0"
                    className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="patch-type-select"
                    className="block text-xs font-medium text-slate-300 mb-1.5"
                  >
                    ประเภทแพตช์
                  </label>
                  <select
                    id="patch-type-select"
                    value={patchForm.type}
                    onChange={(e) =>
                      setPatchForm((prev) => ({
                        ...prev,
                        type: e.target.value as PatchType,
                      }))
                    }
                    className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {PATCH_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="patch-datetime-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  วันและเวลาที่อัปเดต
                </label>
                <input
                  id="patch-datetime-input"
                  type="datetime-local"
                  value={patchForm.releasedAt}
                  onChange={(e) =>
                    setPatchForm((prev) => ({ ...prev, releasedAt: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm font-mono text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="patch-title-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  หัวข้อแพตช์
                </label>
                <input
                  id="patch-title-input"
                  type="text"
                  value={patchForm.title}
                  onChange={(e) =>
                    setPatchForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="เช่น อัปเดตแผนที่ใหม่และปรับสมดุลปืนเลเซอร์"
                  className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="patch-summary-input"
                  className="block text-xs font-medium text-slate-300 mb-1.5"
                >
                  สรุปภาพรวมแพตช์
                </label>
                <textarea
                  id="patch-summary-input"
                  rows={2}
                  value={patchForm.summary}
                  onChange={(e) =>
                    setPatchForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="สรุปจุดเด่นหรือสิ่งที่เปลี่ยนแปลงสำคัญในแพตช์นี้..."
                  className="w-full rounded-lg border border-white/[0.1] bg-[#131822] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">
                    รายการเปลี่ยนแปลงในแพตช์
                  </span>
                  <button
                    type="button"
                    onClick={addChangeRow}
                    className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>เพิ่มรายการ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {patchForm.changes.map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-white/[0.08] bg-[#131822] p-3 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <select
                          aria-label={`หมวดหมู่รายการที่ ${idx + 1}`}
                          value={row.category}
                          onChange={(e) =>
                            updateChangeRow(idx, 'category', e.target.value)
                          }
                          className="rounded-md border border-white/[0.1] bg-[#0B0E14] px-2.5 py-1.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
                        >
                          {CHANGE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>

                        {patchForm.changes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeChangeRow(idx)}
                            aria-label={`ลบรายการที่ ${idx + 1}`}
                            className="rounded p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        aria-label={`หัวข้อรายการที่ ${idx + 1}`}
                        value={row.target}
                        onChange={(e) => updateChangeRow(idx, 'target', e.target.value)}
                        placeholder="ชื่อฮีโร่, อาวุธ หรือระบบที่แก้ไข"
                        className="w-full rounded-md border border-white/[0.08] bg-[#0B0E14] px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      />

                      <textarea
                        rows={2}
                        aria-label={`รายละเอียดรายการที่ ${idx + 1}`}
                        value={row.description}
                        onChange={(e) =>
                          updateChangeRow(idx, 'description', e.target.value)
                        }
                        placeholder="รายละเอียดการเปลี่ยนแปลง..."
                        className="w-full rounded-md border border-white/[0.08] bg-[#0B0E14] px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-white/[0.08] bg-[#0B0E14] px-5 py-4 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/[0.1] bg-[#131822] px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors min-h-[42px] cursor-pointer"
          >
            ยกเลิก
          </button>

          {activeTab === 'sync' ? (
            <>
              <button
                type="button"
                onClick={() => handleSettingsSubmit(false)}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors min-h-[42px] cursor-pointer"
              >
                บันทึกการตั้งค่า
              </button>
              <button
                type="button"
                onClick={() => handleSettingsSubmit(true)}
                className="rounded-lg bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors min-h-[42px] cursor-pointer"
              >
                บันทึกและดึงข้อมูลทันที
              </button>
            </>
          ) : (
            <button
              type="submit"
              form="manual-patch-form"
              className="rounded-lg bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition-colors min-h-[42px] cursor-pointer"
            >
              {editingPatch ? 'บันทึกการแก้ไขแพตช์' : 'เผยแพร่แพตช์ใหม่'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
