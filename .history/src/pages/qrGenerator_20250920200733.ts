import { QRCode, ErrorCorrectLevel } from '../utils/qrcode';

interface QRState {
  text: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  size: number;
  margin: number;
  foreground: string;
  background: string;
  logoDataUrl: string | null;
  logoSizePercent: number;
  logoPosition: 'center' | 'bottom-right';
  logoOriginalWidth: number | null;
  logoOriginalHeight: number | null;
}

const DEFAULT_STATE: QRState = {
  text: 'https://packaging-toolbox.site',
  errorCorrection: 'L',
  size: 320,
  margin: 4,
  foreground: '#111827',
  background: '#ffffff',
  logoDataUrl: null,
  logoSizePercent: 18,
  logoPosition: 'center',
  logoOriginalWidth: null,
  logoOriginalHeight: null,
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector<HTMLFormElement>('#qr-form');
  const textInput = document.querySelector<HTMLTextAreaElement>('#qr-text');
  const ecSelect = document.querySelector<HTMLSelectElement>('#qr-ec');
  const sizeInput = document.querySelector<HTMLInputElement>('#qr-size');
  const marginInput = document.querySelector<HTMLInputElement>('#qr-margin');
  const fgInput = document.querySelector<HTMLInputElement>('#qr-foreground');
  const bgInput = document.querySelector<HTMLInputElement>('#qr-background');
  const logoInput = document.querySelector<HTMLInputElement>('#qr-logo');
  const logoRemove = document.querySelector<HTMLButtonElement>('#qr-logo-remove');
  const logoSizeRange = document.querySelector<HTMLInputElement>('#qr-logo-size');
  const logoPositionSelect = document.querySelector<HTMLSelectElement>('#qr-logo-position');

  const preview = document.querySelector<HTMLElement>('[data-qr-preview]');
  const downloadPngButton = document.querySelector<HTMLButtonElement>('[data-download-png]');
  const feedback = document.querySelector<HTMLElement>('[data-feedback]');
  const canvas = document.createElement('canvas');

  if (
    !form
    || !textInput
    || !ecSelect
    || !sizeInput
    || !marginInput
    || !fgInput
    || !bgInput
    || !logoInput
    || !logoRemove
    || !logoSizeRange
    || !logoPositionSelect
    || !preview
    || !downloadPngButton
    || !feedback
  ) {
    return;
  }

  let state: QRState = { ...DEFAULT_STATE };
  let lastOutput: { svg: string; renderedSize: number } | null = null;
  let lastPngDataUrl = '';

  const setFeedback = (message: string, tone: 'default' | 'success' | 'error' = 'default') => {
    feedback.textContent = message;
    feedback.style.color = tone === 'error'
      ? '#dc2626'
      : tone === 'success'
        ? '#047857'
        : 'var(--slate-500)';
  };

  const toNumber = (value: string, fallback: number, min: number, max: number): number => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.min(max, Math.max(min, parsed));
  };

  const applyStateToForm = (payload: QRState) => {
    textInput.value = payload.text;
    ecSelect.value = payload.errorCorrection;
    sizeInput.value = String(payload.size);
    marginInput.value = String(payload.margin);
    fgInput.value = payload.foreground;
    bgInput.value = payload.background;
    logoSizeRange.value = String(payload.logoSizePercent);
    logoRemove.disabled = !payload.logoDataUrl;
    logoPositionSelect.value = payload.logoPosition;
  };

  const updateStateFromForm = () => {
    state = {
      ...state,
      text: textInput.value,
      errorCorrection: (ecSelect.value as QRState['errorCorrection']) ?? state.errorCorrection,
      size: toNumber(sizeInput.value, state.size, 160, 600),
      margin: toNumber(marginInput.value, state.margin, 0, 12),
      foreground: fgInput.value || DEFAULT_STATE.foreground,
      background: bgInput.value || DEFAULT_STATE.background,
      logoSizePercent: toNumber(logoSizeRange.value, state.logoSizePercent, 10, 30),
      logoPosition: (logoPositionSelect.value as QRState['logoPosition']) ?? state.logoPosition,
      logoOriginalWidth: state.logoOriginalWidth,
      logoOriginalHeight: state.logoOriginalHeight,
    };
    logoRemove.disabled = !state.logoDataUrl;
  };

  const validateLogoSize = (payload: QRState): string | null => {
    if (!payload.logoDataUrl) {
      return null;
    }
    if ((payload.errorCorrection === 'L' || payload.errorCorrection === 'M') && payload.logoSizePercent > 22) {
      return '当前容错等级较低，建议将 Logo 调至 22% 以下或提升容错等级。';
    }
    return null;
  };

  const buildQrOutput = (payload: QRState): { svg: string; renderedSize: number } => {
    const qr = new QRCode(-1, ErrorCorrectLevel[payload.errorCorrection]);
    qr.addData(payload.text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const moduleSize = Math.max(1, Math.floor(payload.size / (moduleCount + payload.margin * 2)));
    const renderedSize = moduleSize * (moduleCount + payload.margin * 2);

    const parts: string[] = [];
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${renderedSize}" height="${renderedSize}" viewBox="0 0 ${renderedSize} ${renderedSize}" role="img" aria-label="二维码">`);
    parts.push(`<rect width="100%" height="100%" fill="${payload.background}"/>`);
    parts.push(`<g fill="${payload.foreground}">`);

    for (let row = 0; row < moduleCount; row += 1) {
      for (let col = 0; col < moduleCount; col += 1) {
        if (qr.isDark(row, col)) {
          const x = (payload.margin + col) * moduleSize;
          const y = (payload.margin + row) * moduleSize;
          parts.push(`<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" />`);
        }
      }
    }

    parts.push('</g>');

    if (payload.logoDataUrl) {
      const baseWidth = payload.logoOriginalWidth ?? renderedSize * 0.2;
      const baseHeight = payload.logoOriginalHeight ?? renderedSize * 0.2;
      const maxLogoSize = (payload.logoSizePercent / 100) * renderedSize;
      const ratio = Math.min(maxLogoSize / baseWidth, maxLogoSize / baseHeight);
      const drawWidth = baseWidth * ratio;
      const drawHeight = baseHeight * ratio;
      let x = (renderedSize - drawWidth) / 2;
      let y = (renderedSize - drawHeight) / 2;
      if (payload.logoPosition === 'bottom-right') {
        const padding = renderedSize * 0.035;
        x = renderedSize - drawWidth - padding;
        y = renderedSize - drawHeight - padding;
      }
      const padding = Math.max(drawWidth, drawHeight) * 0.12;
      const rectX = Math.max(0, x - padding / 2);
      const rectY = Math.max(0, y - padding / 2);
      const rectW = Math.min(renderedSize - rectX, drawWidth + padding);
      const rectH = Math.min(renderedSize - rectY, drawHeight + padding);
      const radius = Math.min(rectW, rectH) * 0.18;
      const strokeWidth = Math.max(2, renderedSize * 0.012);
      parts.push(`<rect x="${rectX}" y="${rectY}" width="${rectW}" height="${rectH}" fill="#ffffff" rx="${radius}" ry="${radius}" stroke="#ffffff" stroke-width="${strokeWidth}"/>`);
      parts.push(`<image href="${payload.logoDataUrl}" x="${x}" y="${y}" width="${drawWidth}" height="${drawHeight}"/>`);
    }

    parts.push('</svg>');
    return { svg: parts.join(''), renderedSize };
  };

  const renderCanvas = async (output: { svg: string; renderedSize: number }): Promise<void> => {
    const blob = new Blob([output.svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await img.decode().catch(() => Promise.reject(new Error('二维码图像解码失败')));

    canvas.width = output.renderedSize;
    canvas.height = output.renderedSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error('Canvas 初始化失败。');
    }
    ctx.fillStyle = state.background;
    ctx.fillRect(0, 0, output.renderedSize, output.renderedSize);
    ctx.drawImage(img, 0, 0, output.renderedSize, output.renderedSize);
    URL.revokeObjectURL(url);
  };

  const render = async () => {
    try {
      const output = buildQrOutput(state);
      lastOutput = output;
      await renderCanvas(output);
      const dataUrl = canvas.toDataURL('image/png');
      preview.innerHTML = '';
      preview.insertAdjacentHTML('afterbegin', `<img src="${dataUrl}" alt="二维码预览" style="max-width:100%;height:auto;">`);
      lastPngDataUrl = dataUrl;
      downloadPngButton.disabled = false;
      const warning = validateLogoSize(state);
      if (warning) {
        setFeedback(warning, 'error');
      } else {
        setFeedback('二维码已更新，可下载 PNG 文件。', 'success');
      }
    } catch (error) {
      preview.innerHTML = '<p class="hint">二维码生成失败，请检查输入内容。</p>';
      lastPngDataUrl = '';
      downloadPngButton.disabled = true;
      setFeedback(error instanceof Error ? error.message : '二维码生成失败。', 'error');
    }
  };

  const handleLogoUpload = () => {
    const file = logoInput.files && logoInput.files[0];
    if (!file) {
      return;
    }
    if (!/^image\/(png|jpeg|svg\+xml)$/.test(file.type)) {
      setFeedback('仅支持 PNG、JPG 或 SVG 图片作为 Logo。', 'error');
      logoInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) {
        setFeedback('Logo 读取失败，请重试。', 'error');
        return;
      }
      const img = new Image();
      img.onload = () => {
        state.logoDataUrl = result;
        state.logoOriginalWidth = img.naturalWidth || img.width;
        state.logoOriginalHeight = img.naturalHeight || img.height;
        logoRemove.disabled = false;
        void render();
      };
      img.onerror = () => {
        setFeedback('Logo 加载失败，请更换文件。', 'error');
      };
      img.src = result;
    };
    reader.onerror = () => {
      setFeedback('Logo 读取失败，请重试。', 'error');
    };
    reader.readAsDataURL(file);
  };

  form.addEventListener('input', () => {
    updateStateFromForm();
    void render();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateStateFromForm();
    void render();
  });

  logoSizeRange.addEventListener('input', () => {
    updateStateFromForm();
    void render();
  });

  logoInput.addEventListener('change', () => {
    void handleLogoUpload();
  });

  logoRemove.addEventListener('click', (event) => {
    event.preventDefault();
    state.logoDataUrl = null;
    state.logoOriginalWidth = null;
    state.logoOriginalHeight = null;
    logoInput.value = '';
    logoRemove.disabled = true;
    void render();
  });

  logoPositionSelect.addEventListener('change', () => {
    updateStateFromForm();
    void render();
  });

  downloadPngButton.addEventListener('click', async () => {
    try {
      const output = lastOutput ?? buildQrOutput(state);
      if (!lastOutput) {
        await renderCanvas(output);
      }
      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('PNG 导出失败。'));
            return;
          }
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = `qr-${Date.now()}.png`;
          document.body.append(anchor);
          anchor.click();
          anchor.remove();
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      });
      setFeedback('已下载 PNG 文件。', 'success');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'PNG 导出失败。', 'error');
    }
  });

  applyStateToForm(state);
  void render();
});
