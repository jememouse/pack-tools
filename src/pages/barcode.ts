import { generateCode39Svg, generateQrSvg } from '../utils/encoding';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector<HTMLFormElement>('#barcode-form');
  const typeSelect = document.querySelector<HTMLSelectElement>('#barcode-type');
  const textInput = document.querySelector<HTMLTextAreaElement>('#barcode-text');
  const heightInput = document.querySelector<HTMLInputElement>('#barcode-height');
  const widthInput = document.querySelector<HTMLInputElement>('#barcode-width');
  const ecSelect = document.querySelector<HTMLSelectElement>('#barcode-ec-level');
  const sizeInput = document.querySelector<HTMLInputElement>('#barcode-size');

  const code39Options = document.querySelectorAll<HTMLElement>('[data-code39-option]');
  const qrOptions = document.querySelectorAll<HTMLElement>('[data-qrcode-option]');

  const preview = document.querySelector<HTMLElement>('[data-preview]');
  const downloadButton = document.querySelector<HTMLButtonElement>('[data-download-svg]');
  const copyButton = document.querySelector<HTMLButtonElement>('[data-copy-svg]');
  const feedback = document.querySelector<HTMLElement>('[data-feedback]');

  if (
    !form
    || !typeSelect
    || !textInput
    || !heightInput
    || !widthInput
    || !ecSelect
    || !sizeInput
    || !preview
    || !downloadButton
    || !copyButton
    || !feedback
  ) {
    return;
  }

  let currentSvg = '';

  const setFeedback = (message: string, tone: 'default' | 'success' | 'error' = 'default') => {
    feedback.textContent = message;
    feedback.style.color = tone === 'error'
      ? '#dc2626'
      : tone === 'success'
        ? '#047857'
        : 'var(--slate-500)';
  };

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  const toggleOptions = () => {
    const type = typeSelect.value as 'code39' | 'qrcode';
    code39Options.forEach((el) => {
      el.hidden = type !== 'code39';
    });
    qrOptions.forEach((el) => {
      el.hidden = type !== 'qrcode';
    });
  };

  const renderCode39 = () => {
    try {
      const svg = generateCode39Svg(textInput.value, {
        barHeight: toNumber(heightInput.value, 72),
        narrowBarWidth: toNumber(widthInput.value, 2),
        includeText: true,
      });
      preview.innerHTML = '';
      preview.insertAdjacentHTML('afterbegin', svg);
      currentSvg = svg;
      downloadButton.disabled = false;
      copyButton.disabled = false;
      setFeedback('已生成 Code 39 条码，可下载或复制 SVG。', 'success');
    } catch (error) {
      preview.innerHTML = '<p class="hint">条码生成失败，请检查内容是否包含不支持的字符。</p>';
      currentSvg = '';
      downloadButton.disabled = true;
      copyButton.disabled = true;
      setFeedback(error instanceof Error ? error.message : '条码生成失败。', 'error');
    }
  };

  const renderQrCode = () => {
    const text = textInput.value.trim();
    if (!text) {
      preview.innerHTML = '<p class="hint">请输入二维码内容。</p>';
      downloadButton.disabled = true;
      copyButton.disabled = true;
      setFeedback('请输入二维码内容。', 'error');
      currentSvg = '';
      return;
    }
    const size = Math.min(Math.max(Math.floor(toNumber(sizeInput.value, 280)), 120), 600);
    const ecLevel = (ecSelect.value as 'L' | 'M' | 'Q' | 'H') || 'M';
    try {
      const svg = generateQrSvg(text, {
        errorCorrectionLevel: ecLevel,
        size,
        margin: 4,
      });
      preview.innerHTML = '';
      preview.insertAdjacentHTML('afterbegin', svg);
      currentSvg = svg;
      downloadButton.disabled = false;
      copyButton.disabled = false;
      setFeedback('已生成二维码，可下载或复制 SVG。', 'success');
    } catch (error) {
      preview.innerHTML = '<p class="hint">二维码生成失败，请尝试简化内容或缩短长度。</p>';
      currentSvg = '';
      downloadButton.disabled = true;
      copyButton.disabled = true;
      setFeedback(error instanceof Error ? error.message : '二维码生成失败。', 'error');
    }
  };

  const render = () => {
    const type = typeSelect.value as 'code39' | 'qrcode';
    if (type === 'code39') {
      renderCode39();
    } else {
      renderQrCode();
    }
  };

  typeSelect.addEventListener('change', () => {
    toggleOptions();
    render();
  });

  form.addEventListener('input', () => {
    render();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    render();
  });

  downloadButton.addEventListener('click', () => {
    if (!currentSvg) {
      return;
    }
    const blob = new Blob([currentSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `barcode-${Date.now()}.svg`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setFeedback('已下载 SVG 文件。', 'success');
  });

  copyButton.addEventListener('click', async () => {
    if (!currentSvg) {
      return;
    }
    try {
      await navigator.clipboard.writeText(currentSvg);
      setFeedback('SVG 内容已复制，可直接粘贴到矢量软件中。', 'success');
    } catch (error) {
      console.error('Failed to copy SVG', error);
      setFeedback('复制失败，请手动选择 SVG 文本。', 'error');
    }
  });

  toggleOptions();
  render();
});
