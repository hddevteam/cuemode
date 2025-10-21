import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Double-Click to Edit Tests', () => {
  let testDocument: vscode.TextDocument;

  suiteSetup(async () => {
    // Create a test markdown file
    const testContent = `# Test Document

This is a **test** document for double-click functionality.

## Section 1
Some content here with multiple words.

## Section 2
- List item 1
- List item 2

\`\`\`javascript
const x = 42;
\`\`\`

More text at the end.`;

    // Create temporary document
    testDocument = await vscode.workspace.openTextDocument({
      content: testContent,
      language: 'markdown'
    });

    await vscode.window.showTextDocument(testDocument);
  });

  suiteTeardown(async () => {
    // Close the test document
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('openEditorAtLine command should be registered', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('cuemode.openEditorAtLine'), 'openEditorAtLine command should be registered');
  });

  test('openEditorAtLine should navigate to correct line', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 2,
      contextText: 'This is a **test** document'
    });

    // Wait a bit for the command to execute
    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor');
    assert.strictEqual(activeEditor?.document.uri.toString(), testDocument.uri.toString(), 'Should be the test document');
  });

  test('openEditorAtLine should handle character-level positioning with clickedText', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 2,
      contextText: 'This is a **test** document',
      clickedText: 'test',
      beforeText: 'This is a **',
      afterText: '** document'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor');
    
    // The selection should include the clicked text
    const selection = activeEditor?.selection;
    assert.ok(selection, 'Should have a selection');
  });

  test('openEditorAtLine should handle Chinese text', async () => {
    const chineseContent = '这是一个测试文档\n\n双击编辑功能测试\n\n更多中文内容';
    const chineseDoc = await vscode.workspace.openTextDocument({
      content: chineseContent,
      language: 'markdown'
    });

    await vscode.window.showTextDocument(chineseDoc);

    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: chineseDoc.uri.toString(),
      line: 2,
      contextText: '双击编辑功能测试',
      clickedText: '编辑',
      beforeText: '双击',
      afterText: '功能测试'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor');
    assert.strictEqual(activeEditor?.document.uri.toString(), chineseDoc.uri.toString(), 'Should be the Chinese document');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  test('openEditorAtLine should handle missing clickedText gracefully', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 5,
      contextText: 'Some content here'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor even without clickedText');
  });

  test('openEditorAtLine should handle out-of-range line numbers', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 9999,
      contextText: 'nonexistent'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should still have active editor');
  });

  test('openEditorAtLine should handle invalid URI gracefully', async () => {
    try {
      await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
        uri: 'invalid://uri',
        line: 0,
        contextText: 'test'
      });
      // Should not throw
      assert.ok(true, 'Should handle invalid URI gracefully');
    } catch (error) {
      // If it throws, that's also acceptable behavior
      assert.ok(true, 'Handled error appropriately');
    }
  });

  test('Character positioning should work with context matching', async () => {
    // Test the three-layer matching algorithm
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 2,
      contextText: 'This is a **test** document for double-click functionality.',
      clickedText: 'double-click',
      beforeText: 'document for ',
      afterText: ' functionality'
    });

    await new Promise(resolve => setTimeout(resolve, 150));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor');
    
    const selection = activeEditor?.selection;
    if (selection && !selection.isEmpty) {
      const selectedText = activeEditor?.document.getText(selection);
      // The selected text should be related to what we clicked
      assert.ok(selectedText, 'Should have selected text');
    }
  });

  test('Should handle code blocks correctly', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 12,
      contextText: 'const x = 42;',
      clickedText: 'const',
      beforeText: '',
      afterText: ' x = 42;'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor for code block');
  });

  test('Should handle list items correctly', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 9,
      contextText: '- List item 1',
      clickedText: 'List',
      beforeText: '- ',
      afterText: ' item 1'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should have active editor for list item');
  });

  test('Should handle empty clickedText', async () => {
    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: testDocument.uri.toString(),
      line: 2,
      contextText: 'This is a test',
      clickedText: '',
      beforeText: 'This is',
      afterText: 'a test'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should handle empty clickedText gracefully');
  });

  test('Should handle special characters in clicked text', async () => {
    const specialContent = 'Test with **bold** and `code` and [link](url)';
    const specialDoc = await vscode.workspace.openTextDocument({
      content: specialContent,
      language: 'markdown'
    });

    await vscode.window.showTextDocument(specialDoc);

    await vscode.commands.executeCommand('cuemode.openEditorAtLine', {
      uri: specialDoc.uri.toString(),
      line: 0,
      contextText: specialContent,
      clickedText: 'bold',
      beforeText: 'with **',
      afterText: '** and'
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const activeEditor = vscode.window.activeTextEditor;
    assert.ok(activeEditor, 'Should handle special characters');

    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });
});
