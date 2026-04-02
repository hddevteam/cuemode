import * as assert from 'assert';
import * as vscode from 'vscode';
import { handleWebviewMessage } from '../../ui/webviewMessageHandler';

suite('webviewMessageHandler', () => {
  const originalExecuteCommand = vscode.commands.executeCommand;

  teardown(() => {
    (
      vscode.commands as typeof vscode.commands & { executeCommand: typeof originalExecuteCommand }
    ).executeCommand = originalExecuteCommand;
  });

  test('forwards characterOffset when opening the editor from CueMode', async () => {
    const calls: Array<{ command: string; args: unknown[] }> = [];
    (
      vscode.commands as typeof vscode.commands & { executeCommand: typeof originalExecuteCommand }
    ).executeCommand = (async (command: string, ...args: unknown[]) => {
      calls.push({ command, args });
      return undefined;
    }) as typeof originalExecuteCommand;

    handleWebviewMessage(
      {
        type: 'openEditor',
        data: {
          lineNumber: 5,
          contextText: 'rendered line',
          clickedText: 'rendered',
          beforeText: '',
          afterText: ' line',
          characterOffset: 7,
        },
      },
      {
        close: () => undefined,
        saveScrollPosition: () => undefined,
        webviewManager: { id: 'test-manager' },
      }
    );

    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0]?.command, 'cuemode.openEditorAtLine');
    assert.strictEqual((calls[0]?.args[0] as { characterOffset?: number }).characterOffset, 7);
  });
});
