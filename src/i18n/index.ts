/**
 * Internationalization message interface
 */
export interface Messages {
  // Commands
  'command.title': string;
  'command.description': string;
  'command.changeTheme': string;
  'command.removeLeadingSpaces': string;
  
  // Notifications
  'notification.activated': string;
  'notification.deactivated': string;
  'notification.configUpdated': string;
  'notification.themeChanged': string;
  'notification.spacesRemoved': string;
  'notification.error': string;
  
  // Errors
  'error.noActiveEditor': string;
  'error.noContent': string;
  'error.webviewFailed': string;
  'error.configInvalid': string;
  'error.noSelection': string;
  
  // Settings
  'settings.colorTheme': string;
  'settings.maxWidth': string;
  'settings.fontSize': string;
  'settings.lineHeight': string;
  'settings.padding': string;
  'settings.scrollSpeed': string;
  'settings.startingPosition': string;
  
  // Themes
  'theme.classic': string;
  'theme.inverted': string;
  'theme.midnightBlue': string;
  'theme.sunset': string;
  'theme.forest': string;
  'theme.ocean': string;
  'theme.rose': string;
  
  // UI
  'ui.title': string;
  'ui.close': string;
  'ui.help': string;
  'ui.shortcuts': string;
  'ui.loading': string;
  'ui.ready': string;
  
  // Help and shortcuts
  'help.shortcuts.space': string;
  'help.shortcuts.plus': string;
  'help.shortcuts.minus': string;
  'help.shortcuts.r': string;
  'help.shortcuts.escape': string;
  'help.shortcuts.arrows': string;
  'help.shortcuts.changeTheme': string;
  'help.shortcuts.removeSpaces': string;
}

/**
 * Internationalization manager
 */
export class I18n {
  private static instance: I18n;
  private messages: Messages;
  private currentLocale: string;

  private constructor() {
    this.currentLocale = this.detectLocale();
    this.messages = this.loadMessages(this.currentLocale);
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }

  /**
   * Get translated message
   */
  public static t(key: keyof Messages, ...args: string[]): string {
    return I18n.getInstance().translate(key, ...args);
  }

  /**
   * Get current locale
   */
  public static getLocale(): string {
    return I18n.getInstance().currentLocale;
  }

  /**
   * Translate message
   */
  public translate(key: keyof Messages, ...args: string[]): string {
    // Handle null, undefined, or invalid keys
    if (key === null || key === undefined || typeof key !== 'string') {
      return `[Invalid key: ${key}]`;
    }
    
    let message = this.messages[key] || key;
    
    // Simple interpolation
    if (args.length > 0) {
      args.forEach((arg, index) => {
        message = message.replace(`{${index}}`, String(arg));
      });
    }
    
    return message;
  }

  /**
   * Detect user locale
   */
  private detectLocale(): string {
    // In VS Code environment
    if (typeof process !== 'undefined' && process.env.VSCODE_NLS_CONFIG) {
      try {
        const nlsConfig = JSON.parse(process.env.VSCODE_NLS_CONFIG);
        return nlsConfig.locale || 'en';
      } catch (e) {
        // Fallback to default
      }
    }

    // Check for Chinese variants
    const locale = process.env.LANG || process.env.LC_ALL || process.env.LC_MESSAGES || 'en';
    if (locale.startsWith('zh')) {
      return 'zh-cn';
    }

    return 'en';
  }

  /**
   * Load messages for locale
   */
  private loadMessages(locale: string): Messages {
    try {
      if (locale.startsWith('zh')) {
        return require('./zh-cn').default;
      }
      return require('./en').default;
    } catch (e) {
      // Fallback to English
      return require('./en').default;
    }
  }
}

export default I18n;
