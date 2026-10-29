import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const TrophyIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" />
  </svg>
);

export const UsersIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
  </svg>
);

export const ClockIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const LogoutIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...stroke({ strokeWidth: 3, ...p })}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <rect x="6" y="4.5" width="4.2" height="15" rx="1" />
    <rect x="13.8" y="4.5" width="4.2" height="15" rx="1" />
  </svg>
);

export const VolumeIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M4 9h4l5-4v14l-5-4H4z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
  </svg>
);

export const MuteIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M4 9h4l5-4v14l-5-4H4z" />
    <path d="M17 9l5 6M22 9l-5 6" />
  </svg>
);

export const SwapIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);

export const FlagIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M5 21V4h11l-2 4 2 4H5" />
  </svg>
);

export const PenIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...stroke(p)}>
    <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
  </svg>
);
