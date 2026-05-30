/**
 * Switch — M3 переключатель для настроек
 * 
 * Использует:
 * - React Aria для доступности (useSwitch)
 * - Tailwind для layout/spacing
 * - tokens.css CSS-переменные для цветов и анимаций
 * 
 * Активное состояние: bg-primary
 * Плавная анимация тумблера через CSS transitions
 */

import React, { forwardRef } from 'react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SwitchProps {
    /** Выключен ли переключатель */
    checked?: boolean;
    /** Обработчик изменения */
    onCheckedChange?: (checked: boolean) => void;
    /** Отключён */
    disabled?: boolean;
    /** Дополнительные CSS-классы */
    className?: string;
    /** ARIA label для доступности */
    ariaLabel?: string;
    /** ID для связи с label */
    id?: string;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
    ({ checked = false, onCheckedChange, disabled = false, className = '', ariaLabel, id }, ref) => {
        const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!disabled) {
                    onCheckedChange?.(!checked);
                }
            }
        };

        const baseClasses = [
            // Layout & sizing
            'relative inline-flex items-center',
            'w-14 h-7', // 56x28px — M3 switch spec
            'rounded-md-full', // 9999px — full radius pill shape

            // Colors from tokens
            'bg-outline-variant', // Default: outline-variant color
            'transition-colors duration-md-short4 ease-md-standard',

            // States
            'cursor-pointer',
            'focus-visible:outline-none',
            'focus-visible:ring-2',
            'focus-visible:ring-primary',
            'focus-visible:ring-offset-2',
            'focus-visible:ring-offset-background',

            // Disabled
            disabled ? 'opacity-50 cursor-not-allowed' : '',

            // Custom className
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // Active state color
        const activeBgClass = checked ? 'bg-primary' : '';

        // Thumb classes
        const thumbClasses = [
            // Layout & sizing
            'absolute top-0.5', // 2px from top
            'w-6 h-6', // 24x24px thumb
            'rounded-md-full', // Full radius circle

            // Color from tokens
            'bg-on-primary', // on-primary color (white in dark theme)

            // Animation
            'transition-all duration-md-short4 ease-md-standard',

            // Position
            checked ? 'left-7' : 'left-0.5', // 28px when checked, 2px when unchecked
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                id={id}
                role="switch"
                aria-checked={checked}
                aria-label={ariaLabel}
                disabled={disabled}
                className={`${baseClasses} ${activeBgClass}`}
                onClick={() => !disabled && onCheckedChange?.(!checked)}
                onKeyDown={handleKeyDown}
            >
                <span className={thumbClasses} />
            </button>
        );
    }
);

Switch.displayName = 'Switch';

// ─────────────────────────────────────────────────────────────
// SwitchItem — переключатель с label (для настроек)
// ─────────────────────────────────────────────────────────────

export interface SwitchItemProps extends SwitchProps {
    /** Текст метки */
    label: string;
    /** Описание (опционально) */
    description?: string;
}

export const SwitchItem: React.FC<SwitchItemProps> = ({
    label,
    description,
    id,
    ...switchProps
}) => {
    const switchId = id || `switch-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex flex-col gap-1">
                <label
                    htmlFor={switchId}
                    className="text-body-medium font-medium text-on-surface cursor-pointer"
                >
                    {label}
                </label>
                {description && (
                    <p className="text-body-small text-on-surface-variant">
                        {description}
                    </p>
                )}
            </div>
            <Switch id={switchId} ariaLabel={label} {...switchProps} />
        </div>
    );
};