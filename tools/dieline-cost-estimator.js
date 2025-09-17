document.addEventListener('DOMContentLoaded', function() {
    const cutInput = document.getElementById('cut-length');
    const creaseInput = document.getElementById('crease-length');
    const resultEl = document.getElementById('result-container').querySelector('p:last-child');

    // Default rates (can be adjusted)
    const RATE_CUT = 20; // 20 CNY per meter
    const RATE_CREASE = 10; // 10 CNY per meter
    const BASE_FEE = 50; // 50 CNY base fee

    const estimateCost = () => {
        const cutLength = parseFloat(cutInput.value) || 0;
        const creaseLength = parseFloat(creaseInput.value) || 0;

        if (cutLength <= 0 && creaseLength <= 0) {
            resultEl.textContent = `¥ 0.00`;
            return;
        }

        const cost = (cutLength * RATE_CUT) + (creaseLength * RATE_CREASE) + BASE_FEE;

        resultEl.textContent = `¥ ${cost.toFixed(2)}`;
    };

    if (cutInput && creaseInput) {
        cutInput.addEventListener('input', estimateCost);
        creaseInput.addEventListener('input', estimateCost);
    }

    estimateCost();
});
