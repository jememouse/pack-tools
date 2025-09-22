import { QRCode, ErrorCorrectLevel } from './qrcode';

export type BarcodeType = 'code39' | 'qrcode';

export interface Code39Options {
  barHeight?: number;
  narrowBarWidth?: number;
  wideFactor?: number;
  margin?: number;
  includeText?: boolean;
}

export interface QROptions {
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  size?: number;
  margin?: number;
}

const CODE39_ALPHABET: Record<string, string> = {
  '0': 'nnnwwnwnn',
  '1': 'wnnwnnnnw',
  '2': 'nnwwnnnnw',
  '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw',
  '5': 'wnnwwnnnn',
  '6': 'nnwwwnnnn',
  '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn',
  '9': 'nnwwnnwnn',
  A: 'wnnnnwnnw',
  B: 'nnwnnwnnw',
  C: 'wnwnnwnnn',
  D: 'nnnnwwnnw',
  E: 'wnnnwwnnn',
  F: 'nnwnwwnnn',
  G: 'nnnnnwwnw',
  H: 'wnnnnwwnn',
  I: 'nnwnnwwnn',
  J: 'nnnnwwwnn',
  K: 'wnnnnnnww',
  L: 'nnwnnnnww',
  M: 'wnwnnnnwn',
  N: 'nnnnwnnww',
  O: 'wnnnwnnwn',
  P: 'nnwnwnnwn',
  Q: 'nnnnnnwww',
  R: 'wnnnnnwwn',
  S: 'nnwnnnwwn',
  T: 'nnnnwnwwn',
  U: 'wwnnnnnnw',
  V: 'nwwnnnnnw',
  W: 'wwwnnnnnn',
  X: 'nwnnwnnnw',
  Y: 'wwnnwnnnn',
  Z: 'nwwnwnnnn',
  '-': 'nwnnnnwnw',
  '.': 'wwnnnnwnn',
  ' ': 'nwwnnnwnn',
  '$': 'nwnwnwnnn',
  '/': 'nwnwnnnwn',
  '+': 'nwnnnwnwn',
  '%': 'nnnwnwnwn',
  '*': 'nwnnwnwnn',
};

const CODE39_ALLOWED = new Set(Object.keys(CODE39_ALPHABET));

export function generateCode39Svg(input: string, options: Code39Options = {}): string {
  const {
    barHeight = 72,
    narrowBarWidth = 2,
    wideFactor = 3,
    margin = 12,
    includeText = true,
  } = options;

  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('请输入需要编码的内容。');
  }

  const upper = `*${trimmed.toUpperCase()}*`;
  for (const ch of upper) {
    if (!CODE39_ALLOWED.has(ch)) {
      throw new Error(`字符 "${ch}" 不受 Code 39 支持。`);
    }
  }

  const wideWidth = narrowBarWidth * Math.max(2, wideFactor);
  let totalWidth = margin * 2;

  upper.split('').forEach((char) => {
    const pattern = CODE39_ALPHABET[char];
    for (let i = 0; i < pattern.length; i += 1) {
      totalWidth += pattern[i] === 'w' ? wideWidth : narrowBarWidth;
    }
    totalWidth += narrowBarWidth;
  });

  const viewHeight = includeText ? barHeight + 20 : barHeight;
  const textY = barHeight + 16;

  let currentX = margin;
  const bars: string[] = [];

  upper.split('').forEach((char, index) => {
    const pattern = CODE39_ALPHABET[char];
    for (let i = 0; i < pattern.length; i += 1) {
      const isBar = i % 2 === 0;
      const width = pattern[i] === 'w' ? wideWidth : narrowBarWidth;
      if (isBar) {
        bars.push(`<rect x="${currentX}" y="0" width="${width}" height="${barHeight}" />`);
      }
      currentX += width;
    }
    if (index !== upper.length - 1) {
      currentX += narrowBarWidth;
    }
  });

  const svgParts: string[] = [];
  svgParts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${viewHeight}" viewBox="0 0 ${totalWidth} ${viewHeight}" role="img" aria-label="Code 39 条码" preserveAspectRatio="xMidYMid meet">`,
  );
  svgParts.push('<g fill="#111827">');
  svgParts.push(...bars);
  svgParts.push('</g>');

  if (includeText) {
    const text = trimmed.toUpperCase();
    svgParts.push(
      `<text x="${totalWidth / 2}" y="${textY}" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="14" fill="#1f2937">${escapeXml(
        text,
      )}</text>`,
    );
  }

  svgParts.push('</svg>');
  return svgParts.join('');
}

export function generateQrSvg(text: string, options: QROptions = {}): string {
  const content = text.trim();
  if (!content) {
    throw new Error('请输入需要编码的内容。');
  }

  const errorCorrectionLevel = options.errorCorrectionLevel ?? 'M';
  const baseSize = options.size ?? 280;
  const margin = options.margin ?? 4;

  const qr = new QRCode(-1, ErrorCorrectLevel[errorCorrectionLevel]);
  qr.addData(content);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const moduleSize = Math.max(1, Math.floor(baseSize / (moduleCount + margin * 2)));
  const renderedSize = moduleSize * (moduleCount + margin * 2);

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${renderedSize}" height="${renderedSize}" viewBox="0 0 ${renderedSize} ${renderedSize}" role="img" aria-label="二维码">`,
  );
  parts.push('<rect width="100%" height="100%" fill="#ffffff"/>');
  parts.push('<g fill="#111827">');

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.isDark(row, col)) {
        const x = (margin + col) * moduleSize;
        const y = (margin + row) * moduleSize;
        parts.push(`<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" />`);
      }
    }
  }

  parts.push('</g>');
  parts.push('</svg>');
  return parts.join('');
}

function escapeXml(value: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return value.replace(/[&<>"']/g, (char) => map[char]);
}
