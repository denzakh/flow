import React from 'react';
import { useButton } from 'react-aria';
import './FAB.css';

interface FABProps {
    size?: 'small' | 'regular' | 'large';
    extended?: boolean;
    label?: string;
    icon: React.ReactNode;
    onPress?: () => void;
    isDisabled?: boolean;
    color?: 'primary' | 'surface' | 'secondary' | 'tertiary';
    'aria-label'?: string;
    isListening?: boolean;
}

const FAB: React.FC<FABProps> = ({
    size = 'regular',
    extended = false,
    label,
    icon,
    onPress,
    isDisabled = false,
    color = 'primary',
    'aria-label': ariaLabel,
    isListening = false,
    ...props
}) => {
    // Ensure aria-label is provided when no visible label is present
    const requiredAriaLabel = !label ? ariaLabel : undefined;

    const { buttonProps, isPressed } = useButton({
        ...props,
        onPress,
        isDisabled,
        'aria-label': requiredAriaLabel,
    });

    // Determine classes based on props
    const fabClasses = [
        'fab',
        `fab--size-${size}`,
        `fab--color-${color}`,
        extended ? 'fab--extended' : '',
        isDisabled ? 'fab--disabled' : '',
        isListening ? 'fab--listening' : ''
    ].filter(Boolean).join(' ');

    return (
        <button
            {...buttonProps}
            className={fabClasses}
            data-pressed={isPressed}
        >
            <span className="fab__icon">{icon}</span>
            {extended && label && <span className="fab__label">{label}</span>}
        </button>
    );
};

export default FAB;