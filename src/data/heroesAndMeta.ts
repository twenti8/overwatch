import type {
  CounterMatchup,
  Hero,
  MetaSyncSettings,
  PatchMetaSnapshot,
} from '../types/meta';

export const HERO_ROSTER: Hero[] = [
  // ================= TANK (13) =================
  {
    id: 'dva',
    overfastKey: 'dva',
    name: 'D.Va',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/df5a5532862d9292634fb3dc0e51a4705aa601de65e5e815513ccc663d84de56.png',
    accentFrom: '#F472B6',
    accentTo: '#EC4899',
    archetype: 'mech',
  },
  {
    id: 'doomfist',
    overfastKey: 'doomfist',
    name: 'Doomfist',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ff5c54f43ad253c7faeda9c4ed31d42582ea6b19205d197866f3dd0c0aa14c16.png',
    accentFrom: '#F59E0B',
    accentTo: '#D97706',
    archetype: 'brawl',
  },
  {
    id: 'hazard',
    overfastKey: 'hazard',
    name: 'Hazard',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ca48b96dbae6ea7f58ce8a5e73513c8c62b1685bdbf258020fb78bb21a008b5f.png',
    accentFrom: '#C084FC',
    accentTo: '#7E22CE',
    archetype: 'brawl',
  },
  {
    id: 'junker_queen',
    overfastKey: 'junker-queen',
    name: 'Junker Queen',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/06eeecb359f311f43a8f5121d4f9f3a93c565d70b30e94ef543c05596c9a39dc.png',
    accentFrom: '#38BDF8',
    accentTo: '#2563EB',
    archetype: 'brawl',
  },
  {
    id: 'mauga',
    overfastKey: 'mauga',
    name: 'Mauga',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/33d39bb439c08975197fc52eff4874716839711b5356c4fdc174f9c24bac1d0e.png',
    accentFrom: '#F87171',
    accentTo: '#B91C1C',
    archetype: 'brawl',
  },
  {
    id: 'orisa',
    overfastKey: 'orisa',
    name: 'Orisa',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/a73958a28551f5254f3ab3f97c5f5f8d698a95c0b6a515d1a2b1caac169205a6.png',
    accentFrom: '#4ADE80',
    accentTo: '#15803D',
    archetype: 'mech',
  },
  {
    id: 'ramattra',
    overfastKey: 'ramattra',
    name: 'Ramattra',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ddef7c9fb8ce4256e8508196b486f81950efe7aaa6cf27fec4668beb4cd15774.png',
    accentFrom: '#818CF8',
    accentTo: '#4F46E5',
    archetype: 'brawl',
  },
  {
    id: 'reinhardt',
    overfastKey: 'reinhardt',
    name: 'Reinhardt',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/551fbe070c16fdfcc17f7f1de63af22c53e7d2f1340fc2f3172441504527bc4e.png',
    accentFrom: '#94A3B8',
    accentTo: '#64748B',
    archetype: 'shield',
  },
  {
    id: 'roadhog',
    overfastKey: 'roadhog',
    name: 'Roadhog',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/89ddf07e4b619ed96169042e296a1b8856d102746f35add88284b44a9a5a6a03.png',
    accentFrom: '#FB923C',
    accentTo: '#EA580C',
    archetype: 'brawl',
  },
  {
    id: 'sigma',
    overfastKey: 'sigma',
    name: 'Sigma',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/a4c032fa466c9a6d9c6974747635d7ef910027f91cd58892af0c899db565f92d.png',
    accentFrom: '#38BDF8',
    accentTo: '#0284C7',
    archetype: 'shield',
  },
  {
    id: 'winston',
    overfastKey: 'winston',
    name: 'Winston',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/46a10db3aa908c590ddc4e7606376a88143d1f1306ecfbea043263040f9529a5.png',
    accentFrom: '#60A5FA',
    accentTo: '#3B82F6',
    archetype: 'dive',
  },
  {
    id: 'wrecking_ball',
    overfastKey: 'wrecking-ball',
    name: 'Wrecking Ball',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/9ef1d58867136e0b26f928d896000b9dab216118f6e2f59e53f2e975e1e27afa.png',
    accentFrom: '#FBBF24',
    accentTo: '#B45309',
    archetype: 'mech',
  },
  {
    id: 'zarya',
    overfastKey: 'zarya',
    name: 'Zarya',
    role: 'Tank',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/9b6f63cc66ddf9d5e0862173c733cc0d2e574c5c89357798d91b93b2f95a7080.png',
    accentFrom: '#FB7185',
    accentTo: '#E11D48',
    archetype: 'beam',
  },

  // ================= DAMAGE (17 — Sombra reworked to Support) =================
  {
    id: 'ashe',
    overfastKey: 'ashe',
    name: 'Ashe',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/f692ad242f921ad06e5887544bb7fa0f546083b647b59792b621690cb4e49704.png',
    accentFrom: '#F87171',
    accentTo: '#DC2626',
    archetype: 'hitscan',
  },
  {
    id: 'bastion',
    overfastKey: 'bastion',
    name: 'Bastion',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4ede795c2a681aaccfa72d0c901cba0cb8a2c292fd6a97b2ba9faed161c2d184.png',
    accentFrom: '#94A3B8',
    accentTo: '#475569',
    archetype: 'mech',
  },
  {
    id: 'cassidy',
    overfastKey: 'cassidy',
    name: 'Cassidy',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/9240cd64cc8ef58df9acbf55204ab1b5d8578f743fda5931f0dbccbd75ab841b.png',
    accentFrom: '#FB7185',
    accentTo: '#BE123C',
    archetype: 'hitscan',
  },
  {
    id: 'echo',
    overfastKey: 'echo',
    name: 'Echo',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/d4f2d5b0c2b7e82d61353186c5f23152ccba9d3569b50839aa580dca3e9114ba.png',
    accentFrom: '#60A5FA',
    accentTo: '#0284C7',
    archetype: 'aerial',
  },
  {
    id: 'genji',
    overfastKey: 'genji',
    name: 'Genji',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/156b12c20b1aea872c1eeb5bb37a7de1047b2ab30ecefd0663a8925badde1ea8.png',
    accentFrom: '#4ADE80',
    accentTo: '#16A34A',
    archetype: 'flank',
  },
  {
    id: 'hanzo',
    overfastKey: 'hanzo',
    name: 'Hanzo',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/78b61c3e806fb26b02b8980fba62189155074fc15bd865b0883268e546030be5.png',
    accentFrom: '#F59E0B',
    accentTo: '#B45309',
    archetype: 'sniper',
  },
  {
    id: 'junkrat',
    overfastKey: 'junkrat',
    name: 'Junkrat',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/7660b9fc6f25f30858fdd8797fe0d52b2306f1e78fef99843f58a274e69af046.png',
    accentFrom: '#FACC15',
    accentTo: '#CA8A04',
    archetype: 'brawl',
  },
  {
    id: 'mei',
    overfastKey: 'mei',
    name: 'Mei',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4a55ced3bd597fb08e0fde9dc007f8543ac616ba98ca3db9b0e4d871a8ae17f8.png',
    accentFrom: '#38BDF8',
    accentTo: '#0284C7',
    archetype: 'beam',
  },
  {
    id: 'pharah',
    overfastKey: 'pharah',
    name: 'Pharah',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/60ac2d5de4a6d34644d8872233da402f1436c87f804bb11a21661bb30bf4a51f.png',
    accentFrom: '#3B82F6',
    accentTo: '#1D4ED8',
    archetype: 'aerial',
  },
  {
    id: 'reaper',
    overfastKey: 'reaper',
    name: 'Reaper',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/dc6ff07ac790c00dc95a40882449617bb6e0e38906b353a630cffe0c815270a9.png',
    accentFrom: '#64748B',
    accentTo: '#1E293B',
    archetype: 'flank',
  },
  {
    id: 'sojourn',
    overfastKey: 'sojourn',
    name: 'Sojourn',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/82b8c1b8765dcb9a0ba16e343c3516bf324c771ac81e9878473280216e70a889.png',
    accentFrom: '#F87171',
    accentTo: '#991B1B',
    archetype: 'hitscan',
  },
  {
    id: 'soldier76',
    overfastKey: 'soldier-76',
    name: 'Soldier: 76',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/c93b5f0a528c40473188f77cc2a267aee7d5b6cf5c9e104105d634b4388674e2.png',
    accentFrom: '#38BDF8',
    accentTo: '#2563EB',
    archetype: 'hitscan',
  },
  {
    id: 'symmetra',
    overfastKey: 'symmetra',
    name: 'Symmetra',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ebec57e8bd68b3d4383edfeb34f8f52dd0b94a6467d594c2fee722e8a97c32aa.png',
    accentFrom: '#22D3EE',
    accentTo: '#0891B2',
    archetype: 'tech',
  },
  {
    id: 'torbjorn',
    overfastKey: 'torbjorn',
    name: 'Torbjörn',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ce17118cedc29b0d2ac1e059666bed36b9531c85079b0b894bb402d12c917ba9.png',
    accentFrom: '#FB923C',
    accentTo: '#C2410C',
    archetype: 'tech',
  },
  {
    id: 'tracer',
    overfastKey: 'tracer',
    name: 'Tracer',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4504f6f15cb3feaa92ecd38e01dcf751cb5abdac2e0bb52d0555727e53277502.png',
    accentFrom: '#F97316',
    accentTo: '#EA580C',
    archetype: 'flank',
  },
  {
    id: 'venture',
    overfastKey: 'venture',
    name: 'Venture',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/dcab9123f5f55df22e54d4e797de43c71b917e0149dd059a7fd6136f48464cd0.png',
    accentFrom: '#FB923C',
    accentTo: '#9A3412',
    archetype: 'brawl',
  },
  {
    id: 'widowmaker',
    overfastKey: 'widowmaker',
    name: 'Widowmaker',
    role: 'Damage',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/6e4702b45f196aaf51555cf57327322721f45458b17f5f0643ed008a88378259.png',
    accentFrom: '#A78BFA',
    accentTo: '#6D28D9',
    archetype: 'sniper',
  },

  // ================= SUPPORT (15 — Includes Sombra Support Rework) =================
  {
    id: 'ana',
    overfastKey: 'ana',
    name: 'Ana',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/985b06beae46b7ba3ca87d1512d0fc62ca7f206ceca58ef16fc44d43a1cc84ed.png',
    accentFrom: '#60A5FA',
    accentTo: '#1D4ED8',
    archetype: 'sniper',
  },
  {
    id: 'baptiste',
    overfastKey: 'baptiste',
    name: 'Baptiste',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/d4e6f1ca45d9f88fa89260787397f141a6f007b14e5b26698883b6a17bab9680.png',
    accentFrom: '#38BDF8',
    accentTo: '#0284C7',
    archetype: 'medic',
  },
  {
    id: 'brigitte',
    overfastKey: 'brigitte',
    name: 'Brigitte',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/795fba91376d87d441a7f359ae12a3175dfa95825ccc4414cc6b95b129fc4cb0.png',
    accentFrom: '#F59E0B',
    accentTo: '#B45309',
    archetype: 'shield',
  },
  {
    id: 'illari',
    overfastKey: 'illari',
    name: 'Illari',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/ce42d1455e03e79f321345fea84b27a8918b5db8bd7ab9b2ca9e569606ede9e4.png',
    accentFrom: '#FACC15',
    accentTo: '#CA8A04',
    archetype: 'beam',
  },
  {
    id: 'jetpack_cat',
    overfastKey: 'jetpack-cat',
    name: 'Jetpack Cat',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/03a184cd0de27091e0099ac22635ad9615a8f6997881a5c25cc5f2444764f729.png',
    accentFrom: '#FB923C',
    accentTo: '#EA580C',
    archetype: 'aerial',
  },
  {
    id: 'juno',
    overfastKey: 'juno',
    name: 'Juno',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/c0167d251e57b0aa2b1e16c37d87f0e7c77263db9dd0503d77b5f2589bf3e4a0.png',
    accentFrom: '#F472B6',
    accentTo: '#DB2777',
    archetype: 'aerial',
  },
  {
    id: 'kiriko',
    overfastKey: 'kiriko',
    name: 'Kiriko',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/408603fe037e8576078eaac5eab2fb251489ced4003b11f5f522776d43d0b83d.png',
    accentFrom: '#2DD4BF',
    accentTo: '#0D9488',
    archetype: 'mystic',
  },
  {
    id: 'lifeweaver',
    overfastKey: 'lifeweaver',
    name: 'Lifeweaver',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/3376515cebed0904012e67e956f6d1b9c12e03da642845eeaf787b7e4c7b339d.png',
    accentFrom: '#F9A8D4',
    accentTo: '#EC4899',
    archetype: 'mystic',
  },
  {
    id: 'lucio',
    overfastKey: 'lucio',
    name: 'Lúcio',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/040bb13f5123ab93faad2f95627ba184608aef4b2469a4d3003859c7087df044.png',
    accentFrom: '#4ADE80',
    accentTo: '#16A34A',
    archetype: 'dive',
  },
  {
    id: 'mercy',
    overfastKey: 'mercy',
    name: 'Mercy',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/3bfb8bd8ec827e53d870f1238ab73d8aa1f5dbfbcfaaf7f96ffcd35b5c6102ab.png',
    accentFrom: '#FDE047',
    accentTo: '#EAB308',
    archetype: 'aerial',
  },
  {
    id: 'mizuki',
    overfastKey: 'mizuki',
    name: 'Mizuki',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/a9733c2367e0cbd70b9316fd2e1e17028653ec56d0051ea6ff098531dc4f99fc.png',
    accentFrom: '#38BDF8',
    accentTo: '#2563EB',
    archetype: 'mystic',
  },
  {
    id: 'moira',
    overfastKey: 'moira',
    name: 'Moira',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/f48f8485056d5d00dad195859188d23e50f7126b8b08b5646f46ef1b42f5e1de.png',
    accentFrom: '#A855F7',
    accentTo: '#7E22CE',
    archetype: 'beam',
  },
  {
    id: 'sombra',
    overfastKey: 'sombra',
    name: 'Sombra',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/47727b02a16e3bd7b2447d86ae1edf11587bc320b2aecb4f2f16a7ca4ad4e8a0.png',
    accentFrom: '#C084FC',
    accentTo: '#7C3AED',
    archetype: 'flank',
  },
  {
    id: 'wuyang',
    overfastKey: 'wuyang',
    name: 'Wuyang',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/4959500b495b35c0908be2abda56b53f2601b2c5cc39a1cfde8df1bffd38d66d.png',
    accentFrom: '#34D399',
    accentTo: '#047857',
    archetype: 'tech',
  },
  {
    id: 'zenyatta',
    overfastKey: 'zenyatta',
    name: 'Zenyatta',
    role: 'Support',
    portraitUrl:
      'https://d15f34w2p8l1cc.cloudfront.net/overwatch/7d1546b1541a8afc39353f9337a408d6275a141b0432b7e560ef61579996b0fc.png',
    accentFrom: '#FBBF24',
    accentTo: '#D97706',
    archetype: 'mystic',
  },
];

export const DEFAULT_META_SYNC_SETTINGS: MetaSyncSettings = {
  autoSyncEnabled: true,
  pollingIntervalMinutes: 5,
  dataSourceType: 'local',
  dataSourceUrl: '',
  steamAppId: '2357570',
};

const BASE_COUNTERS: Record<string, CounterMatchup[]> = {
  // Support counters (15, including Support Sombra)
  kiriko: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดัน Kiriko ในแถวหลังและกางบาเรียตัดระยะ Kunai + Suzu ได้ดีในไฟต์ยืดเยื้อ' },
    { counterHeroId: 'tracer', reason: 'ความเร็วสูง บังคับให้ Kiriko ต้องรีบใช้ Protection Suzu และ Swift Step ก่อนเวลา' },
    { counterHeroId: 'sombra', reason: 'Hack ปิดสกิล Swift Step และ Suzu ชั่วคราว ทำให้ทีมเก็บ Kiriko ได้ก่อนวาร์ปหนี' },
    { counterHeroId: 'cassidy', reason: 'Hinder ขัดขวางการวาร์ปและยิงเก็บจากระยะกลางได้สม่ำเสมอ' },
    { counterHeroId: 'dva', reason: 'Defense Matrix ดูด Kunai และคุมพื้นที่สูงไม่ให้ Kiriko ยืนจ่ายฮีลฟรี' },
  ],
  mercy: [
    { counterHeroId: 'ashe', reason: 'ยิง Hitscan กดดัน Mercy ขณะลอยกลางอากาศได้ดีมากในแผนที่เปิด' },
    { counterHeroId: 'cassidy', reason: 'ยิงแม่นระยะกลาง-ใกล้ ปิด Mercy จังหวะ Guardian Angel หรือตอนแอบชุบเพื่อน' },
    { counterHeroId: 'soldier76', reason: 'ไล่ยิงต่อเนื่องเวลา Mercy บินหลบ และใช้ Tactical Visor ปิดไฟต์กลางอากาศ' },
    { counterHeroId: 'widowmaker', reason: 'ส่อง Headshot เก็บ Mercy ทันทีเมื่อลอยพ้นที่กำบังหรือยืนนิ่งรอชุบ' },
    { counterHeroId: 'dva', reason: 'บูสต์ขึ้นฟ้าไล่ประกบ Mercy และใช้ Micro Missiles ปิดดาเมจได้เร็ว' },
  ],
  sombra: [
    { counterHeroId: 'brigitte', reason: 'กางโล่กัน Hack ของ Support Sombra พร้อม Whip Shot และ Repair Pack คุ้มกันเพื่อนร่วมทีมได้ทัน' },
    { counterHeroId: 'cassidy', reason: 'Flashbang / Hinder หยุด Translocator ทันทีเมื่อ Sombra เข้ามาป่วนหรือแฮกในระยะใกล้' },
    { counterHeroId: 'winston', reason: 'Tesla Cannon กวาดเปิดเผยตัวล่องหน (Spy Check) ง่ายและกางบาเรียตัดสายแฮกของ Sombra' },
    { counterHeroId: 'kiriko', reason: 'Protection Suzu ล้างสถานะ Hack และ EMP ได้ทันที พร้อม Kunai ยิงสวนแรงมาก' },
    { counterHeroId: 'moira', reason: 'Biotic Grasp ล็อกเป้าเช็กตัวล่องหนได้ต่อเนื่องและ Fade หนีจังหวะโดนแฮกได้ง่าย' },
    { counterHeroId: 'dva', reason: 'ยิงกระจาย Spy Check เปิดตัวล่องหนตลอดเวลาและดูดการยิงสนับสนุนของ Sombra ด้วย Matrix' },
  ],
  ana: [
    { counterHeroId: 'winston', reason: 'บาเรียตัดเส้นสายตาปืนฮีลและระเบิด Biotic Grenade ของ Ana ได้อย่างสมบูรณ์' },
    { counterHeroId: 'dva', reason: 'Defense Matrix กิน Sleep Dart และ Biotic Grenade ได้ทันทีพร้อมไล่กดดัน' },
    { counterHeroId: 'sombra', reason: 'แอบเข้าหลังบ้านแฮกปิดสกิลป้องกันตัวและตัดจังหวะฮีลของ Ana ได้ดี' },
    { counterHeroId: 'tracer', reason: 'Blink หลบ Sleep Dart และบังคับให้ Ana ต้องใช้ระเบิดฮีลใส่ตัวเอง' },
    { counterHeroId: 'kiriko', reason: 'Protection Suzu ล้างสถานะห้ามฮีลจาก Biotic Grenade ของ Ana ได้ทันที' },
  ],
  baptiste: [
    { counterHeroId: 'sombra', reason: 'Hack ขัดจังหวะและช่วยทีมพัง Immortality Field ได้รวดเร็ว' },
    { counterHeroId: 'genji', reason: 'ใช้ความคล่องตัวล้วงเข้าถึงตัว Baptiste และ Deflect กระสุนกลับใส่ได้' },
    { counterHeroId: 'winston', reason: 'กระโดดกดดันให้ Baptiste เสีย Regenerative Burst และหนีออกจากตะเกียง' },
    { counterHeroId: 'ashe', reason: 'ใช้ Dynamite และ Headshot บีบให้ต้องวาง Immortality Field นอกจังหวะ' },
  ],
  brigitte: [
    { counterHeroId: 'pharah', reason: 'โจมตีจากมุมสูงนอกระยะฟาดกระบองของ Brigitte ได้อย่างปลอดภัย' },
    { counterHeroId: 'echo', reason: 'บินยิง Sticky Bombs และ Focusing Beam ทะลุโล่เมื่อเลือดลดต่ำกว่าครึ่ง' },
    { counterHeroId: 'ramattra', reason: 'โหมด Nemesis ต่อยทะลุโล่ของ Brigitte เข้าเป้าโดยตรง' },
    { counterHeroId: 'ashe', reason: 'ยิงจากระยะไกลพังโล่และโยน Dynamite ข้ามโล่เผาเลือดต่อเนื่อง' },
  ],
  illari: [
    { counterHeroId: 'dva', reason: 'บินขึ้นไปทำลาย Healing Pylon ที่ซ่อนอยู่บนที่สูงและดูด Captive Sun ได้' },
    { counterHeroId: 'sombra', reason: 'แอบพัง Pylon ของ Illari จากด้านหลังและ Hack ตัดสกิลพุ่งหนี' },
    { counterHeroId: 'winston', reason: 'กางบาเรียบังการชาร์จยิงและทำลาย Pylon พร้อมไล่กดดันแถวหลัง' },
    { counterHeroId: 'tracer', reason: 'ล้วงพัง Pylon อย่างรวดเร็วทำให้ทีมศัตรูขาดแหล่งฮีลหลัก' },
  ],
  jetpack_cat: [
    { counterHeroId: 'soldier76', reason: 'ยิงติดตามเป้าหมายบนอากาศที่เคลื่อนที่เร็วอย่าง Jetpack Cat ได้เสถียรที่สุด' },
    { counterHeroId: 'cassidy', reason: 'ยิงหยุดจังหวะกลางอากาศและลดความเร็วด้วย Hinder' },
    { counterHeroId: 'ashe', reason: 'ส่องระยะกลาง-ไกลตัดการสนับสนุนทางอากาศของ Jetpack Cat' },
    { counterHeroId: 'dva', reason: 'ดูดกระสุนสนับสนุนและบินชนกระแทกกลางอากาศ' },
  ],
  juno: [
    { counterHeroId: 'sombra', reason: 'Hack ปิดสกิล Glide Boost ทำให้ Juno ร่วงลงมาและหนีไม่พ้น' },
    { counterHeroId: 'soldier76', reason: 'ยิงกดดันขณะ Juno ลอยตัวกลางอากาศได้แม่นยำต่อเนื่อง' },
    { counterHeroId: 'tracer', reason: 'ไล่ตามความเร็วของ Hyper Ring ได้ทันและเก็บในระยะประชิด' },
    { counterHeroId: 'cassidy', reason: 'ยิงสองนัดเก็บ Juno ที่พลังชีวิตน้อยระหว่างลอยตัวเปิดมุม' },
  ],
  lifeweaver: [
    { counterHeroId: 'sombra', reason: 'EMP และ Hack ทำลาย Petal Platform และตัดจังหวะ Life Grip' },
    { counterHeroId: 'winston', reason: 'กระโดดตามขึ้น Petal Platform เพื่อกดดันและกางบาเรียตัดฮีล' },
    { counterHeroId: 'tracer', reason: 'ไล่เก็บ Lifeweaver ที่ตัวใหญ่และฮีลตัวเองได้จำกัด' },
    { counterHeroId: 'widowmaker', reason: 'ตัวละครสูงโปร่งยิง Headshot ง่ายเมื่ออยู่บนแพลตฟอร์มเปิดโล่ง' },
  ],
  lucio: [
    { counterHeroId: 'cassidy', reason: 'Hinder หยุดการไต่กำแพงของ Lúcio ได้ชะงักในระยะใกล้' },
    { counterHeroId: 'sombra', reason: 'Hack ปิดออร่าสปีดและทำให้ร่วงจากกำแพงทันที' },
    { counterHeroId: 'moira', reason: 'ลำแสงล็อกเป้าหมายช่วยตามเก็บ Lúcio ที่เคลื่อนไหวเร็วได้ง่าย' },
    { counterHeroId: 'winston', reason: 'Tesla Cannon ยิงโดนโดยไม่ต้องเล็งเป๊ะ กดดันตอนไต่กำแพง' },
  ],
  mizuki: [
    { counterHeroId: 'widowmaker', reason: 'ยิงตัดจังหวะระยะไกลก่อน Mizuki จะตั้งโซนจ่ายบัฟให้ทีมได้ทัน' },
    { counterHeroId: 'tracer', reason: 'เข้าประชิดเร็ว บังคับให้ Mizuki ต้องใช้สกิลเอาตัวรอดก่อนจังหวะไฟต์' },
    { counterHeroId: 'winston', reason: 'กางบาเรียตัดสายสัมพันธ์ฮีลและไล่กดดันในแนวหลัง' },
    { counterHeroId: 'ashe', reason: 'กดดันจากระยะกลางด้วย Dynamite แยกตำแหน่งยืนของ Mizuki' },
  ],
  moira: [
    { counterHeroId: 'dva', reason: 'Defense Matrix กิน Biotic Orb ทั้งลูกฮีลและลูกดาเมจของ Moira ได้หมด' },
    { counterHeroId: 'cassidy', reason: 'ยิง Headshot ปิด Moira ก่อนใช้ Fade หนี และขัดจังหวะอัลติเมท Coalescence' },
    { counterHeroId: 'ana', reason: 'Biotic Grenade ตัดการฮีลตัวเองของ Moira ทำให้แพ้ไฟต์ทันที' },
    { counterHeroId: 'sombra', reason: 'Hack ตัด Coalescence ของ Moira ได้ทันที' },
  ],
  wuyang: [
    { counterHeroId: 'pharah', reason: 'โจมตีจากมุมสูงข้ามแนวกำบังพลังน้ำและโซนตั้งรับของ Wuyang' },
    { counterHeroId: 'dva', reason: 'ดูดกระสุนพลังงานของ Wuyang และบินเข้าประชิดได้รวดเร็ว' },
    { counterHeroId: 'sombra', reason: 'ตัดการใช้งานสกิลสนับสนุนและเกราะน้ำของ Wuyang' },
    { counterHeroId: 'ashe', reason: 'ยิงทำลายจังหวะจากระยะไกลและเผาพื้นที่รวมตัวของทีมศัตรู' },
  ],
  zenyatta: [
    { counterHeroId: 'tracer', reason: 'Hitbox กว้างและไม่มีสกิลหนี Tracer เก็บ Zenyatta ได้ในชุดเดียว' },
    { counterHeroId: 'sombra', reason: 'EMP ลดเกราะสีฟ้าของ Zenyatta หายทันทีและลอบเก็บง่ายมาก' },
    { counterHeroId: 'winston', reason: 'กระโดดทับแนวหลังพร้อมบาเรียบัง Orb of Destruction' },
    { counterHeroId: 'widowmaker', reason: 'ยิงเก็บ Zenyatta ที่เคลื่อนที่ช้าจากระยะไกล' },
  ],

  // Tank counters (13)
  dva: [
    { counterHeroId: 'zarya', reason: 'ลำแสงเลเซอร์ของ Zarya ทะลุ Defense Matrix ของ D.Va โดยตรง' },
    { counterHeroId: 'brigitte', reason: 'ตีทะลุ Matrix และใช้ Whip Shot ผลักตอน D.Va บูสต์เข้ามา' },
    { counterHeroId: 'moira', reason: 'ดูดพลังชีวิตผ่าน Defense Matrix ได้ตลอดเวลา' },
    { counterHeroId: 'symmetra', reason: 'ลำแสงเลเซอร์ชาร์จแรงขึ้นเร็วมากเมื่อยิงใส่หุ่น D.Va และทะลุ Matrix' },
  ],
  winston: [
    { counterHeroId: 'reaper', reason: 'ช็อตกันคู่ระยะประชิดละลายเกราะ Winston และดูดเลือดสวนได้ทัน' },
    { counterHeroId: 'dva', reason: 'บูสต์ตามไปปกป้องเพื่อนและยิงช็อตกันระยะประชิดใส่ตัวใหญ่ของ Winston' },
    { counterHeroId: 'bastion', reason: 'โหมดปืนกลทำลายบาเรียและตัว Winston ในไม่กี่วินาที' },
    { counterHeroId: 'brigitte', reason: 'ผลัก Winston ออกจากแนวหลังด้วย Whip Shot และฮีลทีมพร้อมสู้ระยะใกล้' },
  ],
  reinhardt: [
    { counterHeroId: 'ramattra', reason: 'โหมด Nemesis ต่อยทะลุโล่ Reinhardt เข้าเนื้อโดยตรง' },
    { counterHeroId: 'pharah', reason: 'บินยิงจากมุมสูงด้านหลังโล่ บีบให้ Reinhardt ต้องหันโล่หนี' },
    { counterHeroId: 'bastion', reason: 'โหมดปืนกลละลายโล่ของ Reinhardt ได้เร็วที่สุดในเกม' },
    { counterHeroId: 'symmetra', reason: 'ชาร์จลำแสงระดับ 3 จากโล่ Reinhardt ได้ฟรีและยิงต่อเนื่องไม่เปลืองกระสุน' },
  ],
  doomfist: [
    { counterHeroId: 'sombra', reason: 'Hack หยุด Power Block และตัดจังหวะคอมโบ Rocket Punch ของ Doomfist' },
    { counterHeroId: 'orisa', reason: 'Fortify กันโดนผลักและหอก Energy Javelin หยุดคอมโบ Doomfist ได้ชะงัก' },
    { counterHeroId: 'cassidy', reason: 'Hinder ห้าม Doomfist ใช้สกิลพุ่งหนี' },
    { counterHeroId: 'ana', reason: 'Sleep Dart ยิงใส่วงจังหวะ Power Block ได้แม่นยำมาก' },
  ],
  sigma: [
    { counterHeroId: 'zarya', reason: 'ลำแสงทะลุ Kinetic Grasp ของ Sigma และเก็บชาร์จพลังจากลูกบอลได้ง่าย' },
    { counterHeroId: 'winston', reason: 'กระโดดข้ามโล่ Sigma และใช้ปืนไฟฟ้าทะลุ Kinetic Grasp' },
    { counterHeroId: 'symmetra', reason: 'ลำแสงทะลุ Kinetic Grasp และเก็บพลังงานจากโล่ Sigma ได้ง่าย' },
    { counterHeroId: 'ramattra', reason: 'เดินเข้าประชิดต่อยทะลุโล่และ Kinetic Grasp ของ Sigma' },
  ],
  zarya: [
    { counterHeroId: 'winston', reason: 'คุมจังหวะไม่ยิงใส่ฟองสบู่และกระโดดข้ามไปกดดันแถวหลังแทน' },
    { counterHeroId: 'reinhardt', reason: 'ถือโล่บล็อกลำแสงและคุมพื้นที่ระยะประชิดเหนือกว่าเมื่อ Zarya ชาร์จต่ำ' },
    { counterHeroId: 'pharah', reason: 'ยิงจากมุมสูงนอกระยะลำแสงของ Zarya' },
    { counterHeroId: 'bastion', reason: 'รอฟองสบู่หมดแล้วเปิดปืนกลละลาย Zarya ที่ไม่มีสกิลหนีในพริบตา' },
  ],
  ramattra: [
    { counterHeroId: 'ana', reason: 'Sleep Dart และ Biotic Grenade หยุดโหมด Nemesis ของ Ramattra ได้ดีมาก' },
    { counterHeroId: 'orisa', reason: 'ผลักและปาหอกสวนจังหวะ Nemesis ไม่ให้ Ramattra เข้าถึงแถวหลัง' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ทำให้ Ramattra ร่างใหญ่ละลายเร็วเมื่อพุ่งเข้ามา' },
    { counterHeroId: 'pharah', reason: 'โจมตีทางอากาศหลบระยะหมัดและ Vortex ของ Ramattra' },
  ],
  junker_queen: [
    { counterHeroId: 'kiriko', reason: 'Protection Suzu ล้างสถานะเลือดออกและอัลติเมท Rampage ของ Junker Queen ได้หมด' },
    { counterHeroId: 'ana', reason: 'Biotic Grenade ตัดความสามารถดูดเลือดจากแผลของ Junker Queen ทันที' },
    { counterHeroId: 'zarya', reason: 'ฟองสบู่ล้างสถานะเลือดออกและป้องกันมีดปักได้ดี' },
    { counterHeroId: 'pharah', reason: 'ยิงจากระยะสูงนอกระยะขวานและปืนลูกซอง' },
  ],
  mauga: [
    { counterHeroId: 'ana', reason: 'Biotic Grenade ตัดการดูดเลือด Cardiac Overdrive ทำให้ Mauga ละลายทันที' },
    { counterHeroId: 'sigma', reason: 'Kinetic Grasp ดูดปืนกลคู่และวางโล่สลับจังหวะไม่ให้ Mauga ดูดเลือด' },
    { counterHeroId: 'dva', reason: 'Defense Matrix กินกระสุนระหว่าง Mauga เปิด Cardiac Overdrive ลดการฮีลของอีกฝ่าย' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb + ยิงระยะไกลเจาะตัวใหญ่ของ Mauga ได้ไวมาก' },
  ],
  orisa: [
    { counterHeroId: 'zarya', reason: 'ลำแสงทะลุ Javelin Spin ของ Orisa และยืนแลกดาเมจได้ดี' },
    { counterHeroId: 'symmetra', reason: 'ลำแสงทะลุ Javelin Spin และเจาะเกราะ Orisa เมื่อชาร์จเต็ม' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ช่วยทีมลดเกราะ Fortify ของ Orisa ได้เร็วขึ้นมาก' },
    { counterHeroId: 'echo', reason: 'บินข้ามหัวไปเก็บแถวหลังและใช้ Focusing Beam ปิดตอน Fortify หมด' },
  ],
  roadhog: [
    { counterHeroId: 'ana', reason: 'Sleep Dart จังหวะตะขอ + Biotic Grenade ตัดการฮีล Take a Breather ได้เด็ดขาด' },
    { counterHeroId: 'orisa', reason: 'Energy Javelin ขัดจังหวะการสูดฮีลของ Roadhog และมี Fortify กันตะขอดึง' },
    { counterHeroId: 'reaper', reason: 'ยิงช็อตกันละลายร่างใหญ่ของ Roadhog และเก็บอัลติเมทได้เร็วมาก' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ทำให้ Roadhog โดนดาเมจหนักตลอดเวลาจากระยะไกล' },
  ],
  wrecking_ball: [
    { counterHeroId: 'sombra', reason: 'Hack หยุดลูกกลิ้งให้จอดนิ่งและหลุดจากฟอร์มบอลทันที' },
    { counterHeroId: 'cassidy', reason: 'Hinder หยุดความเร็วกลิ้งและสลิงไม่ให้หนีออกจากไฟต์' },
    { counterHeroId: 'ana', reason: 'ตัวใหญ่ยิง Sleep Dart ง่ายมากช่วงพุ่งลงมา Piledriver' },
    { counterHeroId: 'brigitte', reason: 'Whip Shot ผลักขัดจังหวะสลิงและ Shield Bash กันแนวหลัง' },
  ],
  hazard: [
    { counterHeroId: 'ana', reason: 'Sleep Dart และ Biotic Grenade หยุดการพุ่งทะลวงและป้องกัน Spike Guard ของ Hazard' },
    { counterHeroId: 'orisa', reason: 'Energy Javelin ผลัก Hazard ออกจากกำแพงและขัดสกิลป้องกันได้' },
    { counterHeroId: 'pharah', reason: 'บินยิงเหนือกำแพง Jagged Wall และหลบระยะหนามของ Hazard' },
    { counterHeroId: 'reaper', reason: 'ยืนสู้ระยะประชิดและยิงสวนตัวใหญ่ของ Hazard ได้คุ้มค่า' },
  ],

  // Damage counters (17)
  ashe: [
    { counterHeroId: 'winston', reason: 'กระโดดขึ้นที่สูงไล่กดดัน Ashe ออกจากตำแหน่งยิงและกางบาเรียบังกระสุน' },
    { counterHeroId: 'dva', reason: 'ดูด Dynamite ด้วย Matrix และบินขึ้นไปบีบให้ Ashe ถอย' },
    { counterHeroId: 'widowmaker', reason: 'ดวลระยะไกลชนะ Ashe ด้วยนัดเดียวจากมุมยิงที่ไกลกว่า' },
    { counterHeroId: 'sombra', reason: 'ลอบเข้าหลังบ้านกดดัน Ashe ที่เล็งผ่านกล้องอยู่' },
  ],
  cassidy: [
    { counterHeroId: 'ashe', reason: 'ยิงจากระยะไกลกว่าช่วงหวังผลของปืน Cassidy' },
    { counterHeroId: 'widowmaker', reason: 'คุมระยะไกลที่ Cassidy ยิงสู้ไม่ได้' },
    { counterHeroId: 'sigma', reason: 'ใช้โล่เคลื่อนที่และ Kinetic Grasp บังกระสุนและ High Noon ของ Cassidy' },
    { counterHeroId: 'ana', reason: 'ส่องและปา Sleep Dart หยุด Deadeye ได้จากระยะปลอดภัย' },
  ],
  soldier76: [
    { counterHeroId: 'dva', reason: 'บินเข้าประชิดพร้อม Defense Matrix ดูดกระสุนและ Helix Rockets ทั้งหมด' },
    { counterHeroId: 'sigma', reason: 'วางโล่ตัดมุมยิงบน High Ground และดูดกระสุน Tactical Visor' },
    { counterHeroId: 'widowmaker', reason: 'เก็บ Soldier: 76 ในนัดเดียวเมื่อโผล่ยิงจากที่สูง' },
    { counterHeroId: 'genji', reason: 'Deflect กระสุนและ Helix Rockets กลับใส่ในระยะประชิด' },
  ],
  tracer: [
    { counterHeroId: 'cassidy', reason: 'ยิงนัดเดียว + Hinder กดดันไม่ให้ Tracer กล้า Blink เข้าใกล้' },
    { counterHeroId: 'brigitte', reason: 'Whip Shot และเกราะลดทอนดาเมจของ Tracer และปกป้องเพื่อน Support' },
    { counterHeroId: 'kiriko', reason: 'Kunai เข้าหัว 1 นัด + ต่อย ปิด Tracer ได้ทันทีในระยะใกล้' },
    { counterHeroId: 'torbjorn', reason: 'ป้อมปืน Turret คอยยิงรบกวนและตัดพื้นที่การ Flank ของ Tracer ตลอดเวลา' },
  ],
  widowmaker: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดันพื้นที่สูงที่ Widowmaker ยืนอยู่พร้อมบาเรียกัน Headshot' },
    { counterHeroId: 'sombra', reason: 'ลอบเข้าใกล้โดยไม่ให้รู้ตัวและกดดัน Widowmaker จากระยะประชิด' },
    { counterHeroId: 'dva', reason: 'บูสต์ขึ้นไปชนและดูดกระสุนสไนเปอร์ออกจากมุมยิง' },
    { counterHeroId: 'tracer', reason: 'อ้อมเส้นทางข้างเพื่อตามล่า Widowmaker ที่แยกตัวอยู่คนเดียว' },
  ],
  genji: [
    { counterHeroId: 'winston', reason: 'Tesla Cannon ยิงทะลุ Deflect ของ Genji ได้ตลอดเวลา' },
    { counterHeroId: 'zarya', reason: 'ลำแสงเลเซอร์ไม่ถูกสะท้อนด้วย Deflect และยิงละลาย Genji ได้เร็ว' },
    { counterHeroId: 'moira', reason: 'Biotic Grasp ทะลุ Deflect และ Fade หนี Dragonblade ได้สบาย' },
    { counterHeroId: 'mei', reason: 'ลำแสงน้ำแข็งยิงทะลุ Deflect และชะลอความเร็ว Genji ได้ดี' },
  ],
  pharah: [
    { counterHeroId: 'ashe', reason: 'ส่อง Hitscan เก็บ Pharah กลางอากาศได้แม่นยำและรุนแรง' },
    { counterHeroId: 'soldier76', reason: 'ยิงไล่ Pharah ออกจากฟ้าได้อย่างต่อเนื่องและมี Visor ปิดเกม' },
    { counterHeroId: 'cassidy', reason: 'ยิง Hitscan กดดัน Pharah ที่บินต่ำหรือเข้าใกล้ทีม' },
    { counterHeroId: 'dva', reason: 'บินชน Pharah กลางอากาศและดูดจรวด Barrage ได้หมด' },
  ],
  echo: [
    { counterHeroId: 'ashe', reason: 'ยิงกดดัน Echo ตั้งแต่ก่อนจะบินเข้าประชิดได้ผลดีที่สุด' },
    { counterHeroId: 'soldier76', reason: 'ไล่ยิง Echo กลางอากาศได้ต่อเนื่องแม้ใช้ Flight หลบมุม' },
    { counterHeroId: 'cassidy', reason: 'ยิงตัดเลือด Echo ก่อนที่จะเข้ามาระยะ Focusing Beam' },
    { counterHeroId: 'dva', reason: 'ดูด Sticky Bombs และบินตาม Echo ได้ทัน' },
  ],
  reaper: [
    { counterHeroId: 'pharah', reason: 'ยิงจากมุมสูงนอกระยะปืนลูกซองของ Reaper โดยสมบูรณ์' },
    { counterHeroId: 'echo', reason: 'บินกดดันและยิง Sticky Bombs ปิดเกมก่อน Reaper เข้าประชิด' },
    { counterHeroId: 'dva', reason: 'Defense Matrix กินกระสุนลูกซองและ Death Blossom ของ Reaper ได้ทั้งหมด' },
    { counterHeroId: 'ashe', reason: 'ยิงจากระยะไกลและใช้ Coach Gun ผลัก Reaper ออกเมื่อโดนประชิด' },
  ],
  hanzo: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดันพื้นที่สูงและกางบาเรียกันลูกธนู Storm Arrows' },
    { counterHeroId: 'dva', reason: 'Matrix ดูด Storm Arrows และอัลติเมท Dragonstrike ก่อนออกเป็นมังกรได้' },
    { counterHeroId: 'genji', reason: 'Deflect สะท้อนลูกธนูและไต่กำแพงไล่ประกบ Hanzo ได้คล่องตัว' },
    { counterHeroId: 'tracer', reason: 'หลบลูกธนูด้วย Blink และเก็บ Hanzo ในระยะประชิด' },
  ],
  mei: [
    { counterHeroId: 'pharah', reason: 'บินข้ามกำแพงน้ำแข็ง Ice Wall และยิงจากระยะปลอดภัย' },
    { counterHeroId: 'echo', reason: 'บินพ้นระยะปืนน้ำแข็งและใช้ Beam ปิดหลัง Cryo-Freeze หมด' },
    { counterHeroId: 'kiriko', reason: 'Protection Suzu ล้างสถานะสโลว์จาก Blizzard และปีนกำแพงหนีได้' },
    { counterHeroId: 'orisa', reason: 'Fortify กันการถูกแช่แข็งจาก Blizzard และดันเกมสู้ได้' },
  ],
  symmetra: [
    { counterHeroId: 'pharah', reason: 'บินทำลายป้อม Turret และยิงลงมาจากมุมที่ Symmetra ยิงไม่ถึง' },
    { counterHeroId: 'winston', reason: 'กวาดทำลายป้อม Turret ทั้งหมดได้ในพริบตาด้วย Tesla Cannon' },
    { counterHeroId: 'echo', reason: 'ยิงจากกลางอากาศและเก็บ Teleporter ได้รวดเร็ว' },
    { counterHeroId: 'junkrat', reason: 'ยิงระเบิดชิ่งทำลายป้อมและโซนตั้งรับของ Symmetra โดยไม่ต้องโผล่หน้า' },
  ],
  torbjorn: [
    { counterHeroId: 'pharah', reason: 'ยิงจรวดระยะไกลพังป้อมปืน Turret ใน 2 นัดจากนอกระยะยิง' },
    { counterHeroId: 'hanzo', reason: 'Storm Arrows พังป้อมปืนและยิงเก็บ Torbjörn จากระยะปลอดภัย' },
    { counterHeroId: 'sojourn', reason: 'Disruptor Shot และ Railgun เคลียร์ป้อมปืนได้ไวมาก' },
    { counterHeroId: 'sigma', reason: 'กางโล่บังมุมป้อมและยิงลูกบอลอ้อมกำแพงทำลายป้อมได้สบาย' },
  ],
  bastion: [
    { counterHeroId: 'sigma', reason: 'Kinetic Grasp ดูดปืนกลของ Bastion แปลงเป็นเกราะให้ตัวเองได้มหาศาล' },
    { counterHeroId: 'genji', reason: 'Deflect สะท้อนกระสุนปืนกลกลับใส่ Bastion จนละลายเองในพริบตา' },
    { counterHeroId: 'ana', reason: 'Sleep Dart ยิงโดนร่างใหญ่ของ Bastion ง่ายมากและ Biotic Grenade ตัดการฮีล' },
    { counterHeroId: 'hanzo', reason: 'Storm Arrows + มุมซุ่มยิงทำลาย Bastion ที่เคลื่อนที่ช้าในโหมด Assault ได้ไว' },
  ],
  junkrat: [
    { counterHeroId: 'pharah', reason: 'บินสูงกว่าระยะลูกระเบิดชิ่งของ Junkrat และยิงกดดันได้ฝ่ายเดียว' },
    { counterHeroId: 'echo', reason: 'โจมตีทางอากาศหลบกับดัก Steel Trap และลูกระเบิดบนพื้น' },
    { counterHeroId: 'dva', reason: 'Matrix กินลูกระเบิดและบินชน RIP-Tire หรือป้องกันเพื่อนได้' },
    { counterHeroId: 'ashe', reason: 'ยิงจากระยะไกลพัง RIP-Tire ก่อนถึงตัวทีมได้ง่าย' },
  ],
  sojourn: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดันพื้นที่สูงและกางบาเรียกัน Railgun ชาร์จเต็ม' },
    { counterHeroId: 'dva', reason: 'Defense Matrix กินกระสุน Disruptor Shot และ Railgun ได้ดี' },
    { counterHeroId: 'sombra', reason: 'Hack ปิด Power Slide ไม่ให้ Sojourn พุ่งหนีออกจากมุมยิง' },
    { counterHeroId: 'tracer', reason: 'ความเร็วสูงทำให้ Sojourn เล็ง Railgun โดนยากและกดดันต่อเนื่อง' },
  ],
  venture: [
    { counterHeroId: 'cassidy', reason: 'Hinder ตัดสกิล Burrow และ Drill Dash ไม่ให้ Venture มุดหนีได้' },
    { counterHeroId: 'pharah', reason: 'บินอยู่บนอากาศพ้นระยะขุดดินและสว่านของ Venture' },
    { counterHeroId: 'sombra', reason: 'Hack ขัดจังหวะก่อน Venture จะมุดดินหนี ทำให้เก็บตัวได้ทันที' },
    { counterHeroId: 'brigitte', reason: 'Whip Shot ผลัก Venture ออกตอนโผล่ขึ้นมาจากดินและกันแถวหลัง' },
  ],

  // Additional 2026 OverFast API heroes (dynamically synced)
  anran: [
    { counterHeroId: 'cassidy', reason: 'Hinder หยุดความคล่องตัวระยะใกล้ของ Anran ได้อย่างแม่นยำ' },
    { counterHeroId: 'winston', reason: 'กางบาเรียคุมพื้นที่และปืนไฟฟ้ากดดันสาย Flank ได้สม่ำเสมอ' },
    { counterHeroId: 'brigitte', reason: 'Whip Shot ผลักออกและปกป้องแนวหลังไม่ให้โดนล้วงง่าย' },
    { counterHeroId: 'dva', reason: 'Defense Matrix ดูดคอมโบเปิดไฟต์และไล่ประกบได้ทัน' },
  ],
  dmon: [
    { counterHeroId: 'zarya', reason: 'ลำแสงทะลุโล่และเกราะหุ่นรบของ D.Mon ได้โดยตรง' },
    { counterHeroId: 'ana', reason: 'Sleep Dart และ Biotic Grenade หยุดจังหวะพุ่งชนและตัดการฮีล' },
    { counterHeroId: 'reaper', reason: 'ยิงช็อตกันละลายหุ่นรบขนาดใหญ่ในระยะประชิดได้ไว' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ช่วยลดความอึดของหุ่นรบได้อย่างชัดเจน' },
  ],
  doctrine: [
    { counterHeroId: 'winston', reason: 'กระโดดกดดันแถวหลังและตัดสายสนับสนุนของ Doctrine' },
    { counterHeroId: 'tracer', reason: 'เข้าประชิดเร็ว บีบให้ Doctrine ใช้สกิลป้องกันตัวก่อนจังหวะไฟต์' },
    { counterHeroId: 'sombra', reason: 'Hack ปิดความสามารถซัพพอร์ตสำคัญในช่วงเปิดไฟต์' },
    { counterHeroId: 'ashe', reason: 'ยิงกดดันจากระยะกลาง-ไกลและป่วนการจัดตำแหน่งด้วย Dynamite' },
  ],
  domina: [
    { counterHeroId: 'reaper', reason: 'ยิงช็อตกันระยะใกล้ทะลวงแนวหน้าของ Domina ได้รุนแรง' },
    { counterHeroId: 'pharah', reason: 'โจมตีจากมุมสูงข้ามแนวตั้งรับและโล่ของ Domina' },
    { counterHeroId: 'ana', reason: 'Biotic Grenade ตัดการยืนระยะและ Sleep Dart หยุดการเปิดไฟต์' },
    { counterHeroId: 'zenyatta', reason: 'Discord Orb ทำให้ Domina ถูกรุมยิงล้มเร็วขึ้นมาก' },
  ],
  emre: [
    { counterHeroId: 'dva', reason: 'Defense Matrix ดูดกระสุนและระเบิดของ Emre พร้อมบินขึ้นกดดัน' },
    { counterHeroId: 'winston', reason: 'กระโดดปิดมุมยิงบนที่สูงด้วยบาเรีย' },
    { counterHeroId: 'widowmaker', reason: 'ชิงจังหวะยิงจากระยะที่ไกลกว่า' },
    { counterHeroId: 'tracer', reason: 'ไล่กดดันระยะประชิดทำให้ตั้งป้อมยิงลำบาก' },
  ],
  freja: [
    { counterHeroId: 'ashe', reason: 'ยิง Hitscan สกัด Freja ระหว่างลอยตัวเปิดมุมได้อย่างแม่นยำ' },
    { counterHeroId: 'soldier76', reason: 'ยิงไล่กลางอากาศได้ต่อเนื่องแม้ Freja เคลื่อนที่เร็ว' },
    { counterHeroId: 'dva', reason: 'ดูดลูกธนูพลังงานและบินไล่ประกบกลางอากาศ' },
    { counterHeroId: 'cassidy', reason: 'ยิงเก็บระยะกลาง-ใกล้เมื่อ Freja พยายามเปลี่ยนมุมยิง' },
  ],
  shion: [
    { counterHeroId: 'winston', reason: 'กางบาเรียตัดมุมยิงและไล่กดดัน Shion ในพื้นที่เปิด' },
    { counterHeroId: 'cassidy', reason: 'Hinder ตัดจังหวะเคลื่อนที่และดวลระยะกลางได้นิ่งกว่า' },
    { counterHeroId: 'dva', reason: 'ดูดดาเมจและตามประกบไม่ให้เปิดมุมฟรี' },
    { counterHeroId: 'tracer', reason: 'เข้าประชิดเร็วทำให้เล็งตอบโต้ยาก' },
  ],
  sierra: [
    { counterHeroId: 'sigma', reason: 'วางโล่ปรับมุมกันการยิงระยะไกลของ Sierra ได้ดี' },
    { counterHeroId: 'winston', reason: 'กระโดดกดดันพื้นที่สูงที่ Sierra ยืนคุมโซน' },
    { counterHeroId: 'sombra', reason: 'ลอบแฮกตัดสกิลหนีและเก็บตัวจากด้านหลัง' },
    { counterHeroId: 'dva', reason: 'ดูดกระสุนและบินเข้าประชิดได้รวดเร็ว' },
  ],
  vendetta: [
    { counterHeroId: 'cassidy', reason: 'Hinder หยุดความเร็วและสกิลพุ่งของ Vendetta ในระยะใกล้' },
    { counterHeroId: 'brigitte', reason: 'Shield Bash และ Whip Shot กันจังหวะล้วงได้ดีมาก' },
    { counterHeroId: 'pharah', reason: 'บินเหนือระยะโจมตีประชิดของ Vendetta' },
    { counterHeroId: 'zarya', reason: 'ฟองสบู่ป้องกันดาเมจฉับพลันและยิงสวนได้แรง' },
  ],
};

export const INITIAL_META_PATCHES: PatchMetaSnapshot[] = [
  {
    id: 'patch-2026-sombra-support',
    version: '2026 Meta — Sombra Support Rework',
    releasedAt: '2026-11-17T09:00:00+07:00',
    summary:
      'ซิงค์แพตช์ใหญ่ปี 2026: รีเวิร์ก Sombra ย้ายจากตำแหน่ง Damage มาเป็น Support เต็มตัว พร้อมปรับเมต้าตัวแก้ทางฝั่ง Support และระบบ Dive ในเซิร์ฟเวอร์ SEA',
    sourceLabel: 'OverFast Live Meta',
    balanceNotes: [
      {
        heroName: 'Sombra',
        status: 'ปรับรูปแบบ',
        summary: 'ย้ายตำแหน่งจาก Damage เป็น Support เต็มตัว เพิ่มความสามารถแฮกสนับสนุนทีมและตัดจังหวะศัตรู',
      },
      {
        heroName: 'Brigitte',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เป็นตัว Support แก้ทาง Sombra และตัวล้วงได้แข็งแกร่งที่สุดในแพตช์นี้',
      },
      {
        heroName: 'Kiriko',
        status: 'เนิร์ฟ (ลดความแรง)',
        summary: 'เพิ่มคูลดาวน์ Protection Suzu จาก 14 เป็น 15 วินาที เปิดช่องให้ตัวล้วงมากขึ้น',
      },
    ],
    countersByHero: BASE_COUNTERS,
  },
  {
    id: 'patch-s14-mid',
    version: 'Season 14 Mid-Season',
    releasedAt: '2026-11-16T10:00:00+07:00',
    summary:
      'ปรับสมดุลฮีโร่สาย Dive และ Hitscan ประจำเซิร์ฟเวอร์ SEA ลดคูลดาวน์ Jump Pack ของ Winston และเพิ่มดาเมจระยะกลางของ Soldier: 76 เพื่อรับมือตัวบินอย่าง Juno และ Mercy',
    sourceLabel: 'SEA Meta Official',
    balanceNotes: [
      {
        heroName: 'Winston',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'ลดคูลดาวน์ Jump Pack จาก 5 วินาที เหลือ 4.5 วินาที ทำให้กดดันแถวหลังได้ดีขึ้น',
      },
      {
        heroName: 'Soldier: 76',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เพิ่มดาเมจต่อกระสุนจาก 19 เป็น 20 หน่วย คุ้มค่ามากเวลาใช้ยิง Mercy และ Juno',
      },
    ],
    countersByHero: BASE_COUNTERS,
  },
  {
    id: 'patch-s14-launch',
    version: 'Season 14 Launch',
    releasedAt: '2026-11-01T14:00:00+07:00',
    summary:
      'เปิดฤดูกาล Season 14 พร้อมปรับปรุงระบบฮีลของ Support รุ่นใหม่และสมดุลโล่ Tank',
    sourceLabel: 'SEA Meta Official',
    balanceNotes: [
      {
        heroName: 'Juno',
        status: 'ปรับรูปแบบ',
        summary: 'ลดความเร็วเคลื่อนที่ของ Orbital Ray ลงเล็กน้อย แต่เพิ่มระยะยิงของ Pulsar Torpedoes',
      },
      {
        heroName: 'D.Va',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เพิ่มความเร็วการฟื้นฟู Defense Matrix 10% เหมาะกับการรับมือคอมพ์สไนเปอร์และสแปม',
      },
    ],
    countersByHero: BASE_COUNTERS,
  },
];

export const SIMULATED_META_UPDATES: Array<{
  version: string;
  summary: string;
  balanceNotes: PatchMetaSnapshot['balanceNotes'];
  extraCounters: Record<string, CounterMatchup[]>;
}> = [
  {
    version: '2026 Meta — Mid-Season Reloaded',
    summary:
      'อัปเดตเมต้าใหม่! บัฟ Zarya และ Ramattra ให้คุมพื้นที่แข็งขึ้น พร้อมปรับตัวแก้ทาง Support Sombra และ Kiriko ใน SEA Meta',
    balanceNotes: [
      {
        heroName: 'Zarya',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เพิ่มระยะลำแสงเลเซอร์จาก 15 เมตร เป็น 16.5 เมตร ชนะไฟต์ปะทะตรงหน้าได้ดีขึ้น',
      },
      {
        heroName: 'Cassidy',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'ลดคูลดาวน์ Flashbang เพื่อรับมือ Support Sombra และ Tracer ได้ดียิ่งขึ้น',
      },
      {
        heroName: 'Ashe',
        status: 'เนิร์ฟ (ลดความแรง)',
        summary: 'เพิ่มเวลาบรรจุกระสุนเล็กน้อย แต่ยังคงเป็น Hitscan หลักสำหรับส่องตัวบิน',
      },
    ],
    extraCounters: {
      kiriko: [
        { counterHeroId: 'sombra', reason: 'Support Sombra ยิงตัดจังหวะและ Hack ปิด Suzu / Swift Step ได้ขาดลอย' },
        { counterHeroId: 'winston', reason: 'กดดัน Kiriko แถวหลังต่อเนื่องในแพตช์ใหม่' },
        { counterHeroId: 'tracer', reason: 'บีบคูลดาวน์ Suzu (15 วิ) ได้คุ้มค่าที่สุด' },
        { counterHeroId: 'zarya', reason: 'ฟองสบู่ช่วยล้างสถานะและยืนสู้ในไฟต์ยืดเยื้อได้ดีขึ้นหลังบัฟระยะลำแสง' },
      ],
      mercy: [
        { counterHeroId: 'soldier76', reason: 'ขึ้นแท่น Hitscan อันดับ 1 ในแพตช์นี้สำหรับยิงเก็บ Mercy กลางอากาศ' },
        { counterHeroId: 'cassidy', reason: 'ยิงแม่นระยะกลางเก็บตอน Guardian Angel' },
        { counterHeroId: 'dva', reason: 'บูสต์ไล่ปิด Mercy ได้ไวในไฟต์ที่ทีมศัตรูแยกตำแหน่ง' },
        { counterHeroId: 'ashe', reason: 'ส่องกดดัน Mercy จากระยะไกลทุกมุม' },
      ],
    },
  },
  {
    version: '2026 Meta — Dive Revival',
    summary:
      'เมต้าความเร็วสูง! บัฟ Genji และ Tracer ขณะที่ Widowmaker และ Ana ต้องการการคุ้มกันมากขึ้น',
    balanceNotes: [
      {
        heroName: 'Genji',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เพิ่มความเร็ว Shuriken 8% กดดันแนวหลังสายซุ่มยิงได้ดีมาก',
      },
      {
        heroName: 'Brigitte',
        status: 'บัฟ (เก่งขึ้น)',
        summary: 'เพิ่มพลังชีวิตโล่จาก 250 เป็น 300 หน่วย กลับมาเป็นตัวกัน Dive ที่แข็งแกร่ง',
      },
    ],
    extraCounters: {
      ana: [
        { counterHeroId: 'genji', reason: 'หลังบัฟความเร็ว Shuriken กดดันและล้วง Ana ได้เร็วขึ้นมาก' },
        { counterHeroId: 'winston', reason: 'กางบาเรียตัดฮีลและ Sleep Dart ได้สมบูรณ์' },
        { counterHeroId: 'dva', reason: 'Matrix ดูด Sleep Dart และระเบิด Biotic Grenade' },
        { counterHeroId: 'tracer', reason: 'บังคับใช้สกิลป้องกันตัวแล้วเก็บทันที' },
      ],
    },
  },
];
