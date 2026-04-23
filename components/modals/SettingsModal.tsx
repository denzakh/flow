import React, { useState, useEffect } from 'react';
import { X, LogOut, AlertCircle, Mic } from '../../utils/MaterialIcons';
import { UserSettings, AlarmConfig, Language, VoiceSettings } from '../../types.ts';
import { TRANSLATIONS, VOICE_TRANSLATIONS } from '../../constants.tsx';

// Language map for Web Speech API
const LANG_MAP: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  es: 'es-ES'
};

interface SettingsModalProps {
  settings: UserSettings;
  tempWake: string;
  tempRest: string;
  tempLang: Language;
  tempAlarm: AlarmConfig;
  error: string | null;
  voiceSettings?: VoiceSettings;
  onSave: () => void;
  onClose: () => void;
  onLogout: () => void;
  onTempWakeChange: (value: string) => void;
  onTempRestChange: (value: string) => void;
  onTempLangChange: (lang: Language) => void;
  onVoiceSettingsChange?: (settings: VoiceSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  tempWake,
  tempRest,
  tempLang,
  tempAlarm,
  error,
  voiceSettings,
  onSave,
  onClose,
  onLogout,
  onTempWakeChange,
  onTempRestChange,
  onTempLangChange,
  onVoiceSettingsChange
}) => {
  const t = TRANSLATIONS[settings.language];
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [tempVoiceSettings, setTempVoiceSettings] = useState<VoiceSettings>(
    voiceSettings || {
      enabled: false,
      language: settings.language as 'ru' | 'en' | 'es',
      autoSubmit: false,
      requireConfirmation: true,
      ttsEnabled: true,
      confidenceThreshold: 0.7
    }
  );

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

  const handleVoiceToggle = (key: keyof VoiceSettings) => {
    setTempVoiceSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof VoiceSettings]
    }));
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end animate-in slide-in-from-bottom duration-500">
      <div className="w-full glass-2 rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-10 border-t border-white/5" style={{
        background: 'rgba(15, 15, 15, 0.95)',
        borderRadius: '48px 48px 0 0',
      }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-white tracking-tighter">{t.settings}</h2>
          <button
            onClick={onClose}
            className="glass-btn w-10 h-10 flex items-center justify-center"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                {t.morning} Start
              </label>
              <input
                type="time"
                value={tempWake}
                onChange={e => onTempWakeChange(e.target.value)}
                className="w-full p-4 bg-[#0a0a0a] rounded-2xl border border-white/10 font-bold text-white focus:border-white/20 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                {t.night} Rest
              </label>
              <input
                type="time"
                value={tempRest}
                onChange={e => onTempRestChange(e.target.value)}
                className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">{t.language}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['en', 'ru', 'es'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => onTempLangChange(l)}
                  className={`py-3 rounded-xl text-[10px] font-black uppercase ${
                    tempLang === l ? 'bg-[#0a0a0a] text-white' : 'bg-white/5 text-white/40'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Control Section */}
          {voiceSettings && onVoiceSettingsChange && (
            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <Mic size={18} className="text-white/60" />
                <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">
                  {VOICE_TRANSLATIONS[settings.language].voiceSettings || 'Voice Control'}
                </label>
              </div>

              {/* Enable Voice Control */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].enableVoice || 'Enable Voice'}</label>
                <button
                  onClick={() => {
                    handleVoiceToggle('enabled');
                    onVoiceSettingsChange({ ...tempVoiceSettings, enabled: !tempVoiceSettings.enabled });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    tempVoiceSettings.enabled ? 'bg-active' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      tempVoiceSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Language */}
              <div className="space-y-2">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].voiceLanguage || 'Language'}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTempVoiceSettings(prev => ({ ...prev, language: 'ru' }));
                      onVoiceSettingsChange({ ...tempVoiceSettings, language: 'ru' });
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                      tempVoiceSettings.language === 'ru'
                        ? 'bg-active text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {VOICE_TRANSLATIONS[settings.language].russian || 'RU'}
                  </button>
                  <button
                    onClick={() => {
                      setTempVoiceSettings(prev => ({ ...prev, language: 'en' }));
                      onVoiceSettingsChange({ ...tempVoiceSettings, language: 'en' });
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                      tempVoiceSettings.language === 'en'
                        ? 'bg-active text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {VOICE_TRANSLATIONS[settings.language].english || 'EN'}
                  </button>
                  <button
                    onClick={() => {
                      setTempVoiceSettings(prev => ({ ...prev, language: 'es' }));
                      onVoiceSettingsChange({ ...tempVoiceSettings, language: 'es' });
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm transition-all ${
                      tempVoiceSettings.language === 'es'
                        ? 'bg-active text-white'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {VOICE_TRANSLATIONS[settings.language].spanish || 'ES'}
                  </button>
                </div>
              </div>

              {/* Auto Submit */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].autoSubmit || 'Auto Submit'}</label>
                <button
                  onClick={() => {
                    handleVoiceToggle('autoSubmit');
                    onVoiceSettingsChange({ ...tempVoiceSettings, autoSubmit: !tempVoiceSettings.autoSubmit });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    tempVoiceSettings.autoSubmit ? 'bg-active' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      tempVoiceSettings.autoSubmit ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Require Confirmation */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].requireConfirmation || 'Require Confirmation'}</label>
                <button
                  onClick={() => {
                    handleVoiceToggle('requireConfirmation');
                    onVoiceSettingsChange({ ...tempVoiceSettings, requireConfirmation: !tempVoiceSettings.requireConfirmation });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    tempVoiceSettings.requireConfirmation ? 'bg-active' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      tempVoiceSettings.requireConfirmation ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* TTS Feedback */}
              <div className="flex items-center justify-between">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].enableTTS || 'Voice Feedback'}</label>
                <button
                  onClick={() => {
                    handleVoiceToggle('ttsEnabled');
                    onVoiceSettingsChange({ ...tempVoiceSettings, ttsEnabled: !tempVoiceSettings.ttsEnabled });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    tempVoiceSettings.ttsEnabled ? 'bg-active' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      tempVoiceSettings.ttsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Voice Selection for TTS */}
              {tempVoiceSettings.ttsEnabled && availableVoices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm text-white/80">Voice</label>
                  <select
                    value={tempVoiceSettings.ttsVoice || ''}
                    onChange={(e) => {
                      const newSettings = { ...tempVoiceSettings, ttsVoice: e.target.value };
                      setTempVoiceSettings(newSettings);
                      onVoiceSettingsChange(newSettings);
                    }}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-active"
                  >
                    <option value="" className="bg-gray-800">Default</option>
                    {availableVoices
                      .filter(voice => voice.lang.startsWith(LANG_MAP[tempVoiceSettings.language]?.split('-')[0] || tempVoiceSettings.language))
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

              {/* Confidence Threshold */}
              <div className="space-y-2">
                <label className="text-sm text-white/80">{VOICE_TRANSLATIONS[settings.language].confidenceThreshold || 'Confidence Threshold'}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={tempVoiceSettings.confidenceThreshold}
                    onChange={(e) => {
                      const newSettings = {
                        ...tempVoiceSettings,
                        confidenceThreshold: parseFloat(e.target.value)
                      };
                      setTempVoiceSettings(newSettings);
                      onVoiceSettingsChange(newSettings);
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-white/80 w-12 text-right">
                    {Math.round(tempVoiceSettings.confidenceThreshold * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
            <button
              onClick={onSave}
              className="glass-btn w-full py-5 text-white rounded-3xl font-black shadow-xl active:scale-95 transition-all"
            >
              {t.save}
            </button>
            <button
              onClick={onLogout}
              className="w-full py-5 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-3xl transition-all flex items-center justify-center gap-2 glass-btn"
            >
              <LogOut size={14} /> {t.rhythm === 'Your Rhythm' ? 'Log Out' : t.rhythm}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
