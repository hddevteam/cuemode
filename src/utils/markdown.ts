/**
 * Lightweight Markdown Parser for CueMode
 * Provides selective parsing of markdown elements based on user configuration
 */

import { MarkdownFeatures } from '../types';

/**
 * Parsed markdown content with HTML output
 */
export interface ParsedMarkdown {
  html: string;
  originalLength: number;
  parsedLength: number;
  elementsFound: string[];
}

/**
 * Lightweight markdown parser optimized for teleprompter use
 * Focuses on performance and selective feature parsing
 */
export class MarkdownParser {
  /**
   * Parse markdown content based on enabled features
   * @param content Raw markdown text
   * @param features Configuration of which features to parse
   * @returns Parsed content with HTML markup
   */
  static parse(content: string, features: MarkdownFeatures): ParsedMarkdown {
    if (!content || content.trim().length === 0) {
      return {
        html: '',
        originalLength: 0,
        parsedLength: 0,
        elementsFound: []
      };
    }

    let html = content;
    const elementsFound: string[] = [];
    const originalLength = content.length;

    // Apply parsing in order of precedence to avoid conflicts
    if (features.code) {
      const codeResult = this.parseCodeBlocks(html);
      html = codeResult.html;
      if (codeResult.found) elementsFound.push('code-blocks');
    }

    if (features.code) {
      const inlineCodeResult = this.parseInlineCode(html);
      html = inlineCodeResult.html;
      if (inlineCodeResult.found) elementsFound.push('inline-code');
    }

    if (features.headers) {
      const headerResult = this.parseHeaders(html);
      html = headerResult.html;
      if (headerResult.found) elementsFound.push('headers');
    }

    if (features.horizontalRule) {
      const hrResult = this.parseHorizontalRule(html);
      html = hrResult.html;
      if (hrResult.found) elementsFound.push('horizontal-rule');
    }

    if (features.tables) {
      const tableResult = this.parseTables(html);
      html = tableResult.html;
      if (tableResult.found) elementsFound.push('tables');
    }

    if (features.taskLists) {
      const taskResult = this.parseTaskLists(html);
      html = taskResult.html;
      if (taskResult.found) elementsFound.push('task-lists');
    }

    if (features.lists) {
      const listResult = this.parseLists(html);
      html = listResult.html;
      if (listResult.found) elementsFound.push('lists');
    }

    if (features.blockquotes) {
      const blockquoteResult = this.parseBlockquotes(html);
      html = blockquoteResult.html;
      if (blockquoteResult.found) elementsFound.push('blockquotes');
    }

    if (features.links) {
      const linkResult = this.parseLinks(html);
      html = linkResult.html;
      if (linkResult.found) elementsFound.push('links');
    }

    if (features.emphasis) {
      const emphasisResult = this.parseEmphasis(html);
      html = emphasisResult.html;
      if (emphasisResult.found) elementsFound.push('emphasis');
    }

    if (features.strikethrough) {
      const strikeResult = this.parseStrikethrough(html);
      html = strikeResult.html;
      if (strikeResult.found) elementsFound.push('strikethrough');
    }

    return {
      html: html.trim(),
      originalLength,
      parsedLength: html.length,
      elementsFound
    };
  }

  /**
   * Parse headers (# ## ### #### ##### ######)
   */
  private static parseHeaders(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, text) => {
      found = true;
      const level = hashes.length;
      return `<h${level} class="markdown-header markdown-h${level}">${text.trim()}</h${level}>`;
    });
    return { html, found };
  }

  /**
   * Parse emphasis (**bold**, *italic*, ***bold-italic***)
   */
  private static parseEmphasis(content: string): { html: string; found: boolean } {
    let found = false;
    let html = content;

    // Bold and italic (***text***)
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, (_match, text) => {
      found = true;
      return `<strong class="markdown-bold-italic"><em>${text}</em></strong>`;
    });

    // Bold (**text**)
    html = html.replace(/\*\*(.+?)\*\*/g, (_match, text) => {
      found = true;
      return `<strong class="markdown-bold">${text}</strong>`;
    });

    // Italic (*text*)
    html = html.replace(/\*(.+?)\*/g, (_match, text) => {
      found = true;
      return `<em class="markdown-italic">${text}</em>`;
    });

    // Alternative bold (__text__)
    html = html.replace(/__(.+?)__/g, (_match, text) => {
      found = true;
      return `<strong class="markdown-bold">${text}</strong>`;
    });

    // Alternative italic (_text_)
    html = html.replace(/_(.+?)_/g, (_match, text) => {
      found = true;
      return `<em class="markdown-italic">${text}</em>`;
    });

    return { html, found };
  }

  /**
   * Parse lists (unordered: -, *, +; ordered: 1., 2., etc.)
   */
  private static parseLists(content: string): { html: string; found: boolean } {
    let found = false;
    const lines = content.split('\n');
    const result: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;
    let listItems: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) {
        if (inList) {
          // End of list
          result.push(`<${listType} class="markdown-list markdown-${listType}">`);
          result.push(...listItems.map(item => `  <li class="markdown-list-item">${item}</li>`));
          result.push(`</${listType}>`);
          inList = false;
          listType = null;
          listItems = [];
        }
        result.push('');
        continue;
      }

      const unorderedMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
      const orderedMatch = line.match(/^(\s*)(\d+\.)\s+(.+)$/);

      if (unorderedMatch || orderedMatch) {
        found = true;
        const isOrdered = !!orderedMatch;
        const text = isOrdered ? (orderedMatch?.[3] || '') : (unorderedMatch?.[3] || '');

        if (!inList) {
          inList = true;
          listType = isOrdered ? 'ol' : 'ul';
          listItems = [];
        } else if ((listType === 'ol') !== isOrdered) {
          // List type changed, close previous list
          result.push(`<${listType} class="markdown-list markdown-${listType}">`);
          result.push(...listItems.map(item => `  <li class="markdown-list-item">${item}</li>`));
          result.push(`</${listType}>`);
          
          listType = isOrdered ? 'ol' : 'ul';
          listItems = [];
        }

        listItems.push(text);
      } else {
        if (inList) {
          // End of list
          result.push(`<${listType} class="markdown-list markdown-${listType}">`);
          result.push(...listItems.map(item => `  <li class="markdown-list-item">${item}</li>`));
          result.push(`</${listType}>`);
          inList = false;
          listType = null;
          listItems = [];
        }
        result.push(line);
      }
    }

    // Handle list at end of content
    if (inList && listType) {
      result.push(`<${listType} class="markdown-list markdown-${listType}">`);
      result.push(...listItems.map(item => `  <li class="markdown-list-item">${item}</li>`));
      result.push(`</${listType}>`);
    }

    return { html: result.join('\n'), found };
  }

  /**
   * Parse inline code (`code`)
   */
  private static parseInlineCode(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/`([^`]+)`/g, (_match, code) => {
      found = true;
      return `<code class="markdown-inline-code">${this.escapeHtml(code)}</code>`;
    });
    return { html, found };
  }

  /**
   * Parse code blocks (```language\ncode\n```)
   */
  private static parseCodeBlocks(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, language, code) => {
      found = true;
      const lang = language ? ` data-language="${language}"` : '';
      return `<pre class="markdown-code-block"${lang}><code>${this.escapeHtml(code.trim())}</code></pre>`;
    });
    return { html, found };
  }

  /**
   * Parse blockquotes (> text)
   */
  private static parseBlockquotes(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/^>\s+(.+)$/gm, (_match, text) => {
      found = true;
      return `<blockquote class="markdown-blockquote">${text}</blockquote>`;
    });
    return { html, found };
  }

  /**
   * Parse links ([text](url))
   */
  private static parseLinks(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text, url) => {
      found = true;
      return `<a href="${this.escapeHtml(url)}" class="markdown-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
    return { html, found };
  }

  /**
   * Parse tables (| col1 | col2 |)
   */
  private static parseTables(content: string): { html: string; found: boolean } {
    let found = false;
    const lines = content.split('\n');
    const result: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];
    let headerRow: string | null = null;

    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine) {
        if (inTable) {
          // End of table
          result.push('<table class="markdown-table">');
          if (headerRow) {
            result.push('  <thead class="markdown-table-head">');
            result.push('    <tr class="markdown-table-header-row">');
            result.push(headerRow);
            result.push('    </tr>');
            result.push('  </thead>');
          }
          if (tableRows.length > 0) {
            result.push('  <tbody class="markdown-table-body">');
            result.push(...tableRows);
            result.push('  </tbody>');
          }
          result.push('</table>');
          
          inTable = false;
          headerRow = null;
          tableRows = [];
        }
        result.push('');
        continue;
      }

      const line = currentLine.trim();
      
      if (line.startsWith('|') && line.endsWith('|')) {
        // Check if this is a separator row (|------|-----|)
        if (line.match(/^\|[\s\-:|]+\|$/)) {
          // This is a separator row, skip it
          continue;
        }

        found = true;
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
        
        if (!inTable) {
          inTable = true;
          headerRow = cells.map(cell => `    <th class="markdown-table-header">${cell}</th>`).join('\n');
          tableRows = [];
        } else {
          const row = cells.map(cell => `    <td class="markdown-table-cell">${cell}</td>`).join('\n');
          tableRows.push(`  <tr class="markdown-table-row">\n${row}\n  </tr>`);
        }
      } else {
        if (inTable) {
          // End of table
          result.push('<table class="markdown-table">');
          if (headerRow) {
            result.push('  <thead class="markdown-table-head">');
            result.push('    <tr class="markdown-table-header-row">');
            result.push(headerRow);
            result.push('    </tr>');
            result.push('  </thead>');
          }
          if (tableRows.length > 0) {
            result.push('  <tbody class="markdown-table-body">');
            result.push(...tableRows);
            result.push('  </tbody>');
          }
          result.push('</table>');
          
          inTable = false;
          headerRow = null;
          tableRows = [];
        }
        result.push(line);
      }
    }

    // Handle table at end of content
    if (inTable) {
      result.push('<table class="markdown-table">');
      if (headerRow) {
        result.push('  <thead class="markdown-table-head">');
        result.push('    <tr class="markdown-table-header-row">');
        result.push(headerRow);
        result.push('    </tr>');
        result.push('  </thead>');
      }
      if (tableRows.length > 0) {
        result.push('  <tbody class="markdown-table-body">');
        result.push(...tableRows);
        result.push('  </tbody>');
      }
      result.push('</table>');
    }

    return { html: result.join('\n'), found };
  }

  /**
   * Parse task lists (- [x] done, - [ ] todo)
   */
  private static parseTaskLists(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/^(\s*)-\s+\[([ x])\]\s+(.+)$/gm, (_match, indent, check, text) => {
      found = true;
      const checked = check === 'x';
      const checkedClass = checked ? 'markdown-task-checked' : 'markdown-task-unchecked';
      return `${indent}<div class="markdown-task-item ${checkedClass}">
        <input type="checkbox" class="markdown-task-checkbox" ${checked ? 'checked' : ''} disabled>
        <span class="markdown-task-text">${text}</span>
      </div>`;
    });
    return { html, found };
  }

  /**
   * Parse strikethrough (~~text~~)
   */
  private static parseStrikethrough(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/~~(.+?)~~/g, (_match, text) => {
      found = true;
      return `<del class="markdown-strikethrough">${text}</del>`;
    });
    return { html, found };
  }

  /**
   * Parse horizontal rules (---, ***, ___)
   */
  private static parseHorizontalRule(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/^([-*_]){3,}$/gm, () => {
      found = true;
      return '<hr class="markdown-hr">';
    });
    return { html, found };
  }

  /**
   * Escape HTML characters to prevent XSS
   */
  private static escapeHtml(text: string): string {
    const htmlEscapes: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
  }

  /**
   * Get statistics about parsed content
   */
  static getStats(result: ParsedMarkdown): {
    compressionRatio: number;
    elementsCount: number;
    hasMarkdown: boolean;
  } {
    return {
      compressionRatio: result.originalLength > 0 ? result.parsedLength / result.originalLength : 1,
      elementsCount: result.elementsFound.length,
      hasMarkdown: result.elementsFound.length > 0
    };
  }
}
