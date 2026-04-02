import * as assert from 'assert';
import { resolveEditorNavigationTarget } from '../../utils/editorNavigation';

suite('editorNavigation', () => {
  test('maps rendered markdown emphasis back to source character', () => {
    const documentText = `# Demo\n\nThis is a **test** document for double-click functionality.`;

    const target = resolveEditorNavigationTarget(documentText, {
      lineNumber: 2,
      contextText: 'This is a test document for double-click functionality.',
      clickedText: 'test',
      beforeText: 'This is a ',
      afterText: ' document',
      characterOffset: 10,
    });

    assert.strictEqual(target.lineNumber, 2);
    assert.strictEqual(target.character, 12);
    assert.strictEqual(target.selectionLength, 4);
  });

  test('maps list item text without bullet marker back to source line', () => {
    const documentText = `# Demo\n\n- List item 1\n- List item 2`;

    const target = resolveEditorNavigationTarget(documentText, {
      lineNumber: 3,
      contextText: 'List item 2',
      clickedText: 'List',
      beforeText: '',
      afterText: ' item 2',
      characterOffset: 0,
    });

    assert.strictEqual(target.lineNumber, 3);
    assert.strictEqual(target.character, 2);
    assert.strictEqual(target.selectionLength, 4);
  });

  test('prefers the occurrence nearest the clicked offset when text repeats', () => {
    const documentText = 'alpha **beta** alpha beta';

    const target = resolveEditorNavigationTarget(documentText, {
      lineNumber: 0,
      contextText: 'alpha beta alpha beta',
      clickedText: 'beta',
      beforeText: 'alpha ',
      afterText: '',
      characterOffset: 17,
    });

    assert.strictEqual(target.lineNumber, 0);
    assert.strictEqual(target.character, 21);
    assert.strictEqual(target.selectionLength, 4);
  });

  test('supports Chinese rendered text matching back to markdown source', () => {
    const documentText = '## 标题\n\n双击**编辑**功能测试';

    const target = resolveEditorNavigationTarget(documentText, {
      lineNumber: 2,
      contextText: '双击编辑功能测试',
      clickedText: '编辑',
      beforeText: '双击',
      afterText: '功能测试',
      characterOffset: 2,
    });

    assert.strictEqual(target.lineNumber, 2);
    assert.strictEqual(target.character, 4);
    assert.strictEqual(target.selectionLength, 2);
  });
});
