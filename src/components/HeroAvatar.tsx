import { useEffect, useState } from 'react';
import type { Hero } from '../types/meta';

interface HeroAvatarProps {
  hero: Hero;
  size: 'card' | 'pill';
  portraitOverride?: string;
}

function IllustratedPortraitSvg({
  hero,
  uid,
}: {
  hero: Hero;
  uid: string;
}) {
  const bgId = `bg-${uid}`;
  const helmetId = `helmet-${uid}`;

  // Custom bespoke character illustrations for special heroes
  if (hero.id === 'jetpack_cat') {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
          <radialGradient id={helmetId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
            <stop offset="65%" stopColor="#BAE6FD" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <rect width="80" height="80" fill={`url(#${bgId})`} />
        {/* Stars */}
        <circle cx="14" cy="16" r="1.5" fill="#FEF08A" />
        <circle cx="67" cy="14" r="1.8" fill="#FFFFFF" opacity="0.85" />
        <circle cx="64" cy="58" r="1.2" fill="#BAE6FD" />
        {/* Jetpack thrusters & exhaust */}
        <rect x="12" y="42" width="12" height="24" rx="4" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="56" y="42" width="12" height="24" rx="4" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
        <path d="M15 66l3 10 3-10zM59 66l3 10 3-10z" fill="#FB923C" />
        <path d="M16.5 66l1.5 6 1.5-6zM60.5 66l1.5 6 1.5-6z" fill="#FEF08A" />
        {/* Suit body */}
        <path d="M20 80c0-13 9-20 20-20s20 7 20 20H20z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="31" y="64" width="18" height="8" rx="3" fill="#EA580C" />
        {/* Cat ears */}
        <path d="M25 32L21 15l13 8z" fill="#FB923C" stroke="#9A3412" strokeWidth="1.3" />
        <path d="M55 32l4-17-13 8z" fill="#FB923C" stroke="#9A3412" strokeWidth="1.3" />
        <path d="M26 29l-2-10 8 5z" fill="#FDBA74" />
        <path d="M54 29l2-10-8 5z" fill="#FDBA74" />
        {/* Cat head */}
        <ellipse cx="40" cy="40" rx="18" ry="16" fill="#FB923C" stroke="#9A3412" strokeWidth="1.4" />
        {/* Tabby stripes */}
        <path d="M36 25l2 6M40 24v7M44 25l-2 6" stroke="#C2410C" strokeWidth="2" strokeLinecap="round" />
        {/* Pilot goggles */}
        <rect x="24" y="29" width="14" height="10" rx="4" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="42" y="29" width="14" height="10" rx="4" fill="#1E293B" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="38" y1="34" x2="42" y2="34" stroke="#E2E8F0" strokeWidth="2" />
        <circle cx="31" cy="34" r="2.8" fill="#38BDF8" />
        <circle cx="49" cy="34" r="2.8" fill="#38BDF8" />
        <circle cx="32" cy="33" r="1" fill="#FFFFFF" />
        <circle cx="50" cy="33" r="1" fill="#FFFFFF" />
        {/* Muzzle & whiskers */}
        <ellipse cx="40" cy="46" rx="8" ry="6" fill="#FFEDD5" />
        <polygon points="38,44 42,44 40,46.5" fill="#F43F5E" />
        <path d="M37 48c1.5 1.8 4.5 1.8 6 0" fill="none" stroke="#9A3412" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M23 43l8 1.5M23 47l8-.5M57 43l-8 1.5M57 47l-8-.5" stroke="#FFF7ED" strokeWidth="1.1" strokeLinecap="round" />
        {/* Space dome glass helmet */}
        <circle cx="40" cy="39" r="24" fill={`url(#${helmetId})`} stroke="#E0F2FE" strokeWidth="2" />
        <path d="M24 23c4-4 10-6 15-5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      </svg>
    );
  }

  if (hero.id === 'mizuki') {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" fill={`url(#${bgId})`} />
        {/* Mystic spirit halo */}
        <circle cx="40" cy="36" r="26" fill="none" stroke="#BAE6FD" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.65" />
        {/* Shrine robe & scarf */}
        <path d="M16 80c2-14 11-21 24-21s22 7 24 21H16z" fill="#0F172A" />
        <path d="M26 60l14 14 14-14" fill="#F8FAFC" />
        <path d="M32 62l8 10 8-10" fill="#EF4444" />
        {/* Back hair */}
        <path d="M20 34c0-13 9-22 20-22s20 9 20 22v22c-4-4-7-5-7-5H27s-3 1-7 5V34z" fill="#1E293B" />
        {/* Neck & Face */}
        <rect x="35" y="48" width="10" height="12" rx="4" fill="#FDE6D8" />
        <path d="M25 36c0-10 7-17 15-17s15 7 15 17c0 10-6 17-15 17s-15-7-15-17z" fill="#FDE6D8" />
        {/* Anime eyes */}
        <ellipse cx="33" cy="38" rx="3.2" ry="3.8" fill="#0284C7" />
        <ellipse cx="47" cy="38" rx="3.2" ry="3.8" fill="#0284C7" />
        <circle cx="34" cy="37" r="1.2" fill="#FFFFFF" />
        <circle cx="48" cy="37" r="1.2" fill="#FFFFFF" />
        <path d="M29 34l7 1M44 35l7-1" stroke="#1E293B" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M37 47c2 1.2 4 1.2 6 0" fill="none" stroke="#BE123C" strokeWidth="1.3" strokeLinecap="round" />
        {/* Front swept hair */}
        <path d="M23 36c2-12 10-19 17-19s15 7 17 19c-4-7-9-11-17-11s-13 4-17 11z" fill="#0F172A" />
        <path d="M27 25l6 12M53 25l-6 12" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Fox shrine mask ornament */}
        <path d="M30 17l4-6 6 4 6-4 4 6c-3 5-17 5-20 0z" fill="#F8FAFC" stroke="#EF4444" strokeWidth="1.4" />
        <circle cx="40" cy="18" r="2" fill="#EF4444" />
      </svg>
    );
  }

  if (hero.id === 'wuyang') {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#0F766E" />
          </linearGradient>
        </defs>
        <rect width="80" height="80" fill={`url(#${bgId})`} />
        {/* Hydro ring */}
        <circle cx="40" cy="39" r="28" fill="none" stroke="#99F6E4" strokeWidth="1.5" opacity="0.45" />
        {/* Armored collar */}
        <path d="M14 80c3-14 12-22 26-22s23 8 26 22H14z" fill="#0F172A" />
        <path d="M24 62l16 10 16-10" fill="none" stroke="#14B8A6" strokeWidth="3" strokeLinejoin="round" />
        {/* Head */}
        <rect x="35" y="48" width="10" height="11" rx="4" fill="#F3D2BD" />
        <path d="M25 35c0-10 6.5-17 15-17s15 7 15 17c0 10-6 17-15 17s-15-7-15-17z" fill="#F3D2BD" />
        {/* Styled hair */}
        <path d="M23 36c0-14 8-22 17-22 11 0 18 8 17 22-4-6-9-10-17-10-8 0-13 4-17 10z" fill="#0F172A" />
        <path d="M35 16l8-4-2 8" fill="#1E293B" />
        {/* Glowing emerald tactical visor */}
        <path d="M26 33h28l-3 8H29l-3-8z" fill="#0F172A" stroke="#5EEAD4" strokeWidth="1.5" />
        <path d="M29 36h22l-1.5 3.5h-19L29 36z" fill="#2DD4BF" />
        {/* Confident expression */}
        <path d="M36 46c2.5 1.4 5.5 1.4 8 0" fill="none" stroke="#9A3412" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }

  // Generic rich character portrait illustration tailored by archetype & hero palette
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hero.accentFrom} />
          <stop offset="100%" stopColor={hero.accentTo} />
        </linearGradient>
      </defs>
      <rect width="80" height="80" fill={`url(#${bgId})`} />
      {/* Subtle tactical backdrop ring */}
      <circle cx="40" cy="36" r="27" fill="#FFFFFF" fillOpacity="0.12" />
      <circle cx="40" cy="36" r="21" fill="none" stroke="#FFFFFF" strokeOpacity="0.24" strokeWidth="1.2" />

      {/* Shoulders / Armor Bust */}
      <path
        d="M14 80c2.5-14 12-22 26-22s23.5 8 26 22H14z"
        fill="#0F172A"
        fillOpacity="0.82"
      />
      <path
        d="M27 60l13 11 13-11"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Neck & Stylized Character Head */}
      <rect x="35" y="47" width="10" height="12" rx="4" fill="#F8FAFC" fillOpacity="0.9" />
      <path
        d="M25 35c0-10 6.8-17 15-17s15 7 15 17c0 10-6 17-15 17s-15-7-15-17z"
        fill="#F8FAFC"
        fillOpacity="0.94"
      />

      {/* Archetype Headgear / Visor / Hair */}
      {hero.archetype === 'mech' || hero.archetype === 'shield' ? (
        <>
          <path d="M22 36c0-13 8-22 18-22s18 9 18 22v5H22v-5z" fill="#1E293B" />
          <rect x="27" y="31" width="26" height="8" rx="3.5" fill={hero.accentFrom} stroke="#FFFFFF" strokeWidth="1.2" />
          <path d="M40 12v8" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ) : hero.archetype === 'sniper' || hero.archetype === 'flank' ? (
        <>
          <path d="M21 37c1-14 9-23 19-23s18 9 19 23c-5-7-11-11-19-11s-14 4-19 11z" fill="#0F172A" />
          <circle cx="33" cy="36" r="3" fill={hero.accentTo} />
          <circle cx="47" cy="36" r="3.6" fill="#0F172A" stroke={hero.accentFrom} strokeWidth="1.6" />
          <circle cx="47" cy="36" r="1.4" fill="#38BDF8" />
        </>
      ) : hero.archetype === 'aerial' || hero.archetype === 'mystic' ? (
        <>
          <path d="M22 34c2-12 9-19 18-19s16 7 18 19c-4-5-10-8-18-8s-14 3-18 8z" fill="#1E293B" />
          <path d="M28 21l12-5 12 5" fill="none" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="33" cy="36" r="2.4" fill="#1E293B" />
          <circle cx="47" cy="36" r="2.4" fill="#1E293B" />
          <path d="M36 45c2.5 1.5 5.5 1.5 8 0" fill="none" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M23 34c1.5-11 8.5-18 17-18s15.5 7 17 18c-4-4.5-10-7-17-7s-13 2.5-17 7z" fill="#1E293B" />
          <rect x="26" y="32" width="28" height="7" rx="3" fill="#0F172A" />
          <rect x="29" y="34" width="22" height="3" rx="1.5" fill={hero.accentFrom} />
          <path d="M36 45.5c2.5 1.3 5.5 1.3 8 0" fill="none" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function HeroAvatar({ hero, size, portraitOverride }: HeroAvatarProps) {
  const activeSrc = portraitOverride || hero.portraitUrl;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [activeSrc]);

  const showImg = Boolean(activeSrc) && !imgError;

  if (size === 'pill') {
    return (
      <span
        className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-1 ring-white/70 overflow-hidden select-none shadow-xs"
        aria-hidden="true"
      >
        {showImg ? (
          <img
            src={activeSrc}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <IllustratedPortraitSvg hero={hero} uid={`pill-${hero.id}`} />
        )}
      </span>
    );
  }

  return (
    <div
      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-inset ring-slate-900/10 overflow-hidden select-none shadow-xs"
      aria-hidden="true"
    >
      {showImg ? (
        <img
          src={activeSrc}
          alt=""
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-16 w-16 rounded-xl object-cover"
        />
      ) : (
        <IllustratedPortraitSvg hero={hero} uid={`card-${hero.id}`} />
      )}
    </div>
  );
}
