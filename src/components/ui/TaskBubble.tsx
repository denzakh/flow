import React from 'react';

interface TaskBubbleProps {
    weight: 'quick' | 'focused' | 'deep';
    priority: 'low' | 'medium' | 'high';
    title: string;
}

const TaskBubble: React.FC<TaskBubbleProps> = ({ weight, priority, title }) => {
    // Size classes based on weight
    const sizeClasses = {
        quick: 'w-[60px] h-[60px]',
        focused: 'w-[90px] h-[90px]',
        deep: 'w-[114px] h-[114px]'
    };

    // Background and text color classes
    const bgColor = `bg-[var(--flow-weight-${weight})]`;
    const textColor = `text-[var(--flow-weight-${weight}-on)]`;

    // Shape classes based on priority
    const shapeClasses = {
        low: 'rounded-full',
        medium: 'rounded-3xl',
        high: ''
    };

    const baseClasses = 'flex items-center justify-center cursor-pointer select-none';

    if (priority === 'high') {
        return (
            <div
                className={`${baseClasses} ${sizeClasses[weight]} ${bgColor} ${textColor}`}
                style={{
                    clipPath: 'polygon(50% 0%, 79% 5%, 95% 21%, 100% 50%, 95% 79%, 79% 95%, 50% 100%, 21% 95%, 5% 79%, 0% 50%, 5% 21%, 21% 5%)'
                }}
                aria-label={title}
            >
                <span className="text-xs font-medium text-center px-1">{title}</span>
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${sizeClasses[weight]} ${bgColor} ${textColor} ${shapeClasses[priority]}`}
            aria-label={title}
        >
            <span className="text-xs font-medium text-center px-1">{title}</span>
        </div>
    );
};

export default TaskBubble;