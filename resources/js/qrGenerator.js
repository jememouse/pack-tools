"use strict";
(() => {
  // src/utils/qrcode.ts
  var EXP_TABLE = new Array(256);
  var LOG_TABLE = new Array(256);
  for (let i = 0; i < 8; i += 1) {
    EXP_TABLE[i] = 1 << i;
  }
  for (let i = 8; i < 256; i += 1) {
    EXP_TABLE[i] = EXP_TABLE[i - 4] ^ EXP_TABLE[i - 5] ^ EXP_TABLE[i - 6] ^ EXP_TABLE[i - 8];
  }
  for (let i = 0; i < 255; i += 1) {
    LOG_TABLE[EXP_TABLE[i]] = i;
  }
  function gexp(n) {
    return EXP_TABLE[(n % 255 + 255) % 255];
  }
  function glog(n) {
    if (n < 1) {
      throw new Error("glog(" + n + ")");
    }
    return LOG_TABLE[n];
  }
  var QRPolynomial = class _QRPolynomial {
    num;
    constructor(num, shift) {
      let offset = 0;
      while (offset < num.length && num[offset] === 0) {
        offset += 1;
      }
      this.num = new Array(num.length - offset + shift);
      for (let i = 0; i < num.length - offset; i += 1) {
        this.num[i] = num[i + offset];
      }
      for (let i = num.length - offset; i < this.num.length; i += 1) {
        this.num[i] = 0;
      }
    }
    get(index) {
      return this.num[index];
    }
    getLength() {
      return this.num.length;
    }
    multiply(e) {
      const num = new Array(this.getLength() + e.getLength() - 1).fill(0);
      for (let i = 0; i < this.getLength(); i += 1) {
        for (let j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= gexp(glog(this.get(i)) + glog(e.get(j)));
        }
      }
      return new _QRPolynomial(num, 0);
    }
    mod(e) {
      if (this.getLength() - e.getLength() < 0) {
        return this;
      }
      const ratio = glog(this.get(0)) - glog(e.get(0));
      const num = this.num.slice();
      for (let i = 0; i < e.getLength(); i += 1) {
        num[i] ^= gexp(glog(e.get(i)) + ratio);
      }
      return new _QRPolynomial(num, 0).mod(e);
    }
    static getErrorCorrectionPolynomial(errorCorrectLength) {
      let poly = new _QRPolynomial([1], 0);
      for (let i = 0; i < errorCorrectLength; i += 1) {
        poly = poly.multiply(new _QRPolynomial([1, gexp(i)], 0));
      }
      return poly;
    }
  };
  var QRBitBuffer = class {
    buffer = [];
    length = 0;
    getLengthInBits() {
      return this.length;
    }
    put(num, length) {
      for (let i = length - 1; i >= 0; i -= 1) {
        this.putBit((num >>> i & 1) === 1);
      }
    }
    putBit(bit) {
      const bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) {
        this.buffer.push(0);
      }
      if (bit) {
        this.buffer[bufIndex] |= 128 >>> this.length % 8;
      }
      this.length += 1;
    }
    getBuffer() {
      return this.buffer;
    }
  };
  var QRMode = {
    MODE_NUMBER: 1,
    MODE_ALPHA_NUM: 2,
    MODE_8BIT_BYTE: 4,
    MODE_KANJI: 8
  };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7
  };
  var ErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
  };
  var RS_BLOCK_TABLE = [
    // 1
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    // 2
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    // 3
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    // 4
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    // 5
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    // 6
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    // 7
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    // 8
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    // 9
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    // 10
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
    // 11
    [4, 101, 81],
    [1, 80, 50, 4, 81, 51],
    [4, 50, 22, 4, 51, 23],
    [3, 36, 12, 8, 37, 13],
    // 12
    [2, 116, 92, 2, 117, 93],
    [6, 58, 36, 2, 59, 37],
    [4, 46, 20, 6, 47, 21],
    [7, 42, 14, 4, 43, 15],
    // 13
    [4, 133, 107],
    [8, 59, 37, 1, 60, 38],
    [8, 44, 20, 4, 45, 21],
    [12, 33, 11, 4, 34, 12],
    // 14
    [3, 145, 115, 1, 146, 116],
    [4, 64, 40, 5, 65, 41],
    [11, 36, 16, 5, 37, 17],
    [11, 36, 12, 5, 37, 13],
    // 15
    [5, 109, 87, 1, 110, 88],
    [5, 65, 41, 5, 66, 42],
    [5, 54, 24, 7, 55, 25],
    [11, 36, 12, 7, 37, 13],
    // 16
    [5, 122, 98, 1, 123, 99],
    [7, 73, 45, 3, 74, 46],
    [15, 43, 19, 2, 44, 20],
    [3, 45, 15, 13, 46, 16],
    // 17
    [1, 135, 107, 5, 136, 108],
    [10, 74, 46, 1, 75, 47],
    [1, 50, 22, 15, 51, 23],
    [2, 42, 14, 17, 43, 15],
    // 18
    [5, 150, 120, 1, 151, 121],
    [9, 69, 43, 4, 70, 44],
    [17, 50, 22, 1, 51, 23],
    [2, 42, 14, 19, 43, 15],
    // 19
    [3, 141, 113, 4, 142, 114],
    [3, 70, 44, 11, 71, 45],
    [17, 47, 21, 4, 48, 22],
    [9, 39, 13, 16, 40, 14],
    // 20
    [3, 135, 107, 5, 136, 108],
    [3, 67, 41, 13, 68, 42],
    [15, 54, 24, 5, 55, 25],
    [15, 43, 15, 10, 44, 16]
  ];
  function getRSBlocks(typeNumber, errorCorrectionLevel) {
    const rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectionLevel];
    if (!rsBlock) {
      throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectionLevel:" + errorCorrectionLevel);
    }
    const list = [];
    let i = 0;
    while (i < rsBlock.length) {
      const count = rsBlock[i];
      const totalCount = rsBlock[i + 1];
      const dataCount = rsBlock[i + 2];
      i += 3;
      for (let j = 0; j < count; j += 1) {
        list.push({ totalCount, dataCount });
      }
    }
    return list;
  }
  var PATTERN_POSITION_TABLE = [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
    [6, 30, 54],
    [6, 32, 58],
    [6, 34, 62],
    [6, 26, 46, 66],
    [6, 26, 48, 70],
    [6, 26, 50, 74],
    [6, 30, 54, 78],
    [6, 30, 56, 82],
    [6, 30, 58, 86],
    [6, 34, 62, 90],
    [6, 28, 50, 72, 94],
    [6, 26, 50, 74, 98],
    [6, 30, 54, 78, 102],
    [6, 28, 54, 80, 106],
    [6, 32, 58, 84, 110],
    [6, 30, 58, 86, 114],
    [6, 34, 62, 90, 118],
    [6, 26, 50, 74, 98, 122],
    [6, 30, 54, 78, 102, 126],
    [6, 26, 52, 78, 104, 130],
    [6, 30, 56, 82, 108, 134],
    [6, 34, 60, 86, 112, 138],
    [6, 30, 58, 86, 114, 142],
    [6, 34, 62, 90, 118, 146],
    [6, 30, 54, 78, 102, 126, 150],
    [6, 24, 50, 76, 102, 128, 154],
    [6, 28, 54, 80, 106, 132, 158],
    [6, 32, 58, 84, 110, 136, 162],
    [6, 26, 54, 82, 110, 138, 166],
    [6, 30, 58, 86, 114, 142, 170]
  ];
  var QR8bitByte = class {
    mode = QRMode.MODE_8BIT_BYTE;
    data;
    constructor(data) {
      this.data = data;
    }
    getLength() {
      return this.data.length;
    }
    write(buffer) {
      for (let i = 0; i < this.data.length; i += 1) {
        buffer.put(this.data.charCodeAt(i), 8);
      }
    }
  };
  var BCH_POLY_INFO = 1335;
  var BCH_POLY_TYPE = 7973;
  function getBCHTypeInfo(data) {
    let d = data << 10;
    while (getBCHDigit(d) - getBCHDigit(BCH_POLY_INFO) >= 0) {
      d ^= BCH_POLY_INFO << getBCHDigit(d) - getBCHDigit(BCH_POLY_INFO);
    }
    return data << 10 | d;
  }
  function getBCHTypeNumber(data) {
    let d = data << 12;
    while (getBCHDigit(d) - getBCHDigit(BCH_POLY_TYPE) >= 0) {
      d ^= BCH_POLY_TYPE << getBCHDigit(d) - getBCHDigit(BCH_POLY_TYPE);
    }
    return data << 12 | d;
  }
  function getBCHDigit(data) {
    let digit = 0;
    while (data !== 0) {
      digit += 1;
      data >>>= 1;
    }
    return digit;
  }
  function getMask(maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 === 0;
      case QRMaskPattern.PATTERN001:
        return i % 2 === 0;
      case QRMaskPattern.PATTERN010:
        return j % 3 === 0;
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 === 0;
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
      case QRMaskPattern.PATTERN101:
        return i * j % 2 + i * j % 3 === 0;
      case QRMaskPattern.PATTERN110:
        return (i * j % 2 + i * j % 3) % 2 === 0;
      case QRMaskPattern.PATTERN111:
        return ((i + j) % 2 + i * j % 3) % 2 === 0;
      default:
        return false;
    }
  }
  function getBestMaskPattern(qr) {
    let minPenalty = Infinity;
    let bestPattern = 0;
    for (let i = 0; i < 8; i += 1) {
      qr.makeImpl(true, i);
      const penalty = qr.calculatePenalty();
      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestPattern = i;
      }
    }
    return bestPattern;
  }
  function getPatternPosition(typeNumber) {
    return PATTERN_POSITION_TABLE[typeNumber - 1] ?? [];
  }
  var QRCodeModel = class _QRCodeModel {
    typeNumber;
    errorCorrectionLevel;
    modules = [];
    moduleCount = 0;
    dataCache = null;
    dataList = [];
    constructor(typeNumber, errorCorrectionLevel) {
      this.typeNumber = typeNumber;
      this.errorCorrectionLevel = errorCorrectionLevel;
    }
    addData(data) {
      const newData = new QR8bitByte(data);
      this.dataList.push(newData);
      this.dataCache = null;
    }
    isDark(row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error("Invalid module coordinate");
      }
      return this.modules[row][col] === true;
    }
    getModuleCount() {
      return this.moduleCount;
    }
    make() {
      if (this.typeNumber < 1) {
        this.typeNumber = this.getMinimumTypeNumber();
      }
      this.makeImpl(false, getBestMaskPattern(this));
    }
    makeImpl(test, maskPattern) {
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount).fill(null).map(() => new Array(this.moduleCount).fill(null));
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.typeNumber >= 7) {
        this.setupTypeNumber(test);
      }
      if (this.dataCache == null) {
        this.dataCache = this.createData();
      }
      this.mapData(this.dataCache, maskPattern);
    }
    createData() {
      const buffer = new QRBitBuffer();
      for (const data of this.dataList) {
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), _QRCodeModel.getLengthInBits(data.mode, this.typeNumber));
        data.write(buffer);
      }
      const totalDataCount = this.getTotalDataCount();
      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw new Error("code length overflow.");
      }
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(false);
      }
      const paddingBytes = [236, 17];
      let i = 0;
      while (buffer.getLengthInBits() < totalDataCount * 8) {
        buffer.put(paddingBytes[i % 2], 8);
        i += 1;
      }
      return _QRCodeModel.createBytes(buffer, this.typeNumber, this.errorCorrectionLevel);
    }
    setupTypeNumber(test) {
      const bits = getBCHTypeNumber(this.typeNumber);
      for (let i = 0; i < 18; i += 1) {
        const mod = (bits >> i & 1) === 1;
        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    }
    setupTypeInfo(test, maskPattern) {
      const data = this.errorCorrectionLevel << 3 | maskPattern;
      const bits = getBCHTypeInfo(data);
      for (let i = 0; i < 15; i += 1) {
        const mod = (bits >> i & 1) === 1;
        if (i < 6) {
          this.modules[i][8] = mod;
        } else if (i < 8) {
          this.modules[i + 1][8] = mod;
        } else {
          this.modules[this.moduleCount - 15 + i][8] = mod;
        }
        if (i < 8) {
          this.modules[8][this.moduleCount - i - 1] = mod;
        } else {
          this.modules[8][14 - i] = mod;
        }
      }
      this.modules[this.moduleCount - 8][8] = true;
    }
    mapData(data, maskPattern) {
      let inc = -1;
      let row = this.moduleCount - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) {
          col -= 1;
        }
        for (; ; ) {
          for (let c = 0; c < 2; c += 1) {
            if (this.modules[row][col - c] === null) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              const mask = getMask(maskPattern, row, col - c);
              this.modules[row][col - c] = mask ? !dark : dark;
              bitIndex -= 1;
              if (bitIndex < 0) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    getTotalDataCount() {
      const rsBlock = getRSBlocks(this.typeNumber, this.errorCorrectionLevel);
      return rsBlock.reduce((sum, block) => sum + block.dataCount, 0);
    }
    setupPositionProbePattern(row, col) {
      for (let r = -1; r <= 7; r += 1) {
        if (row + r <= -1 || this.moduleCount <= row + r) {
          continue;
        }
        for (let c = -1; c <= 7; c += 1) {
          if (col + c <= -1 || this.moduleCount <= col + c) {
            continue;
          }
          if (0 <= r && r <= 6 && (c === 0 || c === 6) || 0 <= c && c <= 6 && (r === 0 || r === 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    }
    setupTimingPattern() {
      for (let r = 8; r < this.moduleCount - 8; r += 1) {
        if (this.modules[r][6] !== null) {
          continue;
        }
        this.modules[r][6] = r % 2 === 0;
      }
      for (let c = 8; c < this.moduleCount - 8; c += 1) {
        if (this.modules[6][c] !== null) {
          continue;
        }
        this.modules[6][c] = c % 2 === 0;
      }
    }
    setupPositionAdjustPattern() {
      const pos = getPatternPosition(this.typeNumber);
      for (let i = 0; i < pos.length; i += 1) {
        for (let j = 0; j < pos.length; j += 1) {
          const row = pos[i];
          const col = pos[j];
          if (this.modules[row]?.[col] !== null) {
            continue;
          }
          for (let r = -2; r <= 2; r += 1) {
            for (let c = -2; c <= 2; c += 1) {
              this.modules[row + r][col + c] = Math.max(Math.abs(r), Math.abs(c)) === 2 || r === 0 && c === 0;
            }
          }
        }
      }
    }
    calculatePenalty() {
      let penalty = 0;
      for (let row = 0; row < this.moduleCount; row += 1) {
        let sameCount = 1;
        let prevDark = this.modules[row][0];
        for (let col = 1; col < this.moduleCount; col += 1) {
          const dark = this.modules[row][col];
          if (dark === prevDark) {
            sameCount += 1;
          } else {
            if (sameCount >= 5) {
              penalty += 3 + (sameCount - 5);
            }
            prevDark = dark;
            sameCount = 1;
          }
        }
        if (sameCount >= 5) {
          penalty += 3 + (sameCount - 5);
        }
      }
      for (let col = 0; col < this.moduleCount; col += 1) {
        let sameCount = 1;
        let prevDark = this.modules[0][col];
        for (let row = 1; row < this.moduleCount; row += 1) {
          const dark = this.modules[row][col];
          if (dark === prevDark) {
            sameCount += 1;
          } else {
            if (sameCount >= 5) {
              penalty += 3 + (sameCount - 5);
            }
            prevDark = dark;
            sameCount = 1;
          }
        }
        if (sameCount >= 5) {
          penalty += 3 + (sameCount - 5);
        }
      }
      for (let row = 0; row < this.moduleCount - 1; row += 1) {
        for (let col = 0; col < this.moduleCount - 1; col += 1) {
          const count = (this.modules[row][col] ? 1 : 0) + (this.modules[row + 1][col] ? 1 : 0) + (this.modules[row][col + 1] ? 1 : 0) + (this.modules[row + 1][col + 1] ? 1 : 0);
          if (count === 0 || count === 4) {
            penalty += 3;
          }
        }
      }
      for (let row = 0; row < this.moduleCount; row += 1) {
        for (let col = 0; col < this.moduleCount - 10; col += 1) {
          if (this.modules[row][col] && !this.modules[row][col + 1] && this.modules[row][col + 2] && this.modules[row][col + 3] && this.modules[row][col + 4] && !this.modules[row][col + 5] && this.modules[row][col + 6] && !this.modules[row][col + 7] && !this.modules[row][col + 8] && !this.modules[row][col + 9] && !this.modules[row][col + 10]) {
            penalty += 40;
          }
        }
      }
      for (let col = 0; col < this.moduleCount; col += 1) {
        for (let row = 0; row < this.moduleCount - 10; row += 1) {
          if (this.modules[row][col] && !this.modules[row + 1][col] && this.modules[row + 2][col] && this.modules[row + 3][col] && this.modules[row + 4][col] && !this.modules[row + 5][col] && this.modules[row + 6][col] && !this.modules[row + 7][col] && !this.modules[row + 8][col] && !this.modules[row + 9][col] && !this.modules[row + 10][col]) {
            penalty += 40;
          }
        }
      }
      let darkCount = 0;
      for (let row = 0; row < this.moduleCount; row += 1) {
        for (let col = 0; col < this.moduleCount; col += 1) {
          if (this.modules[row][col]) {
            darkCount += 1;
          }
        }
      }
      const totalCount = this.moduleCount * this.moduleCount;
      const ratio = Math.abs(darkCount * 100 / totalCount - 50) / 5;
      penalty += ratio * 10;
      return penalty;
    }
    getMinimumTypeNumber() {
      for (let typeNumber = 1; typeNumber < 40; typeNumber += 1) {
        const rsBlocks = getRSBlocks(typeNumber, this.errorCorrectionLevel);
        const totalDataCount = rsBlocks.reduce((sum, block) => sum + block.dataCount, 0);
        const buffer = _QRCodeModel.createBuffer(this.dataList, typeNumber);
        if (buffer.getLengthInBits() <= totalDataCount * 8) {
          return typeNumber;
        }
      }
      throw new Error("Too long data");
    }
    static createBuffer(dataList, typeNumber) {
      const buffer = new QRBitBuffer();
      for (const data of dataList) {
        buffer.put(data.mode, 4);
        buffer.put(data.getLength(), _QRCodeModel.getLengthInBits(data.mode, typeNumber));
        data.write(buffer);
      }
      return buffer;
    }
    static getLengthInBits(mode, typeNumber) {
      if (typeNumber >= 1 && typeNumber < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            return 8;
        }
      } else if (typeNumber < 27) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 12;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 10;
          default:
            return 16;
        }
      } else {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 13;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            return 16;
        }
      }
    }
    static createBytes(buffer, typeNumber, errorCorrectionLevel) {
      let offset = 0;
      const rsBlocks = getRSBlocks(typeNumber, errorCorrectionLevel);
      const maxDcCount = Math.max(...rsBlocks.map((block) => block.dataCount));
      const maxEcCount = Math.max(...rsBlocks.map((block) => block.totalCount - block.dataCount));
      const totalCodeCount = rsBlocks.reduce((sum, block) => sum + block.totalCount, 0);
      const dcdata = rsBlocks.map((block) => new Array(block.dataCount).fill(0));
      const ecdata = rsBlocks.map((block) => new Array(block.totalCount - block.dataCount).fill(0));
      for (let r = 0; r < rsBlocks.length; r += 1) {
        const dcCount = rsBlocks[r].dataCount;
        for (let i = 0; i < dcCount; i += 1) {
          dcdata[r][i] = buffer.getBuffer()[offset + i] ?? 0;
        }
        offset += dcCount;
        const rsPoly = QRPolynomial.getErrorCorrectionPolynomial(ecdata[r].length);
        let rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
        rawPoly = rawPoly.mod(rsPoly);
        for (let i = 0; i < ecdata[r].length; i += 1) {
          const modIndex = rawPoly.getLength() - ecdata[r].length + i;
          ecdata[r][i] = modIndex >= 0 ? rawPoly.get(modIndex) : 0;
        }
      }
      const data = new Array(totalCodeCount);
      let index = 0;
      for (let i = 0; i < maxDcCount; i += 1) {
        for (let r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }
      for (let i = 0; i < maxEcCount; i += 1) {
        for (let r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }
      return data;
    }
  };
  var QRCode = class {
    model;
    constructor(typeNumber, errorCorrectionLevel) {
      this.model = new QRCodeModel(typeNumber, errorCorrectionLevel);
    }
    addData(data) {
      this.model.addData(data);
    }
    make() {
      this.model.make();
    }
    getModuleCount() {
      return this.model.getModuleCount();
    }
    isDark(row, col) {
      return this.model.isDark(row, col);
    }
  };

  // src/pages/qrGenerator.ts
  var DEFAULT_STATE = {
    text: "https://packaging-toolbox.site",
    errorCorrection: "L",
    size: 320,
    margin: 4,
    foreground: "#111827",
    background: "#ffffff",
    logoDataUrl: null,
    logoSizePercent: 18,
    logoPosition: "center",
    logoOriginalWidth: null,
    logoOriginalHeight: null
  };
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#qr-form");
    const textInput = document.querySelector("#qr-text");
    const ecSelect = document.querySelector("#qr-ec");
    const sizeInput = document.querySelector("#qr-size");
    const marginInput = document.querySelector("#qr-margin");
    const fgInput = document.querySelector("#qr-foreground");
    const bgInput = document.querySelector("#qr-background");
    const logoInput = document.querySelector("#qr-logo");
    const logoRemove = document.querySelector("#qr-logo-remove");
    const logoSizeRange = document.querySelector("#qr-logo-size");
    const logoPositionSelect = document.querySelector("#qr-logo-position");
    const preview = document.querySelector("[data-qr-preview]");
    const downloadPngButton = document.querySelector("[data-download-png]");
    const feedback = document.querySelector("[data-feedback]");
    const canvas = document.createElement("canvas");
    if (!form || !textInput || !ecSelect || !sizeInput || !marginInput || !fgInput || !bgInput || !logoInput || !logoRemove || !logoSizeRange || !logoPositionSelect || !preview || !downloadPngButton || !feedback) {
      return;
    }
    let state = { ...DEFAULT_STATE };
    let lastOutput = null;
    let lastPngDataUrl = "";
    const setFeedback = (message, tone = "default") => {
      feedback.textContent = message;
      feedback.style.color = tone === "error" ? "#dc2626" : tone === "success" ? "#047857" : "var(--slate-500)";
    };
    const toNumber = (value, fallback, min, max) => {
      const parsed = Number.parseFloat(value);
      if (!Number.isFinite(parsed)) {
        return fallback;
      }
      return Math.min(max, Math.max(min, parsed));
    };
    const applyStateToForm = (payload) => {
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
        errorCorrection: ecSelect.value ?? state.errorCorrection,
        size: toNumber(sizeInput.value, state.size, 160, 600),
        margin: toNumber(marginInput.value, state.margin, 0, 12),
        foreground: fgInput.value || DEFAULT_STATE.foreground,
        background: bgInput.value || DEFAULT_STATE.background,
        logoSizePercent: toNumber(logoSizeRange.value, state.logoSizePercent, 10, 30),
        logoPosition: logoPositionSelect.value ?? state.logoPosition,
        logoOriginalWidth: state.logoOriginalWidth,
        logoOriginalHeight: state.logoOriginalHeight
      };
      logoRemove.disabled = !state.logoDataUrl;
    };
    const validateLogoSize = (payload) => {
      if (!payload.logoDataUrl) {
        return null;
      }
      if ((payload.errorCorrection === "L" || payload.errorCorrection === "M") && payload.logoSizePercent > 22) {
        return "\u5F53\u524D\u5BB9\u9519\u7B49\u7EA7\u8F83\u4F4E\uFF0C\u5EFA\u8BAE\u5C06 Logo \u8C03\u81F3 22% \u4EE5\u4E0B\u6216\u63D0\u5347\u5BB9\u9519\u7B49\u7EA7\u3002";
      }
      return null;
    };
    const buildQrOutput = (payload) => {
      const qr = new QRCode(-1, ErrorCorrectLevel[payload.errorCorrection]);
      qr.addData(payload.text);
      qr.make();
      const moduleCount = qr.getModuleCount();
      const moduleSize = Math.max(1, Math.floor(payload.size / (moduleCount + payload.margin * 2)));
      const renderedSize = moduleSize * (moduleCount + payload.margin * 2);
      const parts = [];
      parts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${renderedSize}" height="${renderedSize}" viewBox="0 0 ${renderedSize} ${renderedSize}" role="img" aria-label="\u4E8C\u7EF4\u7801">`);
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
      parts.push("</g>");
      if (payload.logoDataUrl) {
        const baseWidth = payload.logoOriginalWidth ?? renderedSize * 0.2;
        const baseHeight = payload.logoOriginalHeight ?? renderedSize * 0.2;
        const maxLogoSize = payload.logoSizePercent / 100 * renderedSize;
        const ratio = Math.min(maxLogoSize / baseWidth, maxLogoSize / baseHeight);
        const drawWidth = baseWidth * ratio;
        const drawHeight = baseHeight * ratio;
        let x = (renderedSize - drawWidth) / 2;
        let y = (renderedSize - drawHeight) / 2;
        if (payload.logoPosition === "bottom-right") {
          const padding2 = renderedSize * 0.035;
          x = renderedSize - drawWidth - padding2;
          y = renderedSize - drawHeight - padding2;
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
      parts.push("</svg>");
      return { svg: parts.join(""), renderedSize };
    };
    const renderCanvas = async (output) => {
      const blob = new Blob([output.svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      await img.decode().catch(() => Promise.reject(new Error("\u4E8C\u7EF4\u7801\u56FE\u50CF\u89E3\u7801\u5931\u8D25")));
      canvas.width = output.renderedSize;
      canvas.height = output.renderedSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        throw new Error("Canvas \u521D\u59CB\u5316\u5931\u8D25\u3002");
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
        const dataUrl = canvas.toDataURL("image/png");
        preview.innerHTML = "";
        preview.insertAdjacentHTML("afterbegin", `<img src="${dataUrl}" alt="\u4E8C\u7EF4\u7801\u9884\u89C8" style="max-width:100%;height:auto;">`);
        lastPngDataUrl = dataUrl;
        downloadPngButton.disabled = false;
        const warning = validateLogoSize(state);
        if (warning) {
          setFeedback(warning, "error");
        } else {
          setFeedback("\u4E8C\u7EF4\u7801\u5DF2\u66F4\u65B0\uFF0C\u53EF\u4E0B\u8F7D PNG \u6587\u4EF6\u3002", "success");
        }
      } catch (error) {
        preview.innerHTML = '<p class="hint">\u4E8C\u7EF4\u7801\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u8F93\u5165\u5185\u5BB9\u3002</p>';
        lastPngDataUrl = "";
        downloadPngButton.disabled = true;
        setFeedback(error instanceof Error ? error.message : "\u4E8C\u7EF4\u7801\u751F\u6210\u5931\u8D25\u3002", "error");
      }
    };
    const handleLogoUpload = () => {
      const file = logoInput.files && logoInput.files[0];
      if (!file) {
        return;
      }
      if (!/^image\/(png|jpeg|svg\+xml)$/.test(file.type)) {
        setFeedback("\u4EC5\u652F\u6301 PNG\u3001JPG \u6216 SVG \u56FE\u7247\u4F5C\u4E3A Logo\u3002", "error");
        logoInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : null;
        if (!result) {
          setFeedback("Logo \u8BFB\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002", "error");
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
          setFeedback("Logo \u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u66F4\u6362\u6587\u4EF6\u3002", "error");
        };
        img.src = result;
      };
      reader.onerror = () => {
        setFeedback("Logo \u8BFB\u53D6\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002", "error");
      };
      reader.readAsDataURL(file);
    };
    form.addEventListener("input", () => {
      updateStateFromForm();
      void render();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateStateFromForm();
      void render();
    });
    logoSizeRange.addEventListener("input", () => {
      updateStateFromForm();
      void render();
    });
    logoInput.addEventListener("change", () => {
      void handleLogoUpload();
    });
    logoRemove.addEventListener("click", (event) => {
      event.preventDefault();
      state.logoDataUrl = null;
      state.logoOriginalWidth = null;
      state.logoOriginalHeight = null;
      logoInput.value = "";
      logoRemove.disabled = true;
      void render();
    });
    logoPositionSelect.addEventListener("change", () => {
      updateStateFromForm();
      void render();
    });
    downloadPngButton.addEventListener("click", async () => {
      try {
        const output = lastOutput ?? buildQrOutput(state);
        if (!lastOutput) {
          await renderCanvas(output);
        }
        await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error("PNG \u5BFC\u51FA\u5931\u8D25\u3002"));
              return;
            }
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `qr-${Date.now()}.png`;
            document.body.append(anchor);
            anchor.click();
            anchor.remove();
            URL.revokeObjectURL(url);
            resolve();
          }, "image/png");
        });
        setFeedback("\u5DF2\u4E0B\u8F7D PNG \u6587\u4EF6\u3002", "success");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "PNG \u5BFC\u51FA\u5931\u8D25\u3002", "error");
      }
    });
    applyStateToForm(state);
    void render();
  });
})();
