document.addEventListener('DOMContentLoaded', () => {
    const rgbRInput = document.getElementById('rgb-r') as HTMLInputElement;
    const rgbGInput = document.getElementById('rgb-g') as HTMLInputElement;
    const rgbBInput = document.getElementById('rgb-b') as HTMLInputElement;
    const rgbPreview = document.getElementById('rgb-preview') as HTMLElement;

    const cmykCInput = document.getElementById('cmyk-c') as HTMLInputElement;
    const cmykMInput = document.getElementById('cmyk-m') as HTMLInputElement;
    const cmykYInput = document.getElementById('cmyk-y') as HTMLInputElement;
    const cmykKInput = document.getElementById('cmyk-k') as HTMLInputElement;
    const cmykPreview = document.getElementById('cmyk-preview') as HTMLElement;

    const pantoneInput = document.getElementById('pantone-input') as HTMLInputElement;
    const pantoneConvertButton = document.getElementById('pantone-convert') as HTMLButtonElement;
    const pantonePreview = document.getElementById('pantone-preview') as HTMLElement;
    const pantoneInfo = document.getElementById('pantone-info') as HTMLElement;

    const resultRgb = document.getElementById('result-rgb') as HTMLElement;
    const resultCmyk = document.getElementById('result-cmyk') as HTMLElement;
    const resultPantone = document.getElementById('result-pantone') as HTMLElement;

    // RGB to CMYK conversion
    function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
        r /= 255;
        g /= 255;
        b /= 255;

        const k = 1 - Math.max(r, g, b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100),
        };
    }

    // CMYK to RGB conversion
    function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
        c /= 100;
        m /= 100;
        y /= 100;
        k /= 100;

        const r = 1 - Math.min(1, c * (1 - k) + k);
        const g = 1 - Math.min(1, m * (1 - k) + k);
        const b = 1 - Math.min(1, y * (1 - k) + k);

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    }

    // Simplified Pantone lookup (for demonstration purposes)
    const pantoneColors: { [key: string]: { r: number; g: number; b: number; c: number; m: number; y: number; k: number } } = {
        "185 C": { r: 227, g: 0, b: 34, c: 0, m: 100, y: 81, k: 4 },
        "300 C": { r: 0, g: 103, b: 177, c: 100, m: 45, y: 0, k: 0 },
        "347 C": { r: 0, g: 170, b: 78, c: 89, m: 0, y: 97, k: 0 },
        "109 C": { r: 255, g: 209, b: 0, c: 0, m: 18, y: 100, k: 0 },
        "Black C": { r: 0, g: 0, b: 0, c: 0, m: 0, y: 0, k: 100 },
        "White": { r: 255, g: 255, b: 255, c: 0, m: 0, y: 0, k: 0 },
    };

    function updateRgbInputs(r: number, g: number, b: number) {
        rgbRInput.value = r.toString();
        rgbGInput.value = g.toString();
        rgbBInput.value = b.toString();
        rgbPreview.style.backgroundColor = `rgb(${r},${g},${b})`;
        resultRgb.textContent = `RGB(${r}, ${g}, ${b})`;
    }

    function updateCmykInputs(c: number, m: number, y: number, k: number) {
        cmykCInput.value = c.toString();
        cmykMInput.value = m.toString();
        cmykYInput.value = y.toString();
        cmykKInput.value = k.toString();
        const { r, g, b } = cmykToRgb(c, m, y, k);
        cmykPreview.style.backgroundColor = `rgb(${r},${g},${b})`;
        resultCmyk.textContent = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
    }

    function updatePantoneDisplay(pantoneCode: string, r: number, g: number, b: number) {
        pantoneInput.value = pantoneCode;
        pantonePreview.style.backgroundColor = `rgb(${r},${g},${b})`;
        resultPantone.textContent = `PANTONE ${pantoneCode} (近似值)`;
        pantoneInfo.textContent = "PANTONE 色号为专有颜色系统，此处提供最接近的近似值。精确匹配请参考 PANTONE 官方色卡。";
    }

    function handleRgbInput() {
        const r = parseInt(rgbRInput.value);
        const g = parseInt(rgbGInput.value);
        const b = parseInt(rgbBInput.value);

        if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
            rgbPreview.style.backgroundColor = `#ccc`;
            resultRgb.textContent = `RGB(无效输入)`;
            return;
        }

        rgbPreview.style.backgroundColor = `rgb(${r},${g},${b})`;
        resultRgb.textContent = `RGB(${r}, ${g}, ${b})`;

        const cmyk = rgbToCmyk(r, g, b);
        updateCmykInputs(cmyk.c, cmyk.m, cmyk.y, cmyk.k);

        // Simple Pantone approximation based on RGB
        let closestPantone = "";
        let minDistance = Infinity;

        for (const code in pantoneColors) {
            const pColor = pantoneColors[code];
            const distance = Math.sqrt(
                Math.pow(r - pColor.r, 2) +
                Math.pow(g - pColor.g, 2) +
                Math.pow(b - pColor.b, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestPantone = code;
            }
        }
        if (closestPantone) {
            const pColor = pantoneColors[closestPantone];
            updatePantoneDisplay(closestPantone, pColor.r, pColor.g, pColor.b);
        } else {
            resultPantone.textContent = "未找到近似 PANTONE 色号";
            pantoneInfo.textContent = "PANTONE 色号为专有颜色系统，此处提供最接近的近似值。精确匹配请参考 PANTONE 官方色卡。";
        }
    }

    function handleCmykInput() {
        const c = parseInt(cmykCInput.value);
        const m = parseInt(cmykMInput.value);
        const y = parseInt(cmykYInput.value);
        const k = parseInt(cmykKInput.value);

        if (isNaN(c) || isNaN(m) || isNaN(y) || isNaN(k) ||
            c < 0 || c > 100 || m < 0 || m > 100 || y < 0 || y > 100 || k < 0 || k > 100) {
            cmykPreview.style.backgroundColor = `#ccc`;
            resultCmyk.textContent = `CMYK(无效输入)`;
            return;
        }

        const rgb = cmykToRgb(c, m, y, k);
        updateRgbInputs(rgb.r, rgb.g, rgb.b);
        cmykPreview.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        resultCmyk.textContent = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;

        // Simple Pantone approximation based on RGB
        let closestPantone = "";
        let minDistance = Infinity;

        for (const code in pantoneColors) {
            const pColor = pantoneColors[code];
            const distance = Math.sqrt(
                Math.pow(rgb.r - pColor.r, 2) +
                Math.pow(rgb.g - pColor.g, 2) +
                Math.pow(rgb.b - pColor.b, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestPantone = code;
            }
        }
        if (closestPantone) {
            const pColor = pantoneColors[closestPantone];
            updatePantoneDisplay(closestPantone, pColor.r, pColor.g, pColor.b);
        } else {
            resultPantone.textContent = "未找到近似 PANTONE 色号";
            pantoneInfo.textContent = "PANTONE 色号为专有颜色系统，此处提供最接近的近似值。精确匹配请参考 PANTONE 官方色卡。";
        }
    }

    function handlePantoneConvert() {
        const inputCode = pantoneInput.value.trim();
        const foundColor = pantoneColors[inputCode];

        if (foundColor) {
            updateRgbInputs(foundColor.r, foundColor.g, foundColor.b);
            updateCmykInputs(foundColor.c, foundColor.m, foundColor.y, foundColor.k);
            updatePantoneDisplay(inputCode, foundColor.r, foundColor.g, foundColor.b);
        } else {
            resultPantone.textContent = "未找到近似 PANTONE 色号";
            pantoneInfo.textContent = "PANTONE 色号为专有颜色系统，此处提供最接近的近似值。精确匹配请参考 PANTONE 官方色卡。";
            pantonePreview.style.backgroundColor = `#ccc`;
        }
    }

    // Initial setup and event listeners
    rgbRInput.addEventListener('input', handleRgbInput);
    rgbGInput.addEventListener('input', handleRgbInput);
    rgbBInput.addEventListener('input', handleRgbInput);

    cmykCInput.addEventListener('input', handleCmykInput);
    cmykMInput.addEventListener('input', handleCmykInput);
    cmykYInput.addEventListener('input', handleCmykInput);
    cmykKInput.addEventListener('input', handleCmykInput);

    pantoneConvertButton.addEventListener('click', handlePantoneConvert);

    // Initialize with default values
    handleRgbInput();
});
