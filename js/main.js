const toolsData = {
    coreCalculators: {
        title: '核心计算器',
        tools: [
            { id: 'logistics-cost-calculator', title: '物流成本计算器', description: '输入包裹尺寸，自动计算体积重并估算运费。', styleType: 'primary', href: '/tools/logistics-calculator.html' },
            { id: 'paper-usage-calculator', title: '纸张用量与成本计算器', description: '选择盒型输入尺寸，智能计算开纸方案与单张成本。', styleType: 'primary', href: '#' },
            { id: 'pallet-planner', title: '托盘堆码规划器', description: '可视化展示最佳堆码方案，计算托盘可堆放数量。', styleType: 'primary', href: '#' },
        ]
    },
    designAids: {
        title: '设计与生产辅助',
        tools: [
            { id: 'dieline-library', title: '盒型刀线模板库', description: '提供常用盒型标准刀线图下载，极大降低结构设计门槛。', styleType: 'tertiary', href: '#' },
            { id: 'barcode-generator', title: '条码/二维码生成器', description: '一键生成符合印刷标准的条形码或二维码矢量图。', styleType: 'secondary', href: '/tools/barcode-generator.html' },
            { id: 'color-converter', title: '色彩模式转换器', description: '在RGB、CMYK和PANTONE色值之间进行快速查询和转换。', styleType: 'secondary', href: '#' },
            { id: 'unit-converter', title: '单位换算工具', description: '覆盖长度、重量、克重等包装行业常用单位的快速互换。', styleType: 'secondary', href: '#' },
            { id: 'line-length-calculator', title: '线长计算器', description: '根据卷材外径、卷芯内径和材料厚度，计算卷材总长度。', styleType: 'secondary', href: '/tools/line-length-calculator.html' },
        ]
    },
    prepressAids: {
        title: '印前处理辅助',
        tools: [
            { id: 'dpi-calculator', title: '分辨率 (DPI) 计算器', description: '检查图像是否达到300 DPI印刷标准，避免后期返工。', styleType: 'tertiary', href: '#' },
            { id: 'pdf-checklist', title: 'PDF 印前检查清单', description: '交互式清单引导您规避常见印刷错误，减少沟通成本。', styleType: 'tertiary', href: '#' }
        ]
    }
};

const resourcesData = {
    title: '资源库',
    items: [
        { id: 'material-manual', title: '材料速查手册', description: '图文并茂，快速了解白卡纸、牛皮纸、瓦楞纸等常用材料的特性与成本。', href: '/resources/material-manual.html' },
        { id: 'process-manual', title: '工艺速查手册', description: '直观了解烫金、UV、击凸等后道工艺的效果、优缺点及成本概览。', href: '/resources/process-manual.html' },
        { id: 'industry-news', title: '行业关键资讯', description: '每周精选纸价波动、环保新规等摘要，让您在用工具时洞悉行业大事。', href: '/resources/industry-news.html' },
    ]
};

document.addEventListener('DOMContentLoaded', function() {
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
            const linkHref = `/index.html#${link.id}`;
            if (link.id === 'toolbox') {
                sidebarHTML += `
                    <li>
                        <a href="${linkHref}" data-toggle="sub-menu-tools" class="flex items-center justify-between w-full py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
                            <span class="flex items-center space-x-3">${link.icon}<span>${link.title}</span></span>
                            <svg class="w-4 h-4 transition-transform transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </a>
                        <ul id="sub-menu-tools" class="ml-4 mt-1 space-y-1 border-l border-gray-200 hidden">`;

                for (const categoryKey in toolsData) {
                    const category = toolsData[categoryKey];
                    const categoryId = categoryKey.replace(/([A-Z])/g, "-$1").toLowerCase() + "-heading";
                    sidebarHTML += `<li><a href="/index.html#${categoryId}" class="block py-1 px-3 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200">${category.title}</a><ul class="ml-4 mt-1 space-y-1 border-l border-gray-200">`;
                    category.tools.forEach(tool => {
                        const toolHref = tool.href.startsWith('#') ? `/index.html${tool.href}` : tool.href;
                        sidebarHTML += `<li><a href="${toolHref}" class="block py-1 px-3 text-xs text-gray-400 hover:text-blue-600 transition-all duration-200">${tool.title}</a></li>`;
                    });
                    sidebarHTML += `</ul></li>`;
                }

                sidebarHTML += `</ul></li>`;
            } else if (link.id === 'resources') {
                sidebarHTML += `
                    <li>
                        <a href="${linkHref}" data-toggle="sub-menu-resources" class="flex items-center justify-between w-full py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
                            <span class="flex items-center space-x-3">${link.icon}<span>${link.title}</span></span>
                             <svg class="w-4 h-4 transition-transform transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        </a>
                        <ul id="sub-menu-resources" class="ml-4 mt-1 space-y-1 border-l border-gray-200 hidden">`;
                resourcesData.items.forEach(item => {
                    sidebarHTML += `<li><a href="${item.href}" class="block py-1 px-3 text-sm text-gray-500 hover:text-blue-600 transition-all duration-200">${item.title}</a></li>`;
                });
                sidebarHTML += `</ul></li>`;
            } else {
                 sidebarHTML += `
                    <li>
                        <a href="${linkHref}" class="flex items-center space-x-3 py-2 px-3 rounded-md font-semibold text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200">
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

    const initSharedEventListeners = () => {
        const menuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        }

        const setupCollapsibleMenu = (toggleAttr, subMenuId) => {
            const toggleButton = document.querySelector(`[data-toggle="${toggleAttr}"]`);
            if (toggleButton) {
                const subMenu = document.getElementById(subMenuId);
                const icon = toggleButton.querySelector('svg:last-child');
                if (subMenu && icon) {
                    toggleButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        subMenu.classList.toggle('hidden');
                        icon.classList.toggle('rotate-180');
                    });
                }
            }
        };

        setupCollapsibleMenu('sub-menu-tools', 'sub-menu-tools');
        setupCollapsibleMenu('sub-menu-resources', 'sub-menu-resources');
    };

    renderSidebar();
    initSharedEventListeners();
});
