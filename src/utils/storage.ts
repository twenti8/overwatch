import { DEFAULT_SYNC_SETTINGS, INITIAL_PATCHES } from '../data/seedPatches';
import type { PatchEntry, SyncSettings } from '../types/patch';
import { sortPatchesNewestFirst } from './patchLogic';

const PATCHES_STORAGE_KEY = 'overwatch_patch_tracker_entries_v1';
const SETTINGS_STORAGE_KEY = 'overwatch_patch_tracker_settings_v1';

export function loadPatchesFromStorage(): PatchEntry[] {
  if (typeof window === 'undefined') {
    return sortPatchesNewestFirst(INITIAL_PATCHES);
  }
  try {
    const raw = window.localStorage.getItem(PATCHES_STORAGE_KEY);
    if (!raw) {
      return sortPatchesNewestFirst(INITIAL_PATCHES);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return sortPatchesNewestFirst(INITIAL_PATCHES);
    }
    return sortPatchesNewestFirst(parsed as PatchEntry[]);
  } catch {
    return sortPatchesNewestFirst(INITIAL_PATCHES);
  }
}

export function savePatchesToStorage(patches: PatchEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      PATCHES_STORAGE_KEY,
      JSON.stringify(sortPatchesNewestFirst(patches))
    );
  } catch {
    // Ignore quota or storage restriction errors
  }
}

export function loadSettingsFromStorage(): SyncSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SYNC_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SYNC_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<SyncSettings>;
    return {
      ...DEFAULT_SYNC_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SYNC_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: SyncSettings): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

export function resetPatchesStorage(): PatchEntry[] {
  const initial = sortPatchesNewestFirst(INITIAL_PATCHES);
  savePatchesToStorage(initial);
  return initial;
}
