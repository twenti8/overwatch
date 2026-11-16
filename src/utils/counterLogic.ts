import { HERO_ROSTER, SIMULATED_META_UPDATES } from '../data/heroesAndMeta';
import type {
  CounterMatchup,
  Hero,
  HeroArchetype,
  HeroRole,
  MetaDataSourceType,
  OverfastHeroApiItem,
  PatchMetaSnapshot,
  RecommendedCounter,
  RoleFilter,
} from '../types/meta';

const THAI_SHORT_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
] as const;

const ROLE_SORT_ORDER: Record<HeroRole, number> = {
  Tank: 0,
  Damage: 1,
  Support: 2,
};

const ROLE_FALLBACK_COUNTERS: Record<HeroRole, CounterMatchup[]> = {
  Tank: [
    { counterHeroId: 'ana', reason: 'Biotic Grenade ตัดการฮีลและ Sleep Dart หยุดการเข้าทำของ Tank ได้ดี' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ช่วยทีมลดเลือด Tank ฝั่งตรงข้ามได้เร็วขึ้นมาก' },
    { counterHeroId: 'reaper', reason: 'ช็อตกันระยะประชิดสร้างดาเมจใส่ Tank ตัวใหญ่ได้รุนแรง' },
    { counterHeroId: 'pharah', reason: 'โจมตีจากมุมสูงข้ามโล่และระยะโจมตีของ Tank' },
  ],
  Damage: [
    { counterHeroId: 'dva', reason: 'Defense Matrix ดูดดาเมจและบินไล่กดดัน Damage จากที่สูงได้ทัน' },
    { counterHeroId: 'winston', reason: 'กระโดดกดดันพื้นที่ยืนยิงและกางบาเรียตัดเส้นสายตา' },
    { counterHeroId: 'cassidy', reason: 'Hinder ตัดจังหวะเคลื่อนที่และดวลระยะกลางได้สม่ำเสมอ' },
    { counterHeroId: 'tracer', reason: 'ความเร็วสูงเข้าประชิดป่วนจังหวะยิงได้ดี' },
  ],
  Support: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดัน Support ในแนวหลังและกางบาเรียตัดฮีล' },
    { counterHeroId: 'tracer', reason: 'ล้วงแนวหลังบังคับให้ Support ต้องรีบใช้สกิลเอาตัวรอด' },
    { counterHeroId: 'cassidy', reason: 'Hinder หยุดการหลบหนีและเก็บ Support ได้รวดเร็ว' },
    { counterHeroId: 'dva', reason: 'Defense Matrix ดูดกระสุนและไล่ประกบ Support แถวหลัง' },
  ],
};

export function formatThaiShortDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'ไม่ระบุวันที่';
  }
  const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + bangkokOffsetMs);
  const day = local.getUTCDate();
  const month = THAI_SHORT_MONTHS[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function formatThaiDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'ไม่ระบุเวลา';
  }
  const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + bangkokOffsetMs);
  const day = local.getUTCDate();
  const month = THAI_SHORT_MONTHS[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  const hours = String(local.getUTCHours()).padStart(2, '0');
  const minutes = String(local.getUTCMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

export function sortMetaPatchesNewestFirst(
  patches: PatchMetaSnapshot[]
): PatchMetaSnapshot[] {
  return [...patches].sort((a, b) => {
    const tA = new Date(a.releasedAt).getTime();
    const tB = new Date(b.releasedAt).getTime();
    return (Number.isNaN(tB) ? 0 : tB) - (Number.isNaN(tA) ? 0 : tA);
  });
}

export function filterHeroesByRole(heroes: Hero[], roleFilter: RoleFilter): Hero[] {
  if (roleFilter === 'ทั้งหมด') {
    return heroes;
  }
  return heroes.filter((hero) => hero.role === roleFilter);
}

export function normalizeOverfastRole(rawRole: string): HeroRole | null {
  switch (rawRole.trim().toLowerCase()) {
    case 'tank':
      return 'Tank';
    case 'damage':
      return 'Damage';
    case 'support':
      return 'Support';
    default:
      return null;
  }
}

function getDefaultStyleForRole(role: HeroRole): {
  accentFrom: string;
  accentTo: string;
  archetype: HeroArchetype;
} {
  switch (role) {
    case 'Tank':
      return { accentFrom: '#60A5FA', accentTo: '#2563EB', archetype: 'shield' };
    case 'Damage':
      return { accentFrom: '#F87171', accentTo: '#DC2626', archetype: 'hitscan' };
    case 'Support':
      return { accentFrom: '#34D399', accentTo: '#0D9488', archetype: 'medic' };
  }
}

export function sortRosterByRoleAndName(heroes: Hero[]): Hero[] {
  return [...heroes].sort((a, b) => {
    const roleDiff = ROLE_SORT_ORDER[a.role] - ROLE_SORT_ORDER[b.role];
    if (roleDiff !== 0) return roleDiff;
    return a.name.localeCompare(b.name);
  });
}

export function applyAdminRoleOverrides(
  heroes: Hero[],
  overrides: Record<string, HeroRole>
): Hero[] {
  const updated = heroes.map((hero) => {
    const overrideRole = overrides[hero.id];
    return overrideRole ? { ...hero, role: overrideRole } : hero;
  });
  return sortRosterByRoleAndName(updated);
}

/**
 * Merges live hero data from OverFast API into the baseline roster:
 * - Updates official roles (e.g. Sombra -> Support) and portrait URLs
 * - Adds any newly released official heroes dynamically
 * - Preserves explicit admin role reassignments
 */
export function mergeOverfastHeroes(
  baseRoster: Hero[],
  apiItems: OverfastHeroApiItem[],
  adminRoleOverrides: Record<string, HeroRole> = {}
): {
  heroes: Hero[];
  roleChanges: string[];
  addedHeroes: string[];
} {
  const byKey = new Map<string, OverfastHeroApiItem>();
  for (const item of apiItems) {
    if (item && typeof item.key === 'string') {
      byKey.set(item.key, item);
    }
  }

  const seenKeys = new Set<string>();
  const roleChanges: string[] = [];
  const addedHeroes: string[] = [];

  const updatedBase: Hero[] = baseRoster.map((hero) => {
    seenKeys.add(hero.overfastKey);
    const live = byKey.get(hero.overfastKey);
    if (!live) {
      const overrideRole = adminRoleOverrides[hero.id];
      return overrideRole ? { ...hero, role: overrideRole } : hero;
    }

    const liveRole = normalizeOverfastRole(live.role) ?? hero.role;
    if (liveRole !== hero.role && !adminRoleOverrides[hero.id]) {
      roleChanges.push(`${hero.name} (${hero.role} → ${liveRole})`);
    }

    const finalRole = adminRoleOverrides[hero.id] ?? liveRole;
    const portraitUrl =
      typeof live.portrait === 'string' && live.portrait.startsWith('http')
        ? live.portrait
        : hero.portraitUrl;

    return {
      ...hero,
      name: typeof live.name === 'string' && live.name.trim() ? live.name : hero.name,
      role: finalRole,
      portraitUrl,
    };
  });

  // Add newly released heroes discovered in OverFast API
  for (const item of apiItems) {
    if (!item || typeof item.key !== 'string' || seenKeys.has(item.key)) {
      continue;
    }
    const normalizedRole = normalizeOverfastRole(String(item.role ?? ''));
    if (!normalizedRole) continue;

    const id = item.key.replace(/-/g, '_');
    const style = getDefaultStyleForRole(normalizedRole);
    const finalRole = adminRoleOverrides[id] ?? normalizedRole;

    updatedBase.push({
      id,
      overfastKey: item.key,
      name: item.name || item.key,
      role: finalRole,
      portraitUrl:
        typeof item.portrait === 'string' && item.portrait.startsWith('http')
          ? item.portrait
          : '',
      accentFrom: style.accentFrom,
      accentTo: style.accentTo,
      archetype: style.archetype,
    });
    addedHeroes.push(item.name || item.key);
  }

  return {
    heroes: sortRosterByRoleAndName(updatedBase),
    roleChanges,
    addedHeroes,
  };
}

/**
 * Computes aggregated recommended counter heroes for 1 or multiple selected enemy heroes.
 * Heroes that counter multiple selected enemies rank higher, preserving clean tie-breaking by roster name.
 */
export function computeCounterRecommendations(
  selectedEnemyIds: string[],
  currentPatch: PatchMetaSnapshot | null,
  roster: Hero[] = HERO_ROSTER
): RecommendedCounter[] {
  if (!currentPatch || selectedEnemyIds.length === 0) {
    return [];
  }

  const heroMap = new Map<string, Hero>(roster.map((h) => [h.id, h]));
  const selectedSet = new Set(selectedEnemyIds);

  const counterScores = new Map<
    string,
    {
      hero: Hero;
      score: number;
      targets: Array<{ enemyHero: Hero; reason: string }>;
    }
  >();

  for (const enemyId of selectedEnemyIds) {
    const enemyHero = heroMap.get(enemyId);
    if (!enemyHero) continue;

    const configured = currentPatch.countersByHero[enemyId];
    const matchups =
      configured && configured.length > 0
        ? configured
        : ROLE_FALLBACK_COUNTERS[enemyHero.role];

    matchups.forEach((matchup, idx) => {
      const counterHero = heroMap.get(matchup.counterHeroId);
      if (!counterHero) return;

      const priorityWeight = Math.max(1, matchups.length - idx);
      const existing = counterScores.get(counterHero.id);

      if (existing) {
        existing.score += 10 + priorityWeight;
        if (!existing.targets.some((t) => t.enemyHero.id === enemyHero.id)) {
          existing.targets.push({ enemyHero, reason: matchup.reason });
        }
      } else {
        counterScores.set(counterHero.id, {
          hero: counterHero,
          score: 10 + priorityWeight,
          targets: [{ enemyHero, reason: matchup.reason }],
        });
      }
    });
  }

  return Array.from(counterScores.values())
    .filter((entry) => !(selectedSet.size === 1 && selectedSet.has(entry.hero.id)))
    .sort((a, b) => {
      if (b.targets.length !== a.targets.length) {
        return b.targets.length - a.targets.length;
      }
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.hero.name.localeCompare(b.hero.name);
    })
    .slice(0, 8);
}

/**
 * Generates a simulated new patch snapshot with updated SEA Meta counter recommendations
 */
export function createSimulatedMetaPatch(
  existingPatches: PatchMetaSnapshot[],
  now: Date = new Date()
): PatchMetaSnapshot {
  const sorted = sortMetaPatchesNewestFirst(existingPatches);
  const current = sorted[0];
  const templateIdx =
    Math.max(0, existingPatches.length - 3) % SIMULATED_META_UPDATES.length;
  const template = SIMULATED_META_UPDATES[templateIdx];

  const baseCounters = current ? { ...current.countersByHero } : {};
  const mergedCounters: Record<string, CounterMatchup[]> = {
    ...baseCounters,
    ...template.extraCounters,
  };

  const currentMs = current ? new Date(current.releasedAt).getTime() : 0;
  const safeMs = Math.max(
    now.getTime(),
    Number.isNaN(currentMs) ? 0 : currentMs + 60_000
  );
  const releasedAtIso = new Date(safeMs).toISOString();

  return {
    id: `patch-sim-${safeMs}`,
    version: template.version,
    releasedAt: releasedAtIso,
    summary: template.summary,
    sourceLabel: 'ซิงค์อัตโนมัติ (จำลองแพตช์)',
    balanceNotes: template.balanceNotes,
    countersByHero: mergedCounters,
  };
}

/**
 * Updates counter matchups for a specific hero in the latest patch snapshot
 */
export function updateHeroCountersInPatch(
  patch: PatchMetaSnapshot,
  enemyHeroId: string,
  nextMatchups: CounterMatchup[]
): PatchMetaSnapshot {
  return {
    ...patch,
    countersByHero: {
      ...patch.countersByHero,
      [enemyHeroId]: nextMatchups,
    },
  };
}

export function buildMetaFeedUrl(
  sourceType: MetaDataSourceType,
  rawUrl: string,
  steamAppId: string
): string | null {
  if (sourceType === 'local') return null;
  if (sourceType === 'steam_news') {
    const clean = steamAppId.trim();
    if (!/^\d+$/.test(clean)) return null;
    return `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${clean}&count=3&maxlength=500&format=json`;
  }
  const trimmed = rawUrl.trim();
  return trimmed ? trimmed : null;
}

export function parseExternalMetaFeed(
  payload: unknown,
  sourceType: MetaDataSourceType,
  basePatch: PatchMetaSnapshot
): PatchMetaSnapshot | null {
  if (!payload || typeof payload !== 'object') return null;

  if (sourceType === 'steam_news') {
    const appnews = (payload as { appnews?: { newsitems?: unknown[] } }).appnews;
    const item = Array.isArray(appnews?.newsitems) ? appnews.newsitems[0] : null;
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;
    const title = String(record.title ?? 'Steam Patch Update');
    const sec = Number(record.date ?? 0);
    const releasedAt =
      sec > 0 ? new Date(sec * 1000).toISOString() : new Date().toISOString();
    const rawContents = String(record.contents ?? '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      id: `steam-${String(record.gid ?? Date.now())}`,
      version: title.slice(0, 40),
      releasedAt,
      summary: rawContents.slice(0, 220) || 'ดึงข้อมูลแพตช์จาก Steam News API สำเร็จ',
      sourceLabel: 'Steam News API',
      balanceNotes: basePatch.balanceNotes,
      countersByHero: basePatch.countersByHero,
    };
  }

  // Custom JSON or Google Sheets row feed
  const obj = Array.isArray(payload) ? payload[0] : payload;
  if (!obj || typeof obj !== 'object') return null;
  const rec = obj as Record<string, unknown>;
  const version = String(rec.version ?? rec.Version ?? 'Custom Meta Update');
  const summary = String(rec.summary ?? rec.Summary ?? 'อัปเดตเมต้าจากแหล่งข้อมูลภายนอก');
  const rawDate = String(rec.releasedAt ?? rec.date ?? new Date().toISOString());

  return {
    id: `ext-${Date.now()}`,
    version,
    releasedAt: Number.isNaN(new Date(rawDate).getTime())
      ? new Date().toISOString()
      : new Date(rawDate).toISOString(),
    summary,
    sourceLabel: sourceType === 'google_sheets' ? 'Google Sheets Feed' : 'JSON Endpoint',
    balanceNotes: Array.isArray(rec.balanceNotes)
      ? (rec.balanceNotes as PatchMetaSnapshot['balanceNotes'])
      : basePatch.balanceNotes,
    countersByHero:
      rec.countersByHero && typeof rec.countersByHero === 'object'
        ? (rec.countersByHero as Record<string, CounterMatchup[]>)
        : basePatch.countersByHero,
  };
}
