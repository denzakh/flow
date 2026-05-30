import React, { useState } from 'react';
import { Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { Task, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface TaskManagerPanelProps {
  tasks: Task[];
  language: Language;
  onDeleteAllCompleted: () => void;
  onDeleteAll: () => void;
}

const TaskManagerPanel: React.FC<TaskManagerPanelProps> = ({
  tasks,
  language,
  onDeleteAllCompleted,
  onDeleteAll
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'all' | 'completed' | null>(null);

  const t = TRANSLATIONS[language];
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full glass-2 p-4 rounded-2xl flex items-center justify-between gap-4 hover-lift transition-all group"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--md-sys-color-surface-container-high)' }}
          >
            <AlertCircle size={20} className="flow-text-muted" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black uppercase flow-text-muted tracking-widest">
              {t.tasks} / {t.taskManagement}
            </div>
            <div className="text-sm font-bold flow-text">
              {stats.total} {stats.total === 1 ? 'задача' : 'задач'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-[10px] font-black uppercase flow-text-muted tracking-widest">
              {stats.completed} выполнено
            </div>
            <div className="text-sm font-bold text-emerald-400">
              {stats.active} активных
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="glass-2 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flow-divider border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--md-sys-color-surface-container-high)' }}
          >
            <AlertCircle size={20} className="flow-text-muted" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase flow-text-muted tracking-widest">
              {t.tasks} / {t.taskManagement}
            </div>
            <div className="text-sm font-bold flow-text">
              Всего: {stats.total}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="glass-btn w-8 h-8 flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl p-3" style={{ background: 'var(--md-sys-color-surface-container-high)' }}>
          <div className="text-2xl font-bold flow-text">{stats.total}</div>
          <div className="text-[8px] font-black uppercase flow-text-muted tracking-widest">Всего</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'var(--md-sys-color-surface-container-high)' }}>
          <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
          <div className="text-[8px] font-black uppercase flow-text-muted tracking-widest">Активных</div>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'var(--md-sys-color-surface-container-high)' }}>
          <div className="text-2xl font-bold flow-text-muted">{stats.completed}</div>
          <div className="text-[8px] font-black uppercase flow-text-muted tracking-widest">Выполнено</div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        {stats.completed > 0 && (
          <button
            onClick={() => setShowConfirm('completed')}
            className="w-full py-3 px-4 rounded-xl flow-text-muted text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            style={{ background: 'var(--md-sys-color-surface-container-high)' }}
          >
            <CheckCircle size={16} />
            Удалить выполненные ({stats.completed})
          </button>
        )}

        <button
          onClick={() => setShowConfirm('all')}
          className="w-full py-3 px-4 rounded-xl bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Удалить все задачи ({stats.total})
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="glass-2 rounded-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold flow-text mb-2">
              {showConfirm === 'all' ? 'Удалить все задачи?' : 'Удалить выполненные задачи?'}
            </h3>
            <p className="text-sm flow-text-muted mb-6">
              {showConfirm === 'all'
                ? 'Это действие удалит все задачи без возможности восстановления.'
                : `Это действие удалит ${stats.completed} выполненн${stats.completed === 1 ? 'ую' : 'ые'} задачи.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-3 rounded-xl flow-text-muted text-[10px] font-black uppercase tracking-widest transition-all"
                style={{ background: 'var(--md-sys-color-surface-container-high)' }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (showConfirm === 'all') {
                    onDeleteAll();
                  } else {
                    onDeleteAllCompleted();
                  }
                  setShowConfirm(null);
                  setIsExpanded(false);
                }}
                className="flex-1 py-3 rounded-xl bg-rose-500 flow-text text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagerPanel;
