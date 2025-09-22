document.addEventListener('DOMContentLoaded', function() {
    const inputs = [
        'outer-l', 'outer-w', 'outer-h',
        'inner-l', 'inner-w', 'inner-h'
    ];
    const resultEl = document.getElementById('result-container').querySelector('p:last-child');

    const calculatePacking = () => {
        const outerL = parseFloat(document.getElementById('outer-l').value) || 0;
        const outerW = parseFloat(document.getElementById('outer-w').value) || 0;
        const outerH = parseFloat(document.getElementById('outer-h').value) || 0;
        const innerL = parseFloat(document.getElementById('inner-l').value) || 0;
        const innerW = parseFloat(document.getElementById('inner-w').value) || 0;
        const innerH = parseFloat(document.getElementById('inner-h').value) || 0;

        if (outerL <= 0 || outerW <= 0 || outerH <= 0 || innerL <= 0 || innerW <= 0 || innerH <= 0) {
            resultEl.textContent = '0';
            return;
        }

        const fitL = Math.floor(outerL / innerL);
        const fitW = Math.floor(outerW / innerW);
        const fitH = Math.floor(outerH / innerH);

        const total = fitL * fitW * fitH;

        resultEl.textContent = total;
    };

    inputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', calculatePacking);
        }
    });

    calculatePacking();
});
