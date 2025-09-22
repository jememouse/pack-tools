document.addEventListener('DOMContentLoaded', function() {
    const checklistContainer = document.getElementById('checklist-container');
    const resetBtn = document.getElementById('reset-checklist-btn');

    const checklistItems = [
        { id: 'check-bleed', text: '文件是否已设置3mm出血？' },
        { id: 'check-resolution', text: '所有图片分辨率是否均达到300 DPI？' },
        { id: 'check-colormode', text: '文件色彩模式是否为CMYK，而非RGB？' },
        { id: 'check-fonts', text: '所有文字是否已转为曲线（轮廓化）？' },
        { id: 'check-black', text: '黑色文字是否为单色黑（K:100）？' },
        { id: 'check-dieline', text: '刀线、折痕线是否用专色或单独图层表示？' },
        { id: 'check-safezone', text: '重要内容是否都在裁切线内部的安全区域？' },
    ];

    let completedItems = JSON.parse(localStorage.getItem('checklistProgress')) || [];

    const renderChecklist = () => {
        if (!checklistContainer) return;
        checklistContainer.innerHTML = checklistItems.map(item => `
            <label class="checklist-item flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${completedItems.includes(item.id) ? 'completed' : ''}" data-id="${item.id}">
                <input type="checkbox" class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" ${completedItems.includes(item.id) ? 'checked' : ''}>
                <span>${item.text}</span>
            </label>
        `).join('');

        addEventListeners();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.checklist-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.dataset.id;
                const checkbox = this.querySelector('input');

                if (completedItems.includes(id)) {
                    completedItems = completedItems.filter(itemId => itemId !== id);
                } else {
                    completedItems.push(id);
                }

                localStorage.setItem('checklistProgress', JSON.stringify(completedItems));
                this.classList.toggle('completed');
                checkbox.checked = !checkbox.checked;
            });
        });
    };

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('checklistProgress');
            completedItems = [];
            renderChecklist();
        });
    }

    renderChecklist();
});
