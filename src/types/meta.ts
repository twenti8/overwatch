export type HeroRole = 'Tank' | 'Damage' | 'Support';

export type RoleFilter = 'ทั้งหมด' | HeroRole;

export type HeroArchetype =
  | 'shield'
  | 'mech'
  | 'dive'
  | 'beam'
  | 'sniper'
  | 'hitscan'
  | 'flank'
  | 'aerial'
  | 'medic'
  | 'tech'
  | 'mystic'
  | 'brawl';

export interface Hero {
  id: string;
  overfastKey: string;
  name: string;
  role: HeroRole;
  portraitUrl: string;
  accentFrom: string;
  accentTo: string;
  archetype: HeroArchetype;
}

export interface OverfastHeroApiItem {
  key: string;
  name: string;
  portrait: string;
  role: string;
}

export interface CounterMatchup {
  counterHeroId: string;
  reason: string;
}

export interface HeroBalanceNote {
  heroName: string;
  status: 'บัฟ (เก่งขึ้น)' | 'เนิร์ฟ (ลดความแรง)' | 'ปรับรูปแบบ';
  summary: string;
}

export interface PatchMetaSnapshot {
  id: string;
  version: string;
  releasedAt: string; // ISO date string
  summary: string;
  balanceNotes: HeroBalanceNote[];
  /** Map from enemy heroId -> array of recommended counter matchups */
  countersByHero: Record<string, CounterMatchup[]>;
  sourceLabel?: string;
}

export interface RecommendedCounter {
  hero: Hero;
  score: number;
  targets: Array<{
    enemyHero: Hero;
    reason: string;
  }>;
}

export type MetaDataSourceType =
  | 'local'
  | 'custom_json'
  | 'google_sheets'
  | 'steam_news';

export type MetaPollingMinutes = 1 | 5 | 15 | 30;

export interface MetaSyncSettings {
  autoSyncEnabled: boolean;
  pollingIntervalMinutes: MetaPollingMinutes;
  dataSourceType: MetaDataSourceType;
  dataSourceUrl: string;
  steamAppId: string;
}

export interface MetaSyncStatus {
  isSyncing: boolean;
  lastCheckedAt: string;
  connectionState: 'live' | 'paused' | 'fallback';
  statusNote: string | null;
}
