import assert from 'node:assert/strict';
import test from 'node:test';
import { INITIAL_PATCHES } from '../data/seedPatches';
import {
  buildFeedRequestUrl,
  createSimulatedPatch,
  filterChangesByCategory,
  filterPatches,
  formatRelativeMinutesThai,
  formatThaiDateTime,
  incrementVersion,
  mergePatchesAndDetectNew,
  parseExternalPatchFeed,
  sortPatchesNewestFirst,
  validatePatchInput,
} from './patchLogic';

test('formatThaiDateTime renders Thai month and Bangkok time accurately', () => {
  const formatted = formatThaiDateTime('2026-11-16T10:00:00+07:00');
  assert.equal(formatted, '16 พ.ย. 2026 เวลา 10:00 น.');
});

test('formatRelativeMinutesThai formats seconds, minutes, and hours in Thai', () => {
  const base = new Date('2026-11-16T10:00:00Z').getTime();
  assert.equal(
    formatRelativeMinutesThai('2026-11-16T09:59:40Z', base),
    'เมื่อสักครู่'
  );
  assert.equal(
    formatRelativeMinutesThai('2026-11-16T09:55:00Z', base),
    '5 นาทีที่แล้ว'
  );
  assert.equal(
    formatRelativeMinutesThai('2026-11-16T08:00:00Z', base),
    '2 ชั่วโมงที่แล้ว'
  );
});

test('filterChangesByCategory returns all or matching category items', () => {
  const latest = INITIAL_PATCHES[0];
  assert.equal(filterChangesByCategory(latest.changes, 'ทั้งหมด').length, latest.changes.length);
  const balanceOnly = filterChangesByCategory(latest.changes, 'ปรับสมดุล');
  assert.ok(balanceOnly.length > 0);
  assert.ok(balanceOnly.every((c) => c.category === 'ปรับสมดุล'));
});

test('filterPatches filters by version keyword and patch type', () => {
  const hotfixes = filterPatches(INITIAL_PATCHES, '', 'Hotfix');
  assert.equal(hotfixes.length, 2);
  assert.ok(hotfixes.every((p) => p.type === 'Hotfix'));

  const searchResult = filterPatches(INITIAL_PATCHES, 'v2.3.5', 'ทั้งหมด');
  assert.equal(searchResult.length, 1);
  assert.equal(searchResult[0].version, 'v2.3.5 Hotfix');
});

test('incrementVersion and createSimulatedPatch produce a newer patch version', () => {
  assert.equal(incrementVersion('v2.4.0', 'แพตช์ใหญ่'), 'v2.5.0');
  assert.equal(incrementVersion('v2.4.0', 'Hotfix'), 'v2.4.1 Hotfix');
  assert.equal(incrementVersion('v2.4.0', 'ปรับสมดุล'), 'v2.4.1');

  const sim = createSimulatedPatch(INITIAL_PATCHES, new Date('2026-11-16T12:00:00Z'), 0);
  assert.equal(sim.version, 'v2.4.1');
  const sorted = sortPatchesNewestFirst([sim, ...INITIAL_PATCHES]);
  assert.equal(sorted[0].id, sim.id);
});

test('parseExternalPatchFeed parses custom JSON, Google Sheets, and Steam News payloads', () => {
  const custom = parseExternalPatchFeed(
    {
      patches: [
        {
          version: 'v2.5.0',
          title: 'อัปเดตจาก API',
          type: 'แพตช์ใหญ่',
          releasedAt: '2026-11-16T11:30:00Z',
          summary: 'เพิ่มโหมดใหม่',
          changes: [{ category: 'เนื้อหาใหม่', target: 'โหมดใหม่', description: 'รายละเอียด' }],
        },
      ],
    },
    'custom_json'
  );
  assert.equal(custom.length, 1);
  assert.equal(custom[0].version, 'v2.5.0');

  const sheets = parseExternalPatchFeed(
    [
      {
        version: 'v2.5.1',
        title: 'ชีตอัปเดต',
        type: 'Hotfix',
        summary: 'แก้บั๊กด่วน',
      },
    ],
    'google_sheets'
  );
  assert.equal(sheets.length, 1);
  assert.equal(sheets[0].type, 'Hotfix');

  const steam = parseExternalPatchFeed(
    {
      appnews: {
        newsitems: [
          {
            gid: '999',
            title: 'Patch v2.6.0 Update Notes',
            contents: '<p>New arena map added</p>',
            date: 1794823200,
          },
        ],
      },
    },
    'steam_news'
  );
  assert.equal(steam.length, 1);
  assert.equal(steam[0].version, 'v2.6.0');
});

test('buildFeedRequestUrl validates steam app ID and URLs', () => {
  assert.equal(buildFeedRequestUrl('local', '', ''), null);
  assert.equal(buildFeedRequestUrl('steam_news', '', 'abc'), null);
  assert.ok(
    buildFeedRequestUrl('steam_news', '', '2357570')?.includes('appid=2357570')
  );
  assert.equal(
    buildFeedRequestUrl('custom_json', 'https://example.com/patches.json', ''),
    'https://example.com/patches.json'
  );
});

test('mergePatchesAndDetectNew identifies newly arrived patches', () => {
  const sim = createSimulatedPatch(INITIAL_PATCHES, new Date('2026-11-16T12:00:00Z'), 1);
  const res = mergePatchesAndDetectNew(INITIAL_PATCHES, [sim]);
  assert.equal(res.hasNewPatch, true);
  assert.equal(res.newestPatch?.id, sim.id);

  const noNew = mergePatchesAndDetectNew(INITIAL_PATCHES, [INITIAL_PATCHES[0]]);
  assert.equal(noNew.hasNewPatch, false);
});

test('validatePatchInput rejects empty fields and accepts valid input', () => {
  assert.ok(
    validatePatchInput({
      version: '',
      title: 'หัวข้อ',
      type: 'Hotfix',
      releasedAt: '2026-11-16T10:00',
      summary: 'สรุป',
      changes: [{ category: 'แก้บั๊ก', target: 'เป้า', description: 'แก้แล้ว' }],
    }) !== null
  );

  assert.equal(
    validatePatchInput({
      version: 'v2.4.1',
      title: 'แก้บั๊กด่วน',
      type: 'Hotfix',
      releasedAt: '2026-11-16T10:00',
      summary: 'แก้ไขปัญหาเซิร์ฟเวอร์',
      changes: [{ category: 'แก้บั๊ก', target: 'เซิร์ฟเวอร์', description: 'เพิ่มความเสถียร' }],
    }),
    null
  );
});
