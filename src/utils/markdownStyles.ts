/**
 * Markdown Styles for CueMode
 * Provides styling for parsed markdown elements that integrates with all themes
 */

import { ThemeConfig } from '../types';

/**
 * Generate CSS styles for markdown elements
 * @param theme Theme configuration
 * @returns CSS string for markdown elements
 */
export function generateMarkdownCSS(theme: ThemeConfig): string {
  return `
    /* Markdown Headers - Different sizes for better visual hierarchy */
    .markdown-header {
      font-weight: 600;
      margin: 0.15em 0 0.1em 0;
      line-height: 1.2;
      color: ${theme.textColor};
    }
    
    .markdown-h1 {
      font-size: 2.0em;  /* Largest heading */
      border-bottom: 2px solid ${theme.accentColor || theme.textColor};
      padding-bottom: 0.2em;
    }
    
    .markdown-h2 {
      font-size: 1.7em;  /* Slightly smaller than h1 */
      border-bottom: 1px solid ${theme.accentColor || theme.textColor};
      padding-bottom: 0.1em;
    }
    
    .markdown-h3 {
      font-size: 1.4em;  /* Medium-large heading */
    }
    
    .markdown-h4 {
      font-size: 1.2em;  /* Medium heading */
    }
    
    .markdown-h5 {
      font-size: 1.05em; /* Slightly larger than base */
      font-weight: 700;
    }
    
    .markdown-h6 {
      font-size: 0.95em; /* Slightly smaller than base */
      font-weight: 700;
      opacity: 0.8;
    }

    /* Markdown HTML Comments - Subtle, unobtrusive display */
    .markdown-comment {
      color: ${theme.textColor};
      opacity: 0.4;
      font-size: 0.85em;
      font-style: italic;
      padding: 0.3em 0;
      margin: 0.2em 0;
      line-height: 1.3;
    }
    
    .markdown-comment-marker {
      font-style: normal;
      opacity: 0.6;
      margin-right: 0.3em;
    }
    
    .markdown-comment-text {
      font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
    }

    /* Markdown Emphasis */
    .markdown-bold {
      font-weight: 700;
      color: ${theme.textColor};
    }
    
    .markdown-italic {
      font-style: italic;
      color: ${theme.textColor};
    }
    
    .markdown-bold-italic {
      font-weight: 700;
      font-style: italic;
      color: ${theme.textColor};
    }

    /* Markdown Lists */
    .markdown-list {
      margin: 0.02em 0;
      padding-left: 0;
      margin-left: 0.6em;
      color: ${theme.textColor};
    }
    
    .markdown-ul {
      list-style-type: disc;
    }
    
    .markdown-ol {
      list-style-type: decimal;
    }
    
    .markdown-list-item {
      margin: 0.01em 0;
      line-height: 1.1;
    }

    /* Markdown Code */
    .markdown-inline-code {
      background-color: rgba(127, 127, 127, 0.15);
      border: 1px solid rgba(127, 127, 127, 0.3);
      border-radius: 3px;
      padding: 0.1em 0.3em;
      font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
      color: ${theme.textColor};
    }
    
    .markdown-code-block {
      background-color: rgba(127, 127, 127, 0.1);
      border: 1px solid rgba(127, 127, 127, 0.3);
      border-radius: 6px;
      padding: 1em;
      margin: 0.25em 0;
      overflow-x: auto;
      font-family: 'Courier New', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.9em;
      line-height: 1.4;
      white-space: pre;
      color: ${theme.textColor};
    }
    
    .markdown-code-block code {
      background: none;
      border: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
    }

    /* Markdown Blockquotes */
    .markdown-blockquote {
      border-left: 4px solid ${theme.accentColor || theme.textColor};
      padding: 0.5em 0 0.5em 1em;
      margin: 0.25em 0;
      font-style: italic;
      color: ${theme.textColor};
      opacity: 0.9;
      background-color: rgba(127, 127, 127, 0.05);
    }
    
    /* Nested blockquotes with progressive indentation */
    .markdown-blockquote-nested-2 {
      margin-left: 1.5em;
      border-left-width: 3px;
      opacity: 0.8;
      background-color: rgba(127, 127, 127, 0.08);
    }
    
    .markdown-blockquote-nested-3 {
      margin-left: 3em;
      border-left-width: 2px;
      opacity: 0.7;
      background-color: rgba(127, 127, 127, 0.12);
    }
    
    .markdown-blockquote-nested-4 {
      margin-left: 4.5em;
      border-left-width: 2px;
      opacity: 0.6;
      background-color: rgba(127, 127, 127, 0.15);
    }
    
    .markdown-blockquote-nested-5 {
      margin-left: 6em;
      border-left-width: 1px;
      opacity: 0.5;
      background-color: rgba(127, 127, 127, 0.18);
    }

    /* Markdown Links */
    .markdown-link {
      color: ${theme.accentColor || '#007acc'};
      text-decoration: underline;
      transition: color 0.2s ease;
    }
    
    .markdown-link:hover {
      color: ${theme.textColor};
      text-decoration: none;
    }

    /* Markdown Tables */
    .markdown-table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
      margin: 0.02em 0 0.05em 0;
      font-size: 0.95em;
    }
    
    .markdown-table-header {
      background-color: rgba(127, 127, 127, 0.15);
      font-weight: 600;
      text-align: left;
      padding: 0.3em 0.5em;
      border: 1px solid rgba(127, 127, 127, 0.3);
      color: ${theme.textColor};
    }
    
    .markdown-table-cell {
      padding: 0.3em 0.5em;
      border: 1px solid rgba(127, 127, 127, 0.3);
      color: ${theme.textColor};
    }
    
    .markdown-table-row:nth-child(even) {
      background-color: rgba(127, 127, 127, 0.05);
    }

    /* Markdown Task Lists */
    .markdown-task-item {
      display: flex;
      align-items: center;
      margin: 0.5em 0;
      color: ${theme.textColor};
      line-height: 1.6;
      min-height: 1.5em;
    }
    
    .markdown-task-checkbox {
      margin-right: 0.75em;
      margin-top: 0;
      cursor: pointer;
      flex-shrink: 0;
      vertical-align: middle;
    }
    
    .markdown-task-text {
      flex: 1;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      min-width: 0;
    }
    
    .markdown-task-checked .markdown-task-text {
      text-decoration: line-through;
      opacity: 0.7;
    }

    /* Markdown Strikethrough */
    .markdown-strikethrough {
      text-decoration: line-through;
      opacity: 0.7;
      color: ${theme.textColor};
    }

    /* Markdown Horizontal Rule */
    .markdown-hr {
      border: none;
      height: 2px;
      background: linear-gradient(to right, 
        transparent, 
        ${theme.accentColor || theme.textColor}, 
        transparent
      );
      margin: 2em 0;
      opacity: 0.6;
    }

    /* Focus Mode Compatibility */
    .focus-line .markdown-header,
    .focus-line .markdown-bold,
    .focus-line .markdown-italic,
    .focus-line .markdown-bold-italic,
    .focus-line .markdown-inline-code,
    .focus-line .markdown-link,
    .focus-line .markdown-strikethrough {
      color: inherit;
    }
    
    .focus-line .markdown-blockquote,
    .focus-line .markdown-blockquote-nested-2,
    .focus-line .markdown-blockquote-nested-3,
    .focus-line .markdown-blockquote-nested-4,
    .focus-line .markdown-blockquote-nested-5 {
      border-left-color: currentColor;
    }
    
    .focus-line .markdown-hr {
      background: linear-gradient(to right, 
        transparent, 
        currentColor, 
        transparent
      );
    }

    /* Theme-specific adjustments */
    .theme-inverted .markdown-inline-code,
    .theme-inverted .markdown-code-block {
      background-color: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    .theme-inverted .markdown-table-header {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .theme-inverted .markdown-table-row:nth-child(even) {
      background-color: rgba(255, 255, 255, 0.05);
    }
    
    .theme-inverted .markdown-blockquote {
      background-color: rgba(255, 255, 255, 0.05);
    }

    /* Dark theme adjustments */
    .theme-midnight-blue .markdown-inline-code,
    .theme-midnight-blue .markdown-code-block,
    .theme-forest .markdown-inline-code,
    .theme-forest .markdown-code-block,
    .theme-ocean .markdown-inline-code,
    .theme-ocean .markdown-code-block {
      background-color: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
    }

    /* Responsive design for smaller screens */
    @media (max-width: 768px) {
      .markdown-table {
        font-size: 0.85em;
      }
      
      .markdown-table-header,
      .markdown-table-cell {
        padding: 0.4em 0.6em;
      }
      
      .markdown-code-block {
        padding: 0.8em;
        font-size: 0.85em;
      }
      
      .markdown-h1 {
        font-size: 1.7em;
      }
      
      .markdown-h2 {
        font-size: 1.5em;
      }
      
      .markdown-h3 {
        font-size: 1.3em;
      }
      
      .markdown-h4 {
        font-size: 1.15em;
      }
      
      .markdown-comment {
        font-size: 0.8em;
      }
    }

    /* Print styles */
    @media print {
      .markdown-link {
        color: inherit;
        text-decoration: underline;
      }
      
      .markdown-code-block {
        border: 1px solid #ccc;
        background: #f9f9f9;
      }
      
      .markdown-table {
        border: 1px solid #ccc;
      }
      
      .markdown-table-header,
      .markdown-table-cell {
        border: 1px solid #ccc;
      }
    }
  `;
}
