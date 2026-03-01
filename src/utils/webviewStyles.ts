/**
 * WebView Styles Module - CSS styles for VS Code WebView
 * These styles are shared between VS Code extension and debugging tools
 */

/**
 * Generate base CSS styles for WebView
 * These styles include reset styles, component styles and markdown-specific styles
 */
export function generateWebViewCSS(): string {
  return `
/* Global reset */
* {
  box-sizing: border-box;
}

pre:not(.markdown-code-block) {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* WebView base component styles */
.cue-line {
  display: inline-block;
  width: 100%;
  transition: filter 0.3s ease;
  border: none !important;
  outline: none !important;
  background: transparent !important;
  box-shadow: none !important;
  text-decoration: none !important;
}

.cue-line:empty {
  min-height: 1em;
}

.cue-line:hover {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  box-shadow: none !important;
  text-decoration: none !important;
}

.cue-line:focus {
  border: none !important;
  outline: none !important;
  background: transparent !important;
  box-shadow: none !important;
  text-decoration: none !important;
}

/* Focus indicator */
.focus-indicator {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-left: none;
  border-right: none;
  display: none;
  background: rgba(255, 255, 255, 0.02);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

.focus-indicator.active {
  display: block;
}

/* Markdown content area */
.markdown-content {
  width: 100%;
}

.markdown-block {
  display: block;
  width: 100%;
  transition: filter 0.3s ease;
  margin: 0 0 16px 0; /* Increased paragraph spacing from 8px to 16px */
  padding: 0;
  line-height: inherit; /* Use the configured line height from theme settings */
}

.markdown-block:empty {
  display: none;
}

/* Precise spacing control - using px units */
.markdown-content .markdown-block h1, 
.markdown-content .markdown-block h2, 
.markdown-content .markdown-block h3, 
.markdown-content .markdown-block h4, 
.markdown-content .markdown-block h5, 
.markdown-content .markdown-block h6 {
  margin: 0 0 16px 0 !important; /* Increased header spacing to match paragraph spacing */
  line-height: calc(var(--line-height) * 0.9) !important; /* Slightly tighter line height for headers */
  padding: 0 !important;
}

.markdown-content .markdown-block .markdown-table {
  margin: 16px 0 !important; /* Increased table spacing to match paragraph spacing */
  line-height: calc(var(--line-height) * 0.8) !important; /* Tighter line height for tables */
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}

.markdown-content .markdown-block .markdown-code-block {
  margin: 8px 0 !important; /* Increase code block spacing */
  line-height: calc(var(--line-height) * 0.9) !important; /* Use configured line height for code blocks */
  padding: 4px 8px !important;
  white-space: pre-wrap !important; /* Preserve indentation but allow wrapping */
  word-break: break-word !important; /* Break long tokens */
  overflow-wrap: anywhere !important; /* Wrap anywhere as last resort */
  font-family: 'Courier New', Consolas, 'Liberation Mono', Monaco, 'Lucida Console', monospace !important; /* Monospace font */
  overflow-x: hidden !important; /* Avoid horizontal scrollbars when wrapping */
}

/* List spacing reset */
.markdown-content .markdown-block ul {
  margin: 12px 0 !important; /* Increased list spacing */
  padding-left: 0 !important;
  margin-left: 25px !important; /* Slightly increase unordered list indentation */
  line-height: inherit !important; /* Use configured line height for list items */
}

.markdown-content .markdown-block ol {
  margin: 12px 0 !important; /* Increased list spacing */
  padding-left: 0 !important;
  margin-left: 50px !important; /* Significantly increase ordered list indentation to fully show number sequences */
  line-height: inherit !important; /* Use configured line height for list items */
}

/* Sub-list identification based on markdown-list class */
.markdown-content .markdown-block .markdown-ul {
  margin: 2px 0 !important; /* Reduce sub-list spacing */
  margin-left: 45px !important; /* Sub-list extra indentation - slightly smaller than ordered list */
}

/* Sub-lists (unordered) after ordered lists need larger indentation */
.markdown-content .markdown-block ol + ul,
.markdown-content .markdown-block .markdown-ol + .markdown-ul {
  margin: 2px 0 !important;
  margin-left: 70px !important; /* Sub-lists after ordered lists need larger indentation */
}

/* Sub-lists after unordered lists */
.markdown-content .markdown-block ul + ul,
.markdown-content .markdown-block .markdown-ul + .markdown-ul {
  margin: 2px 0 !important;
  margin-left: 45px !important; /* Sub-list indentation after unordered lists */
}

/* Third-level nesting: consecutive multiple ul/ol */
.markdown-content .markdown-block ul + ul + ul,
.markdown-content .markdown-block ol + ul + ul {
  margin: 1px 0 !important;
  margin-left: 65px !important; /* Third-level indentation */
}

.markdown-content .markdown-block li {
  margin: 0 !important;
  padding: 0 !important;
  line-height: inherit !important; /* Use configured line height for list items */
}

/* Table cell spacing control */
.markdown-content .markdown-block .markdown-table-header,
.markdown-content .markdown-block .markdown-table-cell {
  padding: 4px 8px !important;
  border: 1px solid currentColor !important;
  line-height: calc(var(--line-height) * 0.8) !important; /* Use configured line height for table cells */
}

/* Table style reset */
.markdown-content .markdown-block table {
  margin: 0 !important;
  border-spacing: 0 !important;
  border-collapse: collapse !important;
  width: 100% !important;
}

/* Ensure markdown elements are compatible with focus mode */
.markdown-content pre:not(.markdown-code-block) {
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Override any conflicting markdown element styles */
.markdown-content * {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

/* Mirror flip styles */
.mirror-flip {
  transform: scaleX(-1);
  transition: transform 0.3s ease;
}

.mirror-flip-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* Mirror flip status indicator */
.mirror-status {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.mirror-status.active {
  opacity: 1;
  transform: translateY(0);
}

.mirror-status.enabled {
  background: rgba(0, 100, 200, 0.9);
  border-color: rgba(100, 150, 255, 0.5);
}

.mirror-status.disabled {
  background: rgba(100, 100, 100, 0.7);
  border-color: rgba(150, 150, 150, 0.3);
}

/* Delayed hiding of status indicator */
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
}

.mirror-status.hiding {
  animation: fadeOut 0.3s ease forwards;
}
`;
}

/**
 * Generate debug-specific CSS styles
 * Includes visual borders and background colors for debugging markdown elements
 */
export function generateDebugCSS(): string {
  return `
/* Visual borders for debugging */
.markdown-block {
  border: 1px solid rgba(255, 0, 0, 0.1) !important;
  margin-bottom: 1px !important;
}

.markdown-block h1, .markdown-block h2, .markdown-block h3,
.markdown-block h4, .markdown-block h5, .markdown-block h6 {
  background: rgba(0, 0, 255, 0.05) !important;
}

.markdown-block .markdown-table {
  background: rgba(255, 255, 0, 0.05) !important;
}

.markdown-block .markdown-code-block {
  background: rgba(255, 0, 255, 0.05) !important;
  white-space: pre-wrap !important;
}

.markdown-block ul, .markdown-block ol {
  background: rgba(0, 255, 0, 0.05) !important;
}

/* Debug info panel styles */
.debug-panel { 
  position: fixed; 
  top: 10px; 
  right: 10px; 
  background: rgba(0, 0, 0, 0.9); 
  color: white; 
  padding: 15px; 
  border-radius: 8px; 
  font-size: 12px; 
  max-width: 350px; 
  z-index: 1000; 
  font-family: 'Monaco', 'Menlo', monospace;
}

.file-info { 
  background: rgba(0, 0, 0, 0.05); 
  padding: 15px; 
  margin-bottom: 20px; 
  border-radius: 8px; 
  font-size: 14px; 
  border-left: 4px solid #007acc;
}
`;
}

/**
 * Generate CSS specific to Presentation Mode (slide-centered layout)
 */
export function generatePresentationCSS(): string {
  return `
/* ===== Presentation Mode ===== */
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* Slide container takes the full viewport */
.pm-slide-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* Each slide is vertically + horizontally centered */
.pm-slide {
  display: none;
  position: absolute;
  inset: 0;
  justify-content: center;
  align-items: center;
  padding: 60px 80px;
  box-sizing: border-box;
  text-align: left;
}

.pm-slide.active {
  display: flex;
  animation: pmFadeIn 0.25s ease;
}

@keyframes pmFadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Slide inner content wrapper — constrains width and scrolls if truly overflow */
.pm-slide-inner {
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  scrollbar-width: none;
}

.pm-slide-inner::-webkit-scrollbar {
  display: none;
}

/* Single-slide (no ---) shows a bit bigger font */
.pm-single .pm-slide-inner {
  font-size: 1.15em;
}

/* Navigation bar at the bottom */
.pm-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.35);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  z-index: 100;
  transition: opacity 0.3s ease;
}

.pm-nav.hidden {
  opacity: 0;
  pointer-events: none;
}

.pm-nav-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: inherit;
  padding: 4px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.8;
  transition: opacity 0.2s, border-color 0.2s;
}

.pm-nav-btn:hover {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.7);
}

.pm-nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.pm-counter {
  font-size: 13px;
  opacity: 0.7;
  min-width: 60px;
  text-align: center;
}

/* Top control bar */
.pm-controls {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 12px;
  background: rgba(0, 0, 0, 0.25);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  z-index: 100;
  transition: opacity 0.3s ease;
}

.pm-controls.hidden {
  opacity: 0;
  pointer-events: none;
}

.pm-ctrl-btn {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 1;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 3px;
}

.pm-ctrl-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.15);
}

/* Help overlay */
.pm-help {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(20, 20, 20, 0.92);
  color: #eee;
  border-radius: 10px;
  padding: 28px 36px;
  z-index: 200;
  min-width: 320px;
  display: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.pm-help.visible {
  display: block;
}

.pm-help h3 {
  margin: 0 0 16px;
  font-size: 15px;
  opacity: 0.9;
}

.pm-help ul {
  list-style: disc;
  margin: 0;
  padding: 0 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pm-help li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  opacity: 0.85;
}

.pm-help kbd {
  background: rgba(255,255,255,0.9);
  color: #111;
  border-radius: 4px;
  padding: 2px 8px;
  font-family: monospace;
  font-size: 12px;
  min-width: 60px;
  text-align: center;
}
`;
}
