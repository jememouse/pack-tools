const toolsData = {
    toolbox: [
        // Priority 1
        { id: 'logistics-cost-calculator', title: '物流成本计算器', description: '输入包裹尺寸，自动计算体积重并估算运费。电商卖家与仓储人员必备。', styleType: 'primary' },
        { id: 'paper-usage-calculator', title: '纸张用量与成本计算器', description: '选择盒型输入尺寸，智能计算开纸方案与单张成本，精准核算报价。', styleType: 'primary' },
        { id: 'pallet-planner', title: '托盘堆码规划器', description: '可视化展示最佳堆码方案，计算托盘可堆放数量，优化仓储空间。', styleType: 'primary' },
        // Priority 2
        { id: 'dieline-library', title: '盒型刀线模板库', description: '提供常用盒型标准刀线图下载，极大降低结构设计门槛。', styleType: 'tertiary' },
        { id: 'barcode-generator', title: '条码/二维码生成器', description: '一键生成符合印刷标准的条形码或二维码矢量图。', styleType: 'secondary' },
        { id: 'color-converter', title: '色彩模式转换器', description: '在RGB、CMYK和PANTONE色值之间进行快速查询和转换。', styleType: 'secondary' },
        { id: 'unit-converter', title: '单位换算工具', description: '覆盖长度、重量、克重等包装行业常用单位的快速互换。', styleType: 'secondary' },
        // Priority 3
        { id: 'dpi-calculator', title: '分辨率 (DPI) 计算器', description: '检查图像是否达到300 DPI印刷标准，避免后期返工。', styleType: 'tertiary' },
        { id: 'pdf-checklist', title: 'PDF 印前检查清单', description: '交互式清单引导您规避常见印刷错误，减少沟通成本。', styleType: 'tertiary' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {

    const renderToolCards = () => {
        const container = document.getElementById('toolbox-grid');
        if (!container) return;

        const buttonClasses = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg',
            secondary: 'border border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 py-2 rounded-lg font-semibold',
            tertiary: 'font-semibold text-gray-500 hover:text-blue-600'
        };

        const getButtonText = (tool) => {
            if (['dieline-library', 'pdf-checklist'].includes(tool.id)) return '查看模板库';
            return '使用工具';
        };

        container.innerHTML = toolsData.toolbox.map(tool => `
            <div id="${tool.id}" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all tool-card">
                <div>
                    <h5 class="text-md font-bold text-gray-800">${tool.title}</h5>
                    <p class="mt-2 text-sm text-gray-600">${tool.description}</p>
                </div>
                <a href="#" data-tool-id="${tool.id}" class="mt-4 block w-full text-center transition-all duration-200 ${buttonClasses[tool.styleType] || buttonClasses.secondary}">
                    ${getButtonText(tool)}
                </a>
            </div>
        `).join('');
    };

    const renderSidebar = () => {
        const navContainer = document.getElementById('quick-nav');
        if (!navContainer) return;

        const mainLinks = [
            { id: 'toolbox', title: '核心工具', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>` },
            { id: 'resources', title: '资源库', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>` },
            { id: 'suppliers', title: '供应商', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>` }
        ];

        let sidebarHTML = '<ul class="space-y-2">';
        mainLinks.forEach(link => {
            if (link.id === 'toolbox') {
                sidebarHTML += `
                    <li>
                        <a href="#toolbox" data-toggle="sub-menu" class="flex items-center justify-between w-full py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
                            <span class="flex items-center space-x-3">${link.icon}<span>${link.title}</span></span>
                            <svg class="w-4 h-4 transition-transform transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </a>
                        <ul id="sub-menu" class="ml-4 mt-1 space-y-1 border-l border-gray-200 hidden">`;

                toolsData.toolbox.forEach(tool => {
                    sidebarHTML += `<li><a href="#${tool.id}" class="block py-1 px-3 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200">${tool.title}</a></li>`;
                });

                sidebarHTML += `</ul></li>`;
            } else {
                 sidebarHTML += `
                    <li>
                        <a href="#${link.id}" class="flex items-center space-x-3 py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
                            ${link.icon}<span>${link.title}</span>
                        </a>
                    </li>`;
            }
        });
        sidebarHTML += '</ul>';

        const titleDiv = navContainer.querySelector('.font-bold');
        if(titleDiv) {
            titleDiv.insertAdjacentHTML('afterend', sidebarHTML);
        }
    };

    const initEventListeners = () => {
        // Mobile menu
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        }

        // Sidebar scroll spy
        const quickNav = document.getElementById('quick-nav');
        if (quickNav) {
            const navLinks = quickNav.querySelectorAll('a');
            const sections = document.querySelectorAll('section[id], div.tool-card[id]');
            const observer = new IntersectionObserver(entries => {
                let activeId = null;
                const intersectingEntries = entries.filter(e => e.isIntersecting);
                if (intersectingEntries.length > 0) {
                    activeId = intersectingEntries[intersectingEntries.length - 1].target.getAttribute('id');
                }

                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }, { rootMargin: '-30% 0px -65% 0px', threshold: 0.1 });
            sections.forEach(section => observer.observe(section));
        }

        // Collapsible Sidebar Menu
        const subMenuToggle = document.querySelector('[data-toggle="sub-menu"]');
        if (subMenuToggle) {
            const subMenu = document.getElementById('sub-menu');
            const icon = subMenuToggle.querySelector('svg:last-child');
            subMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                subMenu.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        }

        // Modal Open/Close Logic
        const setupModal = (toolId, modalId, closeBtnId) => {
            const modal = document.getElementById(modalId);
            const openBtn = document.querySelector(`[data-tool-id="${toolId}"]`);
            const closeBtn = document.getElementById(closeBtnId);
            if(modal && openBtn && closeBtn) {
                openBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.remove('hidden'); });
                closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
                modal.addEventListener('click', e => { if(e.target === modal) modal.classList.add('hidden'); });
            }
        };
        setupModal('logistics-cost-calculator', 'logistics-modal', 'close-modal-btn');
        setupModal('dpi-calculator', 'dpi-modal', 'close-dpi-modal-btn');
        setupModal('unit-converter', 'unit-converter-modal', 'close-unit-converter-modal-btn');

        // Logistics Calculator
        const calculateLogisticsBtn = document.getElementById('modal-calculate-btn');
        if (calculateLogisticsBtn) {
            calculateLogisticsBtn.addEventListener('click', () => {
                const length = parseFloat(document.getElementById('modal-length').value) || 0;
                const width = parseFloat(document.getElementById('modal-width').value) || 0;
                const height = parseFloat(document.getElementById('modal-height').value) || 0;
                const weight = parseFloat(document.getElementById('modal-weight').value) || 0;
                const resultDiv = document.getElementById('modal-result');
                if (length <= 0 || width <= 0 || height <= 0 || weight <= 0) {
                    resultDiv.innerHTML = '<p class="text-red-500">请输入所有有效的尺寸和重量值。</p>';
                    return;
                }
                const volumetricWeight = (length * width * height) / 5000;
                const chargeableWeight = Math.max(weight, volumetricWeight);
                const rate = 8;
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

        // DPI Calculator
        const calculateDpiBtn = document.getElementById('calculate-dpi-btn');
        if (calculateDpiBtn) {
            calculateDpiBtn.addEventListener('click', () => {
                const pixelsInput = document.getElementById('dpi-pixels');
                const dpiInput = document.getElementById('dpi-dpi');
                const cmInput = document.getElementById('dpi-cm');
                const resultDiv = document.getElementById('dpi-result');
                const pixels = parseFloat(pixelsInput.value);
                const dpi = parseFloat(dpiInput.value);
                const cm = parseFloat(cmInput.value);
                const inchesToCm = 2.54;
                let resultMessage = '';
                const filledFields = [pixels, dpi, cm].filter(v => !isNaN(v) && v > 0).length;

                if (filledFields !== 2) {
                    resultMessage = '<p class="text-red-500">请输入任意两项有效数值以计算第三项。</p>';
                } else if (!isNaN(pixels) && !isNaN(dpi)) {
                    const sizeInCm = (pixels / dpi) * inchesToCm;
                    cmInput.value = sizeInCm.toFixed(2);
                    resultMessage = `<p>计算出的物理尺寸为 <span class="font-bold text-blue-600">${sizeInCm.toFixed(2)} cm</span>。</p>`;
                } else if (!isNaN(pixels) && !isNaN(cm)) {
                    const calculatedDpi = pixels / (cm / inchesToCm);
                    dpiInput.value = calculatedDpi.toFixed(0);
                    resultMessage = `<p>计算出的分辨率为 <span class="font-bold text-blue-600">${calculatedDpi.toFixed(0)} DPI</span>。</p>`;
                    resultMessage += calculatedDpi < 300 ? ' <span class="font-semibold text-yellow-600">注意: 低于300 DPI，可能不适合高质量印刷。</span>' : ' <span class="font-semibold text-green-600">Great! 满足300 DPI印刷标准。</span>';
                } else if (!isNaN(dpi) && !isNaN(cm)) {
                    const calculatedPixels = dpi * (cm / inchesToCm);
                    pixelsInput.value = calculatedPixels.toFixed(0);
                    resultMessage = `<p>计算出的像素尺寸为 <span class="font-bold text-blue-600">${calculatedPixels.toFixed(0)} pixels</span>。</p>`;
                }
                resultDiv.innerHTML = resultMessage;
            });
        }

        // Unit Converter
        const unitCategorySelect = document.getElementById('unit-category');
        const unitFromSelect = document.getElementById('unit-from');
        const unitToSelect = document.getElementById('unit-to');
        const unitInputField = document.getElementById('unit-input');
        const unitResultDiv = document.getElementById('unit-result').querySelector('p');
        const unitDefs = {
            length: { '厘米 (cm)': 1, '米 (m)': 100, '英寸 (in)': 2.54, '英尺 (ft)': 30.48, '毫米 (mm)': 0.1 },
            weight: { '克 (g)': 1, '千克 (kg)': 1000, '磅 (lb)': 453.592, '盎司 (oz)': 28.3495 },
            gsm: { '克/平方米 (g/m²)': 1, '磅 (lb/ream)': 1.48 }
        };
        const populateUnits = () => {
            const category = unitCategorySelect.value;
            const options = Object.keys(unitDefs[category]);
            unitFromSelect.innerHTML = options.map(o => `<option value="${o}">${o}</option>`).join('');
            unitToSelect.innerHTML = options.map(o => `<option value="${o}">${o}</option>`).join('');
            unitToSelect.selectedIndex = Math.min(1, options.length - 1);
            convertUnits();
        };
        const convertUnits = () => {
            const category = unitCategorySelect.value;
            const fromUnit = unitFromSelect.value;
            const toUnit = unitToSelect.value;
            const inputValue = parseFloat(unitInputField.value) || 0;
            if (isNaN(inputValue)) {
                unitResultDiv.textContent = '0.00';
                return;
            }
            const fromFactor = unitDefs[category][fromUnit];
            const toFactor = unitDefs[category][toUnit];
            const result = (inputValue * fromFactor) / toFactor;
            unitResultDiv.textContent = result.toFixed(3);
        };
        if (unitCategorySelect) {
            unitCategorySelect.addEventListener('change', populateUnits);
            unitFromSelect.addEventListener('change', convertUnits);
            unitToSelect.addEventListener('change', convertUnits);
            unitInputField.addEventListener('input', convertUnits);
            populateUnits();
        }
    };

    // Initial Render
    renderToolCards();
    renderSidebar();
    initEventListeners();
});
