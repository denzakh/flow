import React, { useRef, useEffect, useState } from 'react';
import TaskBubble from '../ui/TaskBubble';
import { Task, TaskWeight, Priority } from '../../types.ts';

interface BubbleBlockProps {
    tasks: Task[];
    isRecoveryMode: boolean;
    blockId: string;
    onBubbleClick: (taskId: string) => void;
}

// Calculate target positions for even distribution
const calculateTargetPositions = (count: number, width: number, height: number) => {
    const positions = [];
    const padding = 60;
    const availableWidth = width - padding * 2;

    for (let i = 0; i < count; i++) {
        positions.push({
            x: padding + (availableWidth / (count + 1)) * (i + 1),
            y: height / 2
        });
    }
    return positions;
};

interface Bubble {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    radius: number;
    settled: boolean;
}

const BubbleBlock: React.FC<BubbleBlockProps> = ({
    tasks,
    isRecoveryMode,
    blockId,
    onBubbleClick,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const animationRef = useRef<number | null>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const bubbleElementsRef = useRef<(HTMLDivElement | null)[]>([]); // Updated to accept null

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const shouldUsePhysics = !isRecoveryMode && !prefersReducedMotion && tasks.length > 0;

    // Initialize bubbles with target positions
    const initializeBubbles = (width: number, height: number) => {
        if (tasks.length === 0) {
            bubblesRef.current = [];
            return;
        }

        const targets = calculateTargetPositions(tasks.length, width, height);

        const getRadius = (weight: TaskWeight): number => {
            switch (weight) {
                case 'quick':
                    return 20;
                case 'focused':
                    return 30;
                case 'deep':
                    return 40;
                default:
                    return 30;
            }
        };

        bubblesRef.current = tasks.map((task, index) => {
            const target = targets[index] || { x: width / 2, y: height / 2 };

            return {
                id: task.id,
                x: target.x,
                y: target.y + 50,
                vx: 0,
                vy: 0,
                targetX: target.x,
                targetY: target.y,
                radius: getRadius(task.weight),
                settled: false,
            };
        });
    };

    // Ensure initial state is set synchronously
    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }

        initializeBubbles(containerWidth, containerRef.current?.clientHeight || 200);

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [containerWidth, tasks, isRecoveryMode, prefersReducedMotion]);

    // Update target positions when tasks change
    useEffect(() => {
        if (containerWidth > 0) {
            initializeBubbles(containerWidth, containerRef.current?.clientHeight || 200);
        }
    }, [tasks, containerWidth]);

    // Physics update loop
    const updatePhysics = (width: number, height: number) => {
        if (!shouldUsePhysics) {
            const targets = calculateTargetPositions(bubblesRef.current.length, width, height);
            bubblesRef.current.forEach((bubble, index) => {
                const target = targets[index] || bubble;
                bubble.x = target.x;
                bubble.y = target.y;
            });
            return;
        }

        const bubbles = bubblesRef.current;

        // Update each bubble
        for (let i = 0; i < bubbles.length; i++) {
            const b = bubbles[i];
            if (b.settled) continue;

            // Attraction to target
            b.vx += (b.targetX - b.x) * 0.02;
            b.vy += (b.targetY - b.y) * 0.02;

            // Damping
            b.vx *= 0.65;
            b.vy *= 0.65;

            // Soft repulsion between bubbles
            for (let j = 0; j < bubbles.length; j++) {
                if (j === i) continue;
                const other = bubbles[j];
                const dx = b.x - other.x;
                const dy = b.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const minDist = b.radius + other.radius + 16;

                if (dist < minDist) {
                    const force = (minDist - dist) / minDist * 2.0;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    b.vx += nx * force;
                    b.vy += ny * force;
                    if (!other.settled) {
                        other.vx -= nx * force;
                        other.vy -= ny * force;
                    }
                }
            }

            // Wall bounds check
            if (b.x - b.radius < 0) {
                b.x = b.radius;
                b.vx *= -0.3;
            }
            if (b.x + b.radius > width) {
                b.x = width - b.radius;
                b.vx *= -0.3;
            }
            if (b.y - b.radius < 0) {
                b.y = b.radius;
                b.vy *= -0.3;
            }
            if (b.y + b.radius > height) {
                b.y = height - b.radius;
                b.vy *= -0.3;
            }

            // Update position
            b.x += b.vx;
            b.y += b.vy;

            // Check if this bubble is settled
            const isSettled = (b: Bubble) =>
                Math.abs(b.vx) < 0.5 &&
                Math.abs(b.vy) < 0.5 &&
                Math.abs(b.x - b.targetX) < 3.0 &&
                Math.abs(b.y - b.targetY) < 3.0;
            if (isSettled(b)) {
                b.x = b.targetX
                b.y = b.targetY
                b.vx = 0
                b.vy = 0
                b.settled = true
            }
        }

        // If all bubbles are settled, cancel the animation
        const allSettled = bubblesRef.current.every(b => b.settled);
        if (allSettled) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
                return;
            }
        }
    };

    // Animation loop
    const animate = () => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        updatePhysics(width, height);

        // Update transform for each bubble
        bubblesRef.current.forEach((b, i) => {
            const el = bubbleElementsRef.current[i];
            if (el) {
                el.style.transform = `translate3d(${b.x - b.radius}px, ${b.y - b.radius}px, 0)`;
            }
        });

        animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.clientWidth);
                initializeBubbles(containerRef.current.clientWidth, containerRef.current.clientHeight || 200);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [tasks]);

    // Initialize and start animation
    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.clientWidth);
        }

        initializeBubbles(containerWidth, containerRef.current?.clientHeight || 200);

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [containerWidth, tasks, isRecoveryMode, prefersReducedMotion]);

    // Update target positions when tasks change
    useEffect(() => {
        if (containerWidth > 0) {
            initializeBubbles(containerWidth, containerRef.current?.clientHeight || 200);
        }
    }, [tasks, containerWidth]);

    if (!bubblesRef.current || bubblesRef.current.length !== tasks.length) {
        return <div style={{ position: 'relative', width: '100%', height: '100%' }} />;
    }

    return (
        <div
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'hidden' }}
            ref={containerRef}
            aria-label="Task bubbles - click to toggle"
        >
            {tasks.map((task, i) => {
                const bubble = bubblesRef.current?.[i];
                if (!bubble) return null;  // ← add this guard
                return (
                    <div
                        key={task.id}
                        style={{
                            position: 'absolute',
                            transform: `translate3d(${bubble.x - bubble.radius}px, ${bubble.y - bubble.radius}px, 0)`,
                            width: bubble.radius * 2,
                            height: bubble.radius * 2
                        }}
                        onClick={() => onBubbleClick(task.id)}
                        ref={(el: HTMLDivElement | null) => {
                            bubbleElementsRef.current[i] = el;
                        }}
                    >
                        <TaskBubble
                            weight={task.weight}
                            priority={task.priority}
                            title={task.title}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default BubbleBlock;