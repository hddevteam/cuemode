import * as vscode from 'vscode';
import { WebViewManager } from './ui/webview';
import { ConfigManager } from './utils/config';
import { I18n, Messages } from './i18n';
import { CueModeError } from './types';

/**
 * Main extension class
 */
export class CueModeExtension {
  private webViewManager: WebViewManager;
  private configChangeListener: vscode.Disposable | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.webViewManager = new WebViewManager(context);
  }

  /**
   * Activate the extension
   */
  public activate(): void {
    console.log('CueMode extension is now active!');

    // Register commands
    this.registerCommands();

    // Setup configuration listener
    this.setupConfigurationListener();

    // Register for cleanup
    this.context.subscriptions.push(
      { dispose: () => this.deactivate() }
    );
  }

  /**
   * Deactivate the extension
   */
  public deactivate(): void {
    console.log('CueMode extension is deactivating...');
    
    // Close webview if active
    if (this.webViewManager.isActive()) {
      this.webViewManager.close();
    }

    // Cleanup listeners
    if (this.configChangeListener) {
      this.configChangeListener.dispose();
    }
  }

  /**
   * Register extension commands
   */
  private registerCommands(): void {
    // Main CueMode command
    const cueModeCommand = vscode.commands.registerCommand('cuemode.cueMode', () => {
      this.activateCueMode();
    });

    // Change theme command
    const changeThemeCommand = vscode.commands.registerCommand('cuemode.changeTheme', () => {
      this.changeTheme();
    });

    // Remove leading spaces command
    const removeLeadingSpacesCommand = vscode.commands.registerCommand('cuemode.removeLeadingSpaces', () => {
      this.removeLeadingSpaces();
    });

    // Cycle theme command
    const cycleThemeCommand = vscode.commands.registerCommand('cuemode.cycleTheme', () => {
      this.cycleTheme();
    });

    this.context.subscriptions.push(cueModeCommand, changeThemeCommand, removeLeadingSpacesCommand, cycleThemeCommand);
  }

  /**
   * Setup configuration change listener
   */
  private setupConfigurationListener(): void {
    this.configChangeListener = ConfigManager.onConfigChanged(newConfig => {
      if (this.webViewManager.isActive()) {
        this.webViewManager.updateConfig(newConfig);
        
        // Show short auto-dismiss notification
        vscode.window.setStatusBarMessage(
          I18n.t('notification.configUpdated'), 
          3000 // Auto-dismiss after 3 seconds
        );
      }
    });

    this.context.subscriptions.push(this.configChangeListener);
  }

  /**
   * Activate CueMode
   */
  private async activateCueMode(): Promise<void> {
    try {
      // Get active editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        throw new CueModeError(I18n.t('error.noActiveEditor'));
      }

      // Get content
      const document = editor.document;
      const selection = editor.selection;
      
      let content: string;
      if (!selection.isEmpty) {
        content = document.getText(selection);
      } else {
        content = document.getText();
      }

      if (!content.trim()) {
        throw new CueModeError(I18n.t('error.noContent'));
      }

      // Get filename
      const filename = this.getFilename(document);

      // Get configuration
      const config = ConfigManager.getSafeConfig();

      // Create webview
      await this.webViewManager.create(content, filename, config);

      // Show short auto-dismiss notification
      vscode.window.setStatusBarMessage(
        I18n.t('notification.activated'), 
        2000 // Auto-dismiss after 2 seconds
      );

    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get filename from document
   */
  private getFilename(document: vscode.TextDocument): string {
    if (document.isUntitled) {
      return `Untitled-${document.languageId}`;
    }

    const path = document.uri.fsPath;
    const parts = path.split(/[/\\]/);
    return parts[parts.length - 1] || 'Unknown';
  }

  /**
   * Change theme
   */
  private async changeTheme(): Promise<void> {
    try {
      const themes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
      const themeLabels = themes.map(theme => {
        const key = `theme.${theme}` as keyof Messages;
        return {
          label: I18n.t(key),
          value: theme
        };
      });

      const selected = await vscode.window.showQuickPick(themeLabels, {
        placeHolder: I18n.t('command.changeTheme')
      });

      if (selected) {
        const config = vscode.workspace.getConfiguration('cuemode');
        await config.update('colorTheme', selected.value, vscode.ConfigurationTarget.Global);
        
        vscode.window.setStatusBarMessage(
          I18n.t('notification.themeChanged', selected.label),
          3000 // Auto-dismiss after 3 seconds
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Cycle to next theme (for T key shortcut)
   */
  private async cycleTheme(): Promise<void> {
    try {
      const themes = ['classic', 'inverted', 'midnightBlue', 'sunset', 'forest', 'ocean', 'rose'];
      const config = vscode.workspace.getConfiguration('cuemode');
      const currentTheme = config.get<string>('colorTheme', 'classic');
      
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      const nextTheme = themes[nextIndex];

      // Update configuration
      await config.update('colorTheme', nextTheme, vscode.ConfigurationTarget.Global);

      // Get localized theme name
      const themeKey = `theme.${nextTheme}` as keyof Messages;
      const themeName = I18n.t(themeKey);

      // Show VS Code notification
      vscode.window.setStatusBarMessage(
        I18n.t('notification.themeChanged', themeName),
        3000 // Auto-dismiss after 3 seconds
      );

      // Update webview if active
      if (this.webViewManager.isActive()) {
        const newConfig = ConfigManager.getSafeConfig();
        await this.webViewManager.updateConfig(newConfig);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Remove leading spaces from selected text
   */
  private async removeLeadingSpaces(): Promise<void> {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        throw new CueModeError(I18n.t('error.noActiveEditor'));
      }

      const selection = editor.selection;
      const document = editor.document;
      
      // If no selection, use entire document
      const range = selection.isEmpty 
        ? new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length)
        : selection;

      const text = document.getText(range);
      const lines = text.split('\n');
      let processedLines = 0;

      const processedText = lines.map(line => {
        // Remove leading spaces, tabs, and Chinese full-width spaces (U+3000)
        const trimmedLine = line.replace(/^[\s\t\u3000]+/, '');
        if (trimmedLine !== line) {
          processedLines++;
        }
        return trimmedLine;
      }).join('\n');

      if (processedLines > 0) {
        await editor.edit(editBuilder => {
          editBuilder.replace(range, processedText);
        });

        vscode.window.setStatusBarMessage(
          I18n.t('notification.spacesRemoved', processedLines.toString()),
          3000 // Auto-dismiss after 3 seconds
        );
      } else {
        vscode.window.setStatusBarMessage(
          I18n.t('notification.spacesRemoved', '0'),
          2000 // Auto-dismiss after 2 seconds
        );
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: unknown): void {
    console.error('CueMode error:', error);

    let message: string;
    if (error instanceof CueModeError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = I18n.t('notification.error', error.message);
    } else {
      message = I18n.t('notification.error', String(error));
    }

    vscode.window.showErrorMessage(message);
  }
}

/**
 * Extension activation function
 */
export function activate(context: vscode.ExtensionContext): void {
  const extension = new CueModeExtension(context);
  extension.activate();
}

/**
 * Extension deactivation function
 */
export function deactivate(): void {
  // Cleanup handled by extension class
}
