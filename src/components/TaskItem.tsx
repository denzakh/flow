import React, { useState, memo } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Circle, Diamond, Star, Bookmark } from 'lucide-react';
import { Task, TimePeriod, Language, TaskWeight, Priority } from '../types.ts';
import { WEIGHT_CONFIG, TRANSLATIONS } from '../constants.tsx';

interface TaskItemProps {
  task: Task;
  index?: number;
  lang: Language;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, lang, onToggle, onDelete, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const t = TRANSLATIONS[lang];
  const weightInfo = WEIGHT_CONFIG[task.weight];

  // Определяем форму по приоритету
  const PriorityIcon = {
    low: Circle,
    medium: Diamond,
    high: Star,
  }[task.priority || 'medium'];

  // Определяем размер формы по весу
  const shapeSize = {
    quick: 24,
    focused: 28,
    deep: 32,
  }[task.weight];

  // Определяем цвет формы по весу
  const shapeColor = {
    quick: 'var(--flow-weight-quick-color, #10B981)',
    focused: 'var(--flow-weight-focused-color, #F59E0B)',
    deep: 'var(--flow-weight-deep-color, #EC4899)',
  }[task.weight];

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <div
      className="group md-state-layer"
      style={{
        background: task.completed
          ? 'var(--md-sys-color-surface-container-lowest)'
          : 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        padding: '12px 16px',
        minHeight: '56px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: task.completed ? 0.6 : 1,
        transition: 'all 200ms ease',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Checkbox (MUI) */}
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        sx={{
          color: 'var(--md-sys-color-on-surface-variant)',
          '&.Mui-checked': {
            color: 'var(--md-sys-color-primary)',
          },
          padding: '4px',
        }}
      />

      {/* Title */}
      <div
        className="flex-1 min-w-0"
        style={{
          cursor: 'pointer',
        }}
        onClick={() => !task.completed && onUpdate(task.id, { completed: !task.completed })}
      >
        <span
          className="md-typescale-body-large"
          style={{
            color: task.completed
              ? 'var(--md-sys-color-on-surface-variant)'
              : 'var(--md-sys-color-on-surface)',
            textDecoration: task.completed ? 'line-through' : 'none',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.title}
        </span>
      </div>

      {/* MaterialShape (Priority + Weight + Icon) */}
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: `${shapeSize + 16}px`,
          height: `${shapeSize + 16}px`,
          borderRadius: '50%',
          background: shapeColor,
          opacity: isPressed ? 0.8 : isHovered ? 0.9 : 1,
          transition: 'opacity 150ms ease',
          position: 'relative',
        }}
      >
        <PriorityIcon
          size={shapeSize}
          style={{
            color: 'var(--md-sys-color-on-primary)',
            strokeWidth: 2,
          }}
        />
      </div>

      {/* Hover/Pressed overlay */}
      {(isHovered || isPressed) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isPressed
              ? 'var(--md-sys-color-on-surface)'
              : 'var(--md-sys-color-on-surface)',
            opacity: isPressed ? 0.12 : 0.08,
            borderRadius: 'var(--md-sys-shape-corner-medium)',
            transition: 'opacity 150ms ease',
          }}
        />
      )}
    </div>
  );
};

export default memo(TaskItem);