import * as vscode from 'vscode';

/**
 * Interface for storing UI state
 */
interface UIState {
  // Note: VS Code doesn't provide APIs to reliably detect sidebar/panel state
  // We just record that we closed them, and try to restore them
  uiWasModified: boolean;
}

/**
 * Manager for VS Code UI state
 * Handles hiding and restoring sidebar and panel visibility
 */
export class UIStateManager {
  private savedState: UIState | null = null;

  /**
   * Hide UI elements for presentation mode
   */
  public async hideUI(): Promise<void> {
    try {
      // Mark that we're modifying UI
      this.savedState = {
        uiWasModified: true
      };

      // Close sidebar - this will close any visible sidebar
      await vscode.commands.executeCommand('workbench.action.closeSidebar');

      // Close panel (terminal, output, problems, etc.)
      await vscode.commands.executeCommand('workbench.action.closePanel');

      // Small delay to ensure UI updates complete
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error('Failed to hide UI elements:', error);
      // Don't throw error - CueMode should still work even if UI optimization fails
    }
  }

  /**
   * Restore previously hidden UI elements
   */
  public async restore(): Promise<void> {
    if (!this.savedState) {
      console.warn('No saved UI state to restore');
      return;
    }

    try {
      // Note: VS Code doesn't provide reliable APIs to detect if sidebar/panel were open
      // The best we can do is toggle them back if they might have been visible
      // Users can manually adjust if needed
      
      // Try to restore sidebar by focusing on it (this will open it if closed)
      // Only do this if we modified the UI
      if (this.savedState.uiWasModified) {
        try {
          await vscode.commands.executeCommand('workbench.action.focusSideBar');
        } catch (error) {
          // Ignore errors - sidebar might not be available
          console.debug('Could not restore sidebar:', error);
        }
      }

      // Small delay to ensure UI updates complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Clear saved state
      this.savedState = null;

    } catch (error) {
      console.error('Failed to restore UI state:', error);
      // Don't throw error - just log it
    }
  }

  /**
   * Check if there is a saved state
   */
  public hasSavedState(): boolean {
    return this.savedState !== null;
  }

  /**
   * Clear saved state without restoring
   */
  public clearState(): void {
    this.savedState = null;
  }
}
