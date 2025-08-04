import * as vscode from 'vscode';
import * as path from 'path';
import { CueModeConfig, CueModeState, WebviewMessage } from '../types';
import { ThemeManager } from '../utils/theme';
import { MarkdownParser } from '../utils/markdown';
import { generateMarkdownCSS } from '../utils/markdownStyles';
import { t, getCurrentLanguage } from '../i18n';

/**
 * WebView manager for CueMode
 */
export class WebViewManager {
  private panel: vscode.WebviewPanel | undefined;
  private context: vscode.ExtensionContext;
  private state: CueModeState;
  private configChangeListener: vscode.Disposable | undefined;
  private documentChangeListener: vscode.Disposable | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = {
      isActive: false,
      content: '',
      config: {
        colorTheme: 'classic',
        maxWidth: 800,
        fontSize: 24,
        lineHeight: 1.5,
        padding: 10,
        scrollSpeed: 0.1,
        startingPosition: 50,
        focusMode: false,
        focusOpacity: 0.3,
        focusLineCount: 3,
        mirrorFlip: false,
        markdownMode: true,
        markdownFeatures: {
          headers: true,
          emphasis: true,
          lists: true,
          links: true,
          code: true,
          blockquotes: true,
          tables: true,
          taskLists: true,
          strikethrough: false,
          horizontalRule: true
        }
      },
      filename: ''
    };
  }

  /**
   * Create and show webview panel
   */
  public async create(content: string, filename: string, config: CueModeConfig): Promise<void> {
    try {
      // Close existing panel if it exists
      if (this.panel) {
        this.panel.dispose();
      }

      // Update state
      this.state = {
        isActive: true,
        content,
        config,
        filename
      };

      // Create new panel
      this.panel = vscode.window.createWebviewPanel(
        'cueMode',
        t('ui.title', { filename }),
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(this.context.extensionPath, 'media')),
            vscode.Uri.file(path.join(this.context.extensionPath, 'out'))
          ]
        }
      );

      // Set up panel event handlers
      this.setupPanelHandlers();

      // Set up listeners
      this.setupListeners();

      // Set initial content
      await this.updateContent();

      // Register panel for cleanup
      this.context.subscriptions.push(this.panel);

    } catch (error) {
      throw new Error(`Failed to create webview: ${error}`);
    }
  }

  /**
   * Update content in webview
   */
  public async updateContent(newContent?: string): Promise<void> {
    if (!this.panel) {
      return;
    }

    if (newContent !== undefined) {
      this.state.content = newContent;
    }

    try {
      this.panel.webview.html = await this.generateHTML();
    } catch (error) {
      console.error('Failed to update webview content:', error);
    }
  }

  /**
   * Update configuration
   */
  public async updateConfig(newConfig: CueModeConfig): Promise<void> {
    this.state.config = newConfig;
    await this.updateContent();
    
    // Send configuration update to webview
    if (this.panel) {
      this.panel.webview.postMessage({
        type: 'configUpdate',
        config: newConfig
      });
    }
  }

  /**
   * Close webview
   */
  public close(): void {
    if (this.panel) {
      this.panel.dispose();
      this.panel = undefined;
    }
    this.cleanup();
  }

  /**
   * Check if webview is active
   */
  public isActive(): boolean {
    return this.state.isActive && this.panel !== undefined;
  }

  /**
   * Get current state
   */
  public getState(): CueModeState {
    return { ...this.state };
  }

  /**
   * Get the current HTML content (for testing purposes)
   */
  public async getHtml(): Promise<string> {
    return await this.generateHTML();
  }

  /**
   * Setup panel event handlers
   */
  private setupPanelHandlers(): void {
    if (!this.panel) {
      return;
    }

    // Handle panel disposal
    this.panel.onDidDispose(() => {
      this.cleanup();
    });

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
      this.handleWebviewMessage(message);
    });

    // Handle panel visibility changes
    this.panel.onDidChangeViewState(() => {
      if (this.panel) {
        this.state.isActive = this.panel.visible;
      }
    });
  }

  /**
   * Setup document and configuration listeners
   */
  private setupListeners(): void {
    // Listen for configuration changes
    this.configChangeListener = vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('cuemode')) {
        // Configuration will be updated by the main extension
        // This is handled in the main extension file
      }
    });

    // Listen for document changes
    this.documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor && event.document === activeEditor.document) {
        const newContent = activeEditor.selection.isEmpty 
          ? activeEditor.document.getText()
          : activeEditor.document.getText(activeEditor.selection);
        
        this.updateContent(newContent);
      }
    });
  }

  /**
   * Handle messages from webview
   */
  private handleWebviewMessage(message: WebviewMessage): void {
    switch (message.type) {
      case 'close':
        this.close();
        break;
      
      case 'changeTheme':
        // Call the main extension's changeTheme command
        vscode.commands.executeCommand('cuemode.changeTheme');
        break;
      
      case 'cycleTheme':
        // Call the main extension's cycleTheme command
        vscode.commands.executeCommand('cuemode.cycleTheme');
        break;
      
      case 'toggleFocus':
        // Call the main extension's toggleFocusMode command
        vscode.commands.executeCommand('cuemode.toggleFocusMode');
        break;
      
      case 'toggleMirror':
        // Call the main extension's toggleMirrorFlip command
        vscode.commands.executeCommand('cuemode.toggleMirrorFlip');
        break;
      
      case 'toggleMarkdown':
        // Call the main extension's toggleMarkdownMode command
        vscode.commands.executeCommand('cuemode.toggleMarkdownMode');
        break;
      
      case 'scroll':
        // Handle scroll events if needed
        break;
      
      default:
        console.warn('Unknown webview message type:', message.type);
    }
  }

  /**
   * Generate HTML content for webview
   */
  private async generateHTML(): Promise<string> {
    const { content, config, filename } = this.state;
    
    // Pre-generate i18n strings for JavaScript
    const i18nStrings = {
      focusMode: t('ui.focusMode'),
      exitFocus: t('ui.exitFocus'),
      helpTitle: t('help.title'),
      initMessage: t('ui.ready'),
      shortcutsTitle: t('help.title'),
      spaceShortcut: `Space: ${t('help.shortcuts.space')}`,
      rShortcut: `R: ${t('help.shortcuts.r')}`,
      speedShortcut: `+/-: ${t('help.shortcuts.plus')} / ${t('help.shortcuts.minus')}`,
      helpShortcut: `H: ${t('help.shortcuts.h')}`,
      escShortcut: `Esc: ${t('help.shortcuts.escape')}`
    };
    
    // Generate CSS for current theme
    const css = ThemeManager.generateCSS(
      config.colorTheme,
      config.fontSize,
      config.lineHeight,
      config.maxWidth,
      config.padding
    );

    // Generate markdown CSS if markdown mode is enabled
    const markdownCSS = config.markdownMode ? 
      generateMarkdownCSS(ThemeManager.getTheme(config.colorTheme)) : 
      '';

    // Process content for display
    const processedContent = this.processContent(content);

    // Calculate starting position (like the original)
    const startingPositionCSS = config.startingPosition > 0 
      ? `padding-top: ${config.startingPosition}vh; padding-bottom: ${config.startingPosition}vh;`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="${getCurrentLanguage()}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('ui.title', { filename })}</title>
        <style>
          ${css}
          ${markdownCSS}
          body {
            ${startingPositionCSS}
          }
          * {
            box-sizing: border-box;
          }
          pre {
            border: none !important;
            outline: none !important;
            background: transparent !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .cue-line {
            display: inline-block;
            width: 100%;
            transition: filter 0.3s ease;
            border: none !important;
            outline: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-decoration: none !important;
          }
          .cue-line:empty {
            min-height: 1em;
          }
          .cue-line:hover {
            border: none !important;
            outline: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-decoration: none !important;
          }
          .cue-line:focus {
            border: none !important;
            outline: none !important;
            background: transparent !important;
            box-shadow: none !important;
            text-decoration: none !important;
          }
          .focus-indicator {
            position: fixed;
            left: 0;
            right: 0;
            z-index: 10;
            pointer-events: none;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-left: none;
            border-right: none;
            display: none;
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: none;
          }
          .focus-indicator.active {
            display: block;
          }
          
          /* Markdown specific styles */
          .markdown-content {
            width: 100%;
          }
          
          .markdown-line {
            display: block;
            width: 100%;
            transition: filter 0.3s ease;
          }
          
          .markdown-line:empty {
            min-height: 1em;
          }
          
          /* Ensure markdown elements work with focus mode */
          .markdown-content pre {
            margin: 0;
            padding: 0;
            background: transparent;
            border: none;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          
          /* Override any conflicting styles for markdown elements */
          .markdown-content * {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Mirror flip styles */
          .mirror-flip {
            transform: scaleX(-1);
            transition: transform 0.3s ease;
          }
          
          .mirror-flip-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
          
          /* Mirror flip status indicator */
          .mirror-status {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            pointer-events: none;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          
          .mirror-status.active {
            opacity: 1;
            transform: translateY(0);
          }
          
          .mirror-status.enabled {
            background: rgba(0, 100, 200, 0.9);
            border-color: rgba(100, 150, 255, 0.5);
          }
          
          .mirror-status.disabled {
            background: rgba(100, 100, 100, 0.7);
            border-color: rgba(150, 150, 150, 0.3);
          }
          
          /* Hide status indicator after delay */
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
          }
          
          .mirror-status.hiding {
            animation: fadeOut 0.3s ease forwards;
          }
        </style>
      </head>
      <body>
        <div class="cue-controls">
          <button class="cue-button" onclick="closeMode()">${t('ui.close')}</button>
          <button class="cue-button" onclick="toggleHelp()">${t('ui.help')}</button>
        </div>
        
        <!-- Mirror flip status indicator -->
        <div class="mirror-status" id="mirror-status">
          <span id="mirror-status-text">${t('ui.mirrorOff')}</span>
        </div>
        
        <div class="cue-help" id="help-panel" style="display: none;">
          <h3>${t('help.title')}</h3>
          <div class="help-grid">
            <div class="help-column">
              <div class="help-section">
                <h4>${t('help.basicControls')}</h4>
                <ul>
                  <li><kbd>Space</kbd> <span>${t('help.shortcuts.space')}</span></li>
                  <li><kbd>R</kbd> <span>${t('help.shortcuts.r')}</span></li>
                  <li><kbd>+/-</kbd> <span>${t('help.shortcuts.plus')} / ${t('help.shortcuts.minus')}</span></li>
                  <li><kbd>Esc</kbd> <span>${t('help.shortcuts.escape')}</span></li>
                </ul>
              </div>
            </div>
            <div class="help-column">
              <div class="help-section">
                <h4>${t('help.navigationModes')}</h4>
                <ul>
                  <li><kbd>↑↓</kbd> <span>${t('help.shortcuts.arrows')}</span></li>
                  <li><kbd>PgUp/Dn</kbd> <span>${t('help.shortcuts.pageUpDown')}</span></li>
                  <li><kbd>Home/End</kbd> <span>${t('help.shortcuts.homeEnd')}</span></li>
                  <li><kbd>T</kbd> <span>${t('help.shortcuts.t')}</span></li>
                  <li><kbd>F</kbd> <span>${t('help.shortcuts.f')}</span></li>
                  <li><kbd>M</kbd> <span>${t('help.shortcuts.m')}</span></li>
                  <li><kbd>D</kbd> <span>${t('help.shortcuts.d')}</span></li>
                  <li><kbd>H</kbd> <span>${t('help.shortcuts.h')}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="cue-container">
          <div class="cue-content" id="content">
            ${processedContent}
          </div>
        </div>
        
        <!-- Focus area indicator -->
        <div class="focus-indicator" id="focus-indicator"></div>

        <script>
          // WebView to extension communication
          const vscode = acquireVsCodeApi();
          
          function closeMode() {
            vscode.postMessage({ type: 'close' });
          }
          
          function toggleHelp() {
            const helpPanel = document.getElementById('help-panel');
            if (helpPanel.style.display === 'none') {
              helpPanel.style.display = 'block';
              
              // Smart positioning: ensure help dialog is fully visible
              adjustHelpPosition(helpPanel);
              
              // Add click outside to close functionality
              setTimeout(() => {
                document.addEventListener('click', hideHelpOnClickOutside);
              }, 100);
            } else {
              helpPanel.style.display = 'none';
              document.removeEventListener('click', hideHelpOnClickOutside);
            }
          }
          
          function adjustHelpPosition(helpPanel) {
            const rect = helpPanel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Reset position
            helpPanel.style.top = '10px';
            helpPanel.style.right = '10px';
            helpPanel.style.left = 'auto';
            helpPanel.style.bottom = 'auto';
            
            // Check if it exceeds right boundary
            if (rect.right > viewportWidth - 10) {
              helpPanel.style.right = '10px';
              helpPanel.style.left = 'auto';
            }
            
            // Check if it exceeds bottom boundary
            if (rect.bottom > viewportHeight - 10) {
              helpPanel.style.top = 'auto';
              helpPanel.style.bottom = '10px';
            }
            
            // For small screens, use full width layout
            if (viewportWidth < 768) {
              helpPanel.style.left = '5px';
              helpPanel.style.right = '5px';
              helpPanel.style.top = '50px'; // Leave space for control buttons
            }
          }
          
          function toggleFocusMode() {
            focusMode = !focusMode;
            
            // Apply focus mode immediately
            applyFocusMode();
            
            // Also notify the extension to update the configuration
            vscode.postMessage({ type: 'toggleFocus' });
          }
          
          // Focus Mode implementation
          let focusMode = ${config.focusMode};
          let focusBlurStrength = ${config.focusOpacity * 5}; // Convert opacity config to blur strength
          let focusLineCount = ${config.focusLineCount};
          
          // Mirror Flip implementation
          let mirrorFlipEnabled = ${config.mirrorFlip};
          
          function toggleMirrorFlip() {
            mirrorFlipEnabled = !mirrorFlipEnabled;
            
            // Apply mirror flip immediately
            applyMirrorFlip();
            
            // Notify the extension to update the configuration
            vscode.postMessage({ type: 'toggleMirror' });
          }
          
          function applyMirrorFlip() {
            const content = document.getElementById('content');
            const statusIndicator = document.getElementById('mirror-status');
            const statusText = document.getElementById('mirror-status-text');
            
            if (mirrorFlipEnabled) {
              content.classList.add('mirror-flip');
              statusText.innerText = '${t('ui.mirrorOn')}';
              statusIndicator.classList.add('enabled');
              statusIndicator.classList.remove('disabled');
            } else {
              content.classList.remove('mirror-flip');
              statusText.innerText = '${t('ui.mirrorOff')}';
              statusIndicator.classList.add('disabled');
              statusIndicator.classList.remove('enabled');
            }
            
            // Show status indicator temporarily
            showMirrorStatus();
          }
          
          function showMirrorStatus() {
            const statusIndicator = document.getElementById('mirror-status');
            
            // Clear any existing timeout
            if (window.mirrorStatusTimeout) {
              clearTimeout(window.mirrorStatusTimeout);
            }
            
            // Show the indicator
            statusIndicator.classList.add('active');
            statusIndicator.classList.remove('hiding');
            
            // Hide after 2 seconds
            window.mirrorStatusTimeout = setTimeout(() => {
              statusIndicator.classList.add('hiding');
              statusIndicator.classList.remove('active');
            }, 2000);
          }
          
          // Markdown Mode implementation
          let markdownMode = ${config.markdownMode};
          
          function toggleMarkdownMode() {
            markdownMode = !markdownMode;
            
            // Re-process the content with the new mode
            updateContentDisplay();
            
            // Notify the extension to update the configuration
            vscode.postMessage({ type: 'toggleMarkdown' });
          }
          
          function updateContent() {
            updateContentDisplay();
          }
          
          function updateContentDisplay() {
            const contentElement = document.getElementById('content');
            if (contentElement && currentContent) {
              if (markdownMode) {
                contentElement.innerHTML = processMarkdownContent(currentContent);
              } else {
                contentElement.innerHTML = processPlainTextContent(currentContent);
              }
              
              // Reapply focus mode after content update
              applyFocusMode();
            }
          }
          
          function processMarkdownContent(content) {
            // Enhanced markdown processing to match server-side implementation
            let html = content;
            
            // Headers (process in order from most specific to least)
            html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
            html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
            html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
            
            // Bold and italic (process in order from most specific to least)
            html = html.replace(/\\*\\*\\*(.*?)\\*\\*\\*/g, '<strong><em>$1</em></strong>');
            html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
            html = html.replace(/\\*(.*?)\\*/g, '<em>$1</em>');
            
            // Code blocks first, then inline code
            html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
            html = html.replace(/\`([^\`]*?)\`/g, '<code>$1</code>');
            
            // Blockquotes - handle nested quotes
            const lines = html.split('\\n');
            const processedLines = [];
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              const blockquoteMatch = line.match(/^(>{1,})\\s*(.*)$/);
              if (blockquoteMatch) {
                const level = blockquoteMatch[1].length;
                const text = blockquoteMatch[2] || '';
                let cssClasses = 'markdown-blockquote';
                if (level > 1) {
                  cssClasses += ' markdown-blockquote-nested-' + Math.min(level, 5);
                }
                processedLines.push('<blockquote class="' + cssClasses + '">' + text + '</blockquote>');
              } else {
                processedLines.push(line);
              }
            }
            html = processedLines.join('\\n');
            
            // Lists - ordered first, then unordered
            html = html.replace(/^\\d+\\. (.*$)/gim, '<li>$1</li>');
            html = html.replace(/^[\\*\\-+] (.*$)/gim, '<li>$1</li>');
            
            // Horizontal rules
            html = html.replace(/^(-{3,}|\\*{3,}|_{3,})$/gim, '<hr>');
            
            // Links
            html = html.replace(/\\[([^\\]]*?)\\]\\(([^\\)]*?)\\)/g, '<a href="$2">$1</a>');
            
            // Split into lines and wrap each line
            return html.split('\\n').map(function(line, index) {
              const lineContent = line.trim() ? line : '&nbsp;';
              return '<div class="cue-line" data-line-number="' + index + '">' + lineContent + '</div>';
            }).join('');
          }
          
          function processPlainTextContent(content) {
            return content.split('\\\\n').map((line, index) => {
              const escapedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
              return \`<div class="cue-line" data-line-number="\${index}">\${escapedLine}</div>\`;
            }).join('');
          }
          
          function applyFocusMode() {
            const content = document.getElementById('content');
            const lines = content.querySelectorAll('.cue-line');
            const focusIndicator = document.getElementById('focus-indicator');
            
            if (focusMode) {
              const windowHeight = window.innerHeight;
              const focusAreaTop = windowHeight * 0.4; // Focus area top position (40% of screen)
              const focusAreaBottom = windowHeight * 0.6; // Focus area bottom position (60% of screen)
              
              // Show focus area indicator
              focusIndicator.classList.add('active');
              focusIndicator.style.top = focusAreaTop + 'px';
              focusIndicator.style.height = (focusAreaBottom - focusAreaTop) + 'px';
              
              lines.forEach((line) => {
                const rect = line.getBoundingClientRect();
                const lineCenter = rect.top + rect.height / 2;
                
                let blurAmount = 0;
                
                // Check if this line is in the focus area
                if (lineCenter >= focusAreaTop && lineCenter <= focusAreaBottom) {
                  // In focus area, completely clear
                  blurAmount = 0;
                } else {
                  // Outside focus area, calculate distance and gradient blur effect
                  const bufferLines = 3; // Buffer line count
                  const avgLineHeight = rect.height || 20; // Average line height
                  const bufferDistance = bufferLines * avgLineHeight;
                  const maxBlur = focusBlurStrength; // Maximum blur amount (px)
                  
                  let distance = 0;
                  if (lineCenter < focusAreaTop) {
                    // Above focus area
                    distance = focusAreaTop - lineCenter;
                  } else {
                    // Below focus area
                    distance = lineCenter - focusAreaBottom;
                  }
                  
                  if (distance <= bufferDistance) {
                    // In buffer zone, calculate gradient blur
                    // Buffer blur range: from maxBlur to minBlur (not 0)
                    const minBlurInBuffer = maxBlur * 0.3; // Buffer boundary still maintains 30% blur
                    const ratio = distance / bufferDistance;
                    blurAmount = minBlurInBuffer + ratio * (maxBlur - minBlurInBuffer);
                  } else {
                    // Beyond buffer, use maximum blur
                    blurAmount = maxBlur;
                  }
                }
                
                // Ensure filter only sets blur, clear other possible filters
                if (blurAmount === 0) {
                  line.style.filter = 'none';
                } else {
                  line.style.filter = \`blur(\${blurAmount}px)\`;
                }
              });
            } else {
              // Hide focus area indicator
              focusIndicator.classList.remove('active');
              
              lines.forEach(line => {
                line.style.filter = 'none';
              });
            }
          }
          
          function updateFocusLine() {
            if (!focusMode) return;
            applyFocusMode();
          }

          function hideHelpOnClickOutside(event) {
            const helpPanel = document.getElementById('help-panel');
            const helpButton = event.target.closest('.cue-button');
            
            // Don't hide if clicking on the help panel itself or the help button
            if (!helpPanel.contains(event.target) && !helpButton) {
              helpPanel.style.display = 'none';
              document.removeEventListener('click', hideHelpOnClickOutside);
            }
          }
          
          // Auto-scroll functionality (based on original webview.html)
          let scrolling = false;
          let scrollSpeed = ${config.scrollSpeed};
          let accumulatedScroll = 0;
          let scrollDirection = 1; // 1 for down, -1 for up
          
          // Content management - use JSON encoding for safety
          let currentContent = ${JSON.stringify(content)};
          
          function scrollStep() {
            if (scrolling) {
              accumulatedScroll += scrollSpeed * scrollDirection;
              if (Math.abs(accumulatedScroll) >= 1) {
                window.scrollBy(0, Math.floor(accumulatedScroll));
                accumulatedScroll -= Math.floor(accumulatedScroll);
              }
            }
            requestAnimationFrame(scrollStep);
          }
          
          // Start the scroll loop
          requestAnimationFrame(scrollStep);
          
          // Handle keyboard events
          document.addEventListener('keydown', (e) => {
            const scrollAmount = 50;
            
            switch(e.key) {
              case 'Escape':
                closeMode();
                break;
              case 'h':
              case 'H':
                toggleHelp();
                e.preventDefault();
                break;
              case ' ': // Space bar to toggle auto-scroll
                scrolling = !scrolling;
                e.preventDefault();
                break;
              case 'ArrowUp':
                scrolling = false; // Stop auto-scroll on manual control
                window.scrollBy(0, -scrollAmount);
                e.preventDefault();
                break;
              case 'ArrowDown':
                scrolling = false; // Stop auto-scroll on manual control
                window.scrollBy(0, scrollAmount);
                e.preventDefault();
                break;
              case 'PageUp':
                scrolling = false;
                window.scrollBy(0, -window.innerHeight * 0.8);
                e.preventDefault();
                break;
              case 'PageDown':
                scrolling = false;
                window.scrollBy(0, window.innerHeight * 0.8);
                e.preventDefault();
                break;
              case 'Home':
                scrolling = false;
                window.scrollTo(0, 0);
                e.preventDefault();
                break;
              case 'End':
                scrolling = false;
                window.scrollTo(0, document.body.scrollHeight);
                e.preventDefault();
                break;
              case 'r':
              case 'R':
                // Toggle reverse scroll
                scrollDirection *= -1;
                e.preventDefault();
                break;
              case '+':
              case '=':
                // Increase scroll speed
                scrollSpeed = Math.min(scrollSpeed + 0.1, 5);
                e.preventDefault();
                break;
              case '-':
              case '_':
                // Decrease scroll speed
                scrollSpeed = Math.max(scrollSpeed - 0.1, 0.1);
                e.preventDefault();
                break;
              case 't':
              case 'T':
                // Cycle to next theme via command
                vscode.postMessage({ type: 'cycleTheme' });
                e.preventDefault();
                break;
              case 'f':
              case 'F':
                // Toggle focus mode
                toggleFocusMode();
                e.preventDefault();
                break;
              case 'm':
              case 'M':
                // Toggle mirror flip
                toggleMirrorFlip();
                e.preventDefault();
                break;
              case 'd':
              case 'D':
                // Toggle markdown mode
                toggleMarkdownMode();
                e.preventDefault();
                break;
            }
          });
          
          // Report scroll events to extension
          window.addEventListener('scroll', () => {
            updateFocusLine();
            vscode.postMessage({ 
              type: 'scroll', 
              data: { 
                scrollTop: window.scrollY,
                scrollHeight: document.body.scrollHeight,
                clientHeight: window.innerHeight
              }
            });
          });
          
          // Listen for messages from the extension
          window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.type === 'configUpdate') {
              // Update configuration
              if (message.config) {
                focusMode = message.config.focusMode;
                focusBlurStrength = message.config.focusOpacity * 5; // Convert opacity config to blur strength
                focusLineCount = message.config.focusLineCount;
                mirrorFlipEnabled = message.config.mirrorFlip;
                markdownMode = message.config.markdownMode;
                
                // Apply focus mode and mirror flip
                applyFocusMode();
                applyMirrorFlip();
                
                // Note: Content display will be updated by server-side HTML regeneration
                // No need to call updateContentDisplay() here as it uses simplified client-side processing
              }
            } else if (message.type === 'contentUpdate') {
              // Update content with new text
              if (message.content !== undefined) {
                currentContent = message.content;
                updateContentDisplay();
              }
            }
          });
          
          // Initialize
          console.log('${i18nStrings.initMessage}');
          
          // Apply initial mirror flip state
          applyMirrorFlip();
          
          // Listen for window resize events
          window.addEventListener('resize', () => {
            const helpPanel = document.getElementById('help-panel');
            if (helpPanel.style.display === 'block') {
              adjustHelpPosition(helpPanel);
            }
            
            // Update focus mode
            if (focusMode) {
              applyFocusMode();
            }
          });
          
          // Apply focus mode on initialization
          setTimeout(() => {
            applyFocusMode();
          }, 100);
          
          // Update focus area on window resize
          window.addEventListener('resize', () => {
            if (focusMode) {
              applyFocusMode();
            }
          });
          
          // Show help message after a delay
          setTimeout(() => {
            const helpText = [
              '${i18nStrings.shortcutsTitle}:',
              '${i18nStrings.spaceShortcut}',
              '${i18nStrings.rShortcut}',
              '${i18nStrings.speedShortcut}',
              '${i18nStrings.helpShortcut}',
              '${i18nStrings.escShortcut}'
            ].join('\\n');
            
            console.log(helpText);
          }, 1000);
        </script>
      </body>
      </html>
    `;
  }

  /**
   * Process content for display
   */
  private processContent(content: string): string {
    if (this.state.config.markdownMode) {
      return this.processMarkdownContent(content);
    }
    return this.processPlainTextContent(content);
  }

  private processMarkdownContent(content: string): string {
    try {
      // Parse markdown content with user's selected features
      const result = MarkdownParser.parse(content, this.state.config.markdownFeatures);
      
      // Split content into lines and wrap each line for focus mode support
      const lines = result.html.split('\n');
      const processedLines = lines.map((line, index) => {
        // For markdown, we need to preserve HTML structure while adding focus classes
        const lineWithFocus = line.trim() ? 
          `<span class="cue-line markdown-line" data-line="${index}">${line}</span>` :
          `<span class="cue-line markdown-line" data-line="${index}">&nbsp;</span>`;
        return lineWithFocus;
      });
      
      return `<div class="markdown-content">${processedLines.join('\n')}</div>`;
    } catch (error) {
      // Fallback to plain text processing if markdown parsing fails
      console.warn('Markdown parsing failed, falling back to plain text:', error);
      return this.processPlainTextContent(content);
    }
  }

  private processPlainTextContent(content: string): string {
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

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.state.isActive = false;
    this.panel = undefined;

    if (this.configChangeListener) {
      this.configChangeListener.dispose();
      this.configChangeListener = undefined;
    }

    if (this.documentChangeListener) {
      this.documentChangeListener.dispose();
      this.documentChangeListener = undefined;
    }
  }

}
