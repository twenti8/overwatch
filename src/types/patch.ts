export type PatchType = 'แพตช์ใหญ่' | 'ปรับสมดุล' | 'Hotfix';

export type ChangeCategory = 'เนื้อหาใหม่' | 'ปรับสมดุล' | 'แก้บั๊ก';

export type SpotlightFilter = 'ทั้งหมด' | ChangeCategory;

export type TimelineTypeFilter = 'ทั้งหมด' | PatchType;

export type PollingIntervalMinutes = 1 | 5 | 15 | 30;

export type DataSourceType = 'local' | 'custom_json' | 'google_sheets' | 'steam_news';

export interface PatchChangeItem {
  id: string;
  category: ChangeCategory;
  target: string;
  description: string;
}

export interface PatchEntry {
  id: string;
  version: string;
  title: string;
  type: PatchType;
  releasedAt: string; // ISO 8601 timestamp
  summary: string;
  changes: PatchChangeItem[];
  sourceLabel?: string;
}

export interface SyncSettings {
  autoSyncEnabled: boolean;
  pollingIntervalMinutes: PollingIntervalMinutes;
  dataSourceType: DataSourceType;
  dataSourceUrl: string;
  steamAppId: string;
}

export interface SyncStatusState {
  isSyncing: boolean;
  lastCheckedAt: string;
  connectionState: 'live' | 'paused' | 'fallback';
  lastSyncMessage: string | null;
}

export interface PatchFormInput {
  id?: string;
  version: string;
  title: string;
  type: PatchType;
  releasedAt: string;
  summary: string;
  changes: Array<{
    category: ChangeCategory;
    target: string;
    description: string;
  }>;
}
