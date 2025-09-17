document.addEventListener('DOMContentLoaded', function() {
    const typeSelect = document.getElementById('barcode-type');
    const dataInput = document.getElementById('barcode-data');
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('barcode-result');

    const generate = () => {
        const type = typeSelect.value;
        const data = dataInput.value;

        // Clear previous result
        resultContainer.innerHTML = '';

        if (!data) {
            resultContainer.innerHTML = '<p class="text-red-500">请输入要编码的内容。</p>';
            return;
        }

        try {
            if (type === 'qrcode') {
                new QRCode(resultContainer, {
                    text: data,
                    width: 128,
                    height: 128,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            } else {
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.id = 'barcode-svg';
                resultContainer.appendChild(svg);

                JsBarcode("#barcode-svg", data, {
                    format: type,
                    lineColor: "#000",
                    width: 2,
                    height: 100,
                    displayValue: true
                });
            }
        } catch (e) {
            resultContainer.innerHTML = `<p class="text-red-500">生成失败：${e.message}。请检查输入内容是否符合“${type}”格式要求。</p>`;
        }
    };

    if (generateBtn) {
        generateBtn.addEventListener('click', generate);
    }

    // Generate on page load with default values
    generate();
});
