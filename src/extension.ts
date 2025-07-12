import * as vscode from 'vscode';
import { WebViewManager } from './ui/webview';
import { ConfigManager } from './utils/config';
import { I18n } from './i18n';
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

    this.context.subscriptions.push(cueModeCommand);
  }

  /**
   * Setup configuration change listener
   */
  private setupConfigurationListener(): void {
    this.configChangeListener = ConfigManager.onConfigChanged(newConfig => {
      if (this.webViewManager.isActive()) {
        this.webViewManager.updateConfig(newConfig);
        
        // Show notification
        vscode.window.showInformationMessage(
          I18n.t('notification.configUpdated')
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

      // Show success notification
      vscode.window.showInformationMessage(
        I18n.t('notification.activated')
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
   * Handle errors
   */
  private handleError(error: any): void {
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
