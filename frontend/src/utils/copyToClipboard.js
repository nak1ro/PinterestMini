export const copyToClipboard = async (text) => {
  if (typeof text !== 'string') {
    throw new TypeError('copyToClipboard expected a string argument');
  }

  const clipboard = navigator?.clipboard;
  const isSecure = window?.isSecureContext;

  if (clipboard?.writeText && isSecure !== false) {
    try {
      await clipboard.writeText(text);
      return;
    } catch (err) {
      // Swallow and fallback below
    }
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '1px';
  textArea.style.height = '1px';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';

  document.body.appendChild(textArea);
  textArea.focus({ preventScroll: true });
  textArea.select();
  textArea.setSelectionRange(0, text.length);

  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!successful) {
    throw new Error('Unable to copy text to clipboard');
  }
};

