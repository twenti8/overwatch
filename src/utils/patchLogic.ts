import { SIMULATED_PATCH_TEMPLATES } from '../data/seedPatches';
import type {
  DataSourceType,
  PatchChangeItem,
  PatchEntry,
  PatchFormInput,
  PatchType,
  SpotlightFilter,
  TimelineTypeFilter,
} from '../types/patch';

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

/**
 * Formats an ISO timestamp into natural Thai format in Asia/Bangkok timezone
 * e.g. "16 พ.ย. 2026 เวลา 10:00 น."
 */
export function formatThaiDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 'ไม่ระบุเวลา';
  }

  // Convert to UTC+7 (Asia/Bangkok) consistently across environments
  const bangkokOffsetMs = 7 * 60 * 60 * 1000;
  const local = new Date(date.getTime() + bangkokOffsetMs);

  const day = local.getUTCDate();
  const month = THAI_SHORT_MONTHS[local.getUTCMonth()];
  const year = local.getUTCFullYear();
  const hours = String(local.getUTCHours()).padStart(2, '0');
  const minutes = String(local.getUTCMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`;
}

/**
 * Formats elapsed time since last sync check in natural Thai
 */
export function formatRelativeMinutesThai(
  lastCheckedIso: string,
  nowMs: number = Date.now()
): string {
  const checkedMs = new Date(lastCheckedIso).getTime();
  if (Number.isNaN(checkedMs)) {
    return 'เมื่อสักครู่';
  }
  const diffSec = Math.max(0, Math.floor((nowMs - checkedMs) / 1000));
  if (diffSec < 60) {
    return 'เมื่อสักครู่';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} นาทีที่แล้ว`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `${diffHours} ชั่วโมงที่แล้ว`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} วันที่แล้ว`;
}

/**
 * Sorts patches newest first based on releasedAt timestamp
 */
export function sortPatchesNewestFirst(patches: PatchEntry[]): PatchEntry[] {
  return [...patches].sort((a, b) => {
    const timeA = new Date(a.releasedAt).getTime();
    const timeB = new Date(b.releasedAt).getTime();
    return (Number.isNaN(timeB) ? 0 : timeB) - (Number.isNaN(timeA) ? 0 : timeA);
  });
}

/**
 * Filters changes inside the Latest Patch Spotlight card
 */
export function filterChangesByCategory(
  changes: PatchChangeItem[],
  filter: SpotlightFilter
): PatchChangeItem[] {
  if (filter === 'ทั้งหมด') {
    return changes;
  }
  return changes.filter((item) => item.category === filter);
}

/**
 * Filters timeline patches by search query (version, title, summary, or change text) and patch type
 */
export function filterPatches(
  patches: PatchEntry[],
  searchQuery: string,
  typeFilter: TimelineTypeFilter
): PatchEntry[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return sortPatchesNewestFirst(patches).filter((patch) => {
    if (typeFilter !== 'ทั้งหมด' && patch.type !== typeFilter) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      patch.version,
      patch.title,
      patch.summary,
      patch.type,
      ...patch.changes.map((c) => `${c.target} ${c.description} ${c.category}`),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

/**
 * Computes next semantic version string from the current latest version
 */
export function incrementVersion(currentVersion: string, nextType: PatchType): string {
  const match = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/i);
  if (!match) {
    return nextType === 'Hotfix' ? 'v2.4.1 Hotfix' : 'v2.5.0';
  }
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);

  if (nextType === 'แพตช์ใหญ่') {
    return `v${major}.${minor + 1}.0`;
  }
  if (nextType === 'Hotfix') {
    return `v${major}.${minor}.${patch + 1} Hotfix`;
  }
  return `v${major}.${minor}.${patch + 1}`;
}

/**
 * Creates a realistic simulated Day-1 patch entry based on the current latest patch
 */
export function createSimulatedPatch(
  existingPatches: PatchEntry[],
  now: Date = new Date(),
  templateIndex?: number
): PatchEntry {
  const sorted = sortPatchesNewestFirst(existingPatches);
  const latestVersion = sorted[0]?.version ?? 'v2.4.0';

  const idx =
    typeof templateIndex === 'number'
      ? Math.abs(templateIndex) % SIMULATED_PATCH_TEMPLATES.length
      : existingPatches.length % SIMULATED_PATCH_TEMPLATES.length;

  const template = SIMULATED_PATCH_TEMPLATES[idx];
  const version = incrementVersion(latestVersion, template.type);
  const idSuffix = `${now.getTime()}-${Math.floor(Math.random() * 1000)}`;

  return {
    id: `patch-sim-${idSuffix}`,
    version,
    title: template.title,
    type: template.type,
    releasedAt: now.toISOString(),
    summary: template.summary,
    sourceLabel: template.sourceLabel ?? 'ซิงค์อัตโนมัติ',
    changes: template.changes.map((item, i) => ({
      ...item,
      id: `sim-change-${idSuffix}-${i}`,
    })),
  };
}

/**
 * Builds the request URL for a configured data source
 */
export function buildFeedRequestUrl(
  sourceType: DataSourceType,
  rawUrl: string,
  steamAppId: string
): string | null {
  if (sourceType === 'local') {
    return null;
  }
  if (sourceType === 'steam_news') {
    const cleanId = steamAppId.trim();
    if (!/^\d+$/.test(cleanId)) {
      return null;
    }
    return `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${cleanId}&count=6&maxlength=600&format=json`;
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function normalizePatchType(raw: unknown): PatchType {
  if (raw === 'แพตช์ใหญ่' || raw === 'ปรับสมดุล' || raw === 'Hotfix') {
    return raw;
  }
  const lower = String(raw ?? '').toLowerCase();
  if (lower.includes('hotfix') || lower.includes('ด่วน')) return 'Hotfix';
  if (lower.includes('balance') || lower.includes('สมดุล')) return 'ปรับสมดุล';
  return 'แพตช์ใหญ่';
}

function normalizeChangeCategory(raw: unknown): PatchChangeItem['category'] {
  if (raw === 'เนื้อหาใหม่' || raw === 'ปรับสมดุล' || raw === 'แก้บั๊ก') {
    return raw;
  }
  const lower = String(raw ?? '').toLowerCase();
  if (lower.includes('new') || lower.includes('เนื้อหา')) return 'เนื้อหาใหม่';
  if (lower.includes('fix') || lower.includes('bug') || lower.includes('บั๊ก')) return 'แก้บั๊ก';
  return 'ปรับสมดุล';
}

/**
 * Parses JSON payloads from Custom Endpoint, Google Sheets JSON feed, or Steam News API
 */
export function parseExternalPatchFeed(
  payload: unknown,
  sourceType: DataSourceType
): PatchEntry[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  // 1. Steam News API format: { appnews: { newsitems: [...] } }
  if (sourceType === 'steam_news') {
    const appnews = (payload as { appnews?: { newsitems?: unknown[] } }).appnews;
    const items = Array.isArray(appnews?.newsitems) ? appnews.newsitems : [];
    return items
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item, idx) => {
        const title = String(item.title ?? `อัปเดตจาก Steam #${idx + 1}`);
        const versionMatch = title.match(/v?\d+\.\d+(?:\.\d+)?(?:\s*Hotfix)?/i);
        const version = versionMatch
          ? versionMatch[0].startsWith('v')
            ? versionMatch[0]
            : `v${versionMatch[0]}`
          : `v2.4.${idx + 1}`;
        const timestampSec = Number(item.date ?? 0);
        const releasedAt =
          timestampSec > 0
            ? new Date(timestampSec * 1000).toISOString()
            : new Date().toISOString();
        const rawContents = String(item.contents ?? '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const summary =
          rawContents.slice(0, 220) || 'ดึงข้อมูลประกาศอัปเดตจาก Steam News API สำเร็จ';

        return {
          id: `steam-${String(item.gid ?? idx)}`,
          version,
          title,
          type: normalizePatchType(title),
          releasedAt,
          summary,
          sourceLabel: 'Steam News API',
          changes: [
            {
              id: `steam-c-${idx}`,
              category: 'เนื้อหาใหม่',
              target: 'รายละเอียดจาก Steam Feed',
              description: rawContents || title,
            },
          ],
        };
      });
  }

  // 2. Google Sheets JSON feed (OpenSheet / SheetDB / gviz-like row objects)
  if (sourceType === 'google_sheets') {
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { rows?: unknown[] }).rows)
        ? (payload as { rows: unknown[] }).rows
        : [];
    return rows
      .filter((r): r is Record<string, unknown> => Boolean(r && typeof r === 'object'))
      .map((row, idx) => {
        const version = String(row.version ?? row.Version ?? `v2.5.${idx}`);
        const title = String(row.title ?? row.Title ?? `อัปเดต ${version}`);
        const summary = String(row.summary ?? row.Summary ?? 'อัปเดตข้อมูลจาก Google Sheets');
        const releasedAt = String(row.releasedAt ?? row.date ?? row.Date ?? new Date().toISOString());
        const noteText = String(row.notes ?? row.changes ?? summary);

        return {
          id: `sheet-${version}-${idx}`,
          version,
          title,
          type: normalizePatchType(row.type ?? row.Type),
          releasedAt: Number.isNaN(new Date(releasedAt).getTime())
            ? new Date().toISOString()
            : new Date(releasedAt).toISOString(),
          summary,
          sourceLabel: 'Google Sheets Feed',
          changes: [
            {
              id: `sheet-c-${idx}`,
              category: normalizeChangeCategory(row.category),
              target: title,
              description: noteText,
            },
          ],
        };
      });
  }

  // 3. Custom JSON Endpoint: Array<PatchEntry> or { patches: PatchEntry[] }
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { patches?: unknown[] }).patches)
      ? (payload as { patches: unknown[] }).patches
      : [];

  return list
    .filter((entry): entry is Record<string, unknown> => Boolean(entry && typeof entry === 'object'))
    .map((entry, idx) => {
      const version = String(entry.version ?? `v2.5.${idx}`);
      const rawChanges = Array.isArray(entry.changes) ? entry.changes : [];
      const changes: PatchChangeItem[] = rawChanges
        .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
        .map((c, cIdx) => ({
          id: String(c.id ?? `ext-c-${idx}-${cIdx}`),
          category: normalizeChangeCategory(c.category),
          target: String(c.target ?? 'รายการอัปเดต'),
          description: String(c.description ?? ''),
        }));

      const rawDate = String(entry.releasedAt ?? new Date().toISOString());
      return {
        id: String(entry.id ?? `ext-${version}-${idx}`),
        version,
        title: String(entry.title ?? `อัปเดต ${version}`),
        type: normalizePatchType(entry.type),
        releasedAt: Number.isNaN(new Date(rawDate).getTime())
          ? new Date().toISOString()
          : new Date(rawDate).toISOString(),
        summary: String(entry.summary ?? ''),
        sourceLabel: 'JSON Endpoint',
        changes:
          changes.length > 0
            ? changes
            : [
                {
                  id: `ext-fallback-${idx}`,
                  category: 'เนื้อหาใหม่',
                  target: 'รายละเอียดแพตช์',
                  description: String(entry.summary ?? 'อัปเดตข้อมูลจากปลายทาง JSON'),
                },
              ],
      };
    });
}

/**
 * Merges incoming patches with existing ones, returning sorted result and whether a newer patch was detected
 */
export function mergePatchesAndDetectNew(
  existing: PatchEntry[],
  incoming: PatchEntry[]
): { merged: PatchEntry[]; hasNewPatch: boolean; newestPatch: PatchEntry | null } {
  const sortedExisting = sortPatchesNewestFirst(existing);
  const currentTopVersion = sortedExisting[0]?.version;

  const byVersion = new Map<string, PatchEntry>();
  for (const item of existing) {
    byVersion.set(item.version.toLowerCase(), item);
  }

  let addedNew = false;
  for (const item of incoming) {
    const key = item.version.toLowerCase();
    if (!byVersion.has(key)) {
      addedNew = true;
    }
    byVersion.set(key, item);
  }

  const merged = sortPatchesNewestFirst(Array.from(byVersion.values()));
  const newestPatch = merged[0] ?? null;
  const hasNewPatch =
    addedNew || Boolean(newestPatch && newestPatch.version !== currentTopVersion);

  return { merged, hasNewPatch, newestPatch };
}

/**
 * Validates manual patch creation/editing input
 */
export function validatePatchInput(input: PatchFormInput): string | null {
  if (!input.version.trim()) {
    return 'กรุณาระบุเลขเวอร์ชันแพตช์ (เช่น v2.4.1)';
  }
  if (!input.title.trim()) {
    return 'กรุณาระบุหัวข้อแพตช์';
  }
  if (!input.summary.trim()) {
    return 'กรุณาระบุสรุปการเปลี่ยนแปลงโดยย่อ';
  }
  const validChanges = input.changes.filter(
    (c) => c.target.trim().length > 0 && c.description.trim().length > 0
  );
  if (validChanges.length === 0) {
    return 'กรุณาระบุรายการเปลี่ยนแปลงอย่างน้อย 1 รายการ';
  }
  return null;
}
