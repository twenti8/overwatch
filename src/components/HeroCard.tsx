import type { Hero } from '../types/meta';
import { HeroAvatar } from './HeroAvatar';

interface HeroCardProps {
  hero: Hero;
  isSelected: boolean;
  portraitOverride?: string;
  onToggle: (heroId: string) => void;
}

export function HeroCard({
  hero,
  isSelected,
  portraitOverride,
  onToggle,
}: HeroCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(hero.id)}
      aria-pressed={isSelected}
      aria-label={`${hero.name} (${hero.role})${isSelected ? ' — เลือกอยู่' : ''}`}
      className={`group flex flex-col items-center rounded-2xl bg-white px-3 py-4 text-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] ${
        isSelected
          ? 'border-2 border-[#60A5FA] shadow-[0_0_0_4px_rgba(147,197,253,0.4)] bg-sky-50/40'
          : 'border border-[#E2E8F0] shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:border-sky-300 hover:shadow-md'
      }`}
    >
      <HeroAvatar hero={hero} size="card" portraitOverride={portraitOverride} />

      <span className="mt-3 text-sm font-bold text-[#1E293B] leading-tight truncate max-w-full">
        {hero.name}
      </span>

      <span className="mt-0.5 text-xs font-medium text-slate-400">{hero.role}</span>
    </button>
  );
}
