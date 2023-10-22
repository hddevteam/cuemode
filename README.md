# CueMode README

This extension is designed to enhance text readability and focus by providing a unique "Cue Mode" functionality when you are presenting or recording your screen. Just select the text you want to display or just open a text file then click right mouse button and select "Cue Mode" from the context menu. 

## Features

CueMode changes the visual style of your code in a few key ways to enhance readability:

* Increases font size
* Adjusts line height
* Centers the layout
* Changes color scheme for high contrast

This mode is perfect for presentations, educational purposes, or just those moments when you need to cut through the clutter and focus on your content.

You can customize these settings to suit your preferences:

* Color theme (default is "Classic" - white text on black background)
* Maximum content width in pixels (default is 800)
* Font size in points (default is 24)
* Line height in ems (default is 1.5)
* Padding in pixels (default is 10)
* Scrolling speed (default is 0.1)
* Starting position of the text in CueMode (default is 50)

![Demo](./images/demo.gif)


## Extension Settings

This extension contributes the following settings:

* `cuemode.colorTheme`: Set the color theme for the cue mode.
* `cuemode.maxWidth`: Set the maximum content width in pixels.
* `cuemode.fontSize`: Set the font size in points.
* `cuemode.lineHeight`: Set the line height in ems.
* `cuemode.padding`: Set the padding in pixels.
* `cuemode.scrollSpeed`: Set the scrolling speed.
* `cuemode.startPosition`: Set the starting position of the text in CueMode. The default value is 50, which means the text will start from the middle of the screen. If you want the text to start from the top of the screen, set this value to 0. If you want the text to start from the bottom of the screen, set this value to 100.

## Known Issues

There are no known issues at this time. 

## Release Notes

### 1.1.0

1. The changes made in settings will now be reflected immediately in CueMode, eliminating the need to re-enter CueMode.
2. Any modifications made to the text content will also be reflected in real-time in CueMode, without the need to re-enter CueMode.
3. The starting position of the text in CueMode will now be displayed in the middle of the screen, instead of starting from the top, providing a better experience for the teleprompter users.

### 1.0.0

Initial release of CueMode.


**Enjoy!**
