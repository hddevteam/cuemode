# CueMode - Professional Teleprompter for Developers

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/luckyXmobile.cuemode?style=flat-square&color=blue)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/luckyXmobile.cuemode?style=flat-square&color=green)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/luckyXmobile.cuemode?style=flat-square&color=orange)](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
[![GitHub](https://img.shields.io/github/license/hddevteam/cuemode?style=flat-square)](https://github.com/hddevteam/cuemode/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/hddevteam/cuemode?style=flat-square)](https://github.com/hddevteam/cuemode/issues)

**Transform VS Code into a professional teleprompter.** Perfect for coding livestreams, technical presentations, educational videos, and professional content creation where you need to read scripts or notes naturally while maintaining eye contact with your audience.

## 🎯 What is CueMode?

CueMode is a specialized teleprompter extension that turns your VS Code editor into a professional teleprompting solution. Designed specifically for developers, educators, and content creators who need to deliver smooth, natural presentations while reading from prepared scripts or notes.

**Key Teleprompter Features:**
- **Auto-scrolling text** - Smooth, controllable scroll speed for natural reading
- **Large, readable fonts** - Optimized for distance reading and camera work
- **High-contrast display** - Crystal clear text visibility in any lighting
- **Invisible controls** - Minimal UI interference during recording/presenting
- **Keyboard shortcuts** - Professional teleprompter controls (start/stop, speed adjustment)

Simply select your script text or open your presentation notes, activate "Teleprompter Mode" from the command palette, and start presenting with confidence. 

## ✨ Teleprompter Features

CueMode provides professional teleprompting capabilities designed for modern content creators:

### 📺 **Professional Teleprompter Controls**
- **Auto-scroll functionality** - Smooth, customizable scrolling speed
- **Space bar control** - Start/stop scrolling with a single key press
- **Speed adjustment** - Real-time speed control with +/- keys
- **Direction toggle** - Reverse scrolling with R key
- **Manual navigation** - Arrow keys for precise positioning

### 🎨 **Optimized Display**
- **Large, readable fonts** - Perfect for reading at distance
- **Centered layout** - Natural eye movement for camera work
- **High contrast themes** - Clear visibility in any lighting condition
- **Minimal interface** - Hidden controls that don't interfere with recording

### 🎭 **Professional Themes**
- **Classic** - Traditional teleprompter white-on-black
- **Inverted** - Black text on white for bright environments
- **Midnight Blue** - Professional studio look
- **Sunset** - Warm, comfortable reading experience
- **Forest** - Easy on the eyes for long sessions
- **Ocean** - Calming blue for relaxed presentations
- **Rose** - Elegant theme for sophisticated content

### ⚙️ **Teleprompter Settings**
- **Scroll speed** - Fine-tune reading pace (0.1-5.0 range)
- **Font size** - Optimize for your reading distance (12-72pt)
- **Line height** - Control text spacing for comfort (1.0-3.0em)
- **Content width** - Set optimal reading width (400-1200px)
- **Starting position** - Position text for comfortable reading
- **Padding** - Adjust margins for your setup

### 🚀 **Perfect For Teleprompter Use Cases**
- **YouTube videos** - Read scripts naturally while maintaining eye contact
- **Live streaming** - Smooth delivery for coding tutorials and tech talks
- **Video tutorials** - Professional presentation with prepared content
- **Online courses** - Educational content delivery with confidence
- **Webinars** - Professional speaking with script support
- **Product demos** - Consistent messaging with teleprompter assistance
- **Screen recordings** - Professional video content
- **Code reviews** - Focus on important details
- **Presentations** - Showcase your work
- **Focused development** - Minimize distractions

## 🚀 Quick Start - Teleprompter Setup

### Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "CueMode Teleprompter"
4. Click Install

### Basic Teleprompter Usage
1. **Prepare your script** - Create or open a text file with your presentation content
2. **Select your script text** (optional - if no selection, entire file is used)
3. **Activate teleprompter** - Use Ctrl+Shift+P (Cmd+Shift+P on Mac) and search for "Teleprompter Mode"
4. **Start reading** - Press Space to begin auto-scrolling
5. **Control while presenting**:
   - **Space**: Start/pause auto-scroll
   - **+/-**: Adjust reading speed in real-time
   - **R**: Reverse scroll direction
   - **Arrow keys**: Manual navigation
### Professional Teleprompter Shortcuts
- **Space** - Start/pause auto-scrolling (primary control)
- **+/-** - Increase/decrease scroll speed
- **R** - Toggle scroll direction (up/down)
- **Arrow Keys** - Manual navigation
- **Page Up/Down** - Fast manual scrolling
- **Home/End** - Jump to beginning/end
- **H** - Show/hide help panel
- **Esc** - Exit teleprompter mode

![Teleprompter Demo](./images/demo.gif)

## ⚙️ Teleprompter Configuration

CueMode teleprompter is highly customizable for professional use. Access settings through:
**File → Preferences → Settings → Extensions → CueMode**

### Teleprompter Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `cuemode.colorTheme` | `"classic"` | Professional teleprompter themes |
| `cuemode.maxWidth` | `800` | Optimal reading width in pixels |
| `cuemode.fontSize` | `24` | Reading distance optimized font size |
| `cuemode.lineHeight` | `1.5` | Comfortable line spacing |
| `cuemode.padding` | `10` | Screen edge margins |
| `cuemode.scrollSpeed` | `0.1` | Auto-scroll reading pace |
| `cuemode.startingPosition` | `50` | Text starting position (0-100%) |

### Professional Teleprompter Themes
- `"classic"` - White text on black background
- `"inverted"` - Dark text on light background
- `"classic"` - Traditional teleprompter white-on-black
- `"inverted"` - Black-on-white for bright studios
- `"midnightBlue"` - Professional studio blue
- `"sunset"` - Warm, comfortable reading
- `"forest"` - Easy on eyes for long sessions
- `"ocean"` - Calming blue for relaxed delivery
- `"rose"` - Elegant theme for sophisticated content

### Professional Teleprompter Setup Example
```json
{
  "cuemode.colorTheme": "classic",
  "cuemode.maxWidth": 1000,
  "cuemode.fontSize": 32,
  "cuemode.lineHeight": 1.8,
  "cuemode.padding": 20,
  "cuemode.scrollSpeed": 0.15,
  "cuemode.startingPosition": 40
}
```

## 🎬 Teleprompter Best Practices

### For Video Recording
1. **Font size**: Use 28-36pt for comfortable reading at arm's length
2. **Scroll speed**: Start with 0.1-0.2, adjust based on your speaking pace
3. **Theme**: Classic (white-on-black) works best for most lighting conditions
4. **Position**: Place VS Code window directly below your camera

### For Live Streaming
1. **Dual monitor setup**: Use teleprompter on secondary screen
2. **Quick controls**: Remember Space bar for pause/start
3. **Backup plan**: Keep manual scroll (arrow keys) as backup
4. **Practice**: Test your setup before going live

## 🐛 Known Issues

Currently, there are no known issues. If you encounter any problems:
1. Check our [GitHub Issues](https://github.com/hddevteam/cuemode/issues)
2. Create a new issue if needed
3. Include your VS Code version and operating system

## 📝 Release Notes

### 1.1.3 (Current) - Professional Teleprompter Update
- ✨ **Auto-scroll teleprompter**: Professional scroll controls with Space bar
- ✨ **Real-time speed control**: Adjust reading pace with +/- keys
- ✨ **Direction toggle**: Reverse scrolling with R key
- ✨ **Enhanced keyboard shortcuts**: Complete teleprompter control set
- ✨ **Minimalist UI**: Hidden controls for distraction-free reading
- 🌐 **Multi-language support**: English and Chinese interface

### 1.1.0 - Enhanced Presentation Features
- ✨ **Real-time updates**: Settings changes reflect immediately
- ✨ **Live content sync**: Text changes update without re-entering mode
- ✨ **Improved positioning**: Content starts centered for better teleprompter experience

### 1.0.0 - Initial Release
- 🎉 Initial release of CueMode teleprompter
- Basic presentation mode functionality
- Multiple professional themes
- Customizable settings

## 🤝 Contributing

We welcome contributions to make CueMode the best teleprompter for developers! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Links
- 🐛 [Report a Bug](https://github.com/hddevteam/cuemode/issues/new?template=bug_report.md)
- 💡 [Request a Teleprompter Feature](https://github.com/hddevteam/cuemode/issues/new?template=feature_request.md)
- 📖 [Documentation](https://github.com/hddevteam/cuemode/blob/main/README.md)
- 💬 [Discussions](https://github.com/hddevteam/cuemode/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Support the Project

If you find CueMode teleprompter useful, please:
- ⭐ Star this repository
- 📝 Leave a review on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
- 🐛 Report issues and suggest teleprompter improvements
- 💡 Share with content creators and educators
- 📺 Tag us in your videos using CueMode teleprompter

## 🔗 Links

- 🛍️ [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=luckyXmobile.cuemode)
- 🐙 [GitHub Repository](https://github.com/hddevteam/cuemode)
- 📊 [Project Roadmap](ROADMAP.md)
- 📋 [Development Board](.github/PROJECT_BOARD.md)

---

**Professional teleprompter for developers - Create better content with CueMode! 🎬�**
