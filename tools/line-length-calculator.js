document.addEventListener('DOMContentLoaded', function() {
    const lineLengthInputs = ['roll-outer-diameter', 'roll-core-diameter', 'material-thickness'];
    const lineLengthResultDiv = document.getElementById('result-container').querySelector('p');

    const calculateLineLength = () => {
        const R = parseFloat(document.getElementById('roll-outer-diameter').value) / 2 || 0;
        const r = parseFloat(document.getElementById('roll-core-diameter').value) / 2 || 0;
        const t = parseFloat(document.getElementById('material-thickness').value) / 1000 || 0; // convert μm to mm

        if (R <= 0 || r < 0 || t <= 0 || R <= r) { // Core diameter can be 0, but not negative
            lineLengthResultDiv.textContent = '0.00 米';
            return;
        }

        const area = Math.PI * (Math.pow(R, 2) - Math.pow(r, 2));
        const lengthInMm = area / t;
        const lengthInM = lengthInMm / 1000;

        lineLengthResultDiv.textContent = `${lengthInM.toFixed(2)} 米`;
    };

    lineLengthInputs.forEach(id => {
        const inputEl = document.getElementById(id);
        if (inputEl) {
            inputEl.addEventListener('input', calculateLineLength);
        }
    });

    // Also, need to populate the sidebar on this page.
    // This logic should be shared. For now, this file only contains calculator logic.
});
