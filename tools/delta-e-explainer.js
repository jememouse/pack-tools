document.addEventListener('DOMContentLoaded', function() {
    const deltaEInput = document.getElementById('delta-e-input');
    const resultContainer = document.getElementById('result-container');

    const explainDeltaE = () => {
        const deltaE = parseFloat(deltaEInput.value) || 0;

        let level = '';
        let description = '';
        let colorClass = '';

        if (deltaE < 1.0) {
            level = '无法察觉';
            description = '普通人眼无法分辨出颜色差异，代表极高的色彩保真度。';
            colorClass = 'text-green-600';
        } else if (deltaE < 2.0) {
            level = '专业人士可察觉';
            description = '只有经验丰富的专业人员在仔细观察下才能分辨出细微差异，通常被认为是高质量印刷的允收范围。';
            colorClass = 'text-green-500';
        } else if (deltaE < 3.5) {
            level = '普通人可察觉';
            description = '普通人可以注意到颜色不同，这是大多数商业印刷品可接受的质量控制上限。';
            colorClass = 'text-yellow-600';
        } else if (deltaE < 5.0) {
            level = '明显的差异';
            description = '颜色差异非常明显，通常被认为是不合格的印刷品。';
            colorClass = 'text-orange-500';
        } else {
            level = '完全不同的颜色';
            description = '两种颜色给人的印象是完全不同的颜色，而非同一颜色的不同色调。';
            colorClass = 'text-red-600';
        }

        resultContainer.innerHTML = `
            <h4 class="text-lg font-semibold text-gray-800">差异程度: <span class="font-bold ${colorClass}">${level}</span></h4>
            <p class="text-sm text-gray-600 mt-2">${description}</p>
        `;
    };

    if (deltaEInput) {
        deltaEInput.addEventListener('input', explainDeltaE);
    }

    // Initial explanation
    explainDeltaE();
});
