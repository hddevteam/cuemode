import * as vscode from 'vscode';

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
  markdownMode: boolean;
  markdownFeatures: MarkdownFeatures;
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
 * Markdown features configuration
 */
export interface MarkdownFeatures {
  headers: boolean;
  emphasis: boolean;
  lists: boolean;
  links: boolean;
  code: boolean;
  blockquotes: boolean;
  tables: boolean;
  taskLists: boolean;
  strikethrough: boolean;
  horizontalRule: boolean;
}

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
  type: 'updateContent' | 'updateConfig' | 'scroll' | 'close' | 'changeTheme' | 'cycleTheme' | 'toggleFocus' | 'toggleMirror' | 'toggleMarkdown' | 'configureMarkdown' | 'adjustLineHeight' | 'increaseFontSize' | 'decreaseFontSize' | 'openEditor';
  data?: {
    scrollTop?: number;
    scrollHeight?: number;
    clientHeight?: number;
    theme?: string;
    config?: CueModeConfig;
    markdownFeatures?: MarkdownFeatures;
    lineNumber?: number;
    contextText?: string;
    clickedText?: string;
    beforeText?: string;
    afterText?: string;
    characterOffset?: number;
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
  sourceDocument?: vscode.TextDocument | undefined;
  savedScrollPosition?: number | undefined;
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
