import React, { useState, useEffect, useRef } from 'react';
import { useButton } from 'react-aria';
import Button from '@mui/material/Button';
import { Settings, Lightbulb, Mic, Plus, Brain } from 'lucide-react';

interface FlowToolbarProps {
    onSettingsClick: () => void;
    onIdeasClick: () => void;
    onVoiceClick: () => void;
    onAddTaskClick: () => void;
    onSmartPlannerClick: () => void;
    isVoiceListening?: boolean;
}

export const FlowToolbar: React.FC<FlowToolbarProps> = ({
    onSettingsClick,
    onIdeasClick,
    onVoiceClick,
    onAddTaskClick,
    onSmartPlannerClick,
    isVoiceListening = false,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Scroll behavior
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
            style={{
                zIndex: 100,
                // Монолитный фон для всего блока (и toolbar, и область под gesture bar)
                backgroundColor: 'var(--md-sys-color-surface-container)',
                boxShadow: 'var(--md-sys-elevation-2)',
            }}
        >
            {/* Toolbar content */}
            <div className="flex items-center justify-around px-4 py-3">
                {/* Settings */}
                <IconButton onPress={onSettingsClick} ariaLabel="Settings">
                    <Settings size={24} />
                </IconButton>

                {/* Ideas */}
                <IconButton onPress={onIdeasClick} ariaLabel="Ideas">
                    <Lightbulb size={24} />
                </IconButton>

                {/* Voice — MUI Filled Button (rounded square, M3 Corner Large) */}
                <Button
                    variant="contained"
                    onClick={onVoiceClick}
                    data-listening={isVoiceListening}
                    sx={{
                        borderRadius: '16px', // Скругленный квадрат по канонам M3
                        minWidth: '56px',
                        height: '56px',
                        padding: 0,
                        backgroundColor: 'var(--md-sys-color-primary)',
                        color: 'var(--md-sys-color-on-primary)',
                        boxShadow: 'var(--md-sys-elevation-2)',
                        '&:hover': {
                            backgroundColor: 'var(--md-sys-color-primary)',
                            boxShadow: 'var(--md-sys-elevation-3)',
                        },
                        '&:active': {
                            transform: 'scale(0.96)',
                        },
                    }}
                >
                    <Mic size={24} />
                </Button>

                {/* Add Task */}
                <IconButton onPress={onAddTaskClick} ariaLabel="Add task">
                    <Plus size={24} />
                </IconButton>

                {/* Smart Day Planner */}
                <IconButton onPress={onSmartPlannerClick} ariaLabel="Smart Day Planner">
                    <Brain size={24} />
                </IconButton>
            </div>

            {/* Gesture bar — простая полоска цветом on-surface на фоне surface-container */}
            <div className="flex justify-center pb-4 pt-1">
                <div
                    className="h-1 w-32 rounded-full"
                    style={{ backgroundColor: 'var(--md-sys-color-on-surface)' }}
                />
            </div>
        </div>
    );
};

// Icon Button (not tonal)
const IconButton: React.FC<{
    onPress: () => void;
    ariaLabel: string;
    children: React.ReactNode;
}> = ({ onPress, ariaLabel, children }) => {
    const ref = useRef<HTMLButtonElement>(null);
    const { buttonProps, isPressed } = useButton({ onPress }, ref);

    return (
        <button
            {...buttonProps}
            ref={ref}
            aria-label={ariaLabel}
            data-pressed={isPressed}
            className="md-state-layer w-12 h-12 flex items-center justify-center rounded-full"
            style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                transform: isPressed ? 'scale(0.96)' : 'scale(1)',
                transition: 'transform 150ms ease',
            }}
        >
            {children}
        </button>
    );
};

export default FlowToolbar;