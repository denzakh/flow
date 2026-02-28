/**
 * FLOW UI Kit - Атомарные компоненты
 * Базовые UI-элементы с единым дизайном
 */

import React from 'react';
import { 
  buttonBaseStyles, 
  buttonPrimaryStyles, 
  buttonSecondaryStyles,
  inputBaseStyles,
  getTouchTargetStyles,
  transitionsPresets,
} from '../utils/design-utils';
import { colors, radius, spacing, typography } from '../design-tokens';

/* ──────────────────────────────────────────────────────────────────────────
   BUTTON COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  style,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: { 
      padding: `${spacing.sm} ${spacing.lg}`, 
      fontSize: typography.fontSize.sm,
      minHeight: '36px',
    },
    md: { 
      padding: `${spacing.md} ${spacing.xl}`, 
      fontSize: typography.fontSize.base,
      minHeight: '44px',
    },
    lg: { 
      padding: `${spacing.lg} ${spacing['2xl']}`, 
      fontSize: typography.fontSize.lg,
      minHeight: '52px',
    },
  };

  const variantStyles = {
    primary: buttonPrimaryStyles,
    secondary: {
      ...buttonSecondaryStyles,
      borderColor: disabled ? colors.border.default : colors.border.default,
    },
    ghost: {
      ...buttonBaseStyles,
      background: 'transparent',
      color: colors.text.primary,
    },
    danger: {
      ...buttonBaseStyles,
      background: colors.state.error,
      color: colors.priority.high.primary,
      border: `1px solid ${colors.priority.high.border}`,
    },
  };

  const baseStyles: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    opacity: disabled || isLoading ? 0.5 : 1,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    ...style,
  };

  return (
    <button
      className={className}
      style={baseStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin"
          style={{ width: '16px', height: '16px' }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.25"
          />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <>
          {leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
          {children}
          {rightIcon && <span style={{ display: 'flex' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   INPUT COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hasGradient?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  hasGradient = false,
  style,
  className = '',
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    ...inputBaseStyles,
    paddingLeft: leftIcon ? '56px' : '24px',
    paddingRight: rightIcon ? '56px' : '24px',
    height: '66px',
    ...style,
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} className={className}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.bold,
            letterSpacing: typography.letterSpacing.wide,
            textTransform: 'uppercase',
            color: colors.text.secondary,
            marginBottom: spacing.sm,
          }}
        >
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.text.tertiary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          style={hasGradient ? {} : baseStyles}
          className={hasGradient ? 'input-field input-gradient' : ''}
          {...props}
        />
        
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.text.tertiary,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p
          style={{
            fontSize: typography.fontSize.xs,
            color: colors.priority.high.primary,
            marginTop: spacing.sm,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   CARD COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'dashed';
  padding?: keyof typeof spacing;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'xl',
  onClick,
  className = '',
  style,
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: colors.bg.card,
      borderRadius: radius['2xl'],
      border: `1px solid ${colors.border.default}`,
    },
    elevated: {
      background: colors.bg.elevated,
      borderRadius: radius['2xl'],
      border: `1px solid ${colors.border.default}`,
      boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
    },
    glass: {
      background: colors.bg.glassCard,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: radius['2xl'],
      border: `1px solid ${colors.border.default}`,
      boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
    },
    dashed: {
      background: 'transparent',
      borderRadius: radius['2xl'],
      border: `2px dashed ${colors.border.dashed}`,
    },
  };

  return (
    <div
      className={className}
      style={{
        ...variantStyles[variant],
        padding: spacing[padding],
        cursor: onClick ? 'pointer' : 'default',
        transition: variant === 'default' || variant === 'glass' 
          ? 'background-color 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' 
          : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   BADGE COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'quick' | 'focused' | 'deep' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'focused',
  size = 'md',
  className = '',
}) => {
  const colorMap = {
    quick: { bg: colors.weight.quick.bg, color: colors.weight.quick.primary, border: colors.weight.quick.border },
    focused: { bg: colors.weight.focused.bg, color: colors.weight.focused.primary, border: colors.weight.focused.border },
    deep: { bg: colors.weight.deep.bg, color: colors.weight.deep.primary, border: colors.weight.deep.border },
    high: { bg: colors.priority.high.bg, color: colors.priority.high.primary, border: colors.priority.high.border },
    medium: { bg: colors.priority.medium.bg, color: colors.priority.medium.primary, border: colors.priority.medium.border },
    low: { bg: colors.priority.low.bg, color: colors.priority.low.primary, border: colors.priority.low.border },
  };

  const sizeStyles = {
    sm: {
      padding: `${spacing.xs} ${spacing.sm}`,
      fontSize: typography.fontSize.xs,
    },
    md: {
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: typography.fontSize.sm,
    },
  };

  const colors_variant = colorMap[variant];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors_variant.bg,
        color: colors_variant.color,
        border: `1px solid ${colors_variant.border}`,
        borderRadius: radius.full,
        fontWeight: typography.fontWeight.bold,
        ...sizeStyles[size],
      }}
    >
      {children}
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   EMPTY STATE COMPONENT
   ────────────────────────────────────────────────────────────────────────── */

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing['4xl'],
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: radius.full,
          background: colors.bg.elevated,
          border: `1px solid ${colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.lg,
          color: colors.text.secondary,
        }}
      >
        {icon}
      </div>
      
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: typography.fontWeight.normal,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {title}
      </h3>
      
      {description && (
        <p
          style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            marginBottom: spacing.lg,
          }}
        >
          {description}
        </p>
      )}
      
      {action && <div>{action}</div>}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   DIVIDER COMPONENT
   ────────────────────────────────────────────────────────────────────────── */

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.border.default,
        opacity: 0.5,
        ...(orientation === 'horizontal'
          ? { height: '1px', width: '100%', ...style }
          : { width: '1px', height: '100%', ...style }),
        ...style,
      }}
    />
  );
};
