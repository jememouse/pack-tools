document.addEventListener('DOMContentLoaded', function() {
    const inputs = [
        'avg-daily-usage',
        'max-daily-usage',
        'avg-lead-time',
        'max-lead-time'
    ];
    const resultContainer = document.getElementById('result-container');

    const calculateROP = () => {
        const avgUsage = parseFloat(document.getElementById('avg-daily-usage').value) || 0;
        const maxUsage = parseFloat(document.getElementById('max-daily-usage').value) || 0;
        const avgLead = parseFloat(document.getElementById('avg-lead-time').value) || 0;
        const maxLead = parseFloat(document.getElementById('max-lead-time').value) || 0;

        if (avgUsage <= 0 || maxUsage <= 0 || avgLead <= 0 || maxLead <= 0 || maxUsage < avgUsage || maxLead < avgLead) {
            resultContainer.innerHTML = '<p class="text-gray-500">请输入有效且一致的参数以查看计算结果。</p>';
            return;
        }

        const safetyStock = (maxUsage * maxLead) - (avgUsage * avgLead);
        const reorderPoint = (avgUsage * avgLead) + safetyStock;

        resultContainer.innerHTML = `
            <div class="space-y-2">
                <div>
                    <h4 class="text-lg font-semibold text-gray-800">安全库存 (Safety Stock)</h4>
                    <p class="text-2xl font-bold text-blue-600">${safetyStock.toFixed(0)} <span class="text-base font-normal text-gray-500">单位</span></p>
                    <p class="text-sm text-gray-500 mt-1">为应对意外需求或延误，建议的最低额外库存量。</p>
                </div>
                <div class="pt-2 border-t">
                    <h4 class="text-lg font-semibold text-gray-800">再订货点 (Reorder Point)</h4>
                    <p class="text-2xl font-bold text-red-600">${reorderPoint.toFixed(0)} <span class="text-base font-normal text-gray-500">单位</span></p>
                    <p class="text-sm text-gray-500 mt-1">当您的库存下降到此水平时，应立即下达新订单。</p>
                </div>
            </div>
        `;
    };

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', calculateROP);
        }
    });

    // Initial calculation in case of pre-filled values
    calculateROP();
});
