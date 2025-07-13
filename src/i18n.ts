import i18next, { TFunction } from 'i18next';
import * as vscode from 'vscode';

/**
 * i18next-based internationalization system for CueMode
 */
export class I18nManager {
  private static instance: I18nManager;
  private i18n: typeof i18next;
  private currentLanguage: string = 'en';

  private constructor() {
    this.i18n = i18next;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  /**
   * Initialize i18next with configuration
   */
  public async initialize(): Promise<void> {
    this.currentLanguage = this.detectLanguage();

    await this.i18n.init({
      lng: this.currentLanguage,
      fallbackLng: 'en',
      debug: false, // Set to true for debugging
      
      // Resources will be loaded dynamically
      resources: {
        en: {
          translation: await this.loadTranslationResource('en')
        },
        'zh-CN': {
          translation: await this.loadTranslationResource('zh-CN')
        },
        ja: {
          translation: await this.loadTranslationResource('ja')
        },
        ko: {
          translation: await this.loadTranslationResource('ko')
        },
        fr: {
          translation: await this.loadTranslationResource('fr')
        },
        de: {
          translation: await this.loadTranslationResource('de')
        }
      },

      interpolation: {
        escapeValue: false,
        formatSeparator: ',',
        format: (value: any, format?: string) => {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'lowercase') return value.toLowerCase();
          return value;
        }
      },

      // Support for pluralization
      pluralSeparator: '_',
      contextSeparator: '_',

      // Namespace configuration
      defaultNS: 'translation',

      // Key separator configuration
      keySeparator: '.',
      nsSeparator: ':',

      // Sync loading since we're in Node.js environment
      initImmediate: false,

      // Support for context and plurals
      postProcess: false,

      // Custom missing key handler
      missingKeyHandler: (lng, _ns, key, fallbackValue) => {
        console.warn(`[i18n] Missing translation for key: ${key} in language: ${lng}`);
        return fallbackValue || key;
      }
    });
  }

  /**
   * Get translation function
   */
  public getTranslationFunction(): TFunction {
    return this.i18n.t.bind(this.i18n);
  }

  /**
   * Get current language
   */
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Change language dynamically
   */
  public async changeLanguage(language: string): Promise<void> {
    // Load resource if not already loaded
    if (!this.i18n.hasResourceBundle(language, 'translation')) {
      const resource = await this.loadTranslationResource(language);
      this.i18n.addResourceBundle(language, 'translation', resource);
    }

    await this.i18n.changeLanguage(language);
    this.currentLanguage = language;
  }

  /**
   * Detect user's preferred language
   */
  private detectLanguage(): string {
    // Try VS Code environment first
    if (typeof vscode !== 'undefined' && vscode.env && vscode.env.language) {
      const vscodeLanguage = vscode.env.language;
      if (vscodeLanguage.startsWith('zh')) {
        return 'zh-CN';
      }
      if (vscodeLanguage.startsWith('ja')) {
        return 'ja';
      }
      if (vscodeLanguage.startsWith('ko')) {
        return 'ko';
      }
      if (vscodeLanguage.startsWith('fr')) {
        return 'fr';
      }
      if (vscodeLanguage.startsWith('de')) {
        return 'de';
      }
      return 'en';
    }

    // Fallback to environment variables
    if (typeof process !== 'undefined' && process.env.VSCODE_NLS_CONFIG) {
      try {
        const nlsConfig = JSON.parse(process.env.VSCODE_NLS_CONFIG);
        const locale = nlsConfig.locale || 'en';
        if (locale.startsWith('zh')) {
          return 'zh-CN';
        }
        if (locale.startsWith('ja')) {
          return 'ja';
        }
        if (locale.startsWith('ko')) {
          return 'ko';
        }
        if (locale.startsWith('fr')) {
          return 'fr';
        }
        if (locale.startsWith('de')) {
          return 'de';
        }
        return 'en';
      } catch (e) {
        console.warn('[i18n] Failed to parse VSCODE_NLS_CONFIG:', e);
      }
    }

    // Final fallback
    const locale = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || 'en';
    if (locale.startsWith('zh')) {
      return 'zh-CN';
    }
    if (locale.startsWith('ja')) {
      return 'ja';
    }
    if (locale.startsWith('ko')) {
      return 'ko';
    }
    if (locale.startsWith('fr')) {
      return 'fr';
    }
    if (locale.startsWith('de')) {
      return 'de';
    }

    return 'en';
  }

  /**
   * Load translation resource for a specific language
   */
  private async loadTranslationResource(language: string): Promise<Record<string, any>> {
    try {
      switch (language) {
        case 'zh-CN':
        case 'zh':
          return require('./locales/zh-CN.json');
        case 'ja':
          return require('./locales/ja.json');
        case 'ko':
          return require('./locales/ko.json');
        case 'fr':
          return require('./locales/fr.json');
        case 'de':
          return require('./locales/de.json');
        case 'en':
        default:
          return require('./locales/en.json');
      }
    } catch (error) {
      console.warn(`[i18n] Failed to load translations for ${language}, falling back to English:`, error);
      return require('./locales/en.json');
    }
  }

  /**
   * Get all available languages
   */
  public getAvailableLanguages(): { code: string; name: string; nativeName: string }[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' }
    ];
  }

  /**
   * Check if a key exists in current language
   */
  public exists(key: string): boolean {
    return this.i18n.exists(key);
  }

  /**
   * Get translation with type safety
   */
  public t(key: string, options?: any): string {
    return this.i18n.t(key, options) as string;
  }
}

// Export singleton instance
const i18nManager = I18nManager.getInstance();

/**
 * Translation function with type safety
 * Usage: t('commands.activateMode') or t('notifications.themeChanged', { theme: 'Dark' })
 */
export const t = (key: string, options?: any): string => {
  return i18nManager.t(key, options);
};

/**
 * Initialize i18n system
 * Should be called once during extension activation
 */
export const initializeI18n = async (): Promise<void> => {
  await i18nManager.initialize();
};

/**
 * Change language
 */
export const changeLanguage = async (language: string): Promise<void> => {
  await i18nManager.changeLanguage(language);
};

/**
 * Get current language
 */
export const getCurrentLanguage = (): string => {
  return i18nManager.getCurrentLanguage();
};

/**
 * Get available languages
 */
export const getAvailableLanguages = () => {
  return i18nManager.getAvailableLanguages();
};

// Re-export for compatibility
export default i18nManager;