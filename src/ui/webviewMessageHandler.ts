import * as vscode from 'vscode';
import type { WebviewMessage } from '../types';

export interface WebviewMessageHandlerDeps {
  close: () => void;
  saveScrollPosition: (scrollTop: number) => void;
  webviewManager: unknown;
}

/**
 * Handle messages from webview and route commands/events to extension logic.
 */
export function handleWebviewMessage(
  message: WebviewMessage,
  deps: WebviewMessageHandlerDeps
): void {
  switch (message.type) {
    case 'close':
      deps.close();
      break;

    case 'changeTheme':
      vscode.commands.executeCommand('cuemode.changeTheme');
      break;

    case 'cycleTheme':
      vscode.commands.executeCommand('cuemode.cycleTheme');
      break;

    case 'toggleFocus':
      vscode.commands.executeCommand('cuemode.toggleFocusMode');
      break;

    case 'toggleMirror':
      vscode.commands.executeCommand('cuemode.toggleMirrorFlip');
      break;

    case 'toggleMarkdown':
      vscode.commands.executeCommand('cuemode.toggleMarkdownMode');
      break;

    case 'adjustLineHeight':
      vscode.commands.executeCommand('cuemode.adjustLineHeight');
      break;

    case 'increaseFontSize':
      vscode.commands.executeCommand('cuemode.increaseFontSize');
      break;

    case 'decreaseFontSize':
      vscode.commands.executeCommand('cuemode.decreaseFontSize');
      break;

    case 'scroll':
      if (message.data?.scrollTop !== undefined) {
        deps.saveScrollPosition(message.data.scrollTop);
      }
      break;

    case 'openEditor':
      if (message.data?.lineNumber !== undefined) {
        vscode.commands.executeCommand('cuemode.openEditorAtLine', {
          lineNumber: message.data.lineNumber,
          contextText: message.data.contextText,
          clickedText: message.data.clickedText,
          beforeText: message.data.beforeText,
          afterText: message.data.afterText,
          characterOffset: message.data.characterOffset,
          webviewManager: deps.webviewManager,
        });
      }
      break;

    default:
      console.warn('Unknown webview message type:', message.type);
  }
}
