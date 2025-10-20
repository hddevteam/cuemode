import * as assert from 'assert';
import { UIStateManager } from '../../utils/uiState';

suite('UIStateManager Test Suite', () => {
  let uiStateManager: UIStateManager;

  setup(() => {
    uiStateManager = new UIStateManager();
  });

  test('hasSavedState should return false initially', () => {
    assert.strictEqual(uiStateManager.hasSavedState(), false);
  });

  test('hasSavedState should return true after hideUI', async () => {
    await uiStateManager.hideUI();
    assert.strictEqual(uiStateManager.hasSavedState(), true);
  });

  test('hasSavedState should return false after restore', async () => {
    await uiStateManager.hideUI();
    assert.strictEqual(uiStateManager.hasSavedState(), true);
    
    await uiStateManager.restore();
    assert.strictEqual(uiStateManager.hasSavedState(), false);
  });

  test('hasSavedState should return false after clearState', async () => {
    await uiStateManager.hideUI();
    assert.strictEqual(uiStateManager.hasSavedState(), true);
    
    uiStateManager.clearState();
    assert.strictEqual(uiStateManager.hasSavedState(), false);
  });

  test('restore should not throw when no state is saved', async () => {
    // Should not throw
    await uiStateManager.restore();
    assert.ok(true);
  });

  test('hideUI should mark UI as modified', async () => {
    // Check that state is not saved initially
    assert.strictEqual(uiStateManager.hasSavedState(), false);
    
    // Hide UI
    await uiStateManager.hideUI();
    
    // Check that state is saved
    assert.strictEqual(uiStateManager.hasSavedState(), true);
  });

  test('multiple hideUI calls should work correctly', async () => {
    await uiStateManager.hideUI();
    assert.strictEqual(uiStateManager.hasSavedState(), true);
    
    await uiStateManager.restore();
    assert.strictEqual(uiStateManager.hasSavedState(), false);
    
    await uiStateManager.hideUI();
    assert.strictEqual(uiStateManager.hasSavedState(), true);
  });
});
