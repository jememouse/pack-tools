document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-btn');
    const resultContainer = document.getElementById('result-container').querySelector('p');

    const copyIdeas = [
        "用心制作，请温柔开启。",
        "开箱有惊喜！",
        "100%可回收材料，感谢您为地球助力。",
        "让美好，不止于此。",
        "始于颜值，忠于品质。",
        "一份来自远方的礼物。",
        "手工匠心，为你而作。",
        "不仅仅是包装，更是一份心意。",
        "简单，而不简单。",
        "为此刻，更精彩。",
        "开启你的专属时刻。",
        "环保新生，由你开始。",
        "小包装，大世界。",
        "品质生活，从这里开始。"
    ];

    const generateCopy = () => {
        const randomIndex = Math.floor(Math.random() * copyIdeas.length);
        const idea = copyIdeas[randomIndex];
        resultContainer.textContent = `“${idea}”`;
    };

    if (generateBtn) {
        generateBtn.addEventListener('click', generateCopy);
    }
});
