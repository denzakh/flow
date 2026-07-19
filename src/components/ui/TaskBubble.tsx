import React from 'react';
import { User } from 'lucide-react';

interface TaskBubbleProps {
    weight: 'quick' | 'focused' | 'deep';
    priority: 'low' | 'medium' | 'high';
    title: string;
}

const sizeMap: Record<TaskBubbleProps['weight'], number> = {
    quick: 56,
    focused: 84,
    deep: 120,
};

// SVG path from Figma component scaled to objectBoundingBox (0-1 range)
// Original dimensions: 114x114
const COOKIE_PATH = "M0.50000,0.04000 C0.53580,0.04000 0.56908,0.08887 0.60741,0.09914 C0.64574,0.10941 0.69899,0.08373 0.73000,0.10163 C0.76101,0.11953 0.76539,0.17849 0.79345,0.20655 C0.82151,0.23461 0.88047,0.23899 0.89837,0.27000 C0.91627,0.30101 0.89059,0.35426 0.90086,0.39259 C0.91113,0.43092 0.96000,0.46420 0.96000,0.50000 C0.96000,0.53580 0.91113,0.56908 0.90086,0.60741 C0.89059,0.64574 0.91627,0.69899 0.89837,0.73000 C0.88047,0.76101 0.82151,0.76539 0.79345,0.79345 C0.76539,0.82151 0.76101,0.88047 0.73000,0.89837 C0.69899,0.91627 0.64574,0.89059 0.60741,0.90086 C0.56908,0.91113 0.53580,0.96000 0.50000,0.96000 C0.46420,0.96000 0.43092,0.91113 0.39259,0.90086 C0.35426,0.89059 0.30101,0.91627 0.27000,0.89837 C0.23899,0.88047 0.23461,0.82151 0.20655,0.79345 C0.17849,0.76539 0.11953,0.76101 0.10163,0.73000 C0.08373,0.69899 0.10941,0.64574 0.09914,0.60741 C0.08887,0.56908 0.04000,0.53580 0.04000,0.50000 C0.04000,0.46420 0.08887,0.43092 0.09914,0.39259 C0.10941,0.35426 0.08373,0.30101 0.10163,0.27000 C0.11953,0.23899 0.17849,0.23461 0.20655,0.20655 C0.23461,0.17849 0.23899,0.11953 0.27000,0.10163 C0.30101,0.08373 0.35426,0.10941 0.39259,0.09914 C0.43092,0.08887 0.46420,0.04000 0.50000,0.04000 Z";

const TaskBubble: React.FC<TaskBubbleProps> = ({ weight, priority, title }) => {
    const size = sizeMap[weight];
    const bg = `var(--flow-weight-${weight}-color)`;
    const fg = `var(--flow-weight-${weight}-on-color)`;

    if (priority === 'high') {
        return (
            <div
                className="shrink-0 flex items-center justify-center"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: bg,
                    clipPath: 'url(#cookie-shape)',
                    position: 'relative',
                }}
                aria-label={title}
                title={title}
            >
                <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
                    <defs>
                        <clipPath id="cookie-shape" clipPathUnits="objectBoundingBox">
                            <path d={COOKIE_PATH} />
                        </clipPath>
                    </defs>
                </svg>
                <svg
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'visible',
                        pointerEvents: 'none',
                    }}
                    viewBox="0 0 1 1"
                    preserveAspectRatio="none"
                >
                    <path
                        d={COOKIE_PATH}
                        fill="none"
                        stroke={fg}
                        strokeWidth="0.05"
                    />
                </svg>
                <User
                    className="w-6 h-6"
                    style={{ color: fg }}
                />
            </div>
        );
    }

    const shapeClass = priority === 'low' ? 'rounded-full' : 'rounded-3xl';

    return (
        <div
            className={`shrink-0 flex items-center justify-center border-2 overflow-hidden ${shapeClass}`}
            style={{
                width: size,
                height: size,
                backgroundColor: bg,
                borderColor: fg,
            }}
            aria-label={title}
            title={title}
        >
            <User
                className="w-6 h-6"
                style={{ color: fg }}
            />
        </div>
    );
};

export default TaskBubble;