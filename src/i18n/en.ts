import { Messages } from './index';

/**
 * English language pack
 */
const messages: Messages = {
  // Commands
  'command.title': 'Teleprompter Mode',
  'command.description': 'Activate teleprompter mode for better presentation',
  
  // Notifications
  'notification.activated': 'Teleprompter mode activated',
  'notification.deactivated': 'Teleprompter mode deactivated',
  'notification.configUpdated': 'Teleprompter mode configuration updated',
  'notification.error': 'Teleprompter mode error: {0}',
  
  // Errors
  'error.noActiveEditor': 'No active editor found',
  'error.noContent': 'No content to display',
  'error.webviewFailed': 'Failed to create webview',
  'error.configInvalid': 'Invalid configuration: {0}',
  
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
  'ui.loading': 'Loading...',
  'ui.ready': 'Ready'
};

export default messages;
