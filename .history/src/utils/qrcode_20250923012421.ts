import * as qrcodeLib from 'qrcode-generator';

export type ErrorCorrectLevel = 'L' | 'M' | 'Q' | 'H';

export class QRCode {
  private qr: qrcodeLib.QRCode;

  constructor(typeNumber: number, errorCorrectLevel: ErrorCorrectLevel) {
    const levelMap: Record<ErrorCorrectLevel, number> = {
      L: qrcodeLib.constants.errorCorrectionLevel.L,
      M: qrcodeLib.constants.errorCorrectionLevel.M,
      Q: qrcodeLib.constants.errorCorrectionLevel.Q,
      H: qrcodeLib.constants.errorCorrectionLevel.H,
    };
    this.qr = new qrcodeLib.QRCode(typeNumber, levelMap[errorCorrectLevel]);
  }

  public addData(data: string): void {
    this.qr.addData(data);
  }

  public make(): void {
    this.qr.make();
  }

  public getModuleCount(): number {
    return this.qr.getModuleCount();
  }

  public isDark(row: number, col: number): boolean {
    return this.qr.isDark(row, col);
  }
}
