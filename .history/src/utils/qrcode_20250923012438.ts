import qrcode from 'qrcode-generator';

export type ErrorCorrectLevel = 'L' | 'M' | 'Q' | 'H';

export class QRCode {
  private qr: any;

  constructor(typeNumber: number, errorCorrectLevel: ErrorCorrectLevel) {
    this.qr = qrcode(typeNumber, errorCorrectLevel);
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
