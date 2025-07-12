import * as vscode from 'vscode';
import * as path from 'path';
import { CueModeConfig, CueModeState, WebviewMessage } from '../types';
import { ThemeManager } from '../utils/theme';
import { I18n } from '../i18n';

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
        startingPosition: 50
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
        I18n.t('ui.title', filename),
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
    
    // Generate CSS for current theme
    const css = ThemeManager.generateCSS(
      config.colorTheme,
      config.fontSize,
      config.lineHeight,
      config.maxWidth,
      config.padding
    );

    // Process content for display
    const processedContent = this.processContent(content);

    // Calculate starting position (like the original)
    const startingPositionCSS = config.startingPosition > 0 
      ? `padding-top: ${config.startingPosition}vh; padding-bottom: ${config.startingPosition}vh;`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="${I18n.getLocale()}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${I18n.t('ui.title', filename)}</title>
        <style>
          ${css}
          body {
            ${startingPositionCSS}
          }
        </style>
      </head>
      <body>
        <div class="cue-controls">
          <button class="cue-button" onclick="closeMode()">${I18n.t('ui.close')}</button>
          <button class="cue-button" onclick="toggleHelp()">${I18n.t('ui.help')}</button>
        </div>
        
        <div class="cue-help" id="help-panel" style="display: none;">
          <h3>${I18n.getLocale().startsWith('zh') ? '提词器模式快捷键' : 'Teleprompter Mode Shortcuts'}</h3>
          <ul>
            <li><strong>Space</strong>: ${I18n.getLocale().startsWith('zh') ? '开始/暂停自动滚屏' : 'Start/Stop auto-scroll'}</li>
            <li><strong>R</strong>: ${I18n.getLocale().startsWith('zh') ? '切换滚屏方向' : 'Toggle scroll direction'}</li>
            <li><strong>+/-</strong>: ${I18n.getLocale().startsWith('zh') ? '调整滚屏速度' : 'Adjust scroll speed'}</li>
            <li><strong>${I18n.getLocale().startsWith('zh') ? '方向键' : 'Arrow keys'}</strong>: ${I18n.getLocale().startsWith('zh') ? '手动滚屏' : 'Manual scroll'}</li>
            <li><strong>Page Up/Down</strong>: ${I18n.getLocale().startsWith('zh') ? '快速滚屏' : 'Fast scroll'}</li>
            <li><strong>Home/End</strong>: ${I18n.getLocale().startsWith('zh') ? '跳转到开始/结束' : 'Jump to start/end'}</li>
            <li><strong>T</strong>: ${I18n.getLocale().startsWith('zh') ? '切换主题' : 'Toggle theme'}</li>
            <li><strong>H</strong>: ${I18n.getLocale().startsWith('zh') ? '显示/隐藏帮助' : 'Show/Hide help'}</li>
            <li><strong>Esc</strong>: ${I18n.getLocale().startsWith('zh') ? '退出模式' : 'Exit mode'}</li>
          </ul>
        </div>
        
        <div class="cue-container">
          <div class="cue-content" id="content">
            ${processedContent}
          </div>
        </div>

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
              // Add click outside to close functionality
              setTimeout(() => {
                document.addEventListener('click', hideHelpOnClickOutside);
              }, 100);
            } else {
              helpPanel.style.display = 'none';
              document.removeEventListener('click', hideHelpOnClickOutside);
            }
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
            }
          });
          
          // Report scroll events to extension
          window.addEventListener('scroll', () => {
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
            // Handle extension messages if needed in the future
          });
          
          // Initialize
          console.log('${I18n.getLocale().startsWith('zh') ? '提词器模式已初始化' : 'Teleprompter mode initialized'}');
          
          // Show help message after a delay
          setTimeout(() => {
            const helpText = [
              '${I18n.getLocale().startsWith('zh') ? '提词器模式快捷键：' : 'Teleprompter Mode Shortcuts:'}',
              '${I18n.getLocale().startsWith('zh') ? 'Space: 开始/暂停自动滚屏' : 'Space: Start/Stop auto-scroll'}',
              '${I18n.getLocale().startsWith('zh') ? 'R: 切换滚屏方向' : 'R: Toggle scroll direction'}',
              '${I18n.getLocale().startsWith('zh') ? '+/-: 调整滚屏速度' : '+/-: Adjust scroll speed'}',
              '${I18n.getLocale().startsWith('zh') ? 'H: 显示/隐藏帮助' : 'H: Show/Hide help'}',
              '${I18n.getLocale().startsWith('zh') ? 'Esc: 退出模式' : 'Esc: Exit mode'}'
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
    // Escape HTML characters
    const escapeHtml = (unsafe: string): string => {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Use pre tag to preserve formatting like the original
    const escapedContent = escapeHtml(content);
    return `<pre>${escapedContent}</pre>`;
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
