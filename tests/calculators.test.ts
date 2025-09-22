import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateLogisticsCost,
  calculatePaperUsage,
  calculatePalletPlan,
  USD_EXCHANGE_RATE,
  type LogisticsInput,
  type PaperInput,
  type PalletInput,
} from '../src/utils/calculators.ts';

test('calculateLogisticsCost applies volumetric weight and fragile surcharge', () => {
  const input: LogisticsInput = {
    lengthCm: 40,
    widthCm: 30,
    heightCm: 20,
    weightKg: 8,
    distanceKm: 600,
    baseFee: 8,
    weightRate: 4.5,
    distanceRate: 6,
    volumetricDivisor: 6000,
    fuelSurchargePercent: 0,
    remoteAreaFee: 0,
    fragile: true,
  };

  const result = calculateLogisticsCost(input);

  assert.ok(Math.abs(result.volumetricWeight - 4) < 1e-6);
  assert.ok(Math.abs(result.chargeableWeight - 8) < 1e-6);
  assert.ok(Math.abs(result.weightCharge - 36) < 1e-6);
  assert.ok(Math.abs(result.distanceCharge - 36) < 1e-6);
  assert.ok(Math.abs(result.baseSubtotal - 80) < 1e-6);
  assert.ok(Math.abs(result.subtotalBeforeFragile - 80) < 1e-6);
  assert.ok(Math.abs(result.totalCost - 89.6) < 1e-6);
});

test('calculateLogisticsCost applies fuel and remote surcharges', () => {
  const input: LogisticsInput = {
    lengthCm: 50,
    widthCm: 40,
    heightCm: 30,
    weightKg: 10,
    distanceKm: 800,
    baseFee: 12,
    weightRate: 5,
    distanceRate: 6.5,
    volumetricDivisor: 5000,
    fuelSurchargePercent: 12,
    remoteAreaFee: 15,
    fragile: false,
  };

  const result = calculateLogisticsCost(input);

  const expectedVolumetric = (50 * 40 * 30) / 5000;
  assert.ok(Math.abs(result.volumetricWeight - expectedVolumetric) < 1e-6);

  const expectedChargeable = Math.max(10, expectedVolumetric);
  const expectedWeightCharge = expectedChargeable * 5;
  const expectedDistance = (800 / 100) * 6.5;
  const expectedBaseSubtotal = 12 + expectedWeightCharge + expectedDistance;
  const expectedFuel = expectedBaseSubtotal * 0.12;
  const expectedSubtotalBeforeFragile = expectedBaseSubtotal + expectedFuel + 15;

  assert.ok(Math.abs(result.weightCharge - expectedWeightCharge) < 1e-6);
  assert.ok(Math.abs(result.distanceCharge - expectedDistance) < 1e-6);
  assert.ok(Math.abs(result.baseSubtotal - expectedBaseSubtotal) < 1e-6);
  assert.ok(Math.abs(result.fuelSurcharge - expectedFuel) < 1e-6);
  assert.ok(Math.abs(result.remoteAreaFee - 15) < 1e-6);
  assert.ok(Math.abs(result.subtotalBeforeFragile - expectedSubtotalBeforeFragile) < 1e-6);
  assert.ok(Math.abs(result.totalCost - expectedSubtotalBeforeFragile) < 1e-6);
});

test('calculatePaperUsage returns area, weight and CNY cost', () => {
  const baseInput: PaperInput = {
    lengthMm: 200,
    widthMm: 120,
    heightMm: 80,
    glueAllowanceMm: 25,
    paperGsm: 350,
    pricePerTon: 6800,
    wasteRatePercent: 2.5,
    currency: 'CNY',
  };

  const result = calculatePaperUsage(baseInput);

  assert.ok(Math.abs(result.areaSquareMeters - 0.1072) < 1e-4);
  assert.ok(Math.abs(result.areaWithWasteSquareMeters - 0.10988) < 1e-5);
  assert.ok(Math.abs(result.weightKg - 0.03846) < 1e-5);
  assert.ok(Math.abs(result.weightGrams - 38.46) < 1e-2);
  assert.ok(Math.abs(result.cost - 0.2615) < 1e-4);
  assert.ok(Math.abs(result.costPerThousand - 261.5) < 1e-1);
  assert.ok(Math.abs(result.unitsPerTon - 26002.392220084253) < 1e-2);
  assert.equal(result.currency, 'CNY');
});

test('calculatePaperUsage converts to USD when requested', () => {
  const input: PaperInput = {
    lengthMm: 200,
    widthMm: 120,
    heightMm: 80,
    glueAllowanceMm: 25,
    paperGsm: 350,
    pricePerTon: 6800,
    wasteRatePercent: 2.5,
    currency: 'USD',
  };

  const reference = calculatePaperUsage({ ...input, currency: 'CNY' });
  const result = calculatePaperUsage(input);

  assert.ok(Math.abs(result.cost - reference.cost / USD_EXCHANGE_RATE) < 1e-6);
  assert.ok(Math.abs(result.costPerThousand - reference.costPerThousand / USD_EXCHANGE_RATE) < 1e-6);
  assert.equal(result.currency, 'USD');
});

test('calculatePalletPlan chooses optimal orientation and computes utilisation', () => {
  const input: PalletInput = {
    cartonLengthMm: 350,
    cartonWidthMm: 250,
    cartonHeightMm: 220,
    palletLengthMm: 1200,
    palletWidthMm: 1000,
    palletMaxHeightMm: 1400,
  };

  const result = calculatePalletPlan(input);

  assert.equal(result.bestOrientation.perLayer, 12);
  assert.ok(Math.abs(result.bestOrientation.footprintUtilisation - 87.5) < 1e-2);
  assert.equal(result.layers, 6);
  assert.equal(result.totalQuantity, 72);
  assert.ok(Math.abs(result.heightUtilisation - 94.285714) < 1e-3);
});
