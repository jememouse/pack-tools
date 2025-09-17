document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('order-quantity');
    const processCheckboxes = document.querySelectorAll('input[type="checkbox"][data-days]');
    const resultContainer = document.getElementById('result-container');

    const estimateLeadTime = () => {
        const quantity = parseInt(quantityInput.value) || 0;

        if (quantity <= 0) {
            resultContainer.innerHTML = '<p class="text-gray-500">请输入有效的订单数量。</p>';
            return;
        }

        // Base model for calculation
        let baseDays = 5; // e.g., 2 days for printing, 1 for die-cutting, 2 for gluing/assembly
        let quantityDays = (quantity / 1000) * 0.5; // 0.5 day per 1000 units

        let processDays = 0;
        processCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                processDays += parseInt(checkbox.dataset.days);
            }
        });

        const totalDays = baseDays + quantityDays + processDays;

        resultContainer.innerHTML = `
            <div class="text-center">
                <p class="text-gray-600">预估生产周期</p>
                <p class="text-4xl font-bold text-blue-600">${Math.ceil(totalDays)} <span class="text-xl font-medium text-gray-500">天</span></p>
            </div>
        `;
    };

    quantityInput.addEventListener('input', estimateLeadTime);
    processCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', estimateLeadTime);
    });

    // Initial calculation
    estimateLeadTime();
});
