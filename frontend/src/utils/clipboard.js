export const copyTextToClipboard = async (text) => {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof window !== 'undefined' &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // fall through to the legacy approach
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  textArea.setAttribute('readonly', '');

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch (err) {
    succeeded = false;
  } finally {
    document.body.removeChild(textArea);
  }

  return succeeded;
};

