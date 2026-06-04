import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
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
                backgroundColor: 'var(--md-sys-color-surface-container)',
                boxShadow: 'var(--md-sys-elevation-2)',
            }}
        >
            {/* Toolbar content */}
            <div className="flex items-center justify-around px-4 py-3">
                {/* Settings */}
                <IconButton
                    onClick={onSettingsClick}
                    aria-label="Settings"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        color: 'var(--md-sys-color-on-surface-variant)',
                    }}
                >
                    <Settings size={24} />
                </IconButton>

                {/* Ideas */}
                <IconButton
                    onClick={onIdeasClick}
                    aria-label="Ideas"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        color: 'var(--md-sys-color-on-surface-variant)',
                    }}
                >
                    <Lightbulb size={24} />
                </IconButton>

                {/* Voice — MUI Filled Button (rounded square, M3 Corner Large) */}
                <Button
                    variant="contained"
                    onClick={onVoiceClick}
                    data-listening={isVoiceListening}
                    sx={{
                        borderRadius: '16px',
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
                    }}
                >
                    <Mic size={24} />
                </Button>

                {/* Add Task */}
                <IconButton
                    onClick={onAddTaskClick}
                    aria-label="Add task"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        color: 'var(--md-sys-color-on-surface-variant)',
                    }}
                >
                    <Plus size={24} />
                </IconButton>

                {/* Smart Day Planner */}
                <IconButton
                    onClick={onSmartPlannerClick}
                    aria-label="Smart Day Planner"
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        color: 'var(--md-sys-color-on-surface-variant)',
                    }}
                >
                    <Brain size={24} />
                </IconButton>
            </div>

            {/* Gesture bar */}
            <div className="flex justify-center pb-4 pt-1">
                <div
                    className="h-1 w-32 rounded-full"
                    style={{ backgroundColor: 'var(--md-sys-color-on-surface)' }}
                />
            </div>
        </div>
    );
};

export default FlowToolbar;