import React, { useState, memo } from 'react';
import { Check, Calendar, Edit2, Repeat, Layers, Zap, Target } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Task, TimePeriod, Language, TaskWeight } from '../types.ts';
import { WEIGHT_CONFIG, TRANSLATIONS } from '../constants.tsx';

interface TaskItemProps {
  task: Task;
  index?: number;
  lang: Language;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const WEIGHT_CHIP_CLASS: Record<TaskWeight, string> = {
  [TaskWeight.QUICK]: 'weight-chip weight-chip--quick',
  [TaskWeight.FOCUSED]: 'weight-chip weight-chip--focused',
  [TaskWeight.DEEP]: 'weight-chip weight-chip--deep',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, index, lang, onToggle, onDelete, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const t = TRANSLATIONS[lang];
  const weightInfo = WEIGHT_CONFIG[task.weight];
  const WeightIcon = weightInfo.icon;

  const handleSave = () => {
    onUpdate(task.id, { title: editTitle });
    setIsEditing(false);
  };

  const togglePeriod = (p: TimePeriod) => {
    const current = task.periods || [];
    const updated = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    if (updated.length > 0) {
      onUpdate(task.id, { periods: updated });
    }
  };

  const changeWeight = (w: TaskWeight) => {
    onUpdate(task.id, { weight: w });
  };

  const periods = [
    { id: TimePeriod.MORNING, label: t.morning },
    { id: TimePeriod.AFTERNOON, label: t.afternoon },
    { id: TimePeriod.EVENING, label: t.evening },
  ];

  const weights = [
    { id: TaskWeight.QUICK, icon: Zap },
    { id: TaskWeight.FOCUSED, icon: Target },
    { id: TaskWeight.DEEP, icon: Layers },
  ];

  return (
    <div
      className={`group md-state-layer ${task.completed ? 'task-completing' : ''}`}
      style={{
        background: 'var(--md-sys-color-surface-container)',
        borderRadius: 'var(--md-sys-shape-corner-medium)',
        padding: '12px 16px',
        minHeight: '48px',
        position: 'relative',
      }}
    >
      <div className="flex items-center justify-between gap-3" style={{ position: 'relative', zIndex: 1 }}>
        {index !== undefined && (
          <span
            className="md-typescale-label-small flex-shrink-0 text-right"
            style={{ width: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}
          >
            {index}
          </span>
        )}

        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="md-focus-ring flex-shrink-0 flex items-center justify-center transition-all duration-md-short1 ease-md-standard"
          style={{
            width: '20px',
            height: '20px',
            minWidth: '48px',
            minHeight: '48px',
            margin: '-14px',
            borderRadius: 'var(--md-sys-shape-corner-extra-small)',
            border: task.completed ? 'none' : '2px solid var(--md-sys-color-outline)',
            background: task.completed ? 'var(--md-sys-color-primary)' : 'transparent',
          }}
          aria-checked={task.completed}
          role="checkbox"
        >
          {task.completed && <Check size={14} style={{ color: 'var(--md-sys-color-on-primary)' }} />}
        </button>

        <div
          className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden"
          onClick={() => !isEditing && setIsExpanded(!isExpanded)}
        >
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="md-typescale-body-large w-full md-focus-ring"
              style={{
                background: 'var(--md-sys-color-surface-container-highest)',
                border: '1px solid var(--md-sys-color-outline-variant)',
                borderRadius: 'var(--md-sys-shape-corner-small)',
                padding: '4px 8px',
                color: 'var(--md-sys-color-on-surface)',
              }}
            />
          ) : (
            <div className="flex-1 min-w-0 flex flex-col">
              <span
                className={`task-title md-typescale-body-large truncate transition-colors duration-md-short4 ease-md-standard ${task.completed ? 'line-through' : ''
                  }`}
                style={{
                  color: task.completed
                    ? 'var(--md-sys-color-on-surface-variant)'
                    : 'var(--md-sys-color-on-surface)',
                }}
              >
                {task.title}
              </span>
              {task.periods.length > 1 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Layers size={14} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
                  <span className="md-typescale-label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                    Multi-Block
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {task.recurrence && task.recurrence !== 'none' && (
              <Repeat size={14} style={{ color: 'var(--md-sys-color-on-surface-variant)' }} />
            )}
            <span
              className={`${WEIGHT_CHIP_CLASS[task.weight]} inline-flex items-center gap-1 h-8 px-3 md-typescale-label-large`}
              style={{ borderRadius: 'var(--md-sys-shape-corner-full)' }}
            >
              <WeightIcon size={14} />
              {weightInfo.label}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="md-state-layer md-focus-ring flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-md-short4 ease-md-standard"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            color: 'var(--md-sys-color-error)',
          }}
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isExpanded && (
        <div
          className="mt-4 pt-4 space-y-4"
          style={{ borderTop: '1px solid var(--md-sys-color-outline-variant)' }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Weight:
              </span>
              <div className="flex gap-1">
                {weights.map((w) => {
                  const Icon = w.icon;
                  const active = task.weight === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => changeWeight(w.id)}
                      className={`md-state-layer md-focus-ring flex-1 p-2 flex items-center justify-center transition-all duration-md-short4 ${active ? WEIGHT_CHIP_CLASS[w.id] : ''
                        }`}
                      style={{
                        borderRadius: 'var(--md-sys-shape-corner-medium)',
                        border: active ? 'none' : '1px solid var(--md-sys-color-outline-variant)',
                        background: active ? undefined : 'var(--md-sys-color-surface-container-high)',
                        minHeight: '48px',
                      }}
                    >
                      <Icon size={22} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                Priority:
              </span>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onUpdate(task.id, { priority: p })}
                    className="md-state-layer md-focus-ring flex-1 p-2 flex items-center justify-center md-typescale-label-small transition-all duration-md-short4"
                    style={{
                      borderRadius: 'var(--md-sys-shape-corner-medium)',
                      minHeight: '48px',
                      background:
                        task.priority === p
                          ? 'var(--md-sys-color-primary-container)'
                          : 'var(--md-sys-color-surface-container-high)',
                      color:
                        task.priority === p
                          ? 'var(--md-sys-color-on-primary-container)'
                          : 'var(--md-sys-color-on-surface-variant)',
                    }}
                  >
                    {p[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 md-typescale-body-medium"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              <Calendar size={14} />
              <span>{task.dueDate || t.deadline}</span>
            </div>
            {task.recurrence && task.recurrence !== 'none' && (
              <div className="md-typescale-label-medium flex items-center gap-2" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                <Repeat size={12} />
                {t[`rec_${task.recurrence === 'all-blocks' ? 'all_blocks' : task.recurrence}` as keyof typeof t]}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              Scheduled for:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {periods.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePeriod(p.id)}
                  className="md-state-layer md-focus-ring px-3 py-1.5 md-typescale-label-medium transition-all duration-md-short4"
                  style={{
                    borderRadius: 'var(--md-sys-shape-corner-small)',
                    minHeight: '48px',
                    background: task.periods.includes(p.id)
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-surface-container-high)',
                    color: task.periods.includes(p.id)
                      ? 'var(--md-sys-color-on-primary)'
                      : 'var(--md-sys-color-on-surface-variant)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="md-state-layer md-focus-ring flex-1 py-3 md-typescale-label-large flex items-center justify-center gap-2 transition-all duration-md-short4"
              style={{
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                minHeight: '48px',
                background: 'var(--md-sys-color-surface-container-high)',
                color: 'var(--md-sys-color-on-surface-variant)',
              }}
            >
              <Edit2 size={14} /> Edit Title
            </button>
            <button
              type="button"
              onClick={() => {
                const date = task.dueDate || new Date().toISOString().split('T')[0];
                const cleanDate = date.replace(/-/g, '');
                window.open(
                  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${cleanDate}T090000/${cleanDate}T100000`,
                  '_blank'
                );
              }}
              className="md-state-layer md-focus-ring flex-1 py-3 md-typescale-label-large transition-all duration-md-short4"
              style={{
                borderRadius: 'var(--md-sys-shape-corner-medium)',
                minHeight: '48px',
                background: 'var(--md-sys-color-primary)',
                color: 'var(--md-sys-color-on-primary)',
              }}
            >
              To Google Calendar
            </button>
          </div>
        </div>
      )}

      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full"
        style={{
          background:
            task.priority === 'high'
              ? 'var(--md-sys-color-error)'
              : task.priority === 'medium'
                ? 'var(--flow-capacity-overload)'
                : 'var(--md-sys-color-outline)',
        }}
      />
    </div>
  );
};

export default memo(TaskItem);
