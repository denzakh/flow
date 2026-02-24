import React from 'react';
import { TimePeriod, Task, Language } from '../../types.ts';
import RecoveryBanner from '../blocks/RecoveryBanner.tsx';
import FocusPoint from '../blocks/FocusPoint.tsx';
import TimeBlockList from '../blocks/TimeBlockList.tsx';

interface DayViewProps {
  isRecoveryMode: boolean;
  isWindDown: boolean;
  currentTime: Date;
  dynamicBlocks: any[];
  activePeriodId: TimePeriod;
  todayStr: string;
  viewDate: Date;
  tasks: Task[];
  collapsedBlocks: Record<string, boolean>;
  language: Language;
  onTaskAdd: (title: string, periods: TimePeriod[], recurrence: any, weight: any) => void;
  onQuickAdd: (period: TimePeriod) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onToggleCollapse: (blockId: string) => void;
  onWeightChange: (weight: any) => void;
  onPeriodToggle: (period: TimePeriod) => void;
  onRecurrenceChange: (recurrence: any) => void;
  onInputFocusChange: (focused: boolean) => void;
  selectedWeight: any;
  selectedPeriods: TimePeriod[];
  selectedRecurrence: any;
  isInputFocused: boolean;
}

const DayView: React.FC<DayViewProps> = ({
  isRecoveryMode,
  isWindDown,
  currentTime,
  dynamicBlocks,
  activePeriodId,
  todayStr,
  viewDate,
  tasks,
  collapsedBlocks,
  language,
  onTaskAdd,
  onQuickAdd,
  onToggle,
  onDelete,
  onUpdate,
  onToggleCollapse,
  onWeightChange,
  onPeriodToggle,
  onRecurrenceChange,
  onInputFocusChange,
  selectedWeight,
  selectedPeriods,
  selectedRecurrence,
  isInputFocused
}) => {
  return (
    <>
      {isRecoveryMode && (
        <RecoveryBanner
          isWindDown={isWindDown}
          currentTime={currentTime}
          language={language}
        />
      )}
      
      <FocusPoint
        onTaskAdd={onTaskAdd}
        selectedWeight={selectedWeight}
        selectedPeriods={selectedPeriods}
        selectedRecurrence={selectedRecurrence}
        isInputFocused={isInputFocused}
        onWeightChange={onWeightChange}
        onPeriodToggle={onPeriodToggle}
        onRecurrenceChange={onRecurrenceChange}
        onInputFocusChange={onInputFocusChange}
        language={language}
      />
      
      <TimeBlockList
        blocks={dynamicBlocks}
        activePeriodId={activePeriodId}
        todayStr={todayStr}
        viewDate={viewDate}
        tasks={tasks}
        collapsedBlocks={collapsedBlocks}
        language={language}
        onQuickAdd={onQuickAdd}
        onToggle={onToggle}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onToggleCollapse={onToggleCollapse}
      />
    </>
  );
};

export default DayView;
