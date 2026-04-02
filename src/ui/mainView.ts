import type { CueModeConfig } from '../types';
import { ThemeManager } from '../utils/theme';
import { generateMarkdownCSS } from '../utils/markdownStyles';
import { generateWebViewCSS } from '../utils/webviewStyles';

export interface MainViewParams {
  content: string;
  processedContent: string;
  filename: string;
  config: CueModeConfig;
  translate?: (key: string, options?: Record<string, unknown>) => string;
  language?: string;
}

function toInlineScriptJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/<\/(script)/gi, '<\\/$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function generateMainHTML(params: MainViewParams): string {
  const { content, processedContent, filename, config } = params;
  const t = params.translate ?? ((key: string) => key);
  const getCurrentLanguage = (): string => params.language ?? 'en';

  // Pre-generate i18n strings for JavaScript
  const i18nStrings = {
    focusMode: t('ui.focusMode'),
    exitFocus: t('ui.exitFocus'),
    helpTitle: t('help.title'),
    initMessage: t('ui.ready'),
    shortcutsTitle: t('help.title'),
    spaceShortcut: `Space: ${t('help.shortcuts.space')}`,
    rShortcut: `R: ${t('help.shortcuts.r')}`,
    speedShortcut: `+/-: ${t('help.shortcuts.plus')} / ${t('help.shortcuts.minus')}`,
    helpShortcut: `H: ${t('help.shortcuts.h')}`,
    escShortcut: `Esc: ${t('help.shortcuts.escape')}`,
    doubleClickHint: t('help.shortcuts.doubleClick'),
    mirrorOn: t('ui.mirrorOn'),
    mirrorOff: t('ui.mirrorOff'),
    speedIndicator: t('accessibility.speedIndicator', { speed: '{{speed}}' }),
  };
  const i18nStringsJson = toInlineScriptJson(i18nStrings);
  const contentJson = toInlineScriptJson(content);

  // Generate CSS for current theme
  const css = ThemeManager.generateCSS(
    config.colorTheme,
    config.fontSize,
    config.lineHeight,
    config.maxWidth,
    config.padding
  );

  // Generate markdown CSS if markdown mode is enabled
  const markdownCSS = config.markdownMode
    ? generateMarkdownCSS(ThemeManager.getTheme(config.colorTheme))
    : '';

  // Generate WebView-specific CSS
  const webviewCSS = generateWebViewCSS();

  // Calculate starting position (like the original)
  const startingPositionCSS =
    config.startingPosition > 0
      ? `padding-top: ${config.startingPosition}vh; padding-bottom: ${config.startingPosition}vh;`
      : '';

  return `
      <!DOCTYPE html>
      <html lang="${getCurrentLanguage()}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t('ui.title', { filename })}</title>
        <style>
          ${css}
          ${markdownCSS}
          ${webviewCSS}
          body {
            ${startingPositionCSS}
          }
          .cue-line.cue-reveal-target {
            outline: 2px solid var(--accent-color);
            border-radius: 6px;
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.12);
            transition: outline-color 0.2s ease, box-shadow 0.2s ease;
          }
          ${
            config.showLineBreaks
              ? `
          /* Line break markers - enhanced visibility for presenters (code blocks only) */
          pre.markdown-code-block code .cm-break-marker::before {
            content: '↵';
            color: var(--accent-color);
            opacity: 0.85;
            font-size: 1.1em;
            font-weight: bold;
            margin-right: 0.15em;
            pointer-events: none;
            filter: drop-shadow(0 0 2px rgba(255,255,255,0.5));
          }
          /* Slightly different spacing for end-of-line marker */
          pre.markdown-code-block code .cm-break-eol::before {
            margin-left: 0.15em;
          }
          `
              : ''
          }
        </style>
      </head>
      <body>
        <div class="cue-controls">
          <button class="cue-button" onclick="closeMode()">${t('ui.close')}</button>
          <button class="cue-button" onclick="toggleHelp()">${t('ui.help')}</button>
        </div>
        
        <!-- Mirror flip status indicator -->
        <div class="mirror-status" id="mirror-status">
          <span id="mirror-status-text">${t('ui.mirrorOff')}</span>
        </div>
        
        <div class="cue-help" id="help-panel" style="display: none;">
          <h3>${t('help.title')}</h3>
          <div class="help-grid">
            <div class="help-column">
              <div class="help-section">
                <h4>${t('help.basicControls')}</h4>
                <ul>
                  <li><kbd>Space</kbd> <span>${t('help.shortcuts.space')}</span></li>
                  <li><kbd>R</kbd> <span>${t('help.shortcuts.r')}</span></li>
                  <li><kbd>+/-</kbd> <span>${t('help.shortcuts.plus')} / ${t('help.shortcuts.minus')}</span></li>
                  <li><kbd>Esc</kbd> <span>${t('help.shortcuts.escape')}</span></li>
                </ul>
              </div>
            </div>
            <div class="help-column">
              <div class="help-section">
                <h4>${t('help.navigationModes')}</h4>
                <ul>
                  <li><kbd>↑↓</kbd> <span>${t('help.shortcuts.arrows')}</span></li>
                  <li><kbd>PgUp/Dn</kbd> <span>${t('help.shortcuts.pageUpDown')}</span></li>
                  <li><kbd>Home/End</kbd> <span>${t('help.shortcuts.homeEnd')}</span></li>
                  <li><kbd>T</kbd> <span>${t('help.shortcuts.t')}</span></li>
                  <li><kbd>F</kbd> <span>${t('help.shortcuts.f')}</span></li>
                  <li><kbd>M</kbd> <span>${t('help.shortcuts.m')}</span></li>
                  <li><kbd>D</kbd> <span>${t('help.shortcuts.d')}</span></li>
                  <li><kbd>L</kbd> <span>${t('help.shortcuts.l')}</span></li>
                  <li><kbd>[/]</kbd> <span>${t('help.shortcuts.fontSize')}</span></li>
                  <li><kbd>H</kbd> <span>${t('help.shortcuts.h')}</span></li>
                </ul>
              </div>
              <div class="help-section">
                <h4>${t('help.basicControls')}</h4>
                <ul>
                  <li><kbd>Double-Click</kbd> <span>${t('help.shortcuts.doubleClick')}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="cue-container">
          <div class="cue-content" id="content">
            ${processedContent}
          </div>
        </div>
        
        <!-- Focus area indicator -->
        <div class="focus-indicator" id="focus-indicator"></div>

        <script>
          // WebView to extension communication
          const vscode = acquireVsCodeApi();
          const i18n = ${i18nStringsJson};
          
          function closeMode() {
            vscode.postMessage({ type: 'close' });
          }
          
          function toggleHelp() {
            const helpPanel = document.getElementById('help-panel');
            if (!helpPanel) {
              return;
            }

            if (helpPanel.style.display === 'none') {
              helpPanel.style.display = 'block';
              
              // Smart positioning: ensure help dialog is fully visible
              adjustHelpPosition(helpPanel);
              
              // Add click outside to close functionality
              setTimeout(() => {
                document.addEventListener('click', hideHelpOnClickOutside);
              }, 100);
            } else {
              helpPanel.style.display = 'none';
              document.removeEventListener('click', hideHelpOnClickOutside);
            }
          }
          
          function adjustHelpPosition(helpPanel) {
            const rect = helpPanel.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Reset position
            helpPanel.style.top = '10px';
            helpPanel.style.right = '10px';
            helpPanel.style.left = 'auto';
            helpPanel.style.bottom = 'auto';
            
            // Check if it exceeds right boundary
            if (rect.right > viewportWidth - 10) {
              helpPanel.style.right = '10px';
              helpPanel.style.left = 'auto';
            }
            
            // Check if it exceeds bottom boundary
            if (rect.bottom > viewportHeight - 10) {
              helpPanel.style.top = 'auto';
              helpPanel.style.bottom = '10px';
            }
            
            // For small screens, use full width layout
            if (viewportWidth < 768) {
              helpPanel.style.left = '5px';
              helpPanel.style.right = '5px';
              helpPanel.style.top = '50px'; // Leave space for control buttons
            }
          }
          
          function toggleFocusMode() {
            focusMode = !focusMode;
            
            // Apply focus mode immediately
            applyFocusMode();
            
            // Also notify the extension to update the configuration
            vscode.postMessage({ type: 'toggleFocus' });
          }
          
          // Focus Mode implementation
          let focusMode = ${config.focusMode};
          let focusBlurStrength = ${config.focusOpacity * 5}; // Convert opacity config to blur strength
          let focusLineCount = ${config.focusLineCount};
          
          // Mirror Flip implementation
          let mirrorFlipEnabled = ${config.mirrorFlip};
          
          function toggleMirrorFlip() {
            mirrorFlipEnabled = !mirrorFlipEnabled;
            
            // Apply mirror flip immediately
            applyMirrorFlip();
            
            // Notify the extension to update the configuration
            vscode.postMessage({ type: 'toggleMirror' });
          }
          
          function applyMirrorFlip() {
            const content = document.getElementById('content');
            const statusIndicator = document.getElementById('mirror-status');
            const statusText = document.getElementById('mirror-status-text');
            if (!content || !statusIndicator || !statusText) {
              return;
            }
            
            if (mirrorFlipEnabled) {
              content.classList.add('mirror-flip');
              statusText.innerText = i18n.mirrorOn;
              statusIndicator.classList.add('enabled');
              statusIndicator.classList.remove('disabled');
            } else {
              content.classList.remove('mirror-flip');
              statusText.innerText = i18n.mirrorOff;
              statusIndicator.classList.add('disabled');
              statusIndicator.classList.remove('enabled');
            }
            
            // Show status indicator temporarily
            showMirrorStatus();
          }
          
          function showMirrorStatus() {
            const statusIndicator = document.getElementById('mirror-status');
            if (!statusIndicator) {
              return;
            }
            
            // Clear any existing timeout
            if (window.mirrorStatusTimeout) {
              clearTimeout(window.mirrorStatusTimeout);
            }
            
            // Show the indicator
            statusIndicator.classList.add('active');
            statusIndicator.classList.remove('hiding');
            
            // Hide after 2 seconds
            window.mirrorStatusTimeout = setTimeout(() => {
              statusIndicator.classList.add('hiding');
              statusIndicator.classList.remove('active');
            }, 2000);
          }

          function showSpeedStatus() {
            const statusIndicator = document.getElementById('mirror-status');
            const statusText = document.getElementById('mirror-status-text');
            if (!statusIndicator || !statusText) {
              return;
            }

            // Show speed value using i18n template
            statusText.innerText = i18n.speedIndicator.replace('{{speed}}', scrollSpeed.toFixed(2));
            statusIndicator.classList.remove('enabled', 'disabled');

            if (window.mirrorStatusTimeout) {
              clearTimeout(window.mirrorStatusTimeout);
            }
            statusIndicator.classList.add('active');
            statusIndicator.classList.remove('hiding');

            window.mirrorStatusTimeout = setTimeout(() => {
              statusIndicator.classList.add('hiding');
              statusIndicator.classList.remove('active');
            }, 1500);
          }
          
          // Markdown Mode implementation
          let markdownMode = ${config.markdownMode};
          
          function toggleMarkdownMode() {
            markdownMode = !markdownMode;
            
            // Send message to extension to update config and re-render content server-side
            vscode.postMessage({ type: 'toggleMarkdown' });
            
            // Note: Content will be updated by server-side re-rendering
            // No need to call updateContentDisplay() here
          }
          
          function updateContent() {
            updateContentDisplay();
          }
          
          function updateContentDisplay() {
            // Content display is now handled entirely by server-side rendering
            // This function is kept for compatibility but should not be used
            console.warn('updateContentDisplay() called - content should be updated via server-side rendering');
          }
          
          // Removed client-side markdown processing functions
          // All markdown processing is now handled server-side for consistency
          
          function processPlainTextContent(content) {
            // Keep plain text processing for non-markdown mode fallback
            return content.split('\\n').map((line, index) => {
              const escapedLine = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
              return \`<div class="cue-line" data-line-number="\${index}">\${escapedLine}</div>\`;
            }).join('');
          }

          function normalizeCueText(text) {
            return (text || '')
              .replace(/\\r/g, '')
              .replace(/^\\s{0,3}#{1,6}\\s+/gm, '')
              .replace(/^\\s*>+\\s*/gm, '')
              .replace(/^\\s*-\\s+\\[[ xX]\\]\\s+/gm, '')
              .replace(/^\\s*(?:[-*+]|\\d+[.])\\s+/gm, '')
              .replace(/!\\[([^\\]]*)\\]\\(([^)]+)\\)/g, '$1')
              .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '$1')
              .replace(/\\*\\*|__|\\*|_|~~|\\x60/g, '')
              .replace(/\\s+/g, ' ')
              .trim()
              .toLowerCase();
          }

          function scoreTextOverlap(candidateText, queryText) {
            if (!candidateText || !queryText) {
              return 0;
            }

            const tokens = queryText.split(/[^\\p{L}\\p{N}]+/u).filter(Boolean);
            if (tokens.length === 0) {
              return candidateText.includes(queryText) ? 1 : 0;
            }

            const matchedTokenCount = tokens.filter(token => candidateText.includes(token)).length;
            return matchedTokenCount / tokens.length;
          }

          function findBestRevealTarget(lineText, selectedText) {
            const cueLines = Array.from(document.querySelectorAll('.cue-line'));
            const normalizedLineText = normalizeCueText(lineText);
            const normalizedSelectedText = normalizeCueText(selectedText);

            let bestTarget = null;
            let bestScore = Number.NEGATIVE_INFINITY;

            for (const cueLine of cueLines) {
              const normalizedCueLineText = normalizeCueText(cueLine.textContent || '');
              let score = 0;

              if (normalizedSelectedText && normalizedCueLineText.includes(normalizedSelectedText)) {
                score += 500 + normalizedSelectedText.length;
              }

              if (normalizedLineText && normalizedCueLineText.includes(normalizedLineText)) {
                score += 300 + normalizedLineText.length;
              } else if (normalizedLineText) {
                score += scoreTextOverlap(normalizedCueLineText, normalizedLineText) * 120;
              }

              if (score > bestScore) {
                bestScore = score;
                bestTarget = cueLine;
              }
            }

            return bestTarget;
          }

          function revealEditorCursorInView(lineText, selectedText) {
            const targetLine = findBestRevealTarget(lineText, selectedText);
            if (!targetLine) {
              return;
            }

            targetLine.classList.add('cue-reveal-target');
            targetLine.scrollIntoView({ block: 'center', behavior: 'smooth' });

            if (window.cueRevealTimeout) {
              clearTimeout(window.cueRevealTimeout);
            }

            window.cueRevealTimeout = setTimeout(() => {
              targetLine.classList.remove('cue-reveal-target');
            }, 1800);
          }
          
          function applyFocusMode() {
            const content = document.getElementById('content');
            const lines = content.querySelectorAll('.cue-line');
            const focusIndicator = document.getElementById('focus-indicator');
            
            if (focusMode) {
              const windowHeight = window.innerHeight;
              const focusAreaTop = windowHeight * 0.4; // Focus area top position (40% of screen)
              const focusAreaBottom = windowHeight * 0.6; // Focus area bottom position (60% of screen)
              
              // Show focus area indicator
              focusIndicator.classList.add('active');
              focusIndicator.style.top = focusAreaTop + 'px';
              focusIndicator.style.height = (focusAreaBottom - focusAreaTop) + 'px';
              
              lines.forEach((line) => {
                const rect = line.getBoundingClientRect();
                const lineCenter = rect.top + rect.height / 2;
                
                let blurAmount = 0;
                
                // Check if this line is in the focus area
                if (lineCenter >= focusAreaTop && lineCenter <= focusAreaBottom) {
                  // In focus area, completely clear
                  blurAmount = 0;
                } else {
                  // Outside focus area, calculate distance and gradient blur effect
                  const bufferLines = 3; // Buffer line count
                  const avgLineHeight = rect.height || 20; // Average line height
                  const bufferDistance = bufferLines * avgLineHeight;
                  const maxBlur = focusBlurStrength; // Maximum blur amount (px)
                  
                  let distance = 0;
                  if (lineCenter < focusAreaTop) {
                    // Above focus area
                    distance = focusAreaTop - lineCenter;
                  } else {
                    // Below focus area
                    distance = lineCenter - focusAreaBottom;
                  }
                  
                  if (distance <= bufferDistance) {
                    // In buffer zone, calculate gradient blur
                    // Buffer blur range: from maxBlur to minBlur (not 0)
                    const minBlurInBuffer = maxBlur * 0.3; // Buffer boundary still maintains 30% blur
                    const ratio = distance / bufferDistance;
                    blurAmount = minBlurInBuffer + ratio * (maxBlur - minBlurInBuffer);
                  } else {
                    // Beyond buffer, use maximum blur
                    blurAmount = maxBlur;
                  }
                }
                
                // Ensure filter only sets blur, clear other possible filters
                if (blurAmount === 0) {
                  line.style.filter = 'none';
                } else {
                  line.style.filter = 'blur(' + blurAmount + 'px)';
                }
              });
            } else {
              // Hide focus area indicator
              focusIndicator.classList.remove('active');
              
              lines.forEach(line => {
                line.style.filter = 'none';
              });
            }
          }
          
          function updateFocusLine() {
            if (!focusMode) return;
            applyFocusMode();
          }

          function hideHelpOnClickOutside(event) {
            const helpPanel = document.getElementById('help-panel');
            const eventTarget = event.target;
            const helpButton = eventTarget instanceof Element ? eventTarget.closest('.cue-button') : null;
            if (!helpPanel || !(eventTarget instanceof Node)) {
              return;
            }
            
            // Don't hide if clicking on the help panel itself or the help button
            if (!helpPanel.contains(eventTarget) && !helpButton) {
              helpPanel.style.display = 'none';
              document.removeEventListener('click', hideHelpOnClickOutside);
            }
          }
          
          // Auto-scroll functionality (based on original webview.html)
          let scrolling = false;
          let scrollSpeed = ${config.scrollSpeed};
          let accumulatedScroll = 0;
          let scrollDirection = 1; // 1 for down, -1 for up
          
          // Content management - use JSON encoding for safety
          const initialContent = ${contentJson};
          
          function scrollStep() {
            if (scrolling) {
              accumulatedScroll += scrollSpeed * scrollDirection;
              if (Math.abs(accumulatedScroll) >= 1) {
                window.scrollBy(0, Math.floor(accumulatedScroll));
                accumulatedScroll -= Math.floor(accumulatedScroll);
              }
            }
            requestAnimationFrame(scrollStep);
          }
          
          // Start the scroll loop
          requestAnimationFrame(scrollStep);
          
          function ensureKeyboardFocus() {
            if (!document.body) {
              return;
            }

            if (!document.body.hasAttribute('tabindex')) {
              document.body.setAttribute('tabindex', '-1');
            }

            if (document.activeElement !== document.body) {
              document.body.focus({ preventScroll: true });
            }
          }

          function isEditableTarget(target) {
            if (!(target instanceof HTMLElement)) {
              return false;
            }

            const tagName = target.tagName.toLowerCase();
            return (
              target.isContentEditable ||
              tagName === 'input' ||
              tagName === 'textarea' ||
              tagName === 'select'
            );
          }

          // Handle keyboard events
          const handleKeydown = (e) => {
            if (isEditableTarget(e.target)) {
              return;
            }

            const scrollAmount = 50;
            
            switch(e.key) {
              case 'Escape':
                closeMode();
                break;
              case 'h':
              case 'H':
                toggleHelp();
                e.preventDefault();
                break;
              case ' ': // Space bar to toggle auto-scroll
                scrolling = !scrolling;
                e.preventDefault();
                break;
              case 'ArrowUp':
                scrolling = false; // Stop auto-scroll on manual control
                window.scrollBy(0, -scrollAmount);
                e.preventDefault();
                break;
              case 'ArrowDown':
                scrolling = false; // Stop auto-scroll on manual control
                window.scrollBy(0, scrollAmount);
                e.preventDefault();
                break;
              case 'PageUp':
                scrolling = false;
                window.scrollBy(0, -window.innerHeight * 0.8);
                e.preventDefault();
                break;
              case 'PageDown':
                scrolling = false;
                window.scrollBy(0, window.innerHeight * 0.8);
                e.preventDefault();
                break;
              case 'Home':
                scrolling = false;
                window.scrollTo(0, 0);
                e.preventDefault();
                break;
              case 'End':
                scrolling = false;
                window.scrollTo(0, document.body.scrollHeight);
                e.preventDefault();
                break;
              case 'r':
              case 'R':
                // Toggle reverse scroll
                scrollDirection *= -1;
                e.preventDefault();
                break;
              case '+':
              case '=':
                // Increase scroll speed
                scrollSpeed = Math.min(Number((scrollSpeed + 0.01).toFixed(2)), 1);
                showSpeedStatus();
                e.preventDefault();
                break;
              case '-':
              case '_':
                // Decrease scroll speed
                scrollSpeed = Math.max(Number((scrollSpeed - 0.01).toFixed(2)), 0.01);
                showSpeedStatus();
                e.preventDefault();
                break;
              case 't':
              case 'T':
                // Cycle to next theme via command
                vscode.postMessage({ type: 'cycleTheme' });
                e.preventDefault();
                break;
              case 'f':
              case 'F':
                // Toggle focus mode
                toggleFocusMode();
                e.preventDefault();
                break;
              case 'm':
              case 'M':
                // Toggle mirror flip
                toggleMirrorFlip();
                e.preventDefault();
                break;
              case 'd':
              case 'D':
                // Toggle markdown mode
                toggleMarkdownMode();
                e.preventDefault();
                break;
              case 'l':
              case 'L':
                // Adjust line height
                vscode.postMessage({ type: 'adjustLineHeight' });
                e.preventDefault();
                break;
              case '[':
                // Decrease font size
                vscode.postMessage({ type: 'decreaseFontSize' });
                e.preventDefault();
                break;
              case ']':
                // Increase font size
                vscode.postMessage({ type: 'increaseFontSize' });
                e.preventDefault();
                break;
            }
          };

          // Capture phase listener improves reliability when focus shifts.
          window.addEventListener('keydown', handleKeydown, true);

          // Keep keyboard focus inside the webview page.
          window.addEventListener('focus', ensureKeyboardFocus);
          document.addEventListener('click', () => {
            setTimeout(() => ensureKeyboardFocus(), 0);
          }, true);

          setTimeout(() => {
            window.focus();
            ensureKeyboardFocus();
          }, 0);
          
          // Report scroll events to extension
          window.addEventListener('scroll', () => {
            updateFocusLine();
            vscode.postMessage({ 
              type: 'scroll', 
              data: { 
                scrollTop: window.scrollY,
                scrollHeight: document.body.scrollHeight,
                clientHeight: window.innerHeight
              }
            });
          });
          
          // Listen for messages from the extension
          window.addEventListener('message', event => {
            const message = event.data;
            
            if (message.type === 'configUpdate') {
              // Update configuration
              if (message.config) {
                focusMode = message.config.focusMode;
                focusBlurStrength = message.config.focusOpacity * 5; // Convert opacity config to blur strength
                focusLineCount = message.config.focusLineCount;
                mirrorFlipEnabled = message.config.mirrorFlip;
                markdownMode = message.config.markdownMode;
                
                // Apply focus mode and mirror flip
                applyFocusMode();
                applyMirrorFlip();
                
                // Note: Content display will be updated by server-side HTML regeneration
                // No need to call updateContentDisplay() here as it uses simplified client-side processing
              }
            } else if (message.type === 'contentUpdate') {
              if (message.data && typeof message.data.processedContent === 'string') {
                const contentElement = document.getElementById('content');
                if (contentElement) {
                  contentElement.innerHTML = message.data.processedContent;
                  applyMirrorFlip();
                  applyFocusMode();
                  ensureKeyboardFocus();
                }
              }
            } else if (message.type === 'revealEditorCursor') {
              revealEditorCursorInView(message.data?.lineText, message.data?.selectedText);
            } else if (message.type === 'restoreScroll') {
              // Restore scroll position
              if (message.data && message.data.scrollTop !== undefined) {
                window.scrollTo({
                  top: message.data.scrollTop,
                  behavior: 'smooth'
                });
              }
            }
          });
          
          // Initialize
          console.log(i18n.initMessage, { initialContentLength: initialContent?.length ?? 0 });
          
          // Apply initial mirror flip state
          applyMirrorFlip();
          
          // Add double-click event handler to open source document
          const contentContainer = document.getElementById('content');
          if (contentContainer) {
            contentContainer.addEventListener('dblclick', (event) => {
              // Find the clicked line element
              let target = event.target;
              while (target && target !== contentContainer) {
                if (target.classList && target.classList.contains('cue-line')) {
                  // Get line number from data attribute
                  const lineAttr = target.getAttribute('data-line');
                  const lineNumberAttr = target.getAttribute('data-line-number');
                  const blockAttr = target.getAttribute('data-block');
                  
                  // Use whichever attribute is available
                  const lineNumber = lineAttr || lineNumberAttr || blockAttr;
                  
                  if (lineNumber !== null) {
                    // Get full text content of the line
                    const fullText = target.textContent || '';
                    
                    // Try to get the exact clicked text using selection/range
                    let clickedText = '';
                    let characterOffset = 0;
                    let beforeText = '';
                    let afterText = '';
                    
                    try {
                      let caretRange = null;
                      if (typeof document.caretRangeFromPoint === 'function') {
                        caretRange = document.caretRangeFromPoint(event.clientX, event.clientY);
                      } else if (typeof document.caretPositionFromPoint === 'function') {
                        const caretPosition = document.caretPositionFromPoint(event.clientX, event.clientY);
                        if (caretPosition) {
                          caretRange = document.createRange();
                          caretRange.setStart(caretPosition.offsetNode, caretPosition.offset);
                          caretRange.setEnd(caretPosition.offsetNode, caretPosition.offset);
                        }
                      }

                      if (caretRange) {
                        const fullRange = document.createRange();
                        fullRange.selectNodeContents(target);
                        fullRange.setEnd(caretRange.startContainer, caretRange.startOffset);

                        const rawOffset = fullRange.toString().length;
                        const safeOffset = Math.max(0, Math.min(rawOffset, Math.max(fullText.length - 1, 0)));
                        let start = safeOffset;
                        let end = safeOffset;
                        const wordBoundary = /[\\s\\t\\r\\n\\u3000,.!?;:()\\[\\]{}"'“”‘’、，。！？；：《》【】]/u;

                        while (start > 0 && !wordBoundary.test(fullText[start - 1])) {
                          start--;
                        }

                        while (end < fullText.length && !wordBoundary.test(fullText[end])) {
                          end++;
                        }

                        clickedText = fullText.substring(start, end).trim();
                        characterOffset = start;
                        beforeText = fullText.substring(Math.max(0, start - 20), start);
                        afterText = fullText.substring(end, Math.min(fullText.length, end + 20));
                      }
                    } catch (err) {
                      console.warn('Could not determine exact click position:', err);
                    }
                    
                    // Fallback to first 50 characters if no specific text
                    const contextText = clickedText || fullText.substring(0, 50);
                    
                    // Send message to extension
                    vscode.postMessage({
                      type: 'openEditor',
                      data: {
                        lineNumber: parseInt(lineNumber, 10),
                        contextText: fullText.substring(0, 100), // Longer context for matching
                        clickedText,
                        beforeText,
                        afterText,
                        characterOffset,
                      }
                    });
                    
                    event.preventDefault();
                    return;
                  }
                }
                target = target.parentElement;
              }
            });
          }
          
          // Listen for window resize events
          window.addEventListener('resize', () => {
            const helpPanel = document.getElementById('help-panel');
            if (helpPanel.style.display === 'block') {
              adjustHelpPosition(helpPanel);
            }
            
            // Update focus mode
            if (focusMode) {
              applyFocusMode();
            }
          });
          
          // Apply focus mode on initialization
          setTimeout(() => {
            applyFocusMode();
          }, 100);
          
          // Update focus area on window resize
          window.addEventListener('resize', () => {
            if (focusMode) {
              applyFocusMode();
            }
          });
          
          // Show help message after a delay
          setTimeout(() => {
            const helpText = [
              i18n.shortcutsTitle + ':',
              i18n.spaceShortcut,
              i18n.rShortcut,
              i18n.speedShortcut,
              i18n.helpShortcut,
              i18n.escShortcut,
            ].join('\\n');
            
            console.log(helpText);
          }, 1000);
        </script>
      </body>
      </html>
    `;
}
