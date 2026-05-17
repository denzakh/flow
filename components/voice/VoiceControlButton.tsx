/**
 * VoiceControlButton - Кнопка микрофона с визуальной индикацией
 */

import React from 'react';
import { Mic, MicOff } from '../../utils/MaterialIcons';
import { Language } from '../../types';
import FAB from '../../src/components/ui/FAB';

interface VoiceControlButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onToggle: () => void;
  language: Language;
  className?: string;
}

const VoiceControlButton: React.FC<VoiceControlButtonProps> = ({
  isListening,
  isProcessing,
  isSupported,
  onToggle,
  language,
  className = ''
}) => {
  if (!isSupported) {
    return null;
  }


  return (
    <FAB
      icon={
        <div className="voice-fab-content">
          {/* Фоновая анимация при прослушивании */}
          {isListening && (
            <div className="voice-waves">
              <div className="voice-wave voice-wave-1"></div>
              <div className="voice-wave voice-wave-2"></div>
              <div className="voice-wave voice-wave-3"></div>
            </div>
          )}

          {/* Иконка микрофона */}
          <div className="voice-icon">
            {isListening ? (
              <Mic size={22} className="voice-icon-active" />
            ) : (
              <MicOff size={22} className="voice-icon-inactive" />
            )}
          </div>

          {/* Индикатор обработки */}
          {isProcessing && (
            <div className="voice-processing-indicator">
              <div className="voice-dot voice-dot-1"></div>
              <div className="voice-dot voice-dot-2"></div>
              <div className="voice-dot voice-dot-3"></div>
            </div>
          )}
        </div>
      }
      onPress={onToggle}
      isListening={isListening}
      aria-label={isListening ? 'Stop listening' : 'Start voice control'}
      color="primary"
    />
  );
};

export default VoiceControlButton;