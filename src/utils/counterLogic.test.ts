import assert from 'node:assert/strict';
import test from 'node:test';
import { HERO_ROSTER, INITIAL_META_PATCHES } from '../data/heroesAndMeta';
import {
  applyAdminRoleOverrides,
  buildMetaFeedUrl,
  computeCounterRecommendations,
  createSimulatedMetaPatch,
  filterHeroesByRole,
  formatThaiShortDate,
  mergeOverfastHeroes,
  parseExternalMetaFeed,
  updateHeroCountersInPatch,
} from './counterLogic';

test('HERO_ROSTER matches 2026 patch rules: 15 Support (incl. Sombra), 13 Tank, 17 Damage (no Sombra)', () => {
  const supportNames = HERO_ROSTER.filter((h) => h.role === 'Support').map((h) => h.name);
  const damageNames = HERO_ROSTER.filter((h) => h.role === 'Damage').map((h) => h.name);
  const tankNames = HERO_ROSTER.filter((h) => h.role === 'Tank').map((h) => h.name);

  const expectedSupports = [
    'Ana',
    'Baptiste',
    'Brigitte',
    'Illari',
    'Jetpack Cat',
    'Juno',
    'Kiriko',
    'Lifeweaver',
    'Lúcio',
    'Mercy',
    'Mizuki',
    'Moira',
    'Sombra',
    'Wuyang',
    'Zenyatta',
  ];
  assert.deepEqual(supportNames, expectedSupports);
  assert.equal(supportNames.includes('Sombra'), true);
  assert.equal(damageNames.includes('Sombra'), false);
  assert.equal(tankNames.length, 13);
  assert.equal(damageNames.length, 17);
  assert.equal(HERO_ROSTER.length, 45);

  const initialPatch = INITIAL_META_PATCHES[0];
  for (const hero of HERO_ROSTER) {
    assert.ok(
      hero.portraitUrl.startsWith('https://d15f34w2p8l1cc.cloudfront.net/overwatch/'),
      `Missing Blizzard CDN portrait URL for ${hero.name}`
    );
    const counters = initialPatch.countersByHero[hero.id] ?? [];
    assert.ok(
      counters.length >= 3,
      `Expected at least 3 counter matchups for ${hero.name}`
    );
  }
});

test('Support Sombra recommends accurate counters (Brigitte, Cassidy, Winston, Kiriko, Moira, D.Va)', () => {
  const latest = INITIAL_META_PATCHES[0];
  const recs = computeCounterRecommendations(['sombra'], latest, HERO_ROSTER);
  const recNames = recs.map((r) => r.hero.name);
  for (const expected of ['Brigitte', 'Cassidy', 'Winston', 'Kiriko', 'Moira', 'D.Va']) {
    assert.ok(recNames.includes(expected), `Expected ${expected} to counter Support Sombra`);
  }
});

test('mergeOverfastHeroes dynamically syncs roles, adds new heroes, and preserves admin role overrides', () => {
  const merged = mergeOverfastHeroes(
    HERO_ROSTER,
    [
      {
        key: 'sombra',
        name: 'Sombra',
        role: 'support',
        portrait: 'https://d15f34w2p8l1cc.cloudfront.net/overwatch/sombra-new.png',
      },
      {
        key: 'freja',
        name: 'Freja',
        role: 'damage',
        portrait: 'https://d15f34w2p8l1cc.cloudfront.net/overwatch/freja.png',
      },
    ],
    { brigitte: 'Tank' }
  );

  assert.equal(merged.addedHeroes.length, 1);
  assert.equal(merged.addedHeroes[0], 'Freja');
  assert.equal(merged.heroes.find((h) => h.id === 'sombra')?.role, 'Support');
  assert.equal(
    merged.heroes.find((h) => h.id === 'sombra')?.portraitUrl,
    'https://d15f34w2p8l1cc.cloudfront.net/overwatch/sombra-new.png'
  );
  assert.equal(merged.heroes.find((h) => h.id === 'brigitte')?.role, 'Tank');
  assert.equal(merged.heroes.find((h) => h.id === 'freja')?.role, 'Damage');

  // Reassigning back via applyAdminRoleOverrides
  const overridden = applyAdminRoleOverrides(HERO_ROSTER, { sombra: 'Damage' });
  assert.equal(overridden.find((h) => h.id === 'sombra')?.role, 'Damage');
});

test('filterHeroesByRole filters Support, Tank, Damage, and ทั้งหมด accurately', () => {
  assert.equal(filterHeroesByRole(HERO_ROSTER, 'ทั้งหมด').length, HERO_ROSTER.length);
  const tanks = filterHeroesByRole(HERO_ROSTER, 'Tank');
  assert.ok(tanks.length > 0);
  assert.ok(tanks.every((h) => h.role === 'Tank'));
});

test('computeCounterRecommendations prioritizes multi-target counters when Kiriko, Mercy, and Sombra are selected', () => {
  const latest = INITIAL_META_PATCHES[0];
  const recs = computeCounterRecommendations(['kiriko', 'mercy', 'sombra'], latest);
  assert.ok(recs.length > 0);
  const topNames = recs.slice(0, 3).map((r) => r.hero.name);
  // Cassidy and D.Va counter all 3 (Kiriko, Mercy, Sombra)
  assert.ok(topNames.includes('Cassidy'));
  assert.ok(topNames.includes('D.Va'));
  const dvaRec = recs.find((r) => r.hero.id === 'dva');
  assert.equal(dvaRec?.targets.length, 3);
});

test('formatThaiShortDate formats Bangkok short date cleanly', () => {
  assert.equal(formatThaiShortDate('2026-11-17T09:00:00+07:00'), '17 พ.ย. 2026');
});

test('createSimulatedMetaPatch creates newer patch snapshot and updates counters', () => {
  const sim = createSimulatedMetaPatch(
    INITIAL_META_PATCHES,
    new Date('2026-11-18T08:00:00Z')
  );
  assert.equal(sim.version, '2026 Meta — Mid-Season Reloaded');
  assert.ok(sim.countersByHero.kiriko.some((c) => c.counterHeroId === 'zarya'));
});

test('updateHeroCountersInPatch updates matchups for a specific enemy hero', () => {
  const latest = INITIAL_META_PATCHES[0];
  const updated = updateHeroCountersInPatch(latest, 'kiriko', [
    { counterHeroId: 'pharah', reason: 'ทดสอบแก้ทางจากระยะสูง' },
  ]);
  assert.equal(updated.countersByHero.kiriko.length, 1);
  assert.equal(updated.countersByHero.kiriko[0].counterHeroId, 'pharah');
});

test('buildMetaFeedUrl and parseExternalMetaFeed handle Steam News and custom JSON', () => {
  assert.equal(buildMetaFeedUrl('local', '', ''), null);
  assert.ok(buildMetaFeedUrl('steam_news', '', '2357570')?.includes('2357570'));

  const parsed = parseExternalMetaFeed(
    {
      appnews: {
        newsitems: [
          {
            gid: '100',
            title: 'Season 15 Patch Notes',
            contents: '<p>Hero updates</p>',
            date: 1794900000,
          },
        ],
      },
    },
    'steam_news',
    INITIAL_META_PATCHES[0]
  );
  assert.ok(parsed !== null);
  assert.equal(parsed?.version, 'Season 15 Patch Notes');
});
