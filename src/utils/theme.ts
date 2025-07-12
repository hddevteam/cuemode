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
        --accent-color: ${themeConfig.accentColor};
        --border-color: ${themeConfig.borderColor};
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
        top: 5px;
        right: 5px;
        z-index: 1000;
        opacity: 0.3;
        transition: opacity 0.3s ease;
        pointer-events: auto;
      }

      .cue-controls:hover {
        opacity: 0.9;
      }

      .cue-button {
        background: var(--accent-color);
        color: var(--bg-color);
        border: none;
        padding: 0.25em 0.5em;
        border-radius: 3px;
        cursor: pointer;
        font-size: 0.65em;
        margin: 0 0.1em;
        transition: all 0.3s ease;
        min-width: auto;
        height: auto;
      }

      .cue-button:hover {
        opacity: 1;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .cue-help {
        position: fixed;
        top: 35px;
        right: 5px;
        background: var(--bg-color);
        border: 1px solid var(--accent-color);
        border-radius: 6px;
        padding: 0.75em;
        max-width: 280px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        font-size: 0.85em;
      }

      .cue-help h3 {
        margin: 0 0 0.4em 0;
        color: var(--accent-color);
        font-size: 1em;
      }

      .cue-help ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .cue-help li {
        margin: 0.25em 0;
        font-size: 0.9em;
        line-height: 1.2;
      }

      .cue-help strong {
        color: var(--accent-color);
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
}
