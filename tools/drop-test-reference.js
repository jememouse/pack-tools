document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('package-weight');
    const resultEl = document.getElementById('result-container').querySelector('p:last-child');

    // Based on ISTA 1A standard drop heights
    const dropHeights = [
        { maxWeight: 9.5, height: 76 },   // Up to 21 lb
        { maxWeight: 18.6, height: 61 },  // 21 to 41 lb
        { maxWeight: 27.7, height: 46 },  // 41 to 61 lb
        { maxWeight: 45.4, height: 30 },  // 61 to 100 lb
        { maxWeight: 68.0, height: 20 },  // 100 to 150 lb
    ];

    const findDropHeight = () => {
        const weight = parseFloat(weightInput.value) || 0;

        if (weight <= 0) {
            resultEl.innerHTML = `- cm`;
            return;
        }

        let height = 15; // Default for packages over 150 lb (68 kg)
        for (const range of dropHeights) {
            if (weight <= range.maxWeight) {
                height = range.height;
                break;
            }
        }

        resultEl.innerHTML = `${height} cm`;
    };

    if (weightInput) {
        weightInput.addEventListener('input', findDropHeight);
    }

    findDropHeight();
});
