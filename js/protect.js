/* ============================================================
   🛡️  Harsha Royal Portfolio — Site Protection
   Disables: right-click, image drag, screenshot shortcuts,
   devtools shortcuts, print/save. Runs on every page.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Disable right-click context menu ─────────────────── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  });

  /* ── 2. Block keyboard shortcuts ─────────────────────────── */
  document.addEventListener('keydown', function (e) {
    const key = e.keyCode || e.which;

    // PrintScreen
    if (e.key === 'PrintScreen' || key === 44) {
      e.preventDefault();
      showToast('Screenshots are disabled 📸');
      // Clear clipboard if possible
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText('').catch(() => {});
      }
      return false;
    }

    // F12 – DevTools
    if (key === 123) {
      e.preventDefault();
      return false;
    }

    const ctrl  = e.ctrlKey  || e.metaKey;
    const shift = e.shiftKey;

    // Ctrl/Cmd + Shift + I/J/C (DevTools)
    if (ctrl && shift && [73, 74, 67].includes(key)) {
      e.preventDefault();
      return false;
    }

    // Ctrl/Cmd + U (View Source)
    if (ctrl && key === 85) {
      e.preventDefault();
      return false;
    }

    // Ctrl/Cmd + S (Save Page)
    if (ctrl && key === 83) {
      e.preventDefault();
      return false;
    }

    // Ctrl/Cmd + P (Print)
    if (ctrl && key === 80) {
      e.preventDefault();
      showToast('Printing is disabled 🖨️');
      return false;
    }

    // Mac screenshot shortcuts: Cmd+Shift+3, 4, 5
    if (e.metaKey && shift && [51, 52, 53].includes(key)) {
      e.preventDefault();
      showToast('Screenshots are disabled 📸');
      return false;
    }

    // Mac: Cmd+Shift+6 (Touch Bar screenshot)
    if (e.metaKey && shift && key === 54) {
      e.preventDefault();
      return false;
    }
  });

  /* ── 3. Disable drag on all images ───────────────────────── */
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });

  /* ── 4. Block print via CSS (media query overlay) ────────── */
  var printStyle = document.createElement('style');
  printStyle.innerHTML = [
    '@media print {',
    '  body * { display: none !important; visibility: hidden !important; }',
    '  body::before {',
    '    content: "Printing is not permitted.";',
    '    display: block !important;',
    '    visibility: visible !important;',
    '    font-size: 24px;',
    '    text-align: center;',
    '    padding: 40px;',
    '  }',
    '}',
    /* Prevent image drag/select globally */
    'img { -webkit-user-drag: none; user-drag: none; pointer-events: none; }',
  ].join('\n');
  document.head.appendChild(printStyle);

  /* ── 5. Subtle toast notification ───────────────────────── */
  var toastEl = null;
  var toastTimer = null;

  function showToast(msg) {
    msg = msg || 'Right-click is disabled 🔒';
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'hr-protect-toast';
      var s = toastEl.style;
      s.cssText = [
        'position:fixed',
        'bottom:28px',
        'left:50%',
        'transform:translateX(-50%) translateY(20px)',
        'background:rgba(0,0,0,0.85)',
        'color:#fff',
        'padding:10px 22px',
        'border-radius:40px',
        'font-family:"Inter",system-ui,sans-serif',
        'font-size:13px',
        'font-weight:600',
        'letter-spacing:0.02em',
        'z-index:9999999',
        'opacity:0',
        'transition:opacity 0.25s ease,transform 0.25s ease',
        'pointer-events:none',
        'white-space:nowrap',
        'box-shadow:0 4px 20px rgba(0,0,0,0.4)',
        'border:1px solid rgba(255,117,24,0.3)',
      ].join(';');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    // Animate in
    requestAnimationFrame(function () {
      toastEl.style.opacity = '1';
      toastEl.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.style.opacity = '0';
      toastEl.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
  }

  /* ── 6. Expose showToast for common-security.js compat ─── */
  window._hrShowProtectToast = showToast;

})();
