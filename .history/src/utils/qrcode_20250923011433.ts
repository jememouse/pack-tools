import QRCode from 'qrcode';

export type ErrorCorrectLevel = 'L' | 'M' | 'Q' | 'H';

export class QRCode {
  private static instance: QRCode;

  private constructor() {}

  public static getInstance(): QRCode {
    if (!QRCode.instance) {
      QRCode.instance = new QRCode();
    }
    return QRCode.instance;
  }

  public async generateSvg(text: string, options: {
    errorCorrectionLevel?: ErrorCorrectLevel;
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }): Promise<string> {
    const {
      errorCorrectionLevel = 'M',
      width = 320,
      margin = 4,
      color = { dark: '#000000', light: '#ffffff' }
    } = options;

    const qrOptions = {
      errorCorrectionLevel,
      width,
      margin,
      color: {
        dark: color.dark,
        light: color.light
      },
      type: 'svg'
    };

    return QRCode.toSvg(text, qrOptions);
  }

  public async generateCanvas(text: string, options: {
    errorCorrectionLevel?: ErrorCorrectLevel;
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }): Promise<HTMLCanvasElement> {
    const {
      errorCorrectionLevel = 'M',
      width = 320,
      margin = 4,
      color = { dark: '#000000', light: '#ffffff' }
    } = options;

    const qrOptions = {
      errorCorrectionLevel,
      width,
      margin,
      color: {
        dark: color.dark,
        light: color.light
      },
      type: 'canvas'
    };

    return QRCode.toCanvas(document.createElement('canvas'), text, qrOptions);
  }
}
