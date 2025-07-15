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
  focusMode: boolean;
  focusOpacity: number;
  focusLineCount: number;
  mirrorFlip: boolean;
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
  type: 'updateContent' | 'updateConfig' | 'scroll' | 'close' | 'changeTheme' | 'cycleTheme' | 'toggleFocus' | 'toggleMirror';
  data?: {
    scrollTop?: number;
    scrollHeight?: number;
    clientHeight?: number;
    theme?: string;
    config?: CueModeConfig;
  };
  command?: string;
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
  subscriptions: { dispose(): void }[];
  globalState: {
    get<T>(key: string): T | undefined;
    update(key: string, value: unknown): Thenable<void>;
  };
  workspaceState: {
    get<T>(key: string): T | undefined;
    update(key: string, value: unknown): Thenable<void>;
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

/**
 * Mirror flip state interface
 */
export interface MirrorFlipState {
  enabled: boolean;
  previousState: boolean;
}
