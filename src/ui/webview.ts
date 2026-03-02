import * as vscode from 'vscode';
import type { CueModeConfig, CueModeState, WebviewMessage } from '../types';
import { t, getCurrentLanguage } from '../i18n';
import { processContent as renderContent } from './contentRenderer';
import { generateMainHTML } from './mainView';
import { generatePresentationHTML as renderPresentationHTML } from './presentationView';
import { handleWebviewMessage as dispatchWebviewMessage } from './webviewMessageHandler';

/**
 * WebView manager for CueMode
 */
export class WebViewManager {
  private static readonly PRESENTATION_REFRESH_DEBOUNCE_MS = 200;
  private panel: vscode.WebviewPanel | undefined;
  private context: vscode.ExtensionContext;
  private state: CueModeState;
  private documentChangeListener: vscode.Disposable | undefined;
  private presentationRefreshTimer: ReturnType<typeof setTimeout> | undefined;
  private onCloseCallback: (() => void) | undefined;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = {
      isActive: false,
      content: '',
      filename: '',
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
        showLineBreaks: true,
        markdownFeatures: {
          headers: true,
          emphasis: true,
          lists: true,
          links: false,
          code: true,
          blockquotes: true,
          tables: true,
          taskLists: true,
          strikethrough: false,
          horizontalRule: true,
        },
      },
      sourceDocument: undefined,
      savedScrollPosition: 0,
      isPresentationMode: false,
      slides: [],
    };
  }

  /**
   * Create normal teleprompter webview
   */
  public async create(
    content: string,
    filename: string,
    config: CueModeConfig,
    sourceDocument?: vscode.TextDocument
  ): Promise<void> {
    this.close();

    this.state.content = content ?? '';
    this.state.filename = filename ?? '';
    this.state.config = config;
    this.state.sourceDocument = sourceDocument;
    this.state.savedScrollPosition = 0;
    this.state.isPresentationMode = false;
    this.state.slides = [];

    this.panel = vscode.window.createWebviewPanel(
      'cuemode',
      t('ui.title', { filename: this.state.filename }),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = await this.generateHTML();
    this.setupPanelListeners();
    this.setupDocumentChangeListener();
    this.state.isActive = true;
  }

  /**
   * Create presentation (slide) webview
   */
  public async createPresentation(
    slides: string[],
    filename: string,
    config: CueModeConfig,
    sourceDocument?: vscode.TextDocument
  ): Promise<void> {
    this.close();

    const safeSlides = slides ?? [];

    this.state.content = safeSlides.join('\n---\n');
    this.state.filename = filename ?? '';
    this.state.config = config;
    this.state.sourceDocument = sourceDocument;
    this.state.savedScrollPosition = 0;
    this.state.isPresentationMode = true;
    this.state.slides = safeSlides;

    this.panel = vscode.window.createWebviewPanel(
      'cuemode.presentation',
      t('presentation.title', { filename: this.state.filename }),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.panel.webview.html = this.generatePresentationHTML(
      safeSlides,
      this.state.config,
      this.state.filename
    );

    this.setupPanelListeners();
    this.setupDocumentChangeListener();
    this.state.isActive = true;
  }

  /**
   * Set callback fired when panel closes
   */
  public setOnCloseCallback(callback: () => void): void {
    this.onCloseCallback = callback;
  }

  /**
   * Whether webview is active
   */
  public isActive(): boolean {
    return this.state.isActive;
  }

  /**
   * Close webview
   */
  public close(): void {
    if (this.panel) {
      this.panel.dispose();
      return;
    }

    // Keep repeated close() safe even when panel is already gone.
    this.cleanup();
  }

  /**
   * Update configuration and re-render panel
   */
  public async updateConfig(config: CueModeConfig): Promise<void> {
    this.state.config = config;

    if (!this.panel) {
      return;
    }

    if (this.state.isPresentationMode) {
      this.panel.webview.html = this.generatePresentationHTML(
        this.state.slides ?? [],
        this.state.config,
        this.state.filename
      );
    } else {
      this.panel.webview.html = await this.generateHTML();
    }

    await this.restoreScrollPosition();
  }

  /**
   * Restore scroll position in normal mode
   */
  public async restoreScrollPosition(): Promise<void> {
    if (!this.panel || this.state.isPresentationMode) {
      return;
    }

    if (this.state.savedScrollPosition === undefined) {
      return;
    }

    this.panel.webview.postMessage({
      type: 'restoreScroll',
      data: {
        scrollTop: this.state.savedScrollPosition,
      },
    });
  }

  /**
   * Return a copy of current state
   */
  public getState(): CueModeState {
    return { ...this.state };
  }

  /**
   * Return the current HTML (useful for tests)
   */
  public async getHtml(): Promise<string> {
    if (this.panel) {
      return this.panel.webview.html;
    }

    if (this.state.isPresentationMode) {
      return this.generatePresentationHTML(
        this.state.slides ?? [],
        this.state.config,
        this.state.filename
      );
    }

    return this.generateHTML();
  }

  private setupPanelListeners(): void {
    if (!this.panel) {
      return;
    }

    this.panel.onDidDispose(
      () => {
        this.cleanup();
      },
      null,
      this.context.subscriptions
    );

    this.panel.webview.onDidReceiveMessage(
      (message: WebviewMessage) => {
        dispatchWebviewMessage(message, {
          close: () => this.close(),
          saveScrollPosition: (scrollTop: number) => this.saveScrollPosition(scrollTop),
          webviewManager: this,
        });
      },
      null,
      this.context.subscriptions
    );
  }

  private setupDocumentChangeListener(): void {
    if (this.documentChangeListener) {
      this.documentChangeListener.dispose();
      this.documentChangeListener = undefined;
    }

    if (!this.state.sourceDocument) {
      return;
    }

    this.documentChangeListener = vscode.workspace.onDidChangeTextDocument(async event => {
      if (!this.panel) {
        return;
      }

      if (event.document.uri.toString() !== this.state.sourceDocument?.uri.toString()) {
        return;
      }

      if (this.state.isPresentationMode) {
        this.schedulePresentationRefresh(event.document);
        return;
      }

      this.state.content = event.document.getText();
      this.panel.webview.html = await this.generateHTML();
      await this.restoreScrollPosition();
    });

    this.context.subscriptions.push(this.documentChangeListener);
  }

  private saveScrollPosition(scrollTop: number): void {
    this.state.savedScrollPosition = scrollTop;
  }

  private splitSlides(rawText: string): string[] {
    const slides = rawText
      .split(/^\s*---\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (slides.length > 0) {
      return slides;
    }

    return [t('presentation.noContent')];
  }

  private schedulePresentationRefresh(document: vscode.TextDocument): void {
    if (this.presentationRefreshTimer) {
      clearTimeout(this.presentationRefreshTimer);
      this.presentationRefreshTimer = undefined;
    }

    this.presentationRefreshTimer = setTimeout(() => {
      this.presentationRefreshFromDocument(document);
    }, WebViewManager.PRESENTATION_REFRESH_DEBOUNCE_MS);
  }

  private presentationRefreshFromDocument(document: vscode.TextDocument): void {
    if (!this.panel || !this.state.isPresentationMode) {
      return;
    }

    if (document.uri.toString() !== this.state.sourceDocument?.uri.toString()) {
      return;
    }

    const rawText = document.getText();
    const slides = this.splitSlides(rawText);

    this.state.content = rawText;
    this.state.slides = slides;

    this.panel.webview.html = this.generatePresentationHTML(
      slides,
      this.state.config,
      this.state.filename
    );
  }

  /**
   * Generate HTML content for webview
   */
  private async generateHTML(): Promise<string> {
    const { content, config, filename } = this.state;
    const processedContent = this.processContent(content);

    return generateMainHTML({
      content,
      processedContent,
      filename,
      config,
      translate: t,
      language: getCurrentLanguage(),
    });
  }

  /**
   * Generate HTML for presentation (slide) mode
   */
  private generatePresentationHTML(
    slides: string[],
    config: CueModeConfig,
    filename: string
  ): string {
    return renderPresentationHTML(slides, config, filename);
  }

  /**
   * Process content for display
   */
  private processContent(content: string): string {
    return renderContent(content, this.state.config);
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.state.isActive = false;
    this.panel = undefined;

    if (this.presentationRefreshTimer) {
      clearTimeout(this.presentationRefreshTimer);
      this.presentationRefreshTimer = undefined;
    }

    if (this.documentChangeListener) {
      this.documentChangeListener.dispose();
      this.documentChangeListener = undefined;
    }

    if (this.onCloseCallback) {
      this.onCloseCallback();
      this.onCloseCallback = undefined;
    }
  }
}
