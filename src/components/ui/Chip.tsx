/**
 * Chip — M3 чипсет для выбора веса задачи (Quick / Focused / Deep)
 * 
 * Использует:
 * - React Aria для доступности
 * - Tailwind для layout/spacing
 * - tokens.css CSS-переменные для цветов и состояний
 * 
 * Скругление: rounded-md-sm (8px)
 * Hover/pressed: через .md-state-layer из tokens.css
 */

import React, { forwardRef } from 'react';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type WeightType = 'quick' | 'focused' | 'deep';

export interface ChipProps {
    /** Вес задачи */
    weight: WeightType;
    /** Выбран ли чип */
    selected?: boolean;
    /** Обработчик клика */
    onClick?: (weight: WeightType) => void;
    /** Отключён */
    disabled?: boolean;
    /** Дополнительные CSS-классы */
    className?: string;
    /** ARIA label для доступности */
    ariaLabel?: string;
}

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const WEIGHT_CONFIG: Record<WeightType, { label: string; bgClass: string; textClass: string }> = {
    quick: {
        label: 'Quick',
        bgClass: 'bg-flow-quick',
        textClass: 'text-flow-quick-on',
    },
    focused: {
        label: 'Focused',
        bgClass: 'bg-flow-focused',
        textClass: 'text-flow-focused-on',
    },
    deep: {
        label: 'Deep',
        bgClass: 'bg-flow-deep',
        textClass: 'text-flow-deep-on',
    },
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
    ({ weight, selected = false, onClick, disabled = false, className = '', ariaLabel }, ref) => {
        const config = WEIGHT_CONFIG[weight];

        const baseClasses = [
            // Layout & sizing (Tailwind)
            'inline-flex items-center justify-center',
            'h-8 px-3', // 32px height, 12px horizontal padding (M3 chip spec)
            'rounded-md-sm', // 8px border radius
            'text-sm font-semibold', // Label Large
            'transition-colors duration-md-short4 ease-md-standard',
            'cursor-pointer select-none',
            'min-w-[48px]', // Touch target minimum
            'md-state-layer', // M3 state layer overlay

            // State layer requires position relative
            'relative',
            'overflow-hidden',

            // Disabled state
            disabled ? 'opacity-50 cursor-not-allowed' : '',

            // Selected state
            selected ? 'ring-2 ring-primary ring-offset-1' : '',

            // Custom className
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // Background color from tokens
        const bgColorClass = selected
            ? 'bg-primary-container'
            : config.bgClass;

        // Text color from tokens
        const textColorClass = selected
            ? 'text-on-primary-container'
            : config.textClass;

        return (
            <button
                ref={ref}
                role="radio"
                aria-checked={selected}
                aria-label={ariaLabel || `${config.label} weight`}
                disabled={disabled}
                className={`${baseClasses} ${bgColorClass} ${textColorClass}`}
                onClick={() => !disabled && onClick?.(weight)}
            >
                {config.label}
            </button>
        );
    }
);

Chip.displayName = 'Chip';

// ─────────────────────────────────────────────────────────────
// ChipGroup — радио-группа для выбора одного веса
// ─────────────────────────────────────────────────────────────

export interface ChipGroupProps {
    /** Текущий выбранный вес */
    value?: WeightType;
    /** Обработчик изменения */
    onChange?: (weight: WeightType) => void;
    /** Отключена ли вся группа */
    disabled?: boolean;
    /** Дополнительные CSS-классы */
    className?: string;
    /** ARIA label для группы */
    ariaLabel?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
    value,
    onChange,
    disabled = false,
    className = '',
    ariaLabel = 'Select task weight',
}) => {
    const weights: WeightType[] = ['quick', 'focused', 'deep'];

    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={`inline-flex gap-2 ${className}`}
        >
            {weights.map((weight) => (
                <Chip
                    key={weight}
                    weight={weight}
                    selected={value === weight}
                    onClick={onChange}
                    disabled={disabled}
                    ariaLabel={`${WEIGHT_CONFIG[weight].label} weight`}
                />
            ))}
        </div>
    );
};