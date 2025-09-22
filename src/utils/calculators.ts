const numberFormatter = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function safeNumber(value: string | null, fallback = 0): number {
  if (value == null || value === '') {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return '--';
  }
  return numberFormatter.format(value);
}

export interface LogisticsInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightKg: number;
  distanceKm: number;
  baseFee: number;
  weightRate: number;
  distanceRate: number;
  volumetricDivisor: number;
  fuelSurchargePercent: number;
  remoteAreaFee: number;
  fragile: boolean;
}

export interface LogisticsResult {
  volumetricWeight: number;
  chargeableWeight: number;
  weightCharge: number;
  distanceCharge: number;
  baseFee: number;
  baseSubtotal: number;
  fuelSurcharge: number;
  remoteAreaFee: number;
  subtotalBeforeFragile: number;
  fragileMultiplier: number;
  totalCost: number;
}

export function calculateLogisticsCost(input: LogisticsInput): LogisticsResult {
  const length = Math.max(0, input.lengthCm);
  const width = Math.max(0, input.widthCm);
  const height = Math.max(0, input.heightCm);
  const weight = Math.max(0, input.weightKg);
  const distance = Math.max(0, input.distanceKm);
  const baseFee = Math.max(0, input.baseFee);
  const weightRate = Math.max(0, input.weightRate);
  const distanceRate = Math.max(0, input.distanceRate);
  const volumetricDivisor = Math.max(1, input.volumetricDivisor || 6000);
  const fuelRatePercent = Math.max(0, input.fuelSurchargePercent);
  const remoteAreaFee = Math.max(0, input.remoteAreaFee);

  const volumetricWeight = (length * width * height) / volumetricDivisor;
  const chargeableWeight = Math.max(weight, volumetricWeight);
  const weightCharge = chargeableWeight * weightRate;
  const distanceCharge = (distance / 100) * distanceRate;
  const baseSubtotal = baseFee + weightCharge + distanceCharge;
  const fuelSurcharge = (baseSubtotal * fuelRatePercent) / 100;
  const subtotalBeforeFragile = baseSubtotal + fuelSurcharge + remoteAreaFee;
  const fragileMultiplier = input.fragile ? 1.12 : 1;
  const totalCost = subtotalBeforeFragile * fragileMultiplier;

  return {
    volumetricWeight,
    chargeableWeight,
    weightCharge,
    distanceCharge,
    baseFee,
    baseSubtotal,
    fuelSurcharge,
    remoteAreaFee,
    subtotalBeforeFragile,
    fragileMultiplier,
    totalCost,
  };
}

export const USD_EXCHANGE_RATE = 7.1;

type PaperCurrency = 'CNY' | 'USD';

export interface PaperInput {
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  glueAllowanceMm: number;
  paperGsm: number;
  pricePerTon: number;
  wasteRatePercent: number;
  currency: PaperCurrency;
}

export interface PaperResult {
  areaSquareMeters: number;
  areaWithWasteSquareMeters: number;
  weightKg: number;
  weightGrams: number;
  cost: number;
  costPerThousand: number;
  unitsPerTon: number;
  currency: PaperCurrency;
}

export interface PaperCalculationOptions {
  usdExchangeRate?: number;
}

export function calculatePaperUsage(
  input: PaperInput,
  options: PaperCalculationOptions = {},
): PaperResult {
  const length = Math.max(0, input.lengthMm) / 1000;
  const width = Math.max(0, input.widthMm) / 1000;
  const height = Math.max(0, input.heightMm) / 1000;
  const allowance = Math.max(0, input.glueAllowanceMm) / 1000;
  const gsm = Math.max(0, input.paperGsm);
  const pricePerTon = Math.max(0, input.pricePerTon);
  const wasteRate = Math.max(0, input.wasteRatePercent);
  const currency = input.currency;

  const unfoldedArea = Math.max(
    0,
    2 * (length * width + length * height + width * height) + allowance * (length + width),
  );
  const areaWithWaste = unfoldedArea * (1 + wasteRate / 100);
  const weightKg = (areaWithWaste * gsm) / 1000;
  const costBase = (weightKg / 1000) * pricePerTon;
  const usdRate = options.usdExchangeRate ?? USD_EXCHANGE_RATE;
  const cost = currency === 'USD' && usdRate > 0 ? costBase / usdRate : costBase;
  const weightGrams = weightKg * 1000;
  const unitsPerTon = weightKg > 0 ? 1000 / weightKg : 0;
  const costPerThousand = cost * 1000;

  return {
    areaSquareMeters: unfoldedArea,
    areaWithWasteSquareMeters: areaWithWaste,
    weightKg,
    weightGrams,
    cost,
    costPerThousand,
    unitsPerTon,
    currency,
  };
}

export interface PalletInput {
  cartonLengthMm: number;
  cartonWidthMm: number;
  cartonHeightMm: number;
  palletLengthMm: number;
  palletWidthMm: number;
  palletMaxHeightMm: number;
}

export interface PalletOrientation {
  perLayer: number;
  columns: number;
  rows: number;
  footprintUtilisation: number;
  label: string;
}

export interface PalletResult {
  bestOrientation: PalletOrientation;
  layers: number;
  totalQuantity: number;
  heightUtilisation: number;
  orientations: PalletOrientation[];
}

function evaluateOrientation(
  palletLength: number,
  palletWidth: number,
  cartonLength: number,
  cartonWidth: number,
  label: string,
): PalletOrientation {
  const columns = Math.floor(palletLength / cartonLength);
  const rows = Math.floor(palletWidth / cartonWidth);
  const perLayer = Math.max(0, columns * rows);
  const footprintUtilisation = perLayer === 0
    ? 0
    : Math.min(100, ((perLayer * cartonLength * cartonWidth) / (palletLength * palletWidth)) * 100);

  return {
    perLayer,
    columns,
    rows,
    footprintUtilisation,
    label,
  };
}

export function calculatePalletPlan(input: PalletInput): PalletResult {
  const cartonLength = Math.max(0, input.cartonLengthMm);
  const cartonWidth = Math.max(0, input.cartonWidthMm);
  const cartonHeight = Math.max(0, input.cartonHeightMm);
  const palletLength = Math.max(0, input.palletLengthMm);
  const palletWidth = Math.max(0, input.palletWidthMm);
  const palletMaxHeight = Math.max(0, input.palletMaxHeightMm);

  const orientationA = evaluateOrientation(
    palletLength,
    palletWidth,
    cartonLength,
    cartonWidth,
    '长边朝向托盘长边摆放',
  );
  const orientationB = evaluateOrientation(
    palletLength,
    palletWidth,
    cartonWidth,
    cartonLength,
    '长边朝向托盘宽边摆放',
  );

  const orientations = [orientationA, orientationB];
  const bestOrientation = orientations.reduce((best, current) => {
    if (current.perLayer > best.perLayer) {
      return current;
    }
    if (current.perLayer === best.perLayer && current.footprintUtilisation > best.footprintUtilisation) {
      return current;
    }
    return best;
  });

  const layers = cartonHeight > 0 ? Math.max(0, Math.floor(palletMaxHeight / cartonHeight)) : 0;
  const totalQuantity = bestOrientation.perLayer * layers;
  const heightUtilisation = palletMaxHeight > 0
    ? Math.min(100, (layers * cartonHeight) / palletMaxHeight * 100)
    : 0;

  return {
    bestOrientation,
    layers,
    totalQuantity,
    heightUtilisation,
    orientations,
  };
}

export function initLogisticsCalculator(): void {
  const form = document.querySelector<HTMLFormElement>('#logistics-form');
  if (!form) {
    return;
  }
  if (form.dataset.initialised === 'true') {
    return;
  }

  const volumetricEl = document.querySelector<HTMLElement>('[data-logistics-volumetric]');
  const chargeableEl = document.querySelector<HTMLElement>('[data-logistics-chargeable]');
  const weightChargeEl = document.querySelector<HTMLElement>('[data-logistics-weight-charge]');
  const distanceEl = document.querySelector<HTMLElement>('[data-logistics-distance]');
  const fuelEl = document.querySelector<HTMLElement>('[data-logistics-fuel]');
  const remoteEl = document.querySelector<HTMLElement>('[data-logistics-remote]');
  const baseFeeEl = document.querySelector<HTMLElement>('[data-logistics-base-fee]');
  const baseSubtotalEl = document.querySelector<HTMLElement>('[data-logistics-subtotal-base]');
  const subtotalEl = document.querySelector<HTMLElement>('[data-logistics-subtotal]');
  const totalEl = document.querySelector<HTMLElement>('[data-logistics-total]');
  const summaryEl = document.querySelector<HTMLElement>('[data-logistics-summary]');
  const exportButtons = document.querySelectorAll<HTMLButtonElement>('[data-logistics-export]');
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('[data-logistics-copy]');

  if (
    !volumetricEl ||
    !chargeableEl ||
    !weightChargeEl ||
    !distanceEl ||
    !fuelEl ||
    !remoteEl ||
    !baseFeeEl ||
    !baseSubtotalEl ||
    !subtotalEl ||
    !totalEl ||
    !summaryEl
  ) {
    return;
  }

  let lastLogisticsResult: LogisticsResult | null = null;
  let lastSummary = '';
  let summaryResetTimer: number | null = null;

  const scheduleSummaryReset = (message: string) => {
    if (summaryResetTimer != null) {
      globalThis.clearTimeout(summaryResetTimer);
      summaryResetTimer = null;
    }
    const fallback = lastSummary || summaryEl.textContent || '';
    summaryEl.textContent = message;
    summaryResetTimer = globalThis.setTimeout(() => {
      summaryEl.textContent = lastSummary || fallback;
      summaryResetTimer = null;
    }, 2200);
  };

  const buildCsv = (result: LogisticsResult, summaryText: string): string => {
    const rows: Array<[string, string, string]> = [
      ['字段', '数值', '附注'],
      ['起步价 (元)', formatNumber(result.baseFee), '固定费用'],
      ['体积重 (kg)', formatNumber(result.volumetricWeight), '按选定换算系数计算'],
      ['计费重量 (kg)', formatNumber(result.chargeableWeight), '取体积重与实际重量最大值'],
      ['计费重量费用 (元)', formatNumber(result.weightCharge), '计费重量 × 单价'],
      ['距离费用 (元)', formatNumber(result.distanceCharge), '运输距离/100 × 单价'],
      ['燃油附加费 (元)', formatNumber(result.fuelSurcharge), result.fuelSurcharge > 0 ? '按基础小计 × 百分比' : '无'],
      ['偏远附加费 (元)', formatNumber(result.remoteAreaFee), result.remoteAreaFee > 0 ? '偏远地区固定费用' : '无'],
      ['基础费用小计 (元)', formatNumber(result.baseSubtotal), '起步价 + 重量费 + 距离费'],
      ['附加费后小计 (元)', formatNumber(result.subtotalBeforeFragile), '基础小计 + 附加费'],
      ['易碎品系数', formatNumber(result.fragileMultiplier), result.fragileMultiplier > 1 ? '已启用易碎品安全系数' : '未启用'],
      ['总费用 (元)', formatNumber(result.totalCost), '最终计费金额'],
    ];
    if (summaryText) {
      rows.push(['结果说明', summaryText, '']);
    }
    return rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const buildTextReport = (result: LogisticsResult, summaryText: string): string => {
    const lines: string[] = [
      '物流成本计算结果',
      '------------------------------',
      `起步价：${formatNumber(result.baseFee)} 元`,
      `体积重：${formatNumber(result.volumetricWeight)} kg`,
      `计费重量：${formatNumber(result.chargeableWeight)} kg`,
      `计费重量费用：${formatNumber(result.weightCharge)} 元`,
      `距离费用：${formatNumber(result.distanceCharge)} 元`,
      `燃油附加费：${formatNumber(result.fuelSurcharge)} 元`,
      `偏远附加费：${formatNumber(result.remoteAreaFee)} 元`,
      `基础费用小计：${formatNumber(result.baseSubtotal)} 元`,
      `附加费后小计：${formatNumber(result.subtotalBeforeFragile)} 元`,
      `易碎品系数：${formatNumber(result.fragileMultiplier)}`,
      `总费用：${formatNumber(result.totalCost)} 元`,
    ];
    if (summaryText) {
      lines.push('', summaryText);
    }
    return lines.join('\n');
  };

  const handleExport = () => {
    if (!lastLogisticsResult) {
      scheduleSummaryReset('请先输入参数并完成计算。');
      return;
    }
    const csvContent = buildCsv(lastLogisticsResult, lastSummary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `logistics-cost-${Date.now()}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    scheduleSummaryReset('CSV 已导出，若未下载请检查浏览器权限。');
  };

  const handleCopy = async () => {
    if (!lastLogisticsResult) {
      scheduleSummaryReset('请先输入参数并完成计算。');
      return;
    }
    const textReport = buildTextReport(lastLogisticsResult, lastSummary);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textReport);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textReport;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      scheduleSummaryReset('结果已复制到剪贴板。');
    } catch (error) {
      console.error('Failed to copy logistics result:', error);
      scheduleSummaryReset('复制失败，请手动选择文本。');
    }
  };

  const calculate = () => {
    const result = calculateLogisticsCost({
      lengthCm: Math.max(0, safeNumber((form.elements.namedItem('lengthCm') as HTMLInputElement | null)?.value)),
      widthCm: Math.max(0, safeNumber((form.elements.namedItem('widthCm') as HTMLInputElement | null)?.value)),
      heightCm: Math.max(0, safeNumber((form.elements.namedItem('heightCm') as HTMLInputElement | null)?.value)),
      weightKg: Math.max(0, safeNumber((form.elements.namedItem('weightKg') as HTMLInputElement | null)?.value)),
      distanceKm: Math.max(0, safeNumber((form.elements.namedItem('distanceKm') as HTMLInputElement | null)?.value)),
      baseFee: Math.max(0, safeNumber((form.elements.namedItem('baseFee') as HTMLInputElement | null)?.value)),
      weightRate: Math.max(0, safeNumber((form.elements.namedItem('weightRate') as HTMLInputElement | null)?.value)),
      distanceRate: Math.max(0, safeNumber((form.elements.namedItem('distanceRate') as HTMLInputElement | null)?.value)),
      volumetricDivisor: Math.max(1, safeNumber((form.elements.namedItem('volumetricDivisor') as HTMLSelectElement | null)?.value, 6000)),
      fuelSurchargePercent: Math.max(0, safeNumber((form.elements.namedItem('fuelSurcharge') as HTMLInputElement | null)?.value)),
      remoteAreaFee: Math.max(0, safeNumber((form.elements.namedItem('remoteFee') as HTMLInputElement | null)?.value)),
      fragile: Boolean((form.elements.namedItem('fragile') as HTMLInputElement | null)?.checked),
    });

    volumetricEl.textContent = formatNumber(result.volumetricWeight);
    chargeableEl.textContent = formatNumber(result.chargeableWeight);
    weightChargeEl.textContent = formatNumber(result.weightCharge);
    distanceEl.textContent = formatNumber(result.distanceCharge);
    fuelEl.textContent = formatNumber(result.fuelSurcharge);
    remoteEl.textContent = formatNumber(result.remoteAreaFee);
    baseFeeEl.textContent = formatNumber(result.baseFee);
    baseSubtotalEl.textContent = formatNumber(result.baseSubtotal);
    subtotalEl.textContent = formatNumber(result.subtotalBeforeFragile);
    totalEl.textContent = formatNumber(result.totalCost);

    const parts: string[] = [];
    parts.push(`计费重量费用 ${formatNumber(result.weightCharge)} 元`);
    parts.push(`距离费用 ${formatNumber(result.distanceCharge)} 元`);
    if (result.fuelSurcharge > 0) {
      parts.push(`燃油附加 ${formatNumber(result.fuelSurcharge)} 元`);
    }
    if (result.remoteAreaFee > 0) {
      parts.push(`偏远附加 ${formatNumber(result.remoteAreaFee)} 元`);
    }
    if (result.fragileMultiplier > 1) {
      parts.push('已包含易碎品安全系数');
    }
    const summaryText = `总费用约 ${formatNumber(result.totalCost)} 元，其中 ${parts.join('，')}。`;
    if (summaryResetTimer != null) {
      globalThis.clearTimeout(summaryResetTimer);
      summaryResetTimer = null;
    }
    summaryEl.textContent = summaryText;
    lastSummary = summaryText;
    lastLogisticsResult = result;
  };

  form.addEventListener('input', calculate);
  form.addEventListener('change', calculate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  exportButtons.forEach((button) => {
    button.addEventListener('click', handleExport);
  });

  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      void handleCopy();
    });
  });

  form.dataset.initialised = 'true';

  calculate();
}

export function initPaperCalculator(): void {
  const form = document.querySelector<HTMLFormElement>('#paper-form');
  if (!form) {
    return;
  }
  if (form.dataset.initialised === 'true') {
    return;
  }

  const areaEl = document.querySelector<HTMLElement>('[data-paper-area]');
  const areaLossEl = document.querySelector<HTMLElement>('[data-paper-area-loss]');
  const weightEl = document.querySelector<HTMLElement>('[data-paper-weight]');
  const weightGramsEl = document.querySelector<HTMLElement>('[data-paper-weight-grams]');
  const yieldEl = document.querySelector<HTMLElement>('[data-paper-yield]');
  const costEl = document.querySelector<HTMLElement>('[data-paper-cost]');
  const thousandEl = document.querySelector<HTMLElement>('[data-paper-thousand]');
  const summaryEl = document.querySelector<HTMLElement>('[data-paper-summary]');
  const exportButtons = document.querySelectorAll<HTMLButtonElement>('[data-paper-export]');
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('[data-paper-copy]');

  if (
    !areaEl ||
    !areaLossEl ||
    !weightEl ||
    !weightGramsEl ||
    !yieldEl ||
    !costEl ||
    !thousandEl ||
    !summaryEl
  ) {
    return;
  }

  let lastPaperResult: PaperResult | null = null;
  let lastSummary = '';
  let summaryResetTimer: number | null = null;

  const scheduleSummaryReset = (message: string) => {
    if (summaryResetTimer != null) {
      globalThis.clearTimeout(summaryResetTimer);
      summaryResetTimer = null;
    }
    const fallback = lastSummary || summaryEl.textContent || '';
    summaryEl.textContent = message;
    summaryResetTimer = globalThis.setTimeout(() => {
      summaryEl.textContent = lastSummary || fallback;
      summaryResetTimer = null;
    }, 2200);
  };

  const buildCsv = (result: PaperResult, summaryText: string): string => {
    const rows: Array<[string, string, string]> = [
      ['字段', '数值', '附注'],
      ['单箱展开面积 (m²)', formatNumber(result.areaSquareMeters), '未计损耗'],
      ['损耗后面积 (m²)', formatNumber(result.areaWithWasteSquareMeters), '含损耗系数'],
      ['单箱重量 (kg)', formatNumber(result.weightKg), '折算克重'],
      ['单箱重量 (g)', formatNumber(result.weightGrams), '便于工艺沟通'],
      ['吨纸可生产数量 (个)', formatNumber(result.unitsPerTon), '1000kg / 单箱重量'],
      ['单箱材料成本', `${formatNumber(result.cost)} ${result.currency}`, '含损耗'],
      ['千箱材料成本', `${formatNumber(result.costPerThousand)} ${result.currency}`, '用于批量估算'],
    ];
    if (summaryText) {
      rows.push(['结果说明', summaryText, '']);
    }
    return rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const buildTextReport = (result: PaperResult, summaryText: string): string => {
    const lines: string[] = [
      '纸张用量与成本计算结果',
      '------------------------------',
      `单箱展开面积：${formatNumber(result.areaSquareMeters)} m²`,
      `损耗后面积：${formatNumber(result.areaWithWasteSquareMeters)} m²`,
      `单箱重量：${formatNumber(result.weightKg)} kg (${formatNumber(result.weightGrams)} g)`,
      `吨纸可生产数量：${formatNumber(result.unitsPerTon)} 个`,
      `单箱材料成本：${formatNumber(result.cost)} ${result.currency}`,
      `千箱材料成本：${formatNumber(result.costPerThousand)} ${result.currency}`,
    ];
    if (summaryText) {
      lines.push('', summaryText);
    }
    return lines.join('\n');
  };

  const handleExport = () => {
    if (!lastPaperResult) {
      scheduleSummaryReset('请先完成计算。');
      return;
    }
    const csvContent = buildCsv(lastPaperResult, lastSummary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `paper-usage-${Date.now()}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    scheduleSummaryReset('CSV 已导出，可在下载目录查看。');
  };

  const handleCopy = async () => {
    if (!lastPaperResult) {
      scheduleSummaryReset('请先完成计算。');
      return;
    }
    const report = buildTextReport(lastPaperResult, lastSummary);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(report);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = report;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      scheduleSummaryReset('结果已复制到剪贴板。');
    } catch (error) {
      console.error('Failed to copy paper calculation:', error);
      scheduleSummaryReset('复制失败，请手动选择文本。');
    }
  };

  const calculate = () => {
    const currency = (form.elements.namedItem('currency') as HTMLSelectElement | null)?.value as PaperCurrency | undefined;
    const result = calculatePaperUsage({
      lengthMm: Math.max(0, safeNumber((form.elements.namedItem('boxLength') as HTMLInputElement | null)?.value)),
      widthMm: Math.max(0, safeNumber((form.elements.namedItem('boxWidth') as HTMLInputElement | null)?.value)),
      heightMm: Math.max(0, safeNumber((form.elements.namedItem('boxHeight') as HTMLInputElement | null)?.value)),
      glueAllowanceMm: Math.max(0, safeNumber((form.elements.namedItem('glueAllowance') as HTMLInputElement | null)?.value)),
      paperGsm: Math.max(0, safeNumber((form.elements.namedItem('paperGsm') as HTMLInputElement | null)?.value, 1)),
      pricePerTon: Math.max(0, safeNumber((form.elements.namedItem('pricePerTon') as HTMLInputElement | null)?.value)),
      wasteRatePercent: Math.max(0, safeNumber((form.elements.namedItem('wasteRate') as HTMLInputElement | null)?.value)),
      currency: currency === 'USD' ? 'USD' : 'CNY',
    });

    areaEl.textContent = formatNumber(result.areaSquareMeters);
    areaLossEl.textContent = formatNumber(result.areaWithWasteSquareMeters);
    weightEl.textContent = formatNumber(result.weightKg);
    weightGramsEl.textContent = formatNumber(result.weightGrams);
    yieldEl.textContent = formatNumber(result.unitsPerTon);
    costEl.textContent = `${formatNumber(result.cost)} ${result.currency}`;
    thousandEl.textContent = `${formatNumber(result.costPerThousand)} ${result.currency}`;

    const summaryText = `单箱约 ${formatNumber(result.weightGrams)} g，吨纸可生产约 ${formatNumber(result.unitsPerTon)} 个，材料成本 ${formatNumber(result.cost)} ${result.currency}。`;
    if (summaryResetTimer != null) {
      globalThis.clearTimeout(summaryResetTimer);
      summaryResetTimer = null;
    }
    summaryEl.textContent = summaryText;
    lastSummary = summaryText;
    lastPaperResult = result;
  };

  form.addEventListener('input', calculate);
  form.addEventListener('change', calculate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  exportButtons.forEach((button) => button.addEventListener('click', handleExport));
  copyButtons.forEach((button) => button.addEventListener('click', () => { void handleCopy(); }));

  document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const preset = button.dataset.preset;
      const lengthInput = form.elements.namedItem('boxLength') as HTMLInputElement | null;
      const widthInput = form.elements.namedItem('boxWidth') as HTMLInputElement | null;
      const heightInput = form.elements.namedItem('boxHeight') as HTMLInputElement | null;
      const glueInput = form.elements.namedItem('glueAllowance') as HTMLInputElement | null;
      const gsmInput = form.elements.namedItem('paperGsm') as HTMLInputElement | null;
      const wasteInput = form.elements.namedItem('wasteRate') as HTMLInputElement | null;
      const priceInput = form.elements.namedItem('pricePerTon') as HTMLInputElement | null;
      if (preset === 'rigid') {
        if (lengthInput) lengthInput.value = '240';
        if (widthInput) widthInput.value = '180';
        if (heightInput) heightInput.value = '90';
        if (glueInput) glueInput.value = '30';
        if (gsmInput) gsmInput.value = '400';
        if (wasteInput) wasteInput.value = '3';
        if (priceInput) priceInput.value = '7200';
      } else if (preset === 'mailer') {
        if (lengthInput) lengthInput.value = '320';
        if (widthInput) widthInput.value = '230';
        if (heightInput) heightInput.value = '60';
        if (glueInput) glueInput.value = '25';
        if (gsmInput) gsmInput.value = '300';
        if (wasteInput) wasteInput.value = '2';
        if (priceInput) priceInput.value = '5200';
      } else if (preset === 'shipper') {
        if (lengthInput) lengthInput.value = '450';
        if (widthInput) widthInput.value = '300';
        if (heightInput) heightInput.value = '250';
        if (glueInput) glueInput.value = '35';
        if (gsmInput) gsmInput.value = '250';
        if (wasteInput) wasteInput.value = '1.5';
        if (priceInput) priceInput.value = '4200';
      }
      calculate();
    });
  });

  form.dataset.initialised = 'true';
  calculate();
}

export function initPalletPlanner(): void {
  const form = document.querySelector<HTMLFormElement>('#pallet-form');
  const orientationEl = document.querySelector<HTMLElement>('[data-pallet-orientation]');
  const perLayerEl = document.querySelector<HTMLElement>('[data-pallet-per-layer]');
  const layersEl = document.querySelector<HTMLElement>('[data-pallet-layers]');
  const totalEl = document.querySelector<HTMLElement>('[data-pallet-total]');
  const footprintEl = document.querySelector<HTMLElement>('[data-pallet-footprint]');
  const heightEl = document.querySelector<HTMLElement>('[data-pallet-height]');

  if (!form || !orientationEl || !perLayerEl || !layersEl || !totalEl || !footprintEl || !heightEl) {
    return;
  }

  const calculate = () => {
    const result = calculatePalletPlan({
      cartonLengthMm: Math.max(0, safeNumber((form.elements.namedItem('cartonLength') as HTMLInputElement | null)?.value)),
      cartonWidthMm: Math.max(0, safeNumber((form.elements.namedItem('cartonWidth') as HTMLInputElement | null)?.value)),
      cartonHeightMm: Math.max(0, safeNumber((form.elements.namedItem('cartonHeight') as HTMLInputElement | null)?.value)),
      palletLengthMm: Math.max(0, safeNumber((form.elements.namedItem('palletLength') as HTMLInputElement | null)?.value)),
      palletWidthMm: Math.max(0, safeNumber((form.elements.namedItem('palletWidth') as HTMLInputElement | null)?.value)),
      palletMaxHeightMm: Math.max(0, safeNumber((form.elements.namedItem('palletMaxHeight') as HTMLInputElement | null)?.value)),
    });

    const { bestOrientation } = result;

    orientationEl.textContent = bestOrientation.perLayer > 0
      ? `${bestOrientation.label}：${bestOrientation.columns} × ${bestOrientation.rows}`
      : '当前尺寸无法布置于托盘，请检查输入参数。';
    perLayerEl.textContent = formatNumber(bestOrientation.perLayer);
    layersEl.textContent = formatNumber(result.layers);
    totalEl.textContent = formatNumber(result.totalQuantity);
    footprintEl.textContent = formatNumber(bestOrientation.footprintUtilisation);
    heightEl.textContent = formatNumber(result.heightUtilisation);
  };

  form.addEventListener('input', calculate);
  form.addEventListener('change', calculate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculate();
  });

  calculate();
}
