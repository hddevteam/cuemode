import { Messages } from './index';

/**
 * 中文语言包
 */
const messages: Messages = {
  // Commands
  'command.title': '提词器模式',
  'command.description': '激活提词器模式以获得更好的演示体验',
  'command.changeTheme': '切换提词器主题',
  'command.removeLeadingSpaces': '移除行首空格',
  
  // Notifications
  'notification.activated': '提词器模式已激活',
  'notification.deactivated': '提词器模式已关闭',
  'notification.configUpdated': '提词器模式配置已更新',
  'notification.themeChanged': '主题已切换为 {0}',
  'notification.spacesRemoved': '已从 {0} 行中移除行首空格',
  'notification.error': '提词器模式错误：{0}',
  
  // Errors
  'error.noActiveEditor': '未找到活动编辑器',
  'error.noContent': '没有内容可显示',
  'error.webviewFailed': '创建网页视图失败',
  'error.configInvalid': '配置无效：{0}',
  'error.noSelection': '未选择文本。请选择文本以移除行首空格。',
  
  // Settings
  'settings.colorTheme': '颜色主题',
  'settings.maxWidth': '最大宽度',
  'settings.fontSize': '字体大小',
  'settings.lineHeight': '行高',
  'settings.padding': '内边距',
  'settings.scrollSpeed': '滚动速度',
  'settings.startingPosition': '起始位置',
  
  // Themes
  'theme.classic': '经典',
  'theme.inverted': '反转',
  'theme.midnightBlue': '午夜蓝',
  'theme.sunset': '日落',
  'theme.forest': '森林',
  'theme.ocean': '海洋',
  'theme.rose': '玫瑰',
  
  // UI
  'ui.title': '提词器模式 - {0}',
  'ui.close': '关闭',
  'ui.help': '帮助',
  'ui.shortcuts': '快捷键',
  'ui.loading': '加载中...',
  'ui.ready': '就绪',
  
  // Help and shortcuts
  'help.shortcuts.space': '空格键 - 切换自动滚屏',
  'help.shortcuts.plus': '+ - 增加滚屏速度',
  'help.shortcuts.minus': '- - 减少滚屏速度',
  'help.shortcuts.r': 'R - 反转滚屏方向',
  'help.shortcuts.escape': 'Esc - 退出提词器模式',
  'help.shortcuts.arrows': '方向键 - 手动导航',
  'help.shortcuts.changeTheme': 'Ctrl+Shift+T - 切换主题',
  'help.shortcuts.removeSpaces': 'Ctrl+Shift+R - 移除行首空格'
};

export default messages;
