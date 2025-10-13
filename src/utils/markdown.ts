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
    const protectedElements: Map<string, string> = new Map();
    let protectedIndex = 0;

    // Parse HTML comments first (always enabled)
    const commentsResult = this.parseHtmlComments(html);
    html = commentsResult.html;
    if (commentsResult.found) elementsFound.push('html-comments');

    // Apply parsing in order of precedence to avoid conflicts
    if (features.code) {
      const codeResult = this.parseCodeBlocks(html);
      html = codeResult.html;
      if (codeResult.found) elementsFound.push('code-blocks');
    }

    // Parse and protect tables FIRST to prevent their content from being processed by other parsers
    if (features.tables) {
      const tableResult = this.parseTablesWithProtection(html, protectedElements, protectedIndex, features);
      html = tableResult.html;
      protectedIndex = tableResult.nextIndex;
      if (tableResult.found) {
        elementsFound.push('tables');
        // Add inner elements found in tables
        tableResult.innerElementsFound.forEach(element => {
          if (!elementsFound.includes(element)) {
            elementsFound.push(element);
          }
        });
      }
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

    // Restore protected elements
    protectedElements.forEach((value, key) => {
      html = html.replace(key, value);
    });

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
   * Parse lists (unordered: -, *, +; ordered: 1., 2., etc.) with nesting support
   */
  private static parseLists(content: string): { html: string; found: boolean } {
    let found = false;
    const lines = content.split('\n');
    const result: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      if (!line) {
        result.push('');
        i++;
        continue;
      }

      const unorderedMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
      const orderedMatch = line.match(/^(\s*)(\d+\.)\s+(.+)$/);

      if (unorderedMatch || orderedMatch) {
        found = true;
        
        // Start processing consecutive list items
        const listItems: Array<{ text: string; level: number; isOrdered: boolean }> = [];
        
        // Process all consecutive list items (including this one)
        while (i < lines.length) {
          const currentLine = lines[i];
          if (!currentLine) {
            // Empty line breaks the list
            break;
          }

          const unorderedItemMatch = currentLine.match(/^(\s*)([-*+])\s+(.+)$/);
          const orderedItemMatch = currentLine.match(/^(\s*)(\d+\.)\s+(.+)$/);
          
          if (unorderedItemMatch || orderedItemMatch) {
            const itemIsOrdered = !!orderedItemMatch;
            const itemIndent = (unorderedItemMatch?.[1] || orderedItemMatch?.[1] || '').length;
            const itemLevel = Math.floor(itemIndent / 2) + 1;
            const itemText = itemIsOrdered ? (orderedItemMatch?.[3] || '') : (unorderedItemMatch?.[3] || '');
            
            listItems.push({
              text: itemText,
              level: itemLevel,
              isOrdered: itemIsOrdered
            });
            i++;
          } else {
            // No more list items, stop processing
            break;
          }
        }
        
        // Generate proper nested list HTML
        result.push(this.generateNestedListHTML(listItems));
        // Don't increment i again because the while loop already did it
        continue;
      } else {
        result.push(line);
        i++;
      }
    }

    return { html: result.join('\n'), found };
  }

  /**
   * Generate properly nested list HTML with correct numbering
   */
  private static generateNestedListHTML(listItems: Array<{ text: string; level: number; isOrdered: boolean }>): string {
    if (listItems.length === 0) return '';
    
    const html: string[] = [];
    const stack: Array<{ type: string; level: number }> = [];
    const listCounters: Map<string, number> = new Map(); // Track numbering for each level+type combination
    
    for (const item of listItems) {
      const listType = item.isOrdered ? 'ol' : 'ul';
      const listClass = `markdown-list markdown-${listType}`;
      const itemClass = item.level > 1 ? 
        `markdown-list-item markdown-list-item-nested-${Math.min(item.level, 5)}` : 
        'markdown-list-item';
      
      // Create a key for tracking list continuity
      const listKey = `${listType}-${item.level}`;
      
      // Close lists that are at deeper levels
      while (stack.length > 0) {
        const lastInStack = stack[stack.length - 1];
        if (!lastInStack || lastInStack.level < item.level) {
          break;
        }
        if (lastInStack.level === item.level && lastInStack.type === listType) {
          // Same level and type, can continue in the same list
          break;
        }
        const lastList = stack.pop();
        if (lastList) {
          html.push(`</${lastList.type}>`);
        }
      }
      
      // Open new list if needed
      const lastInStack = stack[stack.length - 1];
      const needsNewList = stack.length === 0 || !lastInStack || 
        lastInStack.level < item.level || 
        (lastInStack.level === item.level && lastInStack.type !== listType);
      
      if (needsNewList) {
        let startAttr = '';
        if (item.isOrdered) {
          // For ordered lists, check if we need to continue numbering
          const currentCount = listCounters.get(listKey) || 0;
          const nextNumber = currentCount + 1;
          
          // Only add start attribute if it's not starting from 1
          if (nextNumber > 1) {
            startAttr = ` start="${nextNumber}"`;
          }
        }
        
        html.push(`<${listType} class="${listClass}"${startAttr}>`);
        stack.push({ type: listType, level: item.level });
      }
      
      // Add list item
      html.push(`<li class="${itemClass}">${item.text}</li>`);
      
      // Update counter for this list type and level
      if (item.isOrdered) {
        const currentCount = listCounters.get(listKey) || 0;
        listCounters.set(listKey, currentCount + 1);
      }
    }
    
    // Close remaining open lists
    while (stack.length > 0) {
      const lastList = stack.pop();
      if (lastList) {
        html.push(`</${lastList.type}>`);
      }
    }
    
    return html.join('\n');
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
      // Preserve all whitespace including leading spaces, only remove trailing newlines
      const preservedCode = code.replace(/\n+$/, '');
      return `<pre class="markdown-code-block"${lang}><code>${this.escapeHtml(preservedCode)}</code></pre>`;
    });
    return { html, found };
  }

  /**
   * Parse blockquotes (> text, >> nested)
   */
  private static parseBlockquotes(content: string): { html: string; found: boolean } {
    let found = false;
    const lines = content.split('\n');
    const result: string[] = [];

    for (const line of lines) {
      const blockquoteMatch = line.match(/^(>{1,})\s*(.*)$/);

      if (blockquoteMatch) {
        found = true;
        const level = blockquoteMatch[1]?.length || 1;
        const text = blockquoteMatch[2] || '';
        
        // Generate proper CSS classes for nested levels
        let cssClasses = 'markdown-blockquote';
        if (level > 1) {
          cssClasses += ` markdown-blockquote-nested-${Math.min(level, 5)}`;
        }
        
        // Each blockquote line is rendered independently
        result.push(`<blockquote class="${cssClasses}">${text}</blockquote>`);
      } else {
        result.push(line);
      }
    }

    return { html: result.join('\n'), found };
  }

  /**
   * Process nested blockquote content
   */
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
   * Generate complete table HTML structure
   */
  private static generateTableHtml(headerRow: string | null, tableRows: string[]): string {
    const parts = ['<table class="markdown-table">'];
    
    if (headerRow) {
      parts.push('  <thead class="markdown-table-head">');
      parts.push('    <tr class="markdown-table-header-row">');
      parts.push(headerRow);
      parts.push('    </tr>');
      parts.push('  </thead>');
    }
    
    if (tableRows.length > 0) {
      parts.push('  <tbody class="markdown-table-body">');
      parts.push(...tableRows);
      parts.push('  </tbody>');
    }
    
    parts.push('</table>');
    return parts.join('\n');
  }

  /**
   * Parse tables with content protection from further markdown processing
   */
  private static parseTablesWithProtection(content: string, protectedElements: Map<string, string>, startIndex: number, features: MarkdownFeatures): { html: string; found: boolean; nextIndex: number; innerElementsFound: string[] } {
    let found = false;
    let protectedIndex = startIndex;
    const lines = content.split('\n');
    const result: string[] = [];
    let inTable = false;
    let tableRows: string[] = [];
    let headerRow: string | null = null;
    const innerElementsFound: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      if (!currentLine) {
        if (inTable) {
          // End of table - generate and protect it
          const tableHtml = this.generateTableHtml(headerRow, tableRows);
          const placeholder = `<!--MARKDOWN-TABLE-${protectedIndex}-->`;
          protectedElements.set(placeholder, tableHtml);
          result.push(placeholder);
          protectedIndex++;
          
          inTable = false;
          headerRow = null;
          tableRows = [];
        }
        result.push('');
        continue;
      }

      // Skip processing lines that are inside code blocks (already processed)
      // Code blocks after processing become multi-line HTML elements
      const isCodeBlockStart = currentLine.includes('<pre class="markdown-code-block"');
      const isCodeBlockEnd = currentLine.includes('</code></pre>');
      
      // Track if we're inside a code block
      if (isCodeBlockStart) {
        // Starting a code block, add the line and mark that we're inside one
        result.push(currentLine);
        // Check if it's a single-line code block (start and end on same line)
        if (isCodeBlockEnd) {
          continue;
        }
        // Multi-line code block, continue processing until we find the end
        i++; // Move to next line
        while (i < lines.length) {
          const codeLine = lines[i];
          if (codeLine) {
            result.push(codeLine);
            if (codeLine.includes('</code></pre>')) {
              // Found the end of the code block
              break;
            }
          }
          i++;
        }
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
          headerRow = cells.map(cell => {
            const processedCell = this.parseTableCell(cell, features);
            return `    <th class="markdown-table-header">${processedCell}</th>`;
          }).join('\n');
          tableRows = [];
        } else {
          const row = cells.map(cell => {
            const processedCell = this.parseTableCell(cell, features);
            return `    <td class="markdown-table-cell">${processedCell}</td>`;
          }).join('\n');
          tableRows.push(`  <tr class="markdown-table-row">\n${row}\n  </tr>`);
        }
      } else {
        if (inTable) {
          // End of table - generate and protect it
          const tableHtml = this.generateTableHtml(headerRow, tableRows);
          
          // Check for inner elements in the generated HTML
          if (tableHtml.includes('class="markdown-inline-code"') && !innerElementsFound.includes('inline-code')) {
            innerElementsFound.push('inline-code');
          }
          if (tableHtml.includes('class="markdown-bold"') && !innerElementsFound.includes('emphasis')) {
            innerElementsFound.push('emphasis');
          }
          if (tableHtml.includes('class="markdown-italic"') && !innerElementsFound.includes('emphasis')) {
            innerElementsFound.push('emphasis');
          }
          if (tableHtml.includes('class="markdown-strikethrough"') && !innerElementsFound.includes('strikethrough')) {
            innerElementsFound.push('strikethrough');
          }
          
          const placeholder = `<!--MARKDOWN-TABLE-${protectedIndex}-->`;
          protectedElements.set(placeholder, tableHtml);
          result.push(placeholder);
          protectedIndex++;
          
          inTable = false;
          headerRow = null;
          tableRows = [];
        }
        result.push(line);
      }
    }

    // Handle table at end of content
    if (inTable) {
      const tableHtml = this.generateTableHtml(headerRow, tableRows);
      
      // Check for inner elements in the generated HTML
      if (tableHtml.includes('class="markdown-inline-code"') && !innerElementsFound.includes('inline-code')) {
        innerElementsFound.push('inline-code');
      }
      if (tableHtml.includes('class="markdown-bold"') && !innerElementsFound.includes('emphasis')) {
        innerElementsFound.push('emphasis');
      }
      if (tableHtml.includes('class="markdown-italic"') && !innerElementsFound.includes('emphasis')) {
        innerElementsFound.push('emphasis');
      }
      if (tableHtml.includes('class="markdown-strikethrough"') && !innerElementsFound.includes('strikethrough')) {
        innerElementsFound.push('strikethrough');
      }
      
      const placeholder = `<!--MARKDOWN-TABLE-${protectedIndex}-->`;
      protectedElements.set(placeholder, tableHtml);
      result.push(placeholder);
      protectedIndex++;
    }

    return { 
      html: result.join('\n'), 
      found,
      nextIndex: protectedIndex,
      innerElementsFound
    };
  }
  private static parseTableCell(cellContent: string, features?: MarkdownFeatures): string {
    let content = cellContent;

    // Store inline code blocks temporarily to protect them from markdown parsing
    const codeBlocks: string[] = [];
    let codeIndex = 0;

    // Extract and temporarily replace inline code (this protects the code content)
    content = content.replace(/`([^`]+)`/g, (_match, code) => {
      const placeholder = `<!--MARKDOWN-CODE-${codeIndex}-->`;
      codeBlocks[codeIndex] = `<code class="markdown-inline-code">${MarkdownParser.escapeHtml(code)}</code>`;
      codeIndex++;
      return placeholder;
    });

    // Now safely apply other markdown formatting (code content is protected)
    // Only apply if features are enabled
    if (!features || features.emphasis) {
      // Bold
      content = content.replace(/\*\*([^*]+)\*\*/g, '<strong class="markdown-bold">$1</strong>');
      // Italic  
      content = content.replace(/\*([^*]+)\*/g, '<em class="markdown-italic">$1</em>');
    }
    
    if (!features || features.strikethrough) {
      content = content.replace(/~~([^~]+)~~/g, '<del class="markdown-strikethrough">$1</del>');
    }

    // Restore code blocks
    codeBlocks.forEach((codeBlock, index) => {
      content = content.replace(`<!--MARKDOWN-CODE-${index}-->`, codeBlock);
    });

    return content;
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
      return `${indent}<div class="markdown-task-item ${checkedClass}"><input type="checkbox" class="markdown-task-checkbox" ${checked ? 'checked' : ''} disabled><span class="markdown-task-text">${text}</span></div>`;
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
   * Parse HTML comments (<!-- comment -->)
   * Display them in a subtle, unobtrusive way
   */
  private static parseHtmlComments(content: string): { html: string; found: boolean } {
    let found = false;
    const html = content.replace(/<!--\s*(.+?)\s*-->/g, (_match, commentText) => {
      found = true;
      return `<div class="markdown-comment"><span class="markdown-comment-marker">※</span> <span class="markdown-comment-text">${this.escapeHtml(commentText)}</span></div>`;
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
