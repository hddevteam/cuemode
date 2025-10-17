import { ColorTheme, ThemeConfig } from '../types';

/**
 * Theme manager for CueMode
 */
export class ThemeManager {
  private static readonly THEMES: Record<ColorTheme, ThemeConfig> = {
    classic: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      accentColor: '#007acc',
      borderColor: '#333333'
    },
    inverted: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      accentColor: '#007acc',
      borderColor: '#cccccc'
    },
    midnightBlue: {
      backgroundColor: '#1e2a4a',
      textColor: '#e8f4f8',
      accentColor: '#4fc3f7',
      borderColor: '#2d3a5a'
    },
    sunset: {
      backgroundColor: '#2d1b2e',
      textColor: '#fff8dc',
      accentColor: '#ff8c00',
      borderColor: '#4a2c3a'
    },
    forest: {
      backgroundColor: '#1b2f1b',
      textColor: '#e8f5e8',
      accentColor: '#4caf50',
      borderColor: '#2e4a2e'
    },
    ocean: {
      backgroundColor: '#0d2b2e',
      textColor: '#e0f7fa',
      accentColor: '#26c6da',
      borderColor: '#1e3a3e'
    },
    rose: {
      backgroundColor: '#3d1a26',
      textColor: '#fce4ec',
      accentColor: '#e91e63',
      borderColor: '#5a2735'
    }
  };

  /**
   * Get theme configuration
   */
  public static getTheme(theme: ColorTheme): ThemeConfig {
    return this.THEMES[theme] || this.THEMES.classic;
  }

  /**
   * Get all available themes
   */
  public static getAllThemes(): Record<ColorTheme, ThemeConfig> {
    return { ...this.THEMES };
  }

  /**
   * Get theme names
   */
  public static getThemeNames(): ColorTheme[] {
    return Object.keys(this.THEMES) as ColorTheme[];
  }

  /**
   * Generate CSS for theme
   */
  public static generateCSS(theme: ColorTheme, fontSize: number, lineHeight: number, maxWidth: number, padding: number): string {
    const themeConfig = this.getTheme(theme);
    
    return `
      :root {
        --bg-color: ${themeConfig.backgroundColor};
        --text-color: ${themeConfig.textColor};
        --accent-color: ${themeConfig.accentColor || '#007acc'};
        --border-color: ${themeConfig.borderColor || '#333333'};
        --accent-color-alpha-50: ${this.hexToRgba(themeConfig.accentColor || '#007acc', 0.50)};
        --accent-color-alpha-70: ${this.hexToRgba(themeConfig.accentColor || '#007acc', 0.70)};
        --font-size: ${fontSize}px;
        --line-height: ${lineHeight};
        --max-width: ${maxWidth}px;
        --padding: ${padding}px;
      }

      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: var(--font-size);
        line-height: var(--line-height);
        margin: 0;
        padding: var(--padding);
        overflow-x: hidden;
        scroll-behavior: smooth;
      }

      .cue-container {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: var(--padding);
        box-sizing: border-box;
      }

      .cue-content {
        white-space: pre-wrap;
        word-wrap: break-word;
        tab-size: 4;
      }

      .cue-content pre {
        white-space: pre-wrap;
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
      }

      .cue-line {
        display: block;
        margin: 0.2em 0;
        padding: 0.1em 0;
        border-left: 2px solid transparent;
        transition: border-left-color 0.3s ease;
      }

      .cue-line:hover {
        border-left-color: var(--accent-color);
      }

      /* Markdown Elements Styling */
      .markdown-blockquote {
        border-left: 4px solid var(--accent-color);
        margin: 0.5em 0;
        padding: 0.3em 0 0.3em 1em;
        color: var(--text-color) !important;
        font-weight: 700;
        position: relative;
        opacity: 1;
        background: none !important;
        background-color: transparent !important;
      }

      .markdown-blockquote-nested-2 {
        margin-left: 1.5em;
        border-left-width: 3px;
        border-left-color: var(--accent-color-alpha-70);
        padding-left: 0.8em;
        font-weight: 700;
        color: var(--text-color) !important;
        opacity: 1;
        background: none !important;
        background-color: transparent !important;
      }

      .markdown-blockquote-nested-3 {
        margin-left: 2.5em;
        border-left-width: 2px;
        border-left-color: var(--accent-color-alpha-50);
        padding-left: 0.6em;
        font-weight: 700;
        color: var(--text-color) !important;
        opacity: 1;
        background: none !important;
        background-color: transparent !important;
      }

      .markdown-blockquote-nested-4,
      .markdown-blockquote-nested-5 {
        margin-left: 3.5em;
        border-left-width: 1px;
        border-left-color: var(--accent-color-alpha-50);
        padding-left: 0.4em;
        font-weight: 700;
        color: var(--text-color) !important;
        opacity: 1;
        background: none !important;
        background-color: transparent !important;
      }
        border-left-color: var(--accent-color-alpha-50);
        padding-left: 0.4em;
        font-weight: 300;
        opacity: 0.8;
      }

      .markdown-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        overflow: hidden;
      }

      .markdown-table-header {
        background-color: rgba(128, 128, 128, 0.2);
        padding: 0.75em;
        text-align: left;
        font-weight: bold;
        border-bottom: 2px solid var(--accent-color);
        border-right: 1px solid var(--border-color);
      }

      .markdown-table-header:last-child {
        border-right: none;
      }

      .markdown-table-cell {
        padding: 0.75em;
        border-bottom: 1px solid var(--border-color);
        border-right: 1px solid var(--border-color);
      }

      .markdown-table-cell:last-child {
        border-right: none;
      }

      .markdown-table-row:last-child .markdown-table-cell {
        border-bottom: none;
      }

      .markdown-table-row:nth-child(even) {
        background-color: rgba(128, 128, 128, 0.05);
      }

      .markdown-list {
        margin: 0.5em 0;
        padding-left: 1.5em;
      }

      .markdown-list-item {
        margin: 0.2em 0;
        line-height: 1.4;
      }

      .markdown-list-item-nested-2 {
        margin-left: 2em;
        font-size: 0.95em;
      }

      .markdown-list-item-nested-3 {
        margin-left: 4em;
        font-size: 0.9em;
      }

      .markdown-list-item-nested-4,
      .markdown-list-item-nested-5 {
        margin-left: 6em;
        font-size: 0.85em;
      }

      .markdown-header {
        font-weight: bold;
        margin: 0.5em 0 0.3em 0;
        color: var(--accent-color);
      }

      .markdown-h1 {
        font-size: 1.8em;
        border-bottom: 2px solid var(--accent-color);
        padding-bottom: 0.2em;
      }

      .markdown-h2 {
        font-size: 1.5em;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 0.2em;
      }

      .markdown-h3 {
        font-size: 1.3em;
      }

      .markdown-h4 {
        font-size: 1.1em;
      }

      .markdown-h5,
      .markdown-h6 {
        font-size: 1em;
        opacity: 0.8;
      }

      .markdown-bold {
        font-weight: bold;
      }

      .markdown-italic {
        font-style: italic;
        opacity: 0.9;
      }

      .markdown-inline-code {
        background-color: rgba(128, 128, 128, 0.15);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        border: 1px solid var(--border-color);
      }

      .markdown-code-block {
        background-color: rgba(128, 128, 128, 0.1);
        padding: 1em;
        border-radius: 6px;
        margin: 1em 0;
        border: 1px solid var(--border-color);
        overflow-x: auto;
      }

      .markdown-hr {
        border: none;
        height: 2px;
        background: var(--accent-color);
        margin: 1.5em 0;
        border-radius: 1px;
      }

      .markdown-link {
        color: var(--accent-color);
        text-decoration: underline;
      }

      .markdown-link:hover {
        opacity: 0.8;
      }

      .markdown-strikethrough {
        text-decoration: line-through;
        opacity: 0.7;
      }

      .markdown-task-item {
        display: flex;
        align-items: center;
        margin: 0.2em 0;
      }

      .markdown-task-checkbox {
        margin-right: 0.5em;
      }

      .markdown-task-checked {
        opacity: 0.7;
      }

      .markdown-task-text {
        flex: 1;
      }

      .cue-highlight {
        background-color: var(--accent-color);
        color: var(--bg-color);
        padding: 0.1em 0.2em;
        border-radius: 2px;
      }

      .cue-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: var(--accent-color);
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      .cue-loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--accent-color);
        font-size: 1.2em;
      }

      .cue-controls {
        position: fixed;
        top: 8px;
        right: 8px;
        z-index: 1000;
        opacity: 0.4;
        transition: opacity 0.3s ease;
        pointer-events: auto;
        display: flex;
        gap: 0.3em;
      }

      .cue-controls:hover {
        opacity: 1;
      }

      .cue-button {
        background: linear-gradient(135deg, var(--accent-color), #005080);
        color: white;
        border: none;
        padding: 0.4em 0.8em;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        margin: 0;
        transition: all 0.3s ease;
        min-width: auto;
        height: auto;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .cue-button:hover {
        opacity: 1;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, #007acc, var(--accent-color));
      }

      .cue-button:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }

      /* Responsive control buttons */
      @media (max-width: 768px) {
        .cue-controls {
          top: 5px;
          right: 5px;
        }
        
        .cue-button {
          padding: 0.3em 0.6em;
          font-size: 11px;
        }
      }

            .cue-help {
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(30, 30, 30, 0.98);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 2px solid var(--accent-color);
        border-radius: 8px;
        padding: 1em 1.2em;
        width: 560px;
        max-width: calc(100vw - 40px);
        max-height: calc(100vh - 60px);
        z-index: 1000;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6);
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);
        overflow: hidden;
        color: var(--text-color);
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
        transition: all 0.2s ease-out;
        pointer-events: none;
      }

      .cue-help[style*="display: block"] {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      .cue-help h3 {
        margin: 0 0 0.7em 0;
        color: var(--accent-color);
        font-size: 16px;
        text-align: center;
        border-bottom: 1px solid var(--accent-color);
        padding-bottom: 0.4em;
        font-weight: bold;
      }

      .help-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1em;
        align-items: start;
      }

      .help-column {
        min-width: 0;
      }

      .help-section h4 {
        margin: 0 0 0.5em 0;
        color: var(--accent-color);
        font-size: 13px;
        font-weight: bold;
        opacity: 0.9;
        padding-bottom: 0.2em;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .cue-help ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .cue-help li {
        margin: 0.3em 0;
        font-size: 12px;
        line-height: 1.4;
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.15em 0;
      }

      .cue-help li span {
        flex: 1;
        min-width: 0;
      }

      .cue-help kbd {
        background: linear-gradient(135deg, var(--accent-color), #005080);
        color: white;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 11px;
        font-weight: bold;
        min-width: 2.5em;
        text-align: center;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
        white-space: nowrap;
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .cue-help {
          top: 5px;
          right: 5px;
          left: 5px;
          max-width: none;
          min-width: 0;
          padding: 1em;
          font-size: 13px;
        }
        
        .help-grid {
          grid-template-columns: 1fr;
          gap: 1em;
        }
        
        .cue-help kbd {
          min-width: 2.5em;
          padding: 0.15em 0.4em;
        }
      }

      @media (max-height: 600px) {
        .cue-help {
          top: 5px;
          max-height: calc(100vh - 50px);
          padding: 0.8em;
        }
        
        .cue-help h3 {
          margin-bottom: 0.6em;
          font-size: 15px;
        }
        
        .help-grid {
          gap: 1em;
        }
        
        .help-section h4 {
          margin-bottom: 0.5em;
          font-size: 12px;
        }
        
        .cue-help li {
          margin: 0.25em 0;
        }
      }

      /* Scrollbar styling */
      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: var(--bg-color);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--accent-color);
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: var(--border-color);
      }

      /* Help dialog scrollbar */
      .cue-help::-webkit-scrollbar {
        width: 6px;
      }

      .cue-help::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }

      .cue-help::-webkit-scrollbar-thumb {
        background: var(--accent-color);
        border-radius: 3px;
      }

      .cue-help::-webkit-scrollbar-thumb:hover {
        background: #007acc;
      }

      /* Help dialog responsive design */
      @media (max-width: 768px) {
        .cue-help {
          position: fixed;
          top: 5px;
          left: 5px;
          right: 5px;
          width: auto;
          max-width: none;
          padding: 0.9em;
          font-size: 12px;
          max-height: calc(100vh - 30px);
        }

        .help-grid {
          grid-template-columns: 1fr;
          gap: 0.9em;
        }

        .cue-help li {
          margin: 0.25em 0;
          font-size: 11px;
        }

        .cue-help kbd {
          min-width: 2.2em;
          padding: 0.15em 0.3em;
          font-size: 0.7em;
        }
      }

      @media (max-width: 520px) {
        .cue-help {
          padding: 0.7em;
          font-size: 0.6em;
        }

        .cue-help h3 {
          font-size: 0.9em;
          margin-bottom: 0.6em;
        }

        .help-section h4 {
          font-size: 0.8em;
          margin-bottom: 0.5em;
        }

        .cue-help li {
          font-size: 0.75em;
          line-height: 1.2;
          gap: 0.4em;
        }

        .cue-help kbd {
          min-width: 2em;
          padding: 0.12em 0.25em;
          font-size: 0.65em;
        }
      }

      @media (max-height: 600px) {
        .cue-help {
          max-height: calc(100vh - 20px);
          font-size: 0.65em;
          padding: 0.7em;
        }
      }
      }

      /* Responsive design */
      @media (max-width: 768px) {
        body {
          font-size: calc(var(--font-size) * 0.8);
          padding: calc(var(--padding) * 0.5);
        }
        
        .cue-container {
          max-width: 100%;
          padding: calc(var(--padding) * 0.5);
        }
      }
    `;
  }

  /**
   * Check if theme is dark
   */
  public static isDarkTheme(theme: ColorTheme): boolean {
    const themeConfig = this.getTheme(theme);
    // Simple check based on background color brightness
    const hex = themeConfig.backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  }

  /**
   * Get contrast ratio between two colors
   */
  public static getContrastRatio(color1: string, color2: string): number {
    const getLuminance = (hex: string): number => {
      const rgb = hex.replace('#', '');
      const r = parseInt(rgb.substr(0, 2), 16) / 255;
      const g = parseInt(rgb.substr(2, 2), 16) / 255;
      const b = parseInt(rgb.substr(4, 2), 16) / 255;
      
      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * (sRGB[0] || 0) + 0.7152 * (sRGB[1] || 0) + 0.0722 * (sRGB[2] || 0);
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Validate theme accessibility
   */
  public static validateThemeAccessibility(theme: ColorTheme): boolean {
    const themeConfig = this.getTheme(theme);
    const contrastRatio = this.getContrastRatio(themeConfig.backgroundColor, themeConfig.textColor);
    
    // WCAG AA standard requires at least 4.5:1 contrast ratio for normal text
    return contrastRatio >= 4.5;
  }

  /**
   * Convert hex color to rgba with alpha
   */
  private static hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
