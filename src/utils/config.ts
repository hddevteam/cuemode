import * as vscode from 'vscode';
import { CueModeConfig, ColorTheme, ConfigValidationResult, MarkdownFeatures } from '../types';

/**
 * Configuration manager for CueMode
 */
export class ConfigManager {
  private static readonly CONFIG_SECTION = 'cuemode';
  private static readonly DEFAULT_CONFIG: CueModeConfig = {
    colorTheme: 'classic',
    maxWidth: 800,
    fontSize: 24,
    lineHeight: 1.5,
    padding: 10,
    scrollSpeed: 0.1,
    startingPosition: 50,
    focusMode: false,
    focusOpacity: 0.3,
    focusLineCount: 3,
    mirrorFlip: false,
    markdownMode: true,
    markdownFeatures: {
      headers: true,
      emphasis: true,
      lists: true,
      links: false,
      code: true,
      blockquotes: true,
      tables: true,
      taskLists: true,
      strikethrough: false,
      horizontalRule: true
    }
  };

  /**
   * Get current configuration
   */
  public static getConfig(): CueModeConfig {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    
    return {
      colorTheme: config.get<ColorTheme>('colorTheme', this.DEFAULT_CONFIG.colorTheme),
      maxWidth: config.get<number>('maxWidth', this.DEFAULT_CONFIG.maxWidth),
      fontSize: config.get<number>('fontSize', this.DEFAULT_CONFIG.fontSize),
      lineHeight: config.get<number>('lineHeight', this.DEFAULT_CONFIG.lineHeight),
      padding: config.get<number>('padding', this.DEFAULT_CONFIG.padding),
      scrollSpeed: config.get<number>('scrollSpeed', this.DEFAULT_CONFIG.scrollSpeed),
      startingPosition: config.get<number>('startingPosition', this.DEFAULT_CONFIG.startingPosition),
      focusMode: config.get<boolean>('focusMode', this.DEFAULT_CONFIG.focusMode),
      focusOpacity: config.get<number>('focusOpacity', this.DEFAULT_CONFIG.focusOpacity),
      focusLineCount: config.get<number>('focusLineCount', this.DEFAULT_CONFIG.focusLineCount),
      mirrorFlip: config.get<boolean>('mirrorFlip', this.DEFAULT_CONFIG.mirrorFlip),
      markdownMode: config.get<boolean>('markdownMode', this.DEFAULT_CONFIG.markdownMode),
      markdownFeatures: config.get<MarkdownFeatures>('markdownFeatures', this.DEFAULT_CONFIG.markdownFeatures)
    };
  }

  /**
   * Update configuration
   */
  public static async updateConfig(key: keyof CueModeConfig, value: CueModeConfig[keyof CueModeConfig]): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    await config.update(key, value, vscode.ConfigurationTarget.Global);
  }

  /**
   * Validate configuration
   */
  public static validateConfig(config: CueModeConfig): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Handle null or undefined config
    if (!config || typeof config !== 'object') {
      errors.push('Configuration is null or not an object');
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    // Check required properties
    const requiredProperties: (keyof CueModeConfig)[] = [
      'colorTheme', 'maxWidth', 'fontSize', 'lineHeight', 'padding', 'scrollSpeed', 'startingPosition', 'focusMode', 'focusOpacity', 'focusLineCount', 'mirrorFlip', 'markdownMode', 'markdownFeatures'
    ];
    
    for (const prop of requiredProperties) {
      if (!(prop in config) || config[prop] === undefined || config[prop] === null) {
        errors.push(`Missing or null property: ${prop}`);
      }
    }

    // If required properties are missing, return early
    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
        warnings
      };
    }

    // Validate color theme
    const validThemes: ColorTheme[] = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
    if (!validThemes.includes(config.colorTheme)) {
      errors.push(`Invalid color theme: ${config.colorTheme}`);
    }

    // Validate numeric values
    if (config.maxWidth <= 0 || config.maxWidth > 2000) {
      errors.push('maxWidth must be between 1 and 2000');
    }

    if (config.fontSize <= 0 || config.fontSize > 100) {
      errors.push('fontSize must be between 1 and 100');
    }

    if (config.lineHeight <= 0 || config.lineHeight > 5) {
      errors.push('lineHeight must be between 0.1 and 5');
    }

    if (config.padding < 0 || config.padding > 100) {
      errors.push('padding must be between 0 and 100');
    }

    if (config.scrollSpeed <= 0 || config.scrollSpeed > 1) {
      errors.push('scrollSpeed must be between 0.01 and 1');
    }

    if (config.startingPosition < 0 || config.startingPosition > 100) {
      errors.push('startingPosition must be between 0 and 100');
    }

    // Validate markdown features
    if (config.markdownFeatures && typeof config.markdownFeatures === 'object') {
      const markdownFeatureKeys: (keyof MarkdownFeatures)[] = [
        'headers', 'emphasis', 'lists', 'links', 'code', 'blockquotes', 'tables', 'taskLists', 'strikethrough', 'horizontalRule'
      ];
      
      for (const key of markdownFeatureKeys) {
        if (!(key in config.markdownFeatures) || typeof config.markdownFeatures[key] !== 'boolean') {
          warnings.push(`Invalid or missing markdown feature: ${key}`);
        }
      }
    } else if (config.markdownMode) {
      errors.push('markdownFeatures must be an object when markdownMode is enabled');
    }

    // Warnings
    if (config.fontSize > 50) {
      warnings.push('Font size is very large, may cause display issues');
    }

    if (config.maxWidth > 1200) {
      warnings.push('Max width is very large, may not fit on smaller screens');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get safe configuration (with fallbacks)
   */
  public static getSafeConfig(): CueModeConfig {
    const config = this.getConfig();
    const validation = this.validateConfig(config);

    if (!validation.isValid) {
      console.warn('Invalid CueMode configuration, using defaults:', validation.errors);
      return { ...this.DEFAULT_CONFIG };
    }

    return config;
  }

  /**
   * Register configuration change listener
   */
  public static onConfigChanged(callback: (config: CueModeConfig) => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration(this.CONFIG_SECTION)) {
        const newConfig = this.getSafeConfig();
        callback(newConfig);
      }
    });
  }

  /**
   * Get default configuration
   */
  public static getDefaultConfig(): CueModeConfig {
    return { ...this.DEFAULT_CONFIG };
  }

  /**
   * Reset configuration to defaults
   */
  public static async resetToDefaults(): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    const defaultConfig = this.getDefaultConfig();

    for (const [key, value] of Object.entries(defaultConfig)) {
      await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
  }
}
