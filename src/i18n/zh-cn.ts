import { Messages } from './index';

/**
 * 中文语言包
 */
const messages: Messages = {
  // Commands
  'command.title': '提词器模式',
  'command.description': '激活提词器模式以获得更好的演示体验',
  
  // Notifications
  'notification.activated': '提词器模式已激活',
  'notification.deactivated': '提词器模式已关闭',
  'notification.configUpdated': '提词器模式配置已更新',
  'notification.error': '提词器模式错误：{0}',
  
  // Errors
  'error.noActiveEditor': '未找到活动编辑器',
  'error.noContent': '没有内容可显示',
  'error.webviewFailed': '创建网页视图失败',
  'error.configInvalid': '配置无效：{0}',
  
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
  'ui.loading': '加载中...',
  'ui.ready': '就绪'
};

export default messages;
