export type ToolModalId = 'logistics-cost' | 'paper-usage' | 'pallet-planner';

export interface ToolModalDefinition {
  id: ToolModalId;
  title: string;
  description: string;
  content: string;
}

export const toolModals: ToolModalDefinition[] = [
  {
    id: 'logistics-cost',
    title: '物流成本计算器',
    description: '根据包裹尺寸、重量和运输距离快速估算可计费重量与总运费。',
    content: `
      <form id="logistics-form" class="space-y-6" novalidate>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="lengthCm">长度 (cm)</label>
            <input id="lengthCm" name="lengthCm" type="number" min="0" step="0.1" value="40" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="widthCm">宽度 (cm)</label>
            <input id="widthCm" name="widthCm" type="number" min="0" step="0.1" value="30" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="heightCm">高度 (cm)</label>
            <input id="heightCm" name="heightCm" type="number" min="0" step="0.1" value="20" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="weightKg">实际重量 (kg)</label>
            <input id="weightKg" name="weightKg" type="number" min="0" step="0.1" value="8" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="distanceKm">运输距离 (km)</label>
            <input id="distanceKm" name="distanceKm" type="number" min="0" step="1" value="600" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="baseFee">起步价 (元)</label>
            <input id="baseFee" name="baseFee" type="number" min="0" step="0.1" value="8" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="weightRate">计费重量单价 (元/kg)</label>
            <input id="weightRate" name="weightRate" type="number" min="0" step="0.1" value="4.5" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="distanceRate">距离单价 (元/100km)</label>
            <input id="distanceRate" name="distanceRate" type="number" min="0" step="0.1" value="6" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="volumetricDivisor">体积重换算系数</label>
            <select id="volumetricDivisor" name="volumetricDivisor" class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
              <option value="6000">国内快递 / 空运 (6000)</option>
              <option value="5000">国际快递常用 (5000)</option>
              <option value="4000">快船 / 特殊计费 (4000)</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="fuelSurcharge">燃油附加费 (%)</label>
            <input id="fuelSurcharge" name="fuelSurcharge" type="number" min="0" step="0.1" value="8" class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="remoteFee">偏远附加费 (元)</label>
            <input id="remoteFee" name="remoteFee" type="number" min="0" step="0.1" value="0" class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-700">
          <input id="fragile" name="fragile" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          <label for="fragile">敏感/易碎品，含额外 12% 安全系数</label>
        </div>
        <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">重新计算</button>
      </form>
      <div class="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900" id="logistics-result" aria-live="polite">
        <p class="font-semibold">当前估算</p>
        <ul class="mt-2 space-y-1">
          <li>起步价：<span data-logistics-base-fee>--</span> 元</li>
          <li>体积重：<span data-logistics-volumetric>--</span> kg</li>
          <li>计费重量：<span data-logistics-chargeable>--</span> kg</li>
          <li>计费重量费用：<span data-logistics-weight-charge>--</span> 元</li>
          <li>距离费用：<span data-logistics-distance>--</span> 元</li>
          <li>燃油附加费：<span data-logistics-fuel>--</span> 元</li>
          <li>偏远地区附加费：<span data-logistics-remote>--</span> 元</li>
          <li>基础费用小计：<span data-logistics-subtotal-base>--</span> 元</li>
          <li>附加费后小计：<span data-logistics-subtotal>--</span> 元</li>
          <li class="border-t border-blue-200 pt-3 text-base font-bold">总费用：<span data-logistics-total>--</span> 元</li>
        </ul>
        <p class="mt-3 text-xs text-blue-800" data-logistics-summary>输入参数后，将展示费用拆解与说明。</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button type="button" data-logistics-export class="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 8l4-4m0 0l4 4m-4-4v12" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 16h14" /></svg>
            导出结果 (CSV)
          </button>
          <button type="button" data-logistics-copy class="inline-flex items-center gap-1 rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-3-3v6" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-2.828-2.828A2 2 0 0012.172 4H9a2 2 0 00-2 2z" /></svg>
            复制结果
          </button>
        </div>
      </div>
    `,
  },
  {
    id: 'paper-usage',
    title: '纸张用量与成本计算器',
    description: '估算单箱用纸面积、重量以及按吨价折算的材料成本。',
    content: `
      <form id="paper-form" class="space-y-6" novalidate>
        <div class="space-y-5">
          <section class="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <header class="mb-3">
              <h3 class="text-sm font-semibold text-amber-900">展开尺寸</h3>
              <p class="text-xs text-amber-700/80">输入盒体展开长宽高及搭口，系统自动计算展开面积和损耗。</p>
            </header>
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label class="space-y-1 text-xs text-gray-600" for="boxLength">
                <span class="font-medium text-gray-700">盒体长度 (mm)</span>
                <input id="boxLength" name="boxLength" type="number" min="0" step="1" value="200" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600" for="boxWidth">
                <span class="font-medium text-gray-700">盒体宽度 (mm)</span>
                <input id="boxWidth" name="boxWidth" type="number" min="0" step="1" value="120" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600" for="boxHeight">
                <span class="font-medium text-gray-700">盒体高度 (mm)</span>
                <input id="boxHeight" name="boxHeight" type="number" min="0" step="1" value="80" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600 lg:col-span-1" for="glueAllowance">
                <span class="font-medium text-gray-700">搭口与损耗 (mm)</span>
                <input id="glueAllowance" name="glueAllowance" type="number" min="0" step="1" value="25" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-200">
              </label>
            </div>
          </section>

          <section class="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <header class="mb-3">
              <h3 class="text-sm font-semibold text-emerald-900">纸张规格</h3>
              <p class="text-xs text-emerald-700/80">填写克重、损耗率与吨价，可切换币种查看成本。</p>
            </header>
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="space-y-1 text-xs text-gray-600" for="paperGsm">
                <span class="font-medium text-gray-700">纸张克重 (g/m²)</span>
                <input id="paperGsm" name="paperGsm" type="number" min="0" step="1" value="350" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600" for="wasteRate">
                <span class="font-medium text-gray-700">损耗率 (%)</span>
                <input id="wasteRate" name="wasteRate" type="number" min="0" step="0.1" value="2.5" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600" for="pricePerTon">
                <span class="font-medium text-gray-700">吨价 (元/吨)</span>
                <input id="pricePerTon" name="pricePerTon" type="number" min="0" step="1" value="6800" required class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
              </label>
              <label class="space-y-1 text-xs text-gray-600" for="currency">
                <span class="font-medium text-gray-700">币种</span>
                <select id="currency" name="currency" class="w-full rounded-lg border border-gray-300/70 bg-white p-2 text-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200">
                  <option value="CNY" selected>人民币 (CNY)</option>
                  <option value="USD">美元 (USD)</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700">重新计算</button>
          <button type="button" data-paper-export class="inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 8l4-4m0 0l4 4m-4-4v12" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 16h14" /></svg>
            导出结果
          </button>
          <button type="button" data-paper-copy class="inline-flex items-center gap-2 rounded-lg border border-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-3-3v6" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V9.414a2 2 0 00-.586-1.414l-2.828-2.828A2 2 0 0012.172 4H9a2 2 0 00-2 2z" /></svg>
            复制结果
          </button>
        </div>
      </form>
      <div class="mt-6 space-y-4 rounded-xl border border-emerald-200 bg-white p-4 text-xs text-emerald-900" id="paper-result" aria-live="polite">
        <div class="grid gap-3 md:grid-cols-2">
          <div class="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p class="text-sm font-semibold text-emerald-900">面积与重量</p>
            <ul class="mt-2 space-y-1">
              <li>单箱展开面积：<span data-paper-area>--</span> m²</li>
              <li>损耗后面积：<span data-paper-area-loss>--</span> m²</li>
              <li>单箱重量：<span data-paper-weight>--</span> kg</li>
              <li>单箱重量：<span data-paper-weight-grams>--</span> g</li>
            </ul>
          </div>
          <div class="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
            <p class="text-sm font-semibold text-emerald-900">产能与成本</p>
            <ul class="mt-2 space-y-1">
              <li>吨纸可生产：<span data-paper-yield>--</span> 个</li>
              <li>单箱材料成本：<span data-paper-cost class="text-base font-bold">--</span></li>
              <li>千箱材料成本：<span data-paper-thousand>--</span></li>
            </ul>
          </div>
        </div>
        <p class="text-[11px] text-emerald-700" data-paper-summary>输入参数后，将展示损耗、重量与成本拆解。</p>
      </div>
    `,
  },
  {
    id: 'pallet-planner',
    title: '托盘堆码规划器',
    description: '比较水平排布方式，输出单层装载数量、可堆层数与整体利用率。',
    content: `
      <form id="pallet-form" class="space-y-6" novalidate>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="cartonLength">单箱长度 (mm)</label>
            <input id="cartonLength" name="cartonLength" type="number" min="0" step="1" value="350" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="cartonWidth">单箱宽度 (mm)</label>
            <input id="cartonWidth" name="cartonWidth" type="number" min="0" step="1" value="250" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="cartonHeight">单箱高度 (mm)</label>
            <input id="cartonHeight" name="cartonHeight" type="number" min="0" step="1" value="220" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="palletLength">托盘长度 (mm)</label>
            <input id="palletLength" name="palletLength" type="number" min="0" step="1" value="1200" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="palletWidth">托盘宽度 (mm)</label>
            <input id="palletWidth" name="palletWidth" type="number" min="0" step="1" value="1000" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700" for="palletMaxHeight">堆码最大高度 (mm)</label>
            <input id="palletMaxHeight" name="palletMaxHeight" type="number" min="0" step="1" value="1400" required class="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
          </div>
        </div>
        <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">重新计算</button>
      </form>
      <div class="mt-6 space-y-4" id="pallet-result" aria-live="polite">
        <div class="rounded-lg border border-purple-100 bg-purple-50 p-4 text-sm text-purple-900">
          <p class="font-semibold">推荐排布</p>
          <p class="mt-2" data-pallet-orientation>--</p>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p class="font-semibold">装载效率</p>
            <ul class="mt-2 space-y-1">
              <li>单层装箱：<span data-pallet-per-layer>--</span> 箱</li>
              <li>可堆层数：<span data-pallet-layers>--</span> 层</li>
              <li>总装箱量：<span data-pallet-total class="text-lg font-bold">--</span> 箱</li>
            </ul>
          </div>
          <div class="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
            <p class="font-semibold">利用率评估</p>
            <ul class="mt-2 space-y-1">
              <li>底面积利用率：<span data-pallet-footprint>--</span>%</li>
              <li>高度利用率：<span data-pallet-height>--</span>%</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  },
];
