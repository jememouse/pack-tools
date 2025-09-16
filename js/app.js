document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Dynamic tool rendering
    const priority1ToolsContainer = document.getElementById('priority-1-tools');

    const priority1Tools = [
        {
            title: '物流成本计算器',
            description: '输入包裹尺寸，自动计算体积重并估算运费。电商卖家与仓储人员必备。',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
            link: '#'
        },
        {
            title: '纸张用量与成本计算器',
            description: '选择盒型输入尺寸，智能计算开纸方案与单张成本，精准核算报价。',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`,
            link: '#'
        },
        {
            title: '托盘堆码规划器',
            description: '可视化展示最佳堆码方案，计算托盘可堆放数量，优化仓储空间。',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`,
            link: '#'
        }
    ];

    if (priority1ToolsContainer) {
        priority1Tools.forEach(tool => {
            const toolCardHTML = `
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all tool-card">
                    <div>
                        <div class="flex items-center space-x-4">
                            <div class="bg-blue-100 p-3 rounded-lg">${tool.icon}</div>
                            <h5 class="text-lg font-bold text-gray-800">${tool.title}</h5>
                        </div>
                        <p class="mt-4 text-gray-600">${tool.description}</p>
                    </div>
                    <a href="${tool.link}" class="mt-6 block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">使用工具</a>
                </div>
            `;
            priority1ToolsContainer.innerHTML += toolCardHTML;
        });
    }
});
