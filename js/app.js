document.addEventListener('DOMContentLoaded', function() {
    // --- Mobile menu toggle ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    // --- Quick nav active state highlighting ---
    const quickNav = document.getElementById('quick-nav');
    if (quickNav) {
        const navLinks = quickNav.querySelectorAll('a');
        const sections = document.querySelectorAll('section[id], h4[id]');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const activeLink = quickNav.querySelector(`a[href="#${id}"]`);
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
        sections.forEach(section => observer.observe(section));
    }

    // --- Dynamic tool rendering ---
    const priority1ToolsContainer = document.getElementById('priority-1-tools');
    if (priority1ToolsContainer) {
        const priority1Tools = [
            {
                id: 'logistics-cost-calculator',
                title: '物流成本计算器',
                description: '输入包裹尺寸，自动计算体积重并估算运费。电商卖家与仓储人员必备。',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
            },
            {
                id: 'paper-usage-calculator',
                title: '纸张用量与成本计算器',
                description: '选择盒型输入尺寸，智能计算开纸方案与单张成本，精准核算报价。',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`,
            },
            {
                id: 'pallet-planner',
                title: '托盘堆码规划器',
                description: '可视化展示最佳堆码方案，计算托盘可堆放数量，优化仓储空间。',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
            }
        ];

        priority1ToolsContainer.innerHTML = priority1Tools.map(tool => `
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all tool-card">
                <div>
                    <div class="flex items-center space-x-4">
                        <div class="bg-blue-100 p-3 rounded-lg">${tool.icon}</div>
                        <h5 class="text-lg font-bold text-gray-800">${tool.title}</h5>
                    </div>
                    <p class="mt-4 text-gray-600">${tool.description}</p>
                </div>
                <a href="#" data-tool-id="${tool.id}" class="use-tool-btn mt-6 block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">使用工具</a>
            </div>
        `).join('');
    }

    // --- Logistics Calculator Modal Logic ---
    const modal = document.getElementById('logistics-modal');
    const openModalBtn = document.querySelector('[data-tool-id="logistics-cost-calculator"]');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const calculateBtn = document.getElementById('modal-calculate-btn');

    const openModal = () => modal.classList.remove('hidden');
    const closeModal = () => modal.classList.add('hidden');

    if (modal && openModalBtn && closeModalBtn) {
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Click on overlay
                closeModal();
            }
        });
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const length = parseFloat(document.getElementById('modal-length').value) || 0;
            const width = parseFloat(document.getElementById('modal-width').value) || 0;
            const height = parseFloat(document.getElementById('modal-height').value) || 0;
            const weight = parseFloat(document.getElementById('modal-weight').value) || 0;
            const resultDiv = document.getElementById('modal-result');

            resultDiv.innerHTML = ''; // Clear previous results

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
