// This file contains JavaScript logic specific to the homepage (index.html).
// Shared logic is in js/main.js

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

        let allToolsHTML = '';
        for (const categoryKey in toolsData) {
            toolsData[categoryKey].tools.forEach(tool => {
                allToolsHTML += `
                    <div id="${tool.id}" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all tool-card">
                        <div>
                            <h5 class="text-md font-bold text-gray-800">${tool.title}</h5>
                            <p class="mt-2 text-sm text-gray-600">${tool.description}</p>
                        </div>
                        <a href="${tool.href || '#'}" data-tool-id="${tool.id}" class="mt-4 block w-full text-center transition-all duration-200 ${buttonClasses[tool.styleType] || buttonClasses.secondary}">
                            ${getButtonText(tool)}
                        </a>
                    </div>
                `;
            });
        }
        container.innerHTML = allToolsHTML;
    };

    const initHomepageEventListeners = () => {
        // Sidebar scroll spy for homepage
        const quickNav = document.getElementById('quick-nav');
        if (quickNav) {
            const navLinks = quickNav.querySelectorAll('a');
            const sections = document.querySelectorAll('section[id], h4[id]');
            const observer = new IntersectionObserver(entries => {
                const visibleSections = entries.filter(e => e.isIntersecting).map(e => e.target.id);
                navLinks.forEach(link => {
                    const linkHref = link.getAttribute('href');
                    const targetId = linkHref.substring(linkHref.indexOf('#') + 1);
                    if (visibleSections.includes(targetId)) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }, { rootMargin: '-40% 0px -55% 0px' });
            sections.forEach(section => {
                if(section) observer.observe(section);
            });
        }

        // Modal Open/Close Logic
        const setupModal = (toolId, modalId, closeBtnId) => {
            const modal = document.getElementById(modalId);
            const openBtn = document.querySelector(`[data-tool-id="${toolId}"]`);
            const closeBtn = document.getElementById(closeBtnId);
            if(modal && openBtn && closeBtn) {
                if (openBtn.getAttribute('href') === '#') {
                    openBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.remove('hidden'); });
                    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
                    modal.addEventListener('click', e => { if(e.target === modal) modal.classList.add('hidden'); });
                }
            }
        };
        setupModal('dpi-calculator', 'dpi-modal', 'close-dpi-modal-btn');
        setupModal('unit-converter', 'unit-converter-modal', 'close-unit-converter-modal-btn');

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
            fromSelect.addEventListener('change', convertUnits);
            toSelect.addEventListener('change', convertUnits);
            unitInputField.addEventListener('input', convertUnits);
            populateUnits();
        }
    };

    renderToolCards();
    initHomepageEventListeners();
});
