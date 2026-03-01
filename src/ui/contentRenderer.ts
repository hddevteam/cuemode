import type { CueModeConfig } from '../types';
import { MarkdownParser } from '../utils/markdown';

export function processContent(content: string, config: CueModeConfig): string {
  if (config.markdownMode) {
    return processMarkdownContent(content, config);
  }
  return processPlainTextContent(content);
}

function processMarkdownContent(content: string, config: CueModeConfig): string {
  try {
    // Parse markdown content with user's selected features
    const result = MarkdownParser.parse(content, config.markdownFeatures);

    // Instead of splitting by lines, parse logical blocks
    // This preserves HTML structure while still supporting focus mode
    const logicalBlocks = parseMarkdownBlocks(result.html);

    const processedBlocks = logicalBlocks.map((block, index) => {
      if (block.trim() === '') {
        return ''; // Skip empty blocks entirely
      }

      // Wrap each logical block for focus mode support
      return `<div class="cue-line markdown-block" data-block="${index}">${block}</div>`;
    });

    // Filter out empty blocks to avoid unnecessary spacing
    const filteredBlocks = processedBlocks.filter(block => block !== '');

    return `<div class="markdown-content">${filteredBlocks.join('')}</div>`;
  } catch (error) {
    // Fallback to plain text processing if markdown parsing fails
    console.warn('Markdown parsing failed, falling back to plain text:', error);
    return processPlainTextContent(content);
  }
}

/**
 * Parse markdown HTML into logical blocks instead of physical lines.
 */
export function parseMarkdownBlocks(html: string): string[] {
  const blocks: string[] = [];

  // Split by major block elements
  const blockElements = ['h[1-6]', 'p', 'div', 'table', 'ul', 'ol', 'blockquote', 'pre'];

  const blockRegex = new RegExp(
    `(<(?:${blockElements.join('|')})[^>]*>.*?</(?:${blockElements.join('|')})>)`,
    'gs'
  );

  let lastIndex = 0;
  let match;

  while ((match = blockRegex.exec(html)) !== null) {
    // Add any text before this block
    if (match.index > lastIndex) {
      const beforeText = html.slice(lastIndex, match.index).trim();
      if (beforeText) {
        // For plain text content, split by single newlines to create separate display blocks
        // This allows each line to be shown independently in presentation mode
        const lines = beforeText.split(/\n/).filter(line => line.trim());
        lines.forEach(line => {
          if (line.trim()) {
            blocks.push(line.trim());
          }
        });
      }
    }

    // Add the block itself
    if (match[1]) {
      blocks.push(match[1]);
    }
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < html.length) {
    const remainingText = html.slice(lastIndex).trim();
    if (remainingText) {
      // For plain text content, split by single newlines to create separate display blocks
      const lines = remainingText.split(/\n/).filter(line => line.trim());
      lines.forEach(line => {
        if (line.trim()) {
          blocks.push(line.trim());
        }
      });
    }
  }

  return blocks;
}

export function processPlainTextContent(content: string): string {
  // Escape HTML characters
  const escapeHtml = (unsafe: string): string => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Split content into lines and wrap each line in a span for focus mode
  const lines = content.split('\n');
  const processedLines = lines.map((line, index) => {
    const escapedLine = escapeHtml(line);
    return `<span class="cue-line" data-line="${index}">${escapedLine || '&nbsp;'}</span>`;
  });

  return `<pre>${processedLines.join('\n')}</pre>`;
}
