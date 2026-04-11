/**
 * VoiceFeedback - Компонент для визуальной обратной связи о голосовом управлении
 */

import React from 'react';
import { Volume2, VolumeX, AlertCircle, CheckCircle, Loader } from '../../utils/MaterialIcons';

type VoiceStatus = 'idle' | 'listening' | 'processing' | 'error' | 'success';

interface VoiceFeedbackProps {
  isListening: boolean;
  isProcessing: boolean;
  transcript?: string;
  confidence?: number;
  status: VoiceStatus;
  errorMessage?: string;
  className?: string;
}

const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({
  isListening,
  isProcessing,
  transcript,
  confidence,
  status,
  errorMessage,
  className = ''
}) => {
  if (status === 'idle' && !isListening && !isProcessing) {
    return null;
  }

  const containerClasses = [
    'voice-feedback',
    'glass-card',
    'p-4',
    'mb-4',
    'animate-in',
    'fade-in',
    'slide-in-from-bottom-4',
    'duration-300'
  ];

  if (status !== 'idle') {
    containerClasses.push(`voice-feedback-${status}`);
  }

  if (className) {
    containerClasses.push(className);
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'listening':
        return <Volume2 size={20} className="voice-status-icon voice-status-listening" />;
      case 'processing':
        return <Loader size={20} className="voice-status-icon voice-status-processing animate-spin" />;
      case 'error':
        return <AlertCircle size={20} className="voice-status-icon voice-status-error" />;
      case 'success':
        return <CheckCircle size={20} className="voice-status-icon voice-status-success" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Processing...';
      case 'error':
        return errorMessage || 'Sorry, I didn\'t catch that';
      case 'success':
        return 'Done!';
      default:
        return '';
    }
  };

  const getConfidenceLevel = () => {
    if (confidence === undefined) return null;

    let level = 'low';
    let color = 'text-red-400';

    if (confidence >= 0.8) {
      level = 'high';
      color = 'text-green-400';
    } else if (confidence >= 0.6) {
      level = 'medium';
      color = 'text-yellow-400';
    }

    return (
      <div className="voice-confidence">
        <span className={`text-xs ${color}`}>
          Confidence: {Math.round(confidence * 100)}%
        </span>
      </div>
    );
  };

  return (
    <div className={containerClasses.join(' ')}>
      {/* Заголовок статуса */}
      <div className="flex items-center gap-2 mb-2">
        {getStatusIcon()}
        <span className="text-sm font-medium text-white">
          {getStatusText()}
        </span>
      </div>

      {/* Транскрипция распознанного текста */}
      {transcript && (
        <div className="voice-transcript mb-2">
          <p className="text-sm text-white bg-black/30 rounded-lg p-2">
            "{transcript}"
          </p>
        </div>
      )}

      {/* Индикатор уверенности */}
      {confidence !== undefined && getConfidenceLevel()}

      {/* Визуальная индикация прослушивания */}
      {isListening && (
        <div className="voice-listening-indicator mt-2">
          <div className="flex gap-1">
            <div className="voice-bar voice-bar-1"></div>
            <div className="voice-bar voice-bar-2"></div>
            <div className="voice-bar voice-bar-3"></div>
            <div className="voice-bar voice-bar-4"></div>
            <div className="voice-bar voice-bar-5"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceFeedback;