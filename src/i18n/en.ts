import { Messages } from './index';

/**
 * English language pack
 */
const messages: Messages = {
  // Commands
  'command.title': 'Teleprompter Mode',
  'command.description': 'Activate teleprompter mode for better presentation',
  'command.changeTheme': 'Change Teleprompter Theme',
  'command.removeLeadingSpaces': 'Remove Leading Spaces',
  
  // Notifications
  'notification.activated': 'Teleprompter mode activated',
  'notification.deactivated': 'Teleprompter mode deactivated',
  'notification.configUpdated': 'Teleprompter mode configuration updated',
  'notification.themeChanged': 'Theme changed to {0}',
  'notification.spacesRemoved': 'Leading spaces removed from {0} lines',
  'notification.error': 'Teleprompter mode error: {0}',
  
  // Errors
  'error.noActiveEditor': 'No active editor found',
  'error.noContent': 'No content to display',
  'error.webviewFailed': 'Failed to create webview',
  'error.configInvalid': 'Invalid configuration: {0}',
  'error.noSelection': 'No text selected. Please select text to remove leading spaces.',
  
  // Settings
  'settings.colorTheme': 'Color Theme',
  'settings.maxWidth': 'Maximum Width',
  'settings.fontSize': 'Font Size',
  'settings.lineHeight': 'Line Height',
  'settings.padding': 'Padding',
  'settings.scrollSpeed': 'Scroll Speed',
  'settings.startingPosition': 'Starting Position',
  
  // Themes
  'theme.classic': 'Classic',
  'theme.inverted': 'Inverted',
  'theme.midnightBlue': 'Midnight Blue',
  'theme.sunset': 'Sunset',
  'theme.forest': 'Forest',
  'theme.ocean': 'Ocean',
  'theme.rose': 'Rose',
  
  // UI
  'ui.title': 'Teleprompter Mode - {0}',
  'ui.close': 'Close',
  'ui.help': 'Help',
  'ui.shortcuts': 'Keyboard Shortcuts',
  'ui.loading': 'Loading...',
  'ui.ready': 'Ready',
  
  // Help and shortcuts
  'help.shortcuts.space': 'Space - Toggle auto-scroll',
  'help.shortcuts.plus': '+ - Increase scroll speed',
  'help.shortcuts.minus': '- - Decrease scroll speed',
  'help.shortcuts.r': 'R - Reverse scroll direction',
  'help.shortcuts.escape': 'Escape - Exit teleprompter mode',
  'help.shortcuts.arrows': 'Arrow keys - Manual navigation',
  'help.shortcuts.changeTheme': 'Ctrl+Shift+T - Change theme',
  'help.shortcuts.removeSpaces': 'Ctrl+Shift+R - Remove leading spaces'
};

export default messages;
