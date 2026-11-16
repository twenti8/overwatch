import { DEFAULT_META_SYNC_SETTINGS, INITIAL_META_PATCHES } from '../data/heroesAndMeta';
import type {
  HeroRole,
  MetaSyncSettings,
  OverfastHeroApiItem,
  PatchMetaSnapshot,
} from '../types/meta';
import { sortMetaPatchesNewestFirst } from './counterLogic';

const META_PATCHES_KEY = 'overwatch_sea_meta_patches_v3';
const META_SELECTED_HEROES_KEY = 'overwatch_sea_meta_selected_heroes_v2';
const META_SETTINGS_KEY = 'overwatch_sea_meta_settings_v1';
const META_CUSTOM_PORTRAITS_KEY = 'overwatch_sea_meta_custom_portraits_v1';
const META_OVERFAST_HEROES_KEY = 'overwatch_sea_meta_overfast_heroes_v1';
const META_ADMIN_ROLES_KEY = 'overwatch_sea_meta_admin_roles_v1';

export const DEFAULT_SELECTED_HERO_IDS = ['kiriko', 'mercy', 'sombra'];

export function loadMetaPatches(): PatchMetaSnapshot[] {
  if (typeof window === 'undefined') {
    return sortMetaPatchesNewestFirst(INITIAL_META_PATCHES);
  }
  try {
    const raw = window.localStorage.getItem(META_PATCHES_KEY);
    if (!raw) return sortMetaPatchesNewestFirst(INITIAL_META_PATCHES);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return sortMetaPatchesNewestFirst(INITIAL_META_PATCHES);
    }
    return sortMetaPatchesNewestFirst(parsed as PatchMetaSnapshot[]);
  } catch {
    return sortMetaPatchesNewestFirst(INITIAL_META_PATCHES);
  }
}

export function saveMetaPatches(patches: PatchMetaSnapshot[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      META_PATCHES_KEY,
      JSON.stringify(sortMetaPatchesNewestFirst(patches))
    );
  } catch {
    // Ignore storage errors
  }
}

export function loadSelectedHeroIds(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SELECTED_HERO_IDS;
  try {
    const raw = window.localStorage.getItem(META_SELECTED_HEROES_KEY);
    if (!raw) return DEFAULT_SELECTED_HERO_IDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : DEFAULT_SELECTED_HERO_IDS;
  } catch {
    return DEFAULT_SELECTED_HERO_IDS;
  }
}

export function saveSelectedHeroIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(META_SELECTED_HEROES_KEY, JSON.stringify(ids));
  } catch {
    // Ignore storage errors
  }
}

export function loadMetaSyncSettings(): MetaSyncSettings {
  if (typeof window === 'undefined') return DEFAULT_META_SYNC_SETTINGS;
  try {
    const raw = window.localStorage.getItem(META_SETTINGS_KEY);
    if (!raw) return DEFAULT_META_SYNC_SETTINGS;
    return {
      ...DEFAULT_META_SYNC_SETTINGS,
      ...(JSON.parse(raw) as Partial<MetaSyncSettings>),
    };
  } catch {
    return DEFAULT_META_SYNC_SETTINGS;
  }
}

export function saveMetaSyncSettings(settings: MetaSyncSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(META_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function loadCustomPortraits(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(META_CUSTOM_PORTRAITS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveCustomPortraits(portraits: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(META_CUSTOM_PORTRAITS_KEY, JSON.stringify(portraits));
  } catch {
    // Ignore quota errors
  }
}

export function loadOverfastHeroesCache(): OverfastHeroApiItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(META_OVERFAST_HEROES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OverfastHeroApiItem[]) : [];
  } catch {
    return [];
  }
}

export function saveOverfastHeroesCache(items: OverfastHeroApiItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(META_OVERFAST_HEROES_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

export function loadAdminRoleOverrides(): Record<string, HeroRole> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(META_ADMIN_ROLES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, HeroRole>)
      : {};
  } catch {
    return {};
  }
}

export function saveAdminRoleOverrides(overrides: Record<string, HeroRole>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(META_ADMIN_ROLES_KEY, JSON.stringify(overrides));
  } catch {
    // Ignore storage errors
  }
}

export function resetMetaStorage(): {
  patches: PatchMetaSnapshot[];
  selectedHeroIds: string[];
  customPortraits: Record<string, string>;
  adminRoleOverrides: Record<string, HeroRole>;
} {
  const patches = sortMetaPatchesNewestFirst(INITIAL_META_PATCHES);
  saveMetaPatches(patches);
  saveSelectedHeroIds(DEFAULT_SELECTED_HERO_IDS);
  saveCustomPortraits({});
  saveAdminRoleOverrides({});
  return {
    patches,
    selectedHeroIds: DEFAULT_SELECTED_HERO_IDS,
    customPortraits: {},
    adminRoleOverrides: {},
  };
}
