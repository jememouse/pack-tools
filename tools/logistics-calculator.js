document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const length = parseFloat(document.getElementById('length').value) || 0;
            const width = parseFloat(document.getElementById('width').value) || 0;
            const height = parseFloat(document.getElementById('height').value) || 0;
            const weight = parseFloat(document.getElementById('weight').value) || 0;
            const resultDiv = document.getElementById('result-container');

            if (length <= 0 || width <= 0 || height <= 0 || weight <= 0) {
                resultDiv.innerHTML = '<p class="text-red-500">请输入所有有效的尺寸和重量值。</p>';
                return;
            }

            const volumetricWeight = (length * width * height) / 5000;
            const chargeableWeight = Math.max(weight, volumetricWeight);
            const rate = 8; // Example rate: 8 CNY per kg
            const estimatedCost = chargeableWeight * rate;

            resultDiv.innerHTML = `
                <h4 class="font-bold mb-2">计算结果:</h4>
                <p>体积重: <span class="font-semibold text-blue-600">${volumetricWeight.toFixed(2)} kg</span></p>
                <p>实际重量: <span class="font-semibold">${weight.toFixed(2)} kg</span></p>
                <p class="mt-2 text-lg">计费重量: <span class="font-bold text-red-600">${chargeableWeight.toFixed(2)} kg</span></p>
                <p class="mt-1 text-lg">预估费用: <span class="font-bold text-red-600">¥ ${estimatedCost.toFixed(2)}</span> (费率: ${rate}元/kg)</p>
            `;
        });
    }
});
