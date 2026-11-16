interface OverwatchEmblemProps {
  className?: string;
}

export function OverwatchEmblem({ className = 'h-12 w-12' }: OverwatchEmblemProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Top orange tactical arc */}
      <path
        d="M 12.25 13.59 A 27 27 0 0 1 51.75 13.59 L 46.26 18.70 A 19.5 19.5 0 0 0 17.74 18.70 Z"
        fill="#F99E1A"
      />
      {/* Left dark-slate tactical wing */}
      <path
        d="M 10.16 16.13 A 27 27 0 0 0 30.82 58.97 L 30.82 51.46 A 19.5 19.5 0 0 1 23.50 49.50 L 30.82 31.50 L 30.82 18.50 L 16.40 43.70 A 19.5 19.5 0 0 1 16.22 20.54 Z"
        fill="#1E293B"
      />
      {/* Right dark-slate tactical wing */}
      <path
        d="M 53.84 16.13 A 27 27 0 0 1 33.18 58.97 L 33.18 51.46 A 19.5 19.5 0 0 0 40.50 49.50 L 33.18 31.50 L 33.18 18.50 L 47.60 43.70 A 19.5 19.5 0 0 0 47.78 20.54 Z"
        fill="#1E293B"
      />
    </svg>
  );
}
