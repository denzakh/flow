/**
 * Flow Design System 2.0 — Компоненты для основного приложения
 * Glassmorphism 2.0, Hover Lift, Inner Glow эффекты
 */

import React from 'react';
import { colors, spacing, radius, shadows } from '../../design-tokens';

/* ──────────────────────────────────────────────────────────────────────────
   GLASS CARD 2.0
   ────────────────────────────────────────────────────────────────────────── */

export interface GlassCard2Props {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'active' | 'dashed';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const GlassCard2: React.FC<GlassCard2Props> = ({
  children,
  variant = 'default',
  className = '',
  style,
  onClick,
}) => {
  const variantStyles = {
    default: {
      background: 'rgba(20, 20, 20, 0.65)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    elevated: {
      background: 'rgba(26, 26, 26, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      boxShadow: shadows.glowSubtle,
    },
    active: {
      background: 'rgba(20, 20, 20, 0.7)',
      border: '1px solid rgba(212, 165, 116, 0.4)',
      boxShadow: shadows.glowEvening,
    },
    dashed: {
      background: 'transparent',
      border: '2px dashed rgba(255, 255, 255, 0.3)',
    },
  };

  return (
    <div
      className={`glass-card-2 ${className}`}
      style={{
        ...variantStyles[variant],
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: radius['2xl'],
        padding: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          pointerEvents: 'none',
          borderRadius: radius['2xl'],
        }}
      />
      
      {/* Inner highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   BADGE 2.0
   ────────────────────────────────────────────────────────────────────────── */

export interface Badge2Props {
  children: React.ReactNode;
  variant?: 'quick' | 'focused' | 'deep' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge2: React.FC<Badge2Props> = ({
  children,
  variant = 'focused',
  size = 'md',
  animated = false,
  className = '',
  style,
}) => {
  const colorMap = {
    quick: { bg: 'rgba(52, 211, 153, 0.1)', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)' },
    focused: { bg: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
    deep: { bg: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', border: 'rgba(167, 139, 250, 0.3)' },
    high: { bg: 'rgba(248, 113, 113, 0.1)', color: '#f87171', border: 'rgba(248, 113, 113, 0.3)' },
    medium: { bg: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
    low: { bg: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
  };

  const sizeStyles = {
    sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: '10px' },
    md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: '12px' },
  };

  const colorsVariant = colorMap[variant];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: colorsVariant.bg,
        color: colorsVariant.color,
        border: `1px solid ${colorsVariant.border}`,
        borderRadius: radius.full,
        fontWeight: 700,
        ...sizeStyles[size],
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...(animated && {
          animation: 'badgePulse 2s ease-in-out infinite',
        }),
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   TASK ITEM 2.0 — С HOVER LIFT ЭФФЕКТОМ
   ────────────────────────────────────────────────────────────────────────── */

import { Check, Zap, Target, Layers } from '../../utils/MaterialIcons';
import { Task, TaskWeight, Priority } from '../../types';

export interface TaskItem2Props {
  task: Task;
  completed?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

export const TaskItem2: React.FC<TaskItem2Props> = ({
  task,
  completed = false,
  onToggle,
  onClick,
  className = '',
}) => {
  const weightIcons = {
    quick: Zap,
    focused: Target,
    deep: Layers,
  };

  const weightColors = {
    quick: '#34d399',
    focused: '#60a5fa',
    deep: '#a78bfa',
  };

  const Icon = weightIcons[task.weight];

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.lg,
        padding: spacing.lg,
        background: completed ? 'rgba(20, 20, 20, 0.3)' : colors.bg.card,
        border: `1px solid ${colors.border.default}`,
        borderRadius: radius['2xl'],
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: completed ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Custom Checkbox */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
        style={{
          width: '24px',
          height: '24px',
          borderRadius: radius.md,
          border: `2px solid ${completed ? colors.accent.active : colors.border.default}`,
          background: completed ? colors.accent.active : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
      >
        {completed && <Check size={16} color="#fff" strokeWidth={3} />}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 400,
            color: completed ? colors.text.tertiary : colors.text.primary,
            textDecoration: completed ? 'line-through' : 'none',
            margin: 0,
          }}
        >
          {task.title}
        </p>
      </div>
      
      {/* Weight Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.xs} ${spacing.sm}`,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: radius.full,
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={weightColors[task.weight]} />
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: weightColors[task.weight],
            textTransform: 'uppercase',
          }}
        >
          {task.weight}
        </span>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   HOVER LIFT WRAPPER
   ────────────────────────────────────────────────────────────────────────── */

export interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: 'evening' | 'active' | 'subtle';
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  className = '',
  style,
  glowColor = 'evening',
}) => {
  const glowMap = {
    evening: shadows.glowEvening,
    active: shadows.glowActive,
    subtle: shadows.glowSubtle,
  };

  return (
    <div
      className={className}
      style={{
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = glowMap[glowColor];
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   EMPTY STATE 2.0
   ────────────────────────────────────────────────────────────────────────── */

import { Heart, Calendar, Check } from '../../utils/MaterialIcons';

export interface EmptyState2Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState2: React.FC<EmptyState2Props> = ({
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
        {icon || <Heart size={32} />}
      </div>
      
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 400,
          color: colors.text.primary,
          marginBottom: spacing.sm,
        }}
      >
        {title}
      </h3>
      
      {description && (
        <p
          style={{
            fontSize: '14px',
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

export default {
  GlassCard2,
  Badge2,
  TaskItem2,
  HoverLift,
  EmptyState2,
};
