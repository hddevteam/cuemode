import type { CueModeConfig } from '../types';
import { ThemeManager } from '../utils/theme';
import { MarkdownParser } from '../utils/markdown';
import { generateMarkdownCSS } from '../utils/markdownStyles';
import { generatePresentationCSS } from '../utils/webviewStyles';
import { t, getCurrentLanguage } from '../i18n';

/**
 * Generate HTML for presentation (slide) mode.
 */
export function generatePresentationHTML(
  slides: string[],
  config: CueModeConfig,
  filename: string
): string {
  const themeCSS = ThemeManager.generateCSS(
    config.colorTheme,
    config.fontSize,
    config.lineHeight,
    config.maxWidth,
    config.padding
  );
  const markdownCSS = generateMarkdownCSS(ThemeManager.getTheme(config.colorTheme));
  const presentationCSS = generatePresentationCSS();

  // Render each slide content via markdown parser
  const renderedSlides = slides
    .map((slideText, idx) => {
      let innerHtml: string;
      try {
        const parsed = MarkdownParser.parse(slideText.trim(), config.markdownFeatures);
        innerHtml = parsed.html;
      } catch {
        innerHtml = `<pre>${slideText
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</pre>`;
      }
      return `<div class="pm-slide${idx === 0 ? ' active' : ''}" data-slide="${idx}">
        <div class="pm-slide-inner">${innerHtml}</div>
      </div>`;
    })
    .join('\n');

  const isSingle = slides.length === 1;
  const prevLabel = t('presentation.prev');
  const nextLabel = t('presentation.next');
  const closeLabel = t('presentation.close');
  const helpLabel = t('presentation.help');
  const helpTitle = t('presentation.helpTitle');
  const lang = getCurrentLanguage();

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>${t('presentation.title', { filename })}</title>
  <style>
    ${themeCSS}
    ${markdownCSS}
    ${presentationCSS}
  </style>
</head>
<body>
  <!-- Top controls -->
  <div class="pm-controls" id="pm-controls">
    <button class="pm-ctrl-btn" onclick="pmClose()">${closeLabel}</button>
    <button class="pm-ctrl-btn" onclick="pmToggleHelp()">${helpLabel}</button>
  </div>

  <!-- Slide container -->
  <div class="pm-slide-container${isSingle ? ' pm-single' : ''}">
    ${renderedSlides}
  </div>

  <!-- Navigation bar (hidden when only 1 slide) -->
  <div class="pm-nav" id="pm-nav"${isSingle ? ' style="display:none"' : ''}>
    <button class="pm-nav-btn" id="pm-prev" onclick="pmPrev()" disabled>${prevLabel}</button>
    <span class="pm-counter" id="pm-counter">1 / ${slides.length}</span>
    <button class="pm-nav-btn" id="pm-next" onclick="pmNext()"${slides.length <= 1 ? ' disabled' : ''}>${nextLabel}</button>
  </div>

  <!-- Help overlay -->
  <div class="pm-help" id="pm-help">
    <h3>${helpTitle}</h3>
    <ul>
      <li><kbd>← →</kbd><span>${t('presentation.shortcutLeft')} / ${t('presentation.shortcutRight')}</span></li>
      <li><kbd>Space</kbd><span>${t('presentation.shortcutRight')}</span></li>
      <li><kbd>T</kbd><span>${t('presentation.shortcutT')}</span></li>
      <li><kbd>L</kbd><span>${t('presentation.shortcutL')}</span></li>
      <li><kbd>[</kbd><span>${t('presentation.shortcutBracketL')}</span></li>
      <li><kbd>]</kbd><span>${t('presentation.shortcutBracketR')}</span></li>
      <li><kbd>H</kbd><span>${t('presentation.shortcutH')}</span></li>
      <li><kbd>Esc</kbd><span>${t('presentation.shortcutEsc')}</span></li>
    </ul>
    <hr style="border-color:rgba(255,255,255,0.2);margin:10px 0">
    <p style="font-size:0.85em;opacity:0.85;margin:0"><strong>${t('presentation.separatorLabel')}:</strong> <code>${t('presentation.separatorValue')}</code></p>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const slides = document.querySelectorAll('.pm-slide');
    const totalSlides = ${slides.length};
    let current = 0;
    let uiVisible = true;
    let uiTimeout;

    function pmGoTo(idx) {
      if (idx < 0 || idx >= totalSlides) return;
      slides[current].classList.remove('active');
      current = idx;
      slides[current].classList.add('active');
      document.getElementById('pm-counter').textContent = (current + 1) + ' / ' + totalSlides;
      document.getElementById('pm-prev').disabled = current === 0;
      document.getElementById('pm-next').disabled = current === totalSlides - 1;
    }

    function pmNext() { pmGoTo(current + 1); }
    function pmPrev() { pmGoTo(current - 1); }

    function pmClose() { vscode.postMessage({ type: 'close' }); }

    function pmToggleHelp() {
      const help = document.getElementById('pm-help');
      help.classList.toggle('visible');
    }

    function pmShowUI() {
      clearTimeout(uiTimeout);
      const ctrl = document.getElementById('pm-controls');
      const nav  = document.getElementById('pm-nav');
      ctrl.classList.remove('hidden');
      if (totalSlides > 1) nav.classList.remove('hidden');
      uiVisible = true;
      uiTimeout = setTimeout(() => {
        ctrl.classList.add('hidden');
        nav.classList.add('hidden');
        uiVisible = false;
      }, 3000);
    }

    // Show UI on mouse move
    document.addEventListener('mousemove', pmShowUI);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          pmNext(); e.preventDefault(); break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          pmPrev(); e.preventDefault(); break;
        case ' ':
          pmNext(); e.preventDefault(); break;
        case 'Escape':
          {
            const help = document.getElementById('pm-help');
            if (help.classList.contains('visible')) { help.classList.remove('visible'); }
            else { pmClose(); }
          }
          break;
        case 't': case 'T':
          vscode.postMessage({ type: 'cycleTheme' }); e.preventDefault(); break;
        case 'h': case 'H':
          pmToggleHelp(); e.preventDefault(); break;
        case 'l': case 'L':
          vscode.postMessage({ type: 'adjustLineHeight' }); e.preventDefault(); break;
        case '[':
          vscode.postMessage({ type: 'decreaseFontSize' }); e.preventDefault(); break;
        case ']':
          vscode.postMessage({ type: 'increaseFontSize' }); e.preventDefault(); break;
      }
    });

    // Initial UI auto-hide after 2 s
    uiTimeout = setTimeout(() => {
      document.getElementById('pm-controls').classList.add('hidden');
      document.getElementById('pm-nav').classList.add('hidden');
      uiVisible = false;
    }, 2000);

    // Listen for theme update messages from extension
    window.addEventListener('message', event => {
      // Full HTML reload is triggered by extension; nothing extra needed here.
    });
  </script>
</body>
</html>`;
}
