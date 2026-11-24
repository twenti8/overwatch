import { Settings2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CounterRecommendationBox } from './components/CounterRecommendationBox';
import { HeroCard } from './components/HeroCard';
import { MetaSettingsModal } from './components/MetaSettingsModal';
import { MetaToast, type MetaToastData } from './components/MetaToast';
import { OverwatchEmblem } from './components/OverwatchEmblem';
import { PWAInstallButton } from './components/PWAInstallButton';
import { HERO_ROSTER } from './data/heroesAndMeta';
import type {
  CounterMatchup,
  Hero,
  HeroRole,
  MetaSyncSettings,
  MetaSyncStatus,
  OverfastHeroApiItem,
  PatchMetaSnapshot,
  RoleFilter,
} from './types/meta';
import {
  buildMetaFeedUrl,
  computeCounterRecommendations,
  createSimulatedMetaPatch,
  filterHeroesByRole,
  formatThaiShortDate,
  mergeOverfastHeroes,
  parseExternalMetaFeed,
  sortMetaPatchesNewestFirst,
  updateHeroCountersInPatch,
} from './utils/counterLogic';
import {
  loadAdminRoleOverrides,
  loadCustomPortraits,
  loadMetaPatches,
  loadMetaSyncSettings,
  loadOverfastHeroesCache,
  loadSelectedHeroIds,
  resetMetaStorage,
  saveAdminRoleOverrides,
  saveCustomPortraits,
  saveMetaPatches,
  saveMetaSyncSettings,
  saveOverfastHeroesCache,
  saveSelectedHeroIds,
} from './utils/metaStorage';

const ROLE_FILTERS: RoleFilter[] = ['ทั้งหมด', 'Tank', 'Damage', 'Support'];
const OVERFAST_HEROES_API = 'https://overfast-api.tekrop.fr/heroes';

export default function App() {
  const [patches, setPatches] = useState<PatchMetaSnapshot[]>(() => loadMetaPatches());
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>(() =>
    loadSelectedHeroIds()
  );
  const [syncSettings, setSyncSettings] = useState<MetaSyncSettings>(() =>
    loadMetaSyncSettings()
  );
  const [customPortraits, setCustomPortraits] = useState<Record<string, string>>(() =>
    loadCustomPortraits()
  );
  const [overfastHeroes, setOverfastHeroes] = useState<OverfastHeroApiItem[]>(() =>
    loadOverfastHeroesCache()
  );
  const [adminRoleOverrides, setAdminRoleOverrides] = useState<
    Record<string, HeroRole>
  >(() => loadAdminRoleOverrides());

  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ทั้งหมด');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [toast, setToast] = useState<MetaToastData | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [syncStatus, setSyncStatus] = useState<MetaSyncStatus>(() => ({
    isSyncing: false,
    lastCheckedAt: new Date().toISOString(),
    connectionState: syncSettings.autoSyncEnabled ? 'live' : 'paused',
    statusNote: null,
  }));

  const sortedPatches = useMemo(() => sortMetaPatchesNewestFirst(patches), [patches]);
  const latestPatch = sortedPatches[0];

  const liveRoster = useMemo(
    () =>
      mergeOverfastHeroes(HERO_ROSTER, overfastHeroes, adminRoleOverrides).heroes,
    [overfastHeroes, adminRoleOverrides]
  );

  const effectivePortraits = useMemo(() => {
    const map: Record<string, string> = {};
    for (const hero of liveRoster) {
      map[hero.id] = customPortraits[hero.id] || hero.portraitUrl;
    }
    return map;
  }, [liveRoster, customPortraits]);

  const visibleHeroes = useMemo(
    () => filterHeroesByRole(liveRoster, roleFilter),
    [liveRoster, roleFilter]
  );

  const selectedEnemies = useMemo(() => {
    const map = new Map<string, Hero>(liveRoster.map((h) => [h.id, h]));
    return selectedHeroIds
      .map((id) => map.get(id))
      .filter((h): h is Hero => Boolean(h));
  }, [selectedHeroIds, liveRoster]);

  const recommendations = useMemo(
    () => computeCounterRecommendations(selectedHeroIds, latestPatch, liveRoster),
    [selectedHeroIds, latestPatch, liveRoster]
  );

  const showToast = useCallback((title: string, detail?: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ id: `meta-toast-${Date.now()}`, title, detail });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4500);
  }, []);

  useEffect(() => {
    saveMetaPatches(patches);
  }, [patches]);

  useEffect(() => {
    saveSelectedHeroIds(selectedHeroIds);
  }, [selectedHeroIds]);

  useEffect(() => {
    saveMetaSyncSettings(syncSettings);
  }, [syncSettings]);

  useEffect(() => {
    saveCustomPortraits(customPortraits);
  }, [customPortraits]);

  useEffect(() => {
    saveOverfastHeroesCache(overfastHeroes);
  }, [overfastHeroes]);

  useEffect(() => {
    saveAdminRoleOverrides(adminRoleOverrides);
  }, [adminRoleOverrides]);

  const syncOverfastRoster = useCallback(async (): Promise<{
    ok: boolean;
    count: number;
    addedCount: number;
    roleChanges: string[];
  }> => {
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 7000);
      const response = await fetch(OVERFAST_HEROES_API, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      window.clearTimeout(timeoutId);
      if (!response.ok) {
        return { ok: false, count: 0, addedCount: 0, roleChanges: [] };
      }

      const payload: unknown = await response.json();
      if (!Array.isArray(payload)) {
        return { ok: false, count: 0, addedCount: 0, roleChanges: [] };
      }

      const validItems: OverfastHeroApiItem[] = [];
      for (const item of payload) {
        if (
          item &&
          typeof item === 'object' &&
          'key' in item &&
          'name' in item &&
          'role' in item &&
          'portrait' in item &&
          typeof item.key === 'string' &&
          typeof item.name === 'string' &&
          typeof item.role === 'string' &&
          typeof item.portrait === 'string'
        ) {
          validItems.push({
            key: item.key,
            name: item.name,
            role: item.role,
            portrait: item.portrait,
          });
        }
      }

      if (validItems.length === 0) {
        return { ok: false, count: 0, addedCount: 0, roleChanges: [] };
      }

      const currentBaseline = mergeOverfastHeroes(
        HERO_ROSTER,
        overfastHeroes,
        adminRoleOverrides
      ).heroes;
      const merged = mergeOverfastHeroes(
        currentBaseline,
        validItems,
        adminRoleOverrides
      );

      setOverfastHeroes(validItems);
      return {
        ok: true,
        count: validItems.length,
        addedCount: merged.addedHeroes.length,
        roleChanges: merged.roleChanges,
      };
    } catch {
      return { ok: false, count: 0, addedCount: 0, roleChanges: [] };
    }
  }, [overfastHeroes, adminRoleOverrides]);

  // Sync live OverFast roles, new heroes, and official portraits on initial load
  useEffect(() => {
    void syncOverfastRoster();
    // Run once on mount to keep initial load aligned with live patch roles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performSyncCheck = useCallback(
    async (overrideSettings?: MetaSyncSettings, isManual = false) => {
      const activeSettings = overrideSettings ?? syncSettings;
      const checkedAt = new Date().toISOString();

      setSyncStatus((prev) => ({ ...prev, isSyncing: true, statusNote: null }));

      const overfastResult = await syncOverfastRoster();
      const feedUrl = buildMetaFeedUrl(
        activeSettings.dataSourceType,
        activeSettings.dataSourceUrl,
        activeSettings.steamAppId
      );

      if (!feedUrl) {
        setSyncStatus({
          isSyncing: false,
          lastCheckedAt: checkedAt,
          connectionState: activeSettings.autoSyncEnabled ? 'live' : 'paused',
          statusNote: overfastResult.ok
            ? `ซิงค์ OverFast API (${overfastResult.count} ฮีโร่) แล้ว`
            : 'ใช้ข้อมูลแพตช์ 2026 ภายในเครื่อง',
        });

        if (overfastResult.ok && (overfastResult.addedCount > 0 || overfastResult.roleChanges.length > 0)) {
          showToast(
            'อัปเดตตำแหน่งและรายชื่อฮีโร่จาก OverFast API แล้ว',
            [
              overfastResult.addedCount > 0
                ? `เพิ่มฮีโร่ใหม่ ${overfastResult.addedCount} ตัว`
                : '',
              overfastResult.roleChanges.length > 0
                ? `เปลี่ยนตำแหน่ง: ${overfastResult.roleChanges.join(', ')}`
                : '',
            ]
              .filter(Boolean)
              .join(' • ')
          );
        } else if (isManual) {
          showToast(
            'ตรวจสอบแพตช์เรียบร้อย',
            overfastResult.ok
              ? `ซิงค์ตำแหน่งและรูปฮีโร่ ${overfastResult.count} ตัวตรงตาม ${latestPatch.version}`
              : `กำลังใช้ข้อมูล ${latestPatch.version} ในเครื่อง`
          );
        }
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 8000);
        const response = await fetch(feedUrl, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        window.clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        const incomingPatch = parseExternalMetaFeed(
          payload,
          activeSettings.dataSourceType,
          latestPatch
        );

        if (incomingPatch && incomingPatch.version !== latestPatch.version) {
          setPatches((prev) => sortMetaPatchesNewestFirst([incomingPatch, ...prev]));
          showToast(
            'ตรวจพบแพตช์ใหม่! อัปเดตตัวแก้ทางแล้ว',
            `${incomingPatch.version} (${formatThaiShortDate(incomingPatch.releasedAt)})`
          );
        } else if (isManual) {
          showToast('ซิงค์ข้อมูลสำเร็จ', 'ไม่พบแพตช์ใหม่เพิ่มเติม');
        }

        setSyncStatus({
          isSyncing: false,
          lastCheckedAt: checkedAt,
          connectionState: activeSettings.autoSyncEnabled ? 'live' : 'paused',
          statusNote: 'ซิงค์จากแหล่งข้อมูลภายนอกสำเร็จ',
        });
      } catch {
        setSyncStatus({
          isSyncing: false,
          lastCheckedAt: checkedAt,
          connectionState: 'fallback',
          statusNote: 'เชื่อมต่อปลายทางไม่ได้ ใช้ข้อมูลในเครื่องแทนอัตโนมัติ',
        });
        if (isManual) {
          showToast(
            'สลับใช้ข้อมูล SEA Meta ในเครื่อง',
            'ไม่สามารถเชื่อมต่อ URL ภายนอกได้ (ออฟไลน์หรือติด CORS)'
          );
        }
      }
    },
    [syncSettings, latestPatch, showToast, syncOverfastRoster]
  );

  // Auto-sync polling interval
  useEffect(() => {
    if (!syncSettings.autoSyncEnabled) {
      setSyncStatus((prev) => ({ ...prev, connectionState: 'paused' }));
      return;
    }
    const intervalMs = syncSettings.pollingIntervalMinutes * 60_000;
    const timer = window.setInterval(() => {
      void performSyncCheck(syncSettings, false);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [syncSettings, performSyncCheck]);

  const handleToggleHero = (heroId: string) => {
    setSelectedHeroIds((prev) =>
      prev.includes(heroId) ? prev.filter((id) => id !== heroId) : [...prev, heroId]
    );
  };

  const handleSimulatePatchUpdate = () => {
    const newPatch = createSimulatedMetaPatch(patches, new Date());
    setPatches((prev) => sortMetaPatchesNewestFirst([newPatch, ...prev]));
    setSyncStatus((prev) => ({
      ...prev,
      lastCheckedAt: new Date().toISOString(),
      statusNote: `อัปเดตเป็น ${newPatch.version}`,
    }));
    showToast(
      `อัปเดตเมต้าแพตช์ใหม่แล้ว: ${newPatch.version}`,
      `รีเฟรชคำแนะนำ SEA Meta ประจำวันที่ ${formatThaiShortDate(newPatch.releasedAt)}`
    );
  };

  const handleSaveSettings = (next: MetaSyncSettings, triggerSync: boolean) => {
    setSyncSettings(next);
    if (triggerSync) {
      void performSyncCheck(next, true);
    } else {
      showToast('บันทึกการตั้งค่าระบบซิงค์เรียบร้อยแล้ว');
    }
  };

  const handleSaveHeroMatchups = (enemyHeroId: string, matchups: CounterMatchup[]) => {
    setPatches((prev) => {
      const sorted = sortMetaPatchesNewestFirst(prev);
      const head = sorted[0];
      if (!head) return prev;
      const updatedHead = updateHeroCountersInPatch(head, enemyHeroId, matchups);
      return [updatedHead, ...sorted.slice(1)];
    });
    const heroName = liveRoster.find((h) => h.id === enemyHeroId)?.name ?? enemyHeroId;
    showToast(`อัปเดตตัวแก้ทาง ${heroName} แล้ว`, `บันทึกข้อมูลลงในแพตช์ ${latestPatch.version}`);
  };

  const handleAssignHeroRole = (heroId: string, role: HeroRole) => {
    setAdminRoleOverrides((prev) => ({ ...prev, [heroId]: role }));
    const heroName = liveRoster.find((h) => h.id === heroId)?.name ?? heroId;
    showToast(`ย้ายตำแหน่ง ${heroName} เป็น ${role} แล้ว`);
  };

  const handleResetAdminRoles = () => {
    setAdminRoleOverrides({});
    showToast('คืนค่าตำแหน่งฮีโร่ทั้งหมดตามแพตช์ล่าสุดแล้ว');
  };

  const handleSaveCustomPortrait = (heroId: string, imageUrl: string) => {
    setCustomPortraits((prev) => ({ ...prev, [heroId]: imageUrl }));
    const heroName = liveRoster.find((h) => h.id === heroId)?.name ?? heroId;
    showToast(`อัปเดตรูปภาพ ${heroName} แล้ว`);
  };

  const handleClearCustomPortrait = (heroId: string) => {
    setCustomPortraits((prev) => {
      const next = { ...prev };
      delete next[heroId];
      return next;
    });
  };

  const handleResetDefaults = () => {
    const reset = resetMetaStorage();
    setPatches(reset.patches);
    setSelectedHeroIds(reset.selectedHeroIds);
    setCustomPortraits(reset.customPortraits);
    setAdminRoleOverrides(reset.adminRoleOverrides);
    showToast('คืนค่าข้อมูลตัวแก้ทาง ตำแหน่ง และรูปภาพเริ่มต้นเรียบร้อยแล้ว');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-3 py-5 sm:px-6 sm:py-10">
      <main className="mx-auto max-w-[1160px] rounded-3xl border border-[#E2E8F0] bg-white px-4 py-7 sm:px-8 sm:py-10 shadow-[0_4px_24px_rgba(15,23,42,0.04)]">
        {/* Centered Header Section */}
        <header className="flex flex-col items-center text-center">
          <OverwatchEmblem className="mb-2.5 h-12 w-12" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E293B]">
            OVERWATCH
          </h1>
          <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-500">
            เช็กตัวแก้ทางแพตช์ล่าสุด (SEA Meta)
          </p>

          {/* Subtle Live Patch & Auto-Update Status Pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl sm:rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-medium text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    syncSettings.autoSyncEnabled ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="font-mono font-semibold text-[#1E293B]">
                  อัปเดตตามแพตช์ล่าสุด: {latestPatch.version}
                </span>
              </span>
              <span className="text-slate-400">
                (อัปเดตเมื่อ {formatThaiShortDate(latestPatch.releasedAt)})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#60A5FA] hover:text-[#1E293B] transition-colors cursor-pointer min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]"
            >
              <Settings2 className="h-3.5 w-3.5 text-sky-500" aria-hidden="true" />
              <span>อัปเดตแพตช์ / จัดการข้อมูล</span>
            </button>

            <PWAInstallButton />
          </div>
        </header>

        {/* Role Filter Pills (Centered Horizontal Row) */}
        <div
          role="group"
          aria-label="กรองฮีโร่ตามตำแหน่ง"
          className="mt-7 flex flex-wrap items-center justify-center gap-2"
        >
          {ROLE_FILTERS.map((role) => {
            const isActive = roleFilter === role;
            return (
              <button
                key={role}
                type="button"
                aria-pressed={isActive}
                onClick={() => setRoleFilter(role)}
                className={`rounded-full px-3.5 sm:px-5 py-2 text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
                  isActive
                    ? 'bg-[#60A5FA] text-white font-bold shadow-xs'
                    : 'bg-[#F1F5F9] text-slate-600 font-semibold hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {role}
              </button>
            );
          })}
        </div>

        {/* Hero Selection Grid (7 Columns on Desktop, Responsive on Mobile) */}
        <section aria-label="เลือกฮีโร่ฝั่งตรงข้าม" className="mt-7">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-3.5">
            {visibleHeroes.map((hero) => (
              <HeroCard
                key={hero.id}
                hero={hero}
                isSelected={selectedHeroIds.includes(hero.id)}
                portraitOverride={effectivePortraits[hero.id]}
                onToggle={handleToggleHero}
              />
            ))}
          </div>
        </section>

        {/* Bottom Counter Recommendation Box */}
        <div className="mt-8">
          <CounterRecommendationBox
            selectedEnemies={selectedEnemies}
            recommendations={recommendations}
            patchVersion={latestPatch.version}
            portraitOverrides={effectivePortraits}
            onClearSelection={() => setSelectedHeroIds([])}
          />
        </div>
      </main>

      <MetaSettingsModal
        isOpen={isSettingsOpen}
        roster={liveRoster}
        latestPatch={latestPatch}
        patches={sortedPatches}
        settings={syncSettings}
        syncStatus={syncStatus}
        customPortraits={customPortraits}
        effectivePortraits={effectivePortraits}
        adminRoleOverrides={adminRoleOverrides}
        onClose={() => setIsSettingsOpen(false)}
        onSyncNow={() => void performSyncCheck(syncSettings, true)}
        onSimulatePatchUpdate={handleSimulatePatchUpdate}
        onSaveSettings={handleSaveSettings}
        onSaveHeroMatchups={handleSaveHeroMatchups}
        onSaveCustomPortrait={handleSaveCustomPortrait}
        onClearCustomPortrait={handleClearCustomPortrait}
        onAssignHeroRole={handleAssignHeroRole}
        onResetAdminRoles={handleResetAdminRoles}
        onSyncOverfastRoster={syncOverfastRoster}
        onResetDefaults={handleResetDefaults}
      />

      <MetaToast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
