const fs = require('fs');
const path = require('path');

// Import actual CueMode modules
const { MarkdownParser } = require('./out/utils/markdown');
const { ThemeManager } = require('./out/utils/theme');
const { generateMarkdownCSS } = require('./out/utils/markdownStyles');
const { generateWebViewCSS, generateDebugCSS } = require('./out/utils/webviewStyles');

/**
 * CueMode Renderer - Using real extension logic
 */
class CueModeRenderer {
  constructor(options = {}) {
    this.config = {
      fontSize: options.fontSize || 25,
      lineHeight: options.lineHeight || 1,
      maxWidth: options.maxWidth || 1200,
      padding: options.padding || 10,
      theme: options.theme || 'rose',
      features: options.features || {
        headers: true,
        emphasis: true,
        lists: true,
        links: true,
        code: true,
        blockquotes: true,
        tables: true,
        taskLists: true,
        strikethrough: true,
        horizontalRule: true
      }
    };
  }

  /**
   * Parse markdown blocks - Copied from webview.ts logic
   */
  parseMarkdownBlocks(html) {
    const blocks = [];

    const blockElements = [
      'h[1-6]', 'p', 'div', 'table', 'ul', 'ol', 'blockquote', 'pre'
    ];

    const blockRegex = new RegExp(`(<(?:${blockElements.join('|')})[^>]*>.*?</(?:${blockElements.join('|')})>)`, 'gs');

    let lastIndex = 0;
    let match;

    while ((match = blockRegex.exec(html)) !== null) {
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

      if (match[1]) {
        blocks.push(match[1]);
      }
      lastIndex = match.index + match[0].length;
    }

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

  /**
   * Process markdown content - Copied from webview.ts logic
   */
  processMarkdownContent(content) {
    try {
      // Use actual MarkdownParser
      const result = MarkdownParser.parse(content, this.config.features);

      // Use actual block-level processing logic
      const logicalBlocks = this.parseMarkdownBlocks(result.html);

      const processedBlocks = logicalBlocks.map((block, index) => {
        if (block.trim() === '') {
          return '';
        }
        return `<div class="cue-line markdown-block" data-block="${index}">${block}</div>`;
      });

      const filteredBlocks = processedBlocks.filter(block => block !== '');

      return {
        content: `<div class="markdown-content">${filteredBlocks.join('')}</div>`,
        stats: {
          originalLength: result.html.length,
          blockCount: logicalBlocks.length,
          filteredCount: filteredBlocks.length
        }
      };
    } catch (error) {
      throw new Error(`Markdown parsing failed: ${error.message}`);
    }
  }

  /**
   * Generate complete CSS - Using actual theme and style modules
   */
  generateCSS() {
    const themeConfig = ThemeManager.getTheme(this.config.theme);
    const themeCSS = ThemeManager.generateCSS(
      this.config.theme,
      this.config.fontSize,
      this.config.lineHeight,
      this.config.maxWidth,
      this.config.padding
    );
    const markdownCSS = generateMarkdownCSS(themeConfig);
    const webviewCSS = generateWebViewCSS();
    const debugCSS = generateDebugCSS();

    return {
      theme: themeCSS,
      markdown: markdownCSS,
      webview: webviewCSS,
      debug: debugCSS
    };
  }

  /**
   * Render markdown file to HTML
   */
  renderFile(markdownPath, outputPath = null) {
    if (!fs.existsSync(markdownPath)) {
      throw new Error(`File does not exist: ${markdownPath}`);
    }

    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    const processed = this.processMarkdownContent(markdownContent);
    const css = this.generateCSS();

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CueMode Debug - ${path.basename(markdownPath)}</title>
    <style>
/* Basic style reset */
* { box-sizing: border-box; }
body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

/* WebView styles */
${css.webview}

/* Theme CSS */
${css.theme}

/* Markdown base styles */
${css.markdown}

/* Debug-specific styles */
${css.debug}

/* Line break markers - show visual indicators at actual line breaks */
br {
  position: relative;
}
br::after {
  content: ' ↵';
  color: var(--accent-color);
  opacity: 0.7;
  font-size: 1.2em;
  font-weight: bold;
  margin-left: 0.3em;
  pointer-events: none;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
}
    </style>
</head>
<body>
    <div class="file-info">
                <h3>� File Information</h3>
                <p><strong>📁 File:</strong> \${filePath}</p>
        <p><strong>Size:</strong> ${markdownContent.length} characters</p>
        <p><strong>Config:</strong> ${this.config.fontSize}px, line height ${this.config.lineHeight}, padding ${this.config.padding}px</p>
        <p><strong>Logical blocks:</strong> ${processed.stats.blockCount} → ${processed.stats.filteredCount} blocks</p>
    </div>

    <div class="debug-panel">
        <h4>🔧 Debug Guide</h4>
        <p>🔴 Red border: Logical block boundaries</p>
        <p>🔵 Blue background: Header elements</p>
        <p>🟡 Yellow background: Table elements</p>
        <p>🟣 Purple background: Code blocks</p>
        <p>🟢 Green background: List elements</p>
        <p>💡 Click any block to view details</p>
        <p>📏 Unordered list indent: 25px | Ordered list indent: 50px</p>
        <p>📐 Paragraph spacing: 8px (optimized reading experience)</p>
        <p>✂️ Paragraph splitting: Split by lines, displayed independently</p>
        <p>🛠️ Use browser developer tools to debug CSS</p>
    </div>

    <div class="cue-container">
        <div class="cue-content">
            ${processed.content}
        </div>
    </div>

    <script>
        // Debug interaction script
        document.addEventListener('DOMContentLoaded', function() {
            console.log('📊 CueMode Debug Info:');
            console.log('File:', '${markdownPath}');
            console.log('Total blocks:', document.querySelectorAll('.markdown-block').length);
            console.log('Config:', ${JSON.stringify(this.config)});
            
            // Add click event to each block
            document.querySelectorAll('.markdown-block').forEach((block, index) => {
                block.style.cursor = 'pointer';
                block.addEventListener('click', function() {
                    console.log(\`Block \${index}:\`, {
                        content: this.textContent.trim().substring(0, 100) + '...',
                        innerHTML: this.innerHTML.substring(0, 200) + '...',
                        computedStyle: {
                            margin: getComputedStyle(this).margin,
                            padding: getComputedStyle(this).padding,
                            marginLeft: getComputedStyle(this).marginLeft
                        }
                    });
                });
            });

            // Special highlighting for list elements
            document.querySelectorAll('.markdown-block ul, .markdown-block ol').forEach(list => {
                list.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                });
                list.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'rgba(0, 255, 0, 0.05)';
                });
            });
        });
    </script>
</body>
</html>`;

    // Determine output filename
    if (!outputPath) {
      const baseName = path.basename(markdownPath, path.extname(markdownPath));
      outputPath = `debug-${baseName}.html`;
    }

    fs.writeFileSync(outputPath, html, 'utf8');

    return {
      inputFile: markdownPath,
      outputFile: outputPath,
      stats: processed.stats,
      config: this.config
    };
  }
}

module.exports = { CueModeRenderer };
