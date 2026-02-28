/**
 * Flow Design System 2.0 — Interactive Preview
 * Кастомизированная версия по вашим предпочтениям
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, Target, Layers, Sun, SunDim, CloudMoon, Moon,
  Check, Plus, Repeat, Clock, Heart, Sparkles, Refresh,
  Star, Bell
} from '../../utils/MaterialIcons';
import { TaskWeight, TimePeriod, Priority } from '../../types';
import { colors, spacing, radius, typography, shadows } from '../../design-tokens';

/* ──────────────────────────────────────────────────────────────────────────
   КОМПОНЕНТЫ 2.0
   ────────────────────────────────────────────────────────────────────────── */

// Glass 2.0 с noise текстурой
const GlassCard2: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'active';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'default', className = '', onClick }) => {
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
  };

  return (
    <div
      className={`glass-2 ${className}`}
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

// Button 2.0 с spring анимацией
const Button2: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.lg}`, fontSize: typography.fontSize.sm, minHeight: '40px' },
    md: { padding: `${spacing.md} ${spacing.xl}`, fontSize: typography.fontSize.base, minHeight: '48px' },
    lg: { padding: `${spacing.lg} ${spacing['2xl']}`, fontSize: typography.fontSize.lg, minHeight: '56px' },
  };

  const variantStyles = {
    primary: {
      background: colors.bg.primary,
      color: colors.accent.evening,
      border: `1px solid ${colors.accent.evening}`,
      boxShadow: `inset 0 0 20px ${colors.accent.evening}40`, // Inner glow
    },
    secondary: {
      background: 'transparent',
      color: colors.text.primary,
      border: `1px solid ${colors.border.default}`,
    },
    ghost: {
      background: 'transparent',
      color: colors.text.secondary,
      border: 'none',
    },
    gradient: {
      background: `linear-gradient(135deg, ${colors.accent.evening} 0%, ${colors.weight.focused} 100%)`,
      color: colors.text.primary,
      border: 'none',
      boxShadow: `inset 0 0 30px rgba(255, 255, 255, 0.2)`,
    },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isLoading && !disabled) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
      onClick();
    }
  };

  return (
    <button
      className={`btn-2 ${className}`}
      style={{
        ...variantStyles[variant as keyof typeof variantStyles],
        ...sizeStyles[size],
        borderRadius: radius.xl,
        fontWeight: typography.fontWeight.bold,
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.sm,
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.5 : 1,
        transform: isPressed ? 'scale(0.94)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            width: '100px',
            height: '100px',
            left: ripple.x - 50,
            top: ripple.y - 50,
            transform: 'scale(0)',
            animation: 'ripple 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}
      
      {isLoading ? (
        <Refresh size={18} className="animate-spin" />
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

// Input 2.0 с animated gradient border
const Input2: React.FC<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  className?: string;
}> = ({
  label,
  placeholder,
  value,
  onChange,
  leftIcon,
  rightIcon,
  error,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`input-2 ${className}`} style={{ position: 'relative', width: '100%' }}>
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
      
      <div
        className="input-gradient-animated"
        style={{
          position: 'relative',
          borderRadius: radius['2xl'],
        }}
      >
        {/* Animated gradient border */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius['2xl'],
            padding: '1px',
            background: isFocused
              ? `linear-gradient(45deg, ${colors.accent.evening}, ${colors.weight.focused}, ${colors.weight.deep}, ${colors.accent.active}, ${colors.accent.evening})`
              : `linear-gradient(0deg, rgba(43, 72, 172, 0.60) -50.01%, rgba(140, 110, 50, 0.60) 189.97%, rgba(172, 169, 0, 0.60) 289.14%, rgba(255, 255, 255, 0.60) 348.64%)`,
            backgroundSize: isFocused ? '400% 400%' : undefined,
            animation: isFocused ? 'gradientRotate 8s ease infinite' : undefined,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '66px',
            background: colors.bg.primary,
            border: 'none',
            borderRadius: radius['2xl'],
            padding: `0 ${spacing['2xl']}`,
            paddingLeft: leftIcon ? '56px' : spacing['2xl'],
            paddingRight: rightIcon ? '56px' : spacing['2xl'],
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            color: colors.text.primary,
            outline: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        />
        
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: spacing.lg,
              top: '50%',
              transform: 'translateY(-50%)',
              color: isFocused ? colors.text.primary : colors.text.tertiary,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
          >
            {leftIcon}
          </div>
        )}
        
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

// Badge 2.0 — без иконок, только текст (без halo — слишком маленький элемент)
const Badge2: React.FC<{
  children: React.ReactNode;
  variant?: 'quick' | 'focused' | 'deep' | 'high' | 'medium' | 'low';
  size?: 'sm' | 'md';
  animated?: boolean;
  className?: string;
}> = ({
  children,
  variant = 'focused',
  size = 'md',
  animated = false,
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
    sm: { padding: `${spacing.xs} ${spacing.sm}`, fontSize: typography.fontSize.xs },
    md: { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.fontSize.sm },
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
        fontWeight: typography.fontWeight.bold,
        ...sizeStyles[size],
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...(animated && {
          animation: 'badgePulse 2s ease-in-out infinite',
        }),
      }}
    >
      {children}
    </span>
  );
};

// Task Item 2.0 с hover lift
const TaskItem2: React.FC<{
  title: string;
  weight: TaskWeight;
  priority: Priority;
  completed?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
}> = ({ title, weight, priority, completed = false, onToggle, onClick }) => {
  const weightIcons = {
    quick: Zap,
    focused: Target,
    deep: Layers,
  };

  const weightColors = {
    quick: colors.weight.quick.primary,
    focused: colors.weight.focused.primary,
    deep: colors.weight.deep.primary,
  };

  const Icon = weightIcons[weight];

  return (
    <div
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
        }}
      >
        {completed && <Check size={16} color="#fff" strokeWidth={3} />}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.normal,
            color: completed ? colors.text.tertiary : colors.text.primary,
            textDecoration: completed ? 'line-through' : 'none',
            margin: 0,
          }}
        >
          {title}
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
        }}
      >
        <Icon size={14} color={weightColors[weight]} />
        <span
          style={{
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.bold,
            color: weightColors[weight],
            textTransform: 'uppercase',
          }}
        >
          {weight}
        </span>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   PREVIEW SCREEN
   ────────────────────────────────────────────────────────────────────────── */

const DesignPreview2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'effects' | 'typography' | 'colors'>('components');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [timeTheme, setTimeTheme] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('evening');

  // CSS для анимаций
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
        }
      }
      @keyframes gradientRotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes badgePulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const tabs = [
    { id: 'components', label: 'Компоненты', icon: Layers },
    { id: 'effects', label: 'Эффекты', icon: Sparkles },
    { id: 'typography', label: 'Типографика', icon: Target },
    { id: 'colors', label: 'Цвета', icon: Zap },
  ] as const;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.bg.primary,
        padding: spacing['4xl'],
      }}
    >
      {/* Mesh Gradient Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: `
            radial-gradient(at 0% 0%, rgba(212, 165, 116, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(96, 165, 250, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(167, 139, 250, 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%)
          `,
          backgroundSize: '100% 100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing['4xl'] }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.md,
              marginBottom: spacing.lg,
            }}
          >
            <div
              className="animate-float"
              style={{
                width: '64px',
                height: '64px',
                background: `linear-gradient(135deg, ${colors.accent.evening}, ${colors.weight.focused})`,
                borderRadius: radius['2xl'],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: shadows.glowEvening,
              }}
            >
              <Sparkles size={32} color="#fff" />
            </div>
          </div>
          
          <h1
            style={{
              fontSize: typography.fontSize['4xl'],
              fontWeight: typography.fontWeight.light,
              background: `linear-gradient(135deg, ${colors.accent.evening} 0%, ${colors.weight.focused} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: spacing.md,
            }}
          >
            Flow Design System 2.0
          </h1>
          
          <p style={{ color: colors.text.secondary, fontSize: typography.fontSize.lg }}>
            Интерактивный preview обновлённых компонентов
          </p>
        </div>

        {/* Tab Switcher */}
        <GlassCard2 variant="elevated" style={{ marginBottom: spacing['3xl'], padding: spacing.md }}>
          <div
            style={{
              display: 'flex',
              gap: spacing.sm,
              overflowX: 'auto',
              paddingBottom: spacing.sm,
            }}
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    padding: `${spacing.md} ${spacing.xl}`,
                    background: isActive ? colors.accent.active : 'transparent',
                    color: isActive ? colors.text.primary : colors.text.secondary,
                    border: 'none',
                    borderRadius: radius.lg,
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.bold,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </GlassCard2>

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div style={{ display: 'grid', gap: spacing['3xl'] }}>
            {/* Buttons Section */}
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Кнопки 2.0 — Inner Glow
              </h2>
              <GlassCard2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.lg, alignItems: 'center' }}>
                  <Button2 variant="primary">Primary (Glow)</Button2>
                  <Button2 variant="secondary">Secondary</Button2>
                  <Button2 variant="ghost">Ghost</Button2>
                  <Button2 variant="gradient">
                    <Sparkles size={18} />
                    Gradient
                  </Button2>
                  <Button2 variant="primary" isLoading>Loading</Button2>
                  <Button2 variant="primary" size="sm">Small</Button2>
                  <Button2 variant="primary" size="lg">Large</Button2>
                </div>
                <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: spacing.lg }}>
                  Primary кнопка с inner glow эффектом вместо заливки
                </p>
              </GlassCard2>
            </section>

            {/* Inputs Section */}
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Инпуты 2.0
              </h2>
              <GlassCard2>
                <div style={{ display: 'grid', gap: spacing.xl, maxWidth: '500px' }}>
                  <Input2
                    label="Task Title"
                    placeholder="What's next?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    leftIcon={<Search size={20} />}
                  />
                  <Input2
                    label="With Error"
                    placeholder="Enter something..."
                    error="This field is required"
                    rightIcon={<Bell size={20} />}
                  />
                </div>
              </GlassCard2>
            </section>

            {/* Badges Section */}
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Бейджи 2.0
              </h2>
              <GlassCard2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md }}>
                  <Badge2 variant="quick" animated>Quick</Badge2>
                  <Badge2 variant="focused">Focused</Badge2>
                  <Badge2 variant="deep">Deep</Badge2>
                  <Badge2 variant="high">High Priority</Badge2>
                  <Badge2 variant="medium">Medium</Badge2>
                  <Badge2 variant="low">Low</Badge2>
                </div>
                <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: spacing.lg }}>
                  Без иконок, без halo — чистый минимализм
                </p>
              </GlassCard2>
            </section>

            {/* Task Items Section */}
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Задачи 2.0
              </h2>
              <GlassCard2>
                <div style={{ display: 'grid', gap: spacing.md }}>
                  <TaskItem2
                    title="Design system review"
                    weight="deep"
                    priority="high"
                    completed={taskCompleted}
                    onToggle={() => setTaskCompleted(!taskCompleted)}
                  />
                  <TaskItem2
                    title="Send email to team"
                    weight="quick"
                    priority="medium"
                    completed={false}
                  />
                  <TaskItem2
                    title="Write documentation"
                    weight="focused"
                    priority="low"
                    completed={true}
                  />
                </div>
              </GlassCard2>
            </section>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div style={{ display: 'grid', gap: spacing['3xl'] }}>
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Glassmorphism 2.0
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: spacing.xl }}>
                <GlassCard2 variant="default">
                  <h3 style={{ marginBottom: spacing.md }}>Default Glass</h3>
                  <p style={{ color: colors.text.secondary }}>
                    Базовое стекло с noise текстурой и inner highlight
                  </p>
                </GlassCard2>
                <GlassCard2 variant="elevated">
                  <h3 style={{ marginBottom: spacing.md }}>Elevated Glass</h3>
                  <p style={{ color: colors.text.secondary }}>
                    Приподнятое стекло с дополнительной тенью
                  </p>
                </GlassCard2>
                <GlassCard2 variant="active">
                  <h3 style={{ marginBottom: spacing.md }}>Active Glass</h3>
                  <p style={{ color: colors.text.secondary }}>
                    Активное состояние с evening glow эффектом
                  </p>
                </GlassCard2>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Hover Lift Effect
              </h2>
              <GlassCard2>
                <div
                  style={{
                    padding: spacing['3xl'],
                    background: colors.bg.card,
                    borderRadius: radius['2xl'],
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = shadows.glowEvening;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Sparkles size={48} color={colors.accent.evening} style={{ marginBottom: spacing.lg }} />
                  <h3 style={{ marginBottom: spacing.sm }}>Наведите на меня</h3>
                  <p style={{ color: colors.text.secondary }}>
                    Эффект подъёма с цветной тенью
                  </p>
                </div>
              </GlassCard2>
            </section>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div style={{ display: 'grid', gap: spacing['3xl'] }}>
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Заголовки
              </h2>
              <GlassCard2>
                <div style={{ display: 'grid', gap: spacing.lg }}>
                  <h1 style={{ background: `linear-gradient(135deg, ${colors.accent.evening}, ${colors.weight.focused})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    H1 — Flow Calendar 2.0
                  </h1>
                  <h2>H2 — Harmonize your day</h2>
                  <h3>H3 — Time blocks</h3>
                  <h4>H4 — Morning routine</h4>
                </div>
              </GlassCard2>
            </section>

            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Текст и стили
              </h2>
              <GlassCard2>
                <div style={{ display: 'grid', gap: spacing.lg }}>
                  <p style={{ fontSize: typography.fontSize.base, color: colors.text.primary }}>
                    Body text — Основной текст приложения. Читается легко и комфортно.
                  </p>
                  <p style={{ fontSize: typography.fontSize.base, color: colors.text.secondary }}>
                    Secondary text — Вторичный текст для менее важной информации.
                  </p>
                  <p style={{ fontSize: typography.fontSize.base, color: colors.text.tertiary }}>
                    Tertiary text — Третичный текст для подписей и placeholder'ов.
                  </p>
                  <div>
                    <span className="label">Label — Uppercase Bold Tracking</span>
                  </div>
                  <div>
                    <span className="tiny">TINY — Ultra Tracking</span>
                  </div>
                </div>
              </GlassCard2>
            </section>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div style={{ display: 'grid', gap: spacing['3xl'] }}>
            <section>
              <h2 style={{ fontSize: typography.fontSize['2xl'], marginBottom: spacing.xl, color: colors.text.primary }}>
                Цветовая палитра
              </h2>
              
              <h3 style={{ fontSize: typography.fontSize.xl, marginBottom: spacing.lg, color: colors.text.secondary }}>
                Backgrounds
              </h3>
              <GlassCard2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: spacing.lg }}>
                  {Object.entries(colors.bg).slice(0, 4).map(([name, value]) => (
                    <div key={name} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          background: value,
                          borderRadius: radius.lg,
                          border: `1px solid ${colors.border.default}`,
                          marginBottom: spacing.sm,
                        }}
                      />
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'capitalize' }}>
                        {name}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard2>

              <h3 style={{ fontSize: typography.fontSize.xl, marginBottom: spacing.lg, marginTop: spacing['2xl'], color: colors.text.secondary }}>
                Task Weights
              </h3>
              <GlassCard2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: spacing.lg }}>
                  {Object.entries(colors.weight).map(([name, value]) => (
                    <div key={name} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          background: value.bg,
                          borderRadius: radius.lg,
                          border: `1px solid ${value.border}`,
                          marginBottom: spacing.sm,
                        }}
                      />
                      <p style={{ fontSize: typography.fontSize.xs, color: value.primary, fontWeight: typography.fontWeight.bold }}>
                        {name}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard2>

              <h3 style={{ fontSize: typography.fontSize.xl, marginBottom: spacing.lg, marginTop: spacing['2xl'], color: colors.text.secondary }}>
                Accents
              </h3>
              <GlassCard2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: spacing.lg }}>
                  {Object.entries(colors.accent).slice(0, 5).map(([name, value]) => (
                    <div key={name} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          background: value,
                          borderRadius: radius.lg,
                          marginBottom: spacing.sm,
                        }}
                      />
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.text.secondary, textTransform: 'capitalize' }}>
                        {name}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard2>
            </section>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: spacing['4xl'], textAlign: 'center', color: colors.text.tertiary }}>
          <p style={{ fontSize: typography.fontSize.sm }}>
            Flow Design System 2.0 Preview • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Вспомогательный компонент Search (для иконок)
const Search: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default DesignPreview2;
