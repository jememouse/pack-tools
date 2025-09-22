document.addEventListener('DOMContentLoaded', function() {
    const paperTypeSelect = document.getElementById('paper-type');
    const gsmInput = document.getElementById('gsm-input');
    const thicknessInput = document.getElementById('thickness-input');

    // Density approximation (g/cm³). Thickness(mm) = GSM / Density / 100
    const paperDensities = {
        'coated-art-paper': 0.9,
        'uncoated-offset-paper': 0.8,
        'kraft-paper': 0.75,
        // For corrugated, we use thickness directly, not density
        'corrugated-b-flute': 3.0, // mm
        'corrugated-e-flute': 1.5, // mm
    };

    const updateGsm = () => {
        const paperType = paperTypeSelect.value;
        const thickness = parseFloat(thicknessInput.value) || 0;

        if (thickness <= 0) {
            gsmInput.value = '';
            return;
        }

        let gsm = 0;
        if (paperType.includes('corrugated')) {
            gsmInput.value = 'N/A'; // GSM is not directly calculable from thickness for corrugated
        } else {
            const density = paperDensities[paperType];
            gsm = thickness * density * 100;
            gsmInput.value = gsm.toFixed(0);
        }
    };

    const updateThickness = () => {
        const paperType = paperTypeSelect.value;
        const gsm = parseFloat(gsmInput.value) || 0;

        if (gsm <= 0) {
            thicknessInput.value = '';
            return;
        }

        let thickness = 0;
        if (paperType.includes('corrugated')) {
            thickness = paperDensities[paperType];
        } else {
            const density = paperDensities[paperType];
            thickness = gsm / (density * 100);
        }
        thicknessInput.value = thickness.toFixed(3);
    };

    gsmInput.addEventListener('input', () => {
        // User is typing in GSM, so we calculate thickness
        thicknessInput.value = ''; // Clear the other field to avoid confusion
        updateThickness();
    });

    thicknessInput.addEventListener('input', () => {
        // User is typing in thickness, so we calculate GSM
        gsmInput.value = ''; // Clear the other field
        updateGsm();
    });

    paperTypeSelect.addEventListener('change', () => {
        // When paper type changes, recalculate based on which field has a value
        if (gsmInput.value) {
            updateThickness();
        } else if (thicknessInput.value) {
            updateGsm();
        }
    });

});
