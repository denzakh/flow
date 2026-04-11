/**
 * VoiceControlService - Главный сервис для управления Web Speech API
 * Обеспечивает распознавание речи (STT) и синтез речи (TTS)
 */

import { VoiceSettings } from '../../types';

// Объявление типов Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    speechSynthesis: SpeechSynthesis;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare var SpeechRecognition: SpeechRecognitionConstructor | undefined;
declare var webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

type VoiceResultCallback = (transcript: string, isFinal: boolean, confidence?: number) => void;
type VoiceErrorCallback = (error: string) => void;

export class VoiceControlService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: window['speechSynthesis'] | null = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private settings: VoiceSettings;

  // Callbacks
  private onResultCallback?: VoiceResultCallback;
  private onErrorCallback?: VoiceErrorCallback;

  constructor(settings: VoiceSettings) {
    this.settings = settings;
    this.initializeRecognition();
    this.initializeSynthesis();
  }

  /**
   * Инициализация распознавания речи
   */
  private initializeRecognition(): void {
    if (!this.isRecognitionSupported()) {
      console.warn('Speech Recognition is not supported in this browser');
      return;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.settings.language === 'ru' ? 'ru-RU' : 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        const confidence = result[0].confidence;

        if (this.onResultCallback) {
          this.onResultCallback(transcript, isFinal, confidence);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);

        let errorMessage = 'Unknown error';
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'no_speech';
            break;
          case 'audio-capture':
            errorMessage = 'no_microphone';
            break;
          case 'not-allowed':
            errorMessage = 'permission_denied';
            break;
          case 'network':
            errorMessage = 'network_error';
            break;
          case 'aborted':
            errorMessage = 'aborted';
            break;
        }

        if (this.onErrorCallback) {
          this.onErrorCallback(errorMessage);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  /**
   * Инициализация синтеза речи
   */
  private initializeSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('Speech Synthesis is not supported in this browser');
    }
  }

  /**
   * Проверка поддержки распознавания речи
   */
  isRecognitionSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * Проверка поддержки синтеза речи
   */
  isSynthesisSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Начать прослушивание
   */
  startListening(
    onResult: VoiceResultCallback,
    onError: VoiceErrorCallback
  ): void {
    if (!this.isRecognitionSupported()) {
      onError('no_microphone');
      return;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition?.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      onError('failed_to_start');
    }
  }

  /**
   * Остановить прослушивание
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Failed to stop recognition:', error);
      }
    }
  }

  /**
   * Произнести текст вслух
   */
  speak(text: string): void {
    if (!this.isSynthesisSupported() || !this.settings.ttsEnabled) {
      return;
    }

    // Остановить текущую речь
    if (this.isSpeaking) {
      this.synthesis?.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.settings.language === 'ru' ? 'ru-RU' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Выбор голоса если указан
    if (this.settings.ttsVoice && this.synthesis) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === this.settings.ttsVoice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
    };

    this.synthesis?.speak(utterance);
  }

  /**
   * Остановить произношение
   */
  stopSpeaking(): void {
    if (this.synthesis && this.isSpeaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Получить список доступных голосов
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isSynthesisSupported()) {
      return [];
    }
    return this.synthesis?.getVoices() || [];
  }

  /**
   * Получить голоса для указанного языка
   */
  getVoicesForLanguage(language: 'ru' | 'en'): SpeechSynthesisVoice[] {
    const allVoices = this.getAvailableVoices();
    const langCode = language === 'ru' ? 'ru' : 'en';

    return allVoices.filter(voice => voice.lang.startsWith(langCode));
  }

  /**
   * Обновить настройки
   */
  updateSettings(settings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...settings };

    // Обновить язык распознавания
    if (this.recognition) {
      this.recognition.lang = this.settings.language === 'ru' ? 'ru-RU' : 'en-US';
    }
  }

  /**
   * Получить текущие настройки
   */
  getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  /**
   * Проверка состояния прослушивания
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Проверка состояния произношения
   */
  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Очистить ресурсы
   */
  dispose(): void {
    this.stopListening();
    this.stopSpeaking();
    this.onResultCallback = undefined;
    this.onErrorCallback = undefined;
  }
}

/**
 * Фабрика для создания VoiceControlService с настройками по умолчанию
 */
export function createVoiceControlService(
  language: 'ru' | 'en' = 'en',
  ttsEnabled: boolean = true
): VoiceControlService {
  const defaultSettings: VoiceSettings = {
    enabled: true,
    language,
    autoSubmit: false,
    requireConfirmation: true,
    ttsEnabled,
    confidenceThreshold: 0.7
  };

  return new VoiceControlService(defaultSettings);
}