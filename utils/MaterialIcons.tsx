/**
 * Material Symbols Light Icons - SVG Version
 * SVG иконки вместо шрифта для надёжности
 */

import React from 'react';

export interface IconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const iconBaseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Time & Navigation
export const Refresh = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

export const Sparkles = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M9 5H5" />
    <path d="M19 17v4" />
    <path d="M15 19h4" />
  </svg>
);

export const Settings = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Bell = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const Sun = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const Moon = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const Plus = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const Check = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const X = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const ChevronLeft = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ChevronUp = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const ChevronDown = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Calendar = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const Clock = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Repeat = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
);

export const Zap = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Target = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const Layers = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
);

export const Trash2 = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

export const Edit2 = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const Save = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    <path d="M17 21v-8H7v8" />
    <path d="M7 3v5h8" />
  </svg>
);

export const MoreHorizontal = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const ArrowRight = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const Heart = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const Star = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const AlertCircle = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export const LayoutGrid = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

export const StickyNote = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" />
    <path d="M15 3v4a2 2 0 0 0 2 2h4" />
  </svg>
);

export const RotateCcw = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const Chrome = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" x2="12" y1="8" y2="8" />
    <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
    <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
  </svg>
);

export const Person = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

export const User = Person;
export const UserCircle = Person;

export const Mail = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const Lock = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const LogOut = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

export const Search = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const CloudMoon = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
    <path d="M13 11a4 4 0 1 1 0 8h-2a4 4 0 0 1 0-8Z" />
  </svg>
);

export const SunDim = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 4h.01" />
    <path d="M20 12h.01" />
    <path d="M12 20h.01" />
    <path d="M4 12h.01" />
    <path d="M17.657 6.343h.01" />
    <path d="M17.657 17.657h.01" />
    <path d="M6.343 17.657h.01" />
    <path d="M6.343 6.343h.01" />
  </svg>
);

export const BedDouble = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M2 20v-8h20v8" />
    <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" />
    <path d="M12 4v6" />
    <path d="M2 18h20" />
  </svg>
);

export const Menu = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

export const ExpandMore = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ExpandLess = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m18 15-6-6-6 6" />
  </svg>
);

export const Fullscreen = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

export const Send = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const Message = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const Folder = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

export const File = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
);

export const Image = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const Done = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const MoreVertical = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export const ArrowBack = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const ArrowForward = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const Notifications = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const Alarm = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 2" />
    <path d="M5 3 2 6" />
    <path d="m22 6-3-3" />
    <path d="M6.38 18.7 4 21" />
    <path d="M17.64 18.67 20 21" />
  </svg>
);

export const Schedule = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const Today = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export const Home = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const Login = ({ size = 24, className = '', style }: IconProps) => (
  <svg {...iconBaseProps} width={size} height={size} className={className} style={style}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);

export const Close = X;
export const Delete = Trash2;
export const MoreHoriz = MoreHorizontal;
