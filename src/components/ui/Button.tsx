import React, { useRef } from 'react';
import { useButton } from 'react-aria';
import './Button.css';

interface ButtonComponentProps {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  leadingIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  onPress?: () => void;
}

export const Button: React.FC<ButtonComponentProps> = ({
  variant = 'filled',
  size = 'md',
  leadingIcon,
  children,
  className = '',
  isDisabled = false,
  onPress,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton({
    ...props,
    isDisabled,
    onPress
  }, ref);

  // Determine classes based on variant and size
  const variantClasses: Record<string, string> = {
    filled: 'button--filled',
    tonal: 'button--tonal',
    outlined: 'button--outlined',
    text: 'button--text',
    elevated: 'button--elevated'
  };

  const sizeClasses: Record<string, string> = {
    sm: 'button--sm',
    md: 'button--md',
    lg: 'button--lg'
  };

  const disabledClass = isDisabled ? 'button--disabled' : '';

  const classes = [
    'button',
    variantClasses[variant],
    sizeClasses[size],
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classes}
      data-pressed={isPressed}
    >
      {leadingIcon && <span className="button__icon">{leadingIcon}</span>}
      <span className="button__content">{children}</span>
    </button>
  );
};

