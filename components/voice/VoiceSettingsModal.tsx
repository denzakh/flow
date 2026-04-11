/**
 * VoiceSettingsModal - Модальное окно настроек голосового управления
 */

import React, { useEffect, useState } from 'react';
import { VoiceSettings } from '../../types';
import { TRANSLATIONS, VOICE_TRANSLATIONS } from '../../constants';

interface VoiceSettingsModalProps {
  settings: VoiceSettings;
  onSave: (settings: VoiceSettings) => void;
  onClose: () => void;
  language: 'en' | 'ru';
}

const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  settings,
  onSave,
  onClose,
  language
}) => {
  const [tempSettings, setTempSettings] = React.useState<VoiceSettings>(settings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const t = VOICE_TRANSLATIONS[language];
  const mainT = TRANSLATIONS[language];

  // Загрузить доступные голоса при монтировании
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSave = () => {
    onSave(tempSettings);
    onClose();
  };

  const handleToggle = (key: keyof VoiceSettings) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof VoiceSettings]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-light text-white">{t.voiceSettings}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Настройки */}
        <div className="space-y-4">
          {/* Включить голосовое управление */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-white/80">{t.enableVoice}</label>
            <button
              onClick={() => handleToggle('enabled')}
              className={`w-12 h-6 rounded-full transition-colors ${
                tempSettings.enabled ? 'bg-active' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  tempSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Язык голоса */}
          <div className="space-y-2">
            <label className="text-sm text-white/80">{t.voiceLanguage}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTempSettings(prev => ({ ...prev, language: 'ru' }))}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                  tempSettings.language === 'ru'
                    ? 'bg-active text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {t.russian}
              </button>
              <button
                onClick={() => setTempSettings(prev => ({ ...prev, language: 'en' }))}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                  tempSettings.language === 'en'
                    ? 'bg-active text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {t.english}
              </button>
            </div>
          </div>

          {/* Автоматическая отправка */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-white/80">{t.autoSubmit}</label>
            <button
              onClick={() => handleToggle('autoSubmit')}
              className={`w-12 h-6 rounded-full transition-colors ${
                tempSettings.autoSubmit ? 'bg-active' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  tempSettings.autoSubmit ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Требовать подтверждение */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-white/80">{t.requireConfirmation}</label>
            <button
              onClick={() => handleToggle('requireConfirmation')}
              className={`w-12 h-6 rounded-full transition-colors ${
                tempSettings.requireConfirmation ? 'bg-active' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  tempSettings.requireConfirmation ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Голосовая обратная связь */}
          <div className="flex items-center justify-between">
            <label className="text-sm text-white/80">{t.enableTTS}</label>
            <button
              onClick={() => handleToggle('ttsEnabled')}
              className={`w-12 h-6 rounded-full transition-colors ${
                tempSettings.ttsEnabled ? 'bg-active' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  tempSettings.ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Выбор голоса для TTS */}
          {tempSettings.ttsEnabled && availableVoices.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-white/80">Voice</label>
              <select
                value={tempSettings.ttsVoice || ''}
                onChange={(e) =>
                  setTempSettings(prev => ({ ...prev, ttsVoice: e.target.value }))
                }
                className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-active"
              >
                <option value="" className="bg-gray-800">Default</option>
                {availableVoices
                  .filter(voice => voice.lang.startsWith(tempSettings.language === 'ru' ? 'ru' : 'en'))
                  .map(voice => (
                    <option
                      key={voice.name}
                      value={voice.name}
                      className="bg-gray-800"
                    >
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Порог уверенности */}
          <div className="space-y-2">
            <label className="text-sm text-white/80">{t.confidenceThreshold}</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={tempSettings.confidenceThreshold}
                onChange={(e) =>
                  setTempSettings(prev => ({
                    ...prev,
                    confidenceThreshold: parseFloat(e.target.value)
                  }))
                }
                className="flex-1"
              />
              <span className="text-sm text-white/80 w-12 text-right">
                {Math.round(tempSettings.confidenceThreshold * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 rounded-lg bg-active text-white hover:opacity-90 transition-opacity"
          >
            {mainT.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettingsModal;