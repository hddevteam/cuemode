/**
 * CueMode configuration interface
 */
export interface CueModeConfig {
  colorTheme: ColorTheme;
  maxWidth: number;
  fontSize: number;
  lineHeight: number;
  padding: number;
  scrollSpeed: number;
  startingPosition: number;
}

/**
 * Available color themes
 */
export type ColorTheme = 
  | 'classic'
  | 'inverted'
  | 'midnightBlue'
  | 'sunset'
  | 'forest'
  | 'ocean'
  | 'rose';

/**
 * Theme configuration
 */
export interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  borderColor?: string;
}

/**
 * Webview message types
 */
export interface WebviewMessage {
  type: 'updateContent' | 'updateConfig' | 'scroll' | 'close';
  data?: any;
}

/**
 * CueMode panel state
 */
export interface CueModeState {
  isActive: boolean;
  content: string;
  config: CueModeConfig;
  filename: string;
}

/**
 * Extension context interface
 */
export interface ExtensionContext {
  subscriptions: { dispose(): any }[];
  globalState: {
    get<T>(key: string): T | undefined;
    update(key: string, value: any): Thenable<void>;
  };
  workspaceState: {
    get<T>(key: string): T | undefined;
    update(key: string, value: any): Thenable<void>;
  };
}

/**
 * Error types
 */
export class CueModeError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'CueModeError';
  }
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
