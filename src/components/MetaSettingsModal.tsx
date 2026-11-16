import {
  Check,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';
import type {
  CounterMatchup,
  Hero,
  HeroBalanceNote,
  HeroRole,
  MetaDataSourceType,
  MetaPollingMinutes,
  MetaSyncSettings,
  MetaSyncStatus,
  PatchMetaSnapshot,
} from '../types/meta';
import { formatThaiDateTime } from '../utils/counterLogic';
import { HeroAvatar } from './HeroAvatar';

interface MetaSettingsModalProps {
  isOpen: boolean;
  roster: Hero[];
  latestPatch: PatchMetaSnapshot;
  patches: PatchMetaSnapshot[];
  settings: MetaSyncSettings;
  syncStatus: MetaSyncStatus;
  customPortraits: Record<string, string>;
  effectivePortraits: Record<string, string>;
  adminRoleOverrides: Record<string, HeroRole>;
  onClose: () => void;
  onSyncNow: () => void;
  onSimulatePatchUpdate: () => void;
  onSaveSettings: (next: MetaSyncSettings, triggerSync: boolean) => void;
  onSaveHeroMatchups: (enemyHeroId: string, matchups: CounterMatchup[]) => void;
  onSaveCustomPortrait: (heroId: string, imageUrl: string) => void;
  onClearCustomPortrait: (heroId: string) => void;
  onAssignHeroRole: (heroId: string, role: HeroRole) => void;
  onResetAdminRoles: () => void;
  onSyncOverfastRoster: () => Promise<{
    ok: boolean;
    count: number;
    addedCount: number;
    roleChanges: string[];
  }>;
  onResetDefaults: () => void;
}

const POLLING_OPTIONS: MetaPollingMinutes[] = [1, 5, 15, 30];
const ROLE_OPTIONS: HeroRole[] = ['Tank', 'Damage', 'Support'];

function getBalanceStatusBadge(status: HeroBalanceNote['status']): string {
  switch (status) {
    case 'บัฟ (เก่งขึ้น)':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'เนิร์ฟ (ลดความแรง)':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'ปรับรูปแบบ':
      return 'bg-sky-50 text-sky-700 border-sky-200';
  }
}

function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านไฟล์รูปภาพได้'));
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl) {
        reject(new Error('ไฟล์รูปภาพไม่ถูกต้อง'));
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        const maxDim = 256;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

export function MetaSettingsModal({
  isOpen,
  roster,
  latestPatch,
  patches,
  settings,
  syncStatus,
  customPortraits,
  effectivePortraits,
  adminRoleOverrides,
  onClose,
  onSyncNow,
  onSimulatePatchUpdate,
  onSaveSettings,
  onSaveHeroMatchups,
  onSaveCustomPortrait,
  onClearCustomPortrait,
  onAssignHeroRole,
  onResetAdminRoles,
  onSyncOverfastRoster,
  onResetDefaults,
}: MetaSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<
    'log' | 'sync' | 'roles' | 'editor' | 'images'
  >('log');
  const [draftSettings, setDraftSettings] = useState<MetaSyncSettings>(settings);

  // Day-1 matchup editor state
  const [selectedEditHeroId, setSelectedEditHeroId] = useState<string>('sombra');
  const [draftMatchups, setDraftMatchups] = useState<CounterMatchup[]>([]);
  const [editorError, setEditorError] = useState<string | null>(null);

  // Admin role reassignment state
  const [roleSearch, setRoleSearch] = useState('');

  // Hero Image Manager state
  const [selectedImageHeroId, setSelectedImageHeroId] = useState<string>('jetpack_cat');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [imageMessage, setImageMessage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSyncingOverfast, setIsSyncingOverfast] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDraftSettings(settings);
    const existing = latestPatch.countersByHero[selectedEditHeroId] ?? [];
    setDraftMatchups(existing.map((m) => ({ ...m })));
    setEditorError(null);
  }, [isOpen, settings, latestPatch, selectedEditHeroId]);

  useEffect(() => {
    if (!isOpen) return;
    setImageUrlInput(customPortraits[selectedImageHeroId] ?? '');
    setImageMessage(null);
    setImageError(null);
  }, [isOpen, selectedImageHeroId, customPortraits]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const filteredRoleHeroes = useMemo(() => {
    const q = roleSearch.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (h) =>
        h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q)
    );
  }, [roster, roleSearch]);

  if (!isOpen) return null;

  const selectedImageHero =
    roster.find((h) => h.id === selectedImageHeroId) ?? roster[0];
  const hasCustomImage = Boolean(customPortraits[selectedImageHero.id]);
  const overrideCount = Object.keys(adminRoleOverrides).length;

  const handleSelectEditHero = (heroId: string) => {
    setSelectedEditHeroId(heroId);
    const existing = latestPatch.countersByHero[heroId] ?? [];
    setDraftMatchups(existing.map((m) => ({ ...m })));
    setEditorError(null);
  };

  const handleAddMatchupRow = () => {
    const firstAvailable =
      roster.find(
        (h) =>
          h.id !== selectedEditHeroId &&
          !draftMatchups.some((m) => m.counterHeroId === h.id)
      )?.id ?? roster[0].id;

    setDraftMatchups((prev) => [
      ...prev,
      { counterHeroId: firstAvailable, reason: '' },
    ]);
  };

  const handleSaveEditor = () => {
    const cleaned = draftMatchups
      .map((m) => ({
        counterHeroId: m.counterHeroId,
        reason: m.reason.trim(),
      }))
      .filter((m) => m.counterHeroId && m.reason.length > 0);

    if (cleaned.length === 0) {
      setEditorError('กรุณาระบุตัวแก้ทางและเหตุผลอย่างน้อย 1 รายการ');
      return;
    }

    onSaveHeroMatchups(selectedEditHeroId, cleaned);
    setEditorError(null);
  };

  const handleSavePortraitUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      setImageError('กรุณาวางลิงก์รูปภาพ (URL) ก่อนบันทึก');
      setImageMessage(null);
      return;
    }
    if (!/^(https?:\/\/|data:image\/)/i.test(trimmed)) {
      setImageError('ลิงก์ต้องขึ้นต้นด้วย https:// หรือ http://');
      setImageMessage(null);
      return;
    }
    onSaveCustomPortrait(selectedImageHero.id, trimmed);
    setImageError(null);
    setImageMessage(`บันทึกรูปภาพใหม่ของ ${selectedImageHero.name} เรียบร้อยแล้ว`);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setImageError('ไฟล์รูปภาพมีขนาดใหญ่เกิน 5 MB กรุณาเลือกไฟล์ที่เล็กลง');
      setImageMessage(null);
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      onSaveCustomPortrait(selectedImageHero.id, dataUrl);
      setImageUrlInput(dataUrl);
      setImageError(null);
      setImageMessage(`อัปโหลดรูปภาพให้ ${selectedImageHero.name} สำเร็จ`);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'อัปโหลดรูปภาพไม่สำเร็จ');
      setImageMessage(null);
    }
  };

  const handleFetchOverfast = async () => {
    setIsSyncingOverfast(true);
    setImageError(null);
    setImageMessage(null);
    const result = await onSyncOverfastRoster();
    setIsSyncingOverfast(false);
    if (result.ok) {
      const extras: string[] = [];
      if (result.addedCount > 0) extras.push(`ฮีโร่ใหม่ ${result.addedCount} ตัว`);
      if (result.roleChanges.length > 0) {
        extras.push(`อัปเดตตำแหน่ง: ${result.roleChanges.join(', ')}`);
      }
      setImageMessage(
        `ซิงค์รายชื่อ ตำแหน่ง และรูปฮีโร่จาก OverFast API สำเร็จ (${result.count} ตัว${
          extras.length > 0 ? ` • ${extras.join(' | ')}` : ''
        })`
      );
    } else {
      setImageError('ไม่สามารถเชื่อมต่อ OverFast API ได้ ใช้ข้อมูลและภาพสำรองในระบบแทน');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 sm:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meta-modal-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-[#E2E8F0] bg-white text-[#1E293B] shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4 sm:px-6">
          <div>
            <h2 id="meta-modal-title" className="text-base sm:text-lg font-bold text-[#1E293B]">
              ระบบอัปเดตแพตช์เมต้าและจัดการข้อมูลฮีโร่
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              จัดการแพตช์ล่าสุด ซิงค์ OverFast API ย้ายตำแหน่งฮีโร่ แก้ไขตัวแก้ทาง และปรับแต่งรูปภาพ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่างจัดการแพตช์"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 sm:px-6">
          <div
            role="tablist"
            aria-label="แท็บจัดการแพตช์"
            className="grid grid-cols-2 sm:grid-cols-5 gap-1 rounded-xl bg-slate-200/70 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'log'}
              onClick={() => setActiveTab('log')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'log'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ประวัติแพตช์
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sync'}
              onClick={() => setActiveTab('sync')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ซิงค์อัตโนมัติ
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'roles'}
              onClick={() => setActiveTab('roles')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ย้ายตำแหน่งฮีโร่
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'editor'}
              onClick={() => setActiveTab('editor')}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              แก้ไขตัวแก้ทาง
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'images'}
              onClick={() => setActiveTab('images')}
              className={`col-span-2 sm:col-span-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'images'
                  ? 'bg-white text-[#1E293B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              จัดการรูปภาพ
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {activeTab === 'log' && (
            <div className="space-y-5">
              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
                <div>
                  <p className="text-xs font-semibold text-sky-800">
                    ทดสอบหรือเช็กอัปเดตแพตช์ล่าสุด (OverFast API + SEA Meta)
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    ตรวจสอบฮีโร่ใหม่ ตำแหน่งที่โดนรีเวิร์ก และรีเฟรชคำแนะนำทันที
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onSyncNow}
                    disabled={syncStatus.isSyncing}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 text-sky-500 ${
                        syncStatus.isSyncing ? 'animate-spin' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>{syncStatus.isSyncing ? 'กำลังเช็ก...' : 'เช็กอัปเดตตอนนี้'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onSimulatePatchUpdate}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#60A5FA] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#3B82F6] transition-colors cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>จำลองเกมอัปเดตแพตช์ใหม่</span>
                  </button>
                </div>
              </div>

              {/* Chronological Patch Update Log */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1E293B]">
                  บันทึกการอัปเดตแพตช์และตัวที่โดนปรับ ({patches.length} เวอร์ชัน)
                </h3>

                <div className="divide-y divide-slate-200 rounded-xl border border-[#E2E8F0] bg-white">
                  {patches.map((patch, idx) => (
                    <article key={patch.id} className="p-4 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#1E293B]">
                            {patch.version}
                          </span>
                          {idx === 0 && (
                            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                              แพตช์ปัจจุบัน
                            </span>
                          )}
                        </div>
                        <time
                          dateTime={patch.releasedAt}
                          className="font-mono text-xs text-slate-500 tabular-nums"
                        >
                          {formatThaiDateTime(patch.releasedAt)}
                        </time>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {patch.summary}
                      </p>

                      {patch.balanceNotes.length > 0 && (
                        <ul className="space-y-1.5 pt-1">
                          {patch.balanceNotes.map((note, nIdx) => (
                            <li
                              key={nIdx}
                              className="flex flex-wrap items-baseline gap-2 text-xs"
                            >
                              <span className="font-bold text-slate-800">
                                {note.heroName}
                              </span>
                              <span
                                className={`rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${getBalanceStatusBadge(
                                  note.status
                                )}`}
                              >
                                {note.status}
                              </span>
                              <span className="text-slate-600">{note.summary}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">
                    เปิดใช้งานระบบซิงค์อัตโนมัติ (Auto-Sync Polling)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    ตรวจจับฮีโร่ใหม่ ตำแหน่งรีเวิร์กจาก OverFast API และอัปเดตตัวแก้ทางอัตโนมัติ
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={draftSettings.autoSyncEnabled}
                  aria-label="เปิดหรือปิดซิงค์เมต้าอัตโนมัติ"
                  onClick={() =>
                    setDraftSettings((prev) => ({
                      ...prev,
                      autoSyncEnabled: !prev.autoSyncEnabled,
                    }))
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    draftSettings.autoSyncEnabled ? 'bg-[#60A5FA]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      draftSettings.autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2">
                  ความถี่การตรวจสอบอัตโนมัติ
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
                        className={`rounded-xl border px-3 py-2 text-xs sm:text-sm font-mono tabular-nums transition-colors cursor-pointer disabled:opacity-40 ${
                          active
                            ? 'border-[#60A5FA] bg-sky-50 text-sky-700 font-bold'
                            : 'border-[#E2E8F0] bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {mins} นาที
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-200" />

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="meta-source-type"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    แหล่งข้อมูลอัปเดตแพตช์เสริม (ร่วมกับ OverFast API)
                  </label>
                  <select
                    id="meta-source-type"
                    value={draftSettings.dataSourceType}
                    onChange={(e) =>
                      setDraftSettings((prev) => ({
                        ...prev,
                        dataSourceType: e.target.value as MetaDataSourceType,
                      }))
                    }
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#1E293B] focus:border-[#60A5FA] focus:outline-none"
                  >
                    <option value="local">OverFast API + ข้อมูล SEA Meta ในเครื่อง</option>
                    <option value="custom_json">Custom JSON Endpoint URL</option>
                    <option value="google_sheets">Google Sheets JSON Feed</option>
                    <option value="steam_news">Steam / Blizzard News Feed (App ID)</option>
                  </select>
                </div>

                {(draftSettings.dataSourceType === 'custom_json' ||
                  draftSettings.dataSourceType === 'google_sheets') && (
                  <div>
                    <label
                      htmlFor="meta-source-url"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      URL ปลายทาง JSON
                    </label>
                    <input
                      id="meta-source-url"
                      type="url"
                      value={draftSettings.dataSourceUrl}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          dataSourceUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/overwatch-sea-meta.json"
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-mono text-[#1E293B] placeholder:text-slate-400 focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>
                )}

                {draftSettings.dataSourceType === 'steam_news' && (
                  <div>
                    <label
                      htmlFor="meta-steam-id"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Steam App ID (Overwatch 2 = 2357570)
                    </label>
                    <input
                      id="meta-steam-id"
                      type="text"
                      inputMode="numeric"
                      value={draftSettings.steamAppId}
                      onChange={(e) =>
                        setDraftSettings((prev) => ({
                          ...prev,
                          steamAppId: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-mono text-[#1E293B] focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  สถานะล่าสุด: ตรวจสอบเมื่อ {formatThaiDateTime(syncStatus.lastCheckedAt)}
                  {syncStatus.statusNote ? ` · ${syncStatus.statusNote}` : ''}
                </p>
              </div>

              <hr className="border-slate-200" />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    คืนค่าเมต้า ตำแหน่ง และรูปภาพเริ่มต้นทั้งหมด
                  </p>
                  <p className="text-xs text-slate-500">
                    ล้างการแก้ไขในเครื่องกลับเป็นข้อมูลแพตช์มาตรฐาน
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetDefaults();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>คืนค่าเริ่มต้น</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSaveSettings(draftSettings, false);
                    onClose();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  บันทึกการตั้งค่า
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveSettings(draftSettings, true);
                    onClose();
                  }}
                  className="rounded-xl bg-[#60A5FA] px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-[#3B82F6] cursor-pointer"
                >
                  บันทึกและซิงค์ทันที
                </button>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
                <div>
                  <p className="text-xs font-semibold text-sky-800">
                    สลับตำแหน่งฮีโร่ได้ทันทีในคลิกเดียว (กรณีฮีโร่โดนรีเวิร์กในแพตช์ใหม่)
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    ระบบซิงค์ตำแหน่งล่าสุดจาก OverFast API ให้อัตโนมัติ (เช่น Sombra → Support) หรือปรับเองได้ที่นี่
                  </p>
                </div>
                {overrideCount > 0 && (
                  <button
                    type="button"
                    onClick={onResetAdminRoles}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>คืนค่าตามแพตช์ ({overrideCount})</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={roleSearch}
                  onChange={(e) => setRoleSearch(e.target.value)}
                  placeholder="ค้นหาชื่อฮีโร่หรือตำแหน่ง (เช่น Sombra, Support)..."
                  aria-label="ค้นหาฮีโร่เพื่อย้ายตำแหน่ง"
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#60A5FA] focus:outline-none"
                />
              </div>

              <div className="divide-y divide-slate-200 rounded-xl border border-[#E2E8F0] bg-white max-h-[380px] overflow-y-auto">
                {filteredRoleHeroes.map((hero) => {
                  const isOverridden = Boolean(adminRoleOverrides[hero.id]);
                  return (
                    <div
                      key={hero.id}
                      className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <HeroAvatar
                          hero={hero}
                          size="pill"
                          portraitOverride={effectivePortraits[hero.id]}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-[#1E293B] truncate">
                              {hero.name}
                            </span>
                            {isOverridden && (
                              <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">
                                ปรับเอง
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        role="group"
                        aria-label={`กำหนดตำแหน่งให้ ${hero.name}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#F1F5F9] p-1"
                      >
                        {ROLE_OPTIONS.map((roleOpt) => {
                          const active = hero.role === roleOpt;
                          return (
                            <button
                              key={roleOpt}
                              type="button"
                              aria-pressed={active}
                              onClick={() => onAssignHeroRole(hero.id, roleOpt)}
                              className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                                active
                                  ? 'bg-[#60A5FA] text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              {roleOpt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="edit-enemy-hero-select"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  เลือกฮีโร่ฝั่งตรงข้ามที่ต้องการแก้ไขตัวแก้ทาง ({latestPatch.version})
                </label>
                <select
                  id="edit-enemy-hero-select"
                  value={selectedEditHeroId}
                  onChange={(e) => handleSelectEditHero(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-semibold text-[#1E293B] focus:border-[#60A5FA] focus:outline-none"
                >
                  {roster.map((hero) => (
                    <option key={hero.id} value={hero.id}>
                      {hero.name} ({hero.role})
                    </option>
                  ))}
                </select>
              </div>

              {editorError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-700"
                >
                  {editorError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  รายชื่อตัวแก้ทางแนะนำ (เรียงตามลำดับความสำคัญ)
                </span>
                <button
                  type="button"
                  onClick={handleAddMatchupRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>เพิ่มตัวแก้ทาง</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {draftMatchups.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <select
                        aria-label={`ตัวแก้ทางลำดับที่ ${idx + 1}`}
                        value={item.counterHeroId}
                        onChange={(e) =>
                          setDraftMatchups((prev) =>
                            prev.map((m, i) =>
                              i === idx ? { ...m, counterHeroId: e.target.value } : m
                            )
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-[#1E293B] focus:border-[#60A5FA] focus:outline-none"
                      >
                        {roster.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} ({h.role})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          setDraftMatchups((prev) => prev.filter((_, i) => i !== idx))
                        }
                        aria-label={`ลบตัวแก้ทางลำดับที่ ${idx + 1}`}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <input
                      type="text"
                      aria-label={`เหตุผลตัวแก้ทางลำดับที่ ${idx + 1}`}
                      value={item.reason}
                      onChange={(e) =>
                        setDraftMatchups((prev) =>
                          prev.map((m, i) =>
                            i === idx ? { ...m, reason: e.target.value } : m
                          )
                        )
                      }
                      placeholder="อธิบายสั้นๆ ว่าทำไมถึงแก้ทางได้ในแพตช์นี้..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-[#1E293B] placeholder:text-slate-400 focus:border-[#60A5FA] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveEditor}
                  className="rounded-xl bg-[#60A5FA] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#3B82F6] transition-colors cursor-pointer"
                >
                  บันทึกตัวแก้ทางลงเครื่อง
                </button>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-5">
              {/* OverFast Sync Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/60 p-4">
                <div>
                  <p className="text-xs font-semibold text-sky-800">
                    ซิงค์รายชื่อ ตำแหน่ง และรูปภาพฮีโร่จาก OverFast API
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    ดึงข้อมูลทางการล่าสุด ({roster.length} ตัว พร้อมภาพวาด SVG สำรองหากออฟไลน์)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void handleFetchOverfast()}
                  disabled={isSyncingOverfast}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-sky-300 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 text-sky-500 ${
                      isSyncingOverfast ? 'animate-spin' : ''
                    }`}
                    aria-hidden="true"
                  />
                  <span>
                    {isSyncingOverfast ? 'กำลังซิงค์...' : 'ดึงรูปและข้อมูลจาก OverFast API'}
                  </span>
                </button>
              </div>

              {/* Select Hero & Preview */}
              <div className="space-y-3">
                <label
                  htmlFor="image-hero-select"
                  className="block text-xs font-semibold text-slate-700"
                >
                  เลือกฮีโร่ที่ต้องการปรับแต่งรูปภาพ ({roster.length} ตัว)
                </label>
                <select
                  id="image-hero-select"
                  value={selectedImageHero.id}
                  onChange={(e) => setSelectedImageHeroId(e.target.value)}
                  className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm font-semibold text-[#1E293B] focus:border-[#60A5FA] focus:outline-none"
                >
                  {roster.map((hero) => (
                    <option key={hero.id} value={hero.id}>
                      {hero.name} ({hero.role})
                      {customPortraits[hero.id] ? ' ★ รูปที่กำหนดเอง' : ''}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <HeroAvatar
                    hero={selectedImageHero}
                    size="card"
                    portraitOverride={effectivePortraits[selectedImageHero.id]}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#1E293B]">
                        {selectedImageHero.name}
                      </span>
                      <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {selectedImageHero.role}
                      </span>
                      {hasCustomImage && (
                        <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                          กำลังใช้รูปที่กำหนดเอง
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      รองรับทั้งการวางลิงก์รูปภาพภายนอก และการอัปโหลดรูปจากอุปกรณ์ของคุณ (บันทึกอัตโนมัติในเครื่อง)
                    </p>
                  </div>

                  {hasCustomImage && (
                    <button
                      type="button"
                      onClick={() => {
                        onClearCustomPortrait(selectedImageHero.id);
                        setImageUrlInput('');
                        setImageError(null);
                        setImageMessage(
                          `คืนค่ารูปภาพมาตรฐานของ ${selectedImageHero.name} แล้ว`
                        );
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>ลบรูปที่กำหนดเอง</span>
                    </button>
                  )}
                </div>
              </div>

              {imageError && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-medium text-rose-700"
                >
                  {imageError}
                </div>
              )}

              {imageMessage && (
                <div
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-medium text-emerald-700"
                >
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{imageMessage}</span>
                </div>
              )}

              {/* Paste Custom URL */}
              <div className="space-y-2">
                <label
                  htmlFor="custom-portrait-url"
                  className="block text-xs font-semibold text-slate-700"
                >
                  วางลิงก์รูปภาพ (Image URL)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="custom-portrait-url"
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/hero-portrait.png"
                    className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-xs sm:text-sm font-mono text-[#1E293B] placeholder:text-slate-400 focus:border-[#60A5FA] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSavePortraitUrl}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#60A5FA] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#3B82F6] transition-colors cursor-pointer shrink-0"
                  >
                    <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    <span>บันทึกรูป URL</span>
                  </button>
                </div>
              </div>

              {/* Upload Local Image File */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700">
                  หรืออัปโหลดไฟล์รูปภาพจากเครื่อง (PNG / JPG / WebP)
                </span>
                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-[#F8FAFC] px-4 py-4 text-xs sm:text-sm font-semibold text-slate-600 hover:border-[#60A5FA] hover:bg-sky-50/40 hover:text-sky-700 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  <span>เลือกไฟล์รูปภาพสำหรับ {selectedImageHero.name}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void handleFileUpload(e)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
