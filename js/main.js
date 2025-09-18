const toolsData = {
    designAndPrepress: {
        title: '设计与印前',
        tools: [
            { id: 'dieline-library', title: '盒型刀线模板库', description: '提供常用盒型标准刀线图下载，极大降低结构设计门槛。', styleType: 'tertiary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>' },
            { id: 'color-converter', title: '色彩模式转换器', description: '在RGB、CMYK和PANTONE色值之间进行快速查询和转换。', styleType: 'secondary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>' },
            { id: 'delta-e-explainer', title: '颜色差异(ΔE)解释器', description: '直观地理解Delta E数值在印刷颜色管理中的实际意义。', styleType: 'tertiary', href: '/tools/delta-e-explainer.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>' },
            { id: 'dpi-calculator', title: '分辨率 (DPI) 计算器', description: '检查图像是否达到300 DPI印刷标准，避免后期返工。', styleType: 'tertiary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>' },
            { id: 'pdf-checklist', title: 'PDF 印前检查清单', description: '交互式清单引导您规避常见印刷错误，减少沟通成本。', styleType: 'tertiary', href: '/tools/compliance-checklist.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
            { id: 'image-converter', title: '图片格式转换', description: '转换图片的格式，如 PNG, JPG, WebP。', styleType: 'tertiary', href: '/tools/image-converter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>' },
            { id: 'image-cropper', title: '图片缩放与裁剪', description: '可视化地裁剪和缩放图片。', styleType: 'tertiary', href: '/tools/image-cropper.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>' },
            { id: 'barcode-generator', title: '条码/二维码生成器', description: '一键生成符合印刷标准的条形码或二维码矢量图。', styleType: 'secondary', href: '/tools/barcode-generator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.5v15m16.5-15v15M6.75 6h10.5M6.75 9h10.5M6.75 12h10.5M6.75 15h10.5M6.75 18h10.5" /></svg>' },
            { id: 'copy-generator', title: '包装文案灵感生成器', description: '为您的包装寻找一句话灵感。', styleType: 'tertiary', href: '/tools/copy-generator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>' },
        ]
    },
    productionAndCost: {
        title: '生产与成本',
        tools: [
            { id: 'paper-usage-calculator', title: '纸张用量与成本计算器', description: '选择盒型输入尺寸，智能计算开纸方案与单张成本。', styleType: 'primary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
            { id: 'dieline-cost-estimator', title: '刀版成本估算器', description: '根据刀线和压痕线的总长度，估算一次性刀版费用。', styleType: 'secondary', href: '/tools/dieline-cost-estimator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>' },
            { id: 'lead-time-estimator', title: '生产周期估算器', description: '根据订单数量和工艺复杂度，估算大致的生产所需天数。', styleType: 'secondary', href: '/tools/lead-time-estimator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M12 12.75h.008v.008H12v-.008z" /></svg>' },
            { id: 'line-length-calculator', title: '线长计算器', description: '根据卷材外径、卷芯内径和材料厚度，计算卷材总长度。', styleType: 'secondary', href: '/tools/line-length-calculator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992" /></svg>' },
            { id: 'gsm-converter', title: '克重与厚度换算', description: '根据常见纸张类型，在克重(gsm)和厚度(mm)之间进行估算。', styleType: 'secondary', href: '/tools/gsm-converter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
        ]
    },
    warehousingAndLogistics: {
        title: '仓储与物流',
        tools: [
            { id: 'logistics-cost-calculator', title: '物流成本计算器', description: '输入包裹尺寸，自动计算体积重并估算运费。', styleType: 'primary', href: '/tools/logistics-calculator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375m15.75 9v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 003.375-3.375h1.5c1.85 0 3.375 1.525 3.375 3.375v1.875m-17.25-9a3.375 3.375 0 003.375 3.375h1.5a1.125 1.125 0 011.125 1.125v1.5a3.375 3.375 0 00-3.375 3.375H3.375m1.5-9a3.375 3.375 0 013.375-3.375h1.5a1.125 1.125 0 011.125 1.125v1.5a3.375 3.375 0 01-3.375 3.375H3.375" /></svg>' },
            { id: 'pallet-planner', title: '托盘堆码规划器', description: '可视化展示最佳堆码方案，计算托盘可堆放数量。', styleType: 'primary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>' },
            { id: 'box-packing-calculator', title: '拼箱数量计算器', description: '估算一个大箱子最多能装下多少个小内盒。', styleType: 'secondary', href: '/tools/box-packing-calculator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>' },
            { id: 'rop-calculator', title: '安全库存与再订货点计算器', description: '通过科学计算，助您在不牺牲安全性的前提下，最大化降低库存成本。', styleType: 'secondary', href: '/tools/rop-calculator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18h-5.25m-7.5 0h7.5m-7.5 0l-1.5-1.5L5.25 15l1.5-1.5L5.25 12l1.5-1.5L5.25 9l1.5-1.5L5.25 6l1.5-1.5L5.25 3" /></svg>' },
            { id: 'drop-test-reference', title: '包装跌落测试高度参考', description: '根据包装重量，查询ISTA标准建议的测试跌落高度。', styleType: 'secondary', href: '/tools/drop-test-reference.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
        ]
    },
    generalUtilities: {
        title: '通用效率工具',
        tools: [
            { id: 'unit-converter', title: '单位换算工具', description: '覆盖长度、重量、克重等包装行业常用单位的快速互换。', styleType: 'secondary', href: '#', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
            { id: 'unit-converter-general', title: '通用单位换算器', description: '在各种通用单位之间进行转换。', styleType: 'secondary', href: '/tools/unit-converter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
            { id: 'qrcode-generator', title: '二维码生成器', description: '根据文本或链接生成二维码。', styleType: 'secondary', href: '/tools/qrcode-generator.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 15.375a1.125 1.125 0 011.125-1.125h4.5a1.125 1.125 0 011.125 1.125v4.5a1.125 1.125 0 01-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /></svg>' },
            { id: 'word-counter', title: '字数统计', description: '统计文本的字符数和单词数。', styleType: 'tertiary', href: '/tools/word-counter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m-1.233 15.375-2.25 2.25M12 3.75l-2.25 2.25M12 3.75l2.25 2.25M12 15.75l2.25 2.25M12 15.75l-2.25 2.25M3.75 9l2.25-2.25M3.75 9l-2.25-2.25M15.75 9l2.25-2.25M15.75 9l-2.25-2.25M20.25 15l-2.25 2.25M20.25 15l2.25 2.25M3.75 15l2.25 2.25M3.75 15l-2.25 2.25M4.5 12l-2.25 2.25M4.5 12l2.25 2.25" /></svg>' },
            { id: 'case-converter', title: '大小写转换', description: '一键转换文本的大小写格式。', styleType: 'tertiary', href: '/tools/case-converter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" /></svg>' },
            { id: 'text-diff', title: '文本对比工具', description: '高亮显示两段文本之间的差异。', styleType: 'tertiary', href: '/tools/text-diff.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>' },
            { id: 'json-formatter', title: 'JSON 格式化', description: '美化和校验 JSON 数据。', styleType: 'tertiary', href: '/tools/json-formatter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" /></svg>' },
            { id: 'url-encoder', title: 'URL 编码/解码', description: '编码或解码 URL 中的特殊字符。', styleType: 'tertiary', href: '/tools/url-encoder.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>' },
            { id: 'base64-encoder', title: 'Base64 编码/解码', description: '对文本进行 Base64 编码或解码。', styleType: 'tertiary', href: '/tools/base64-encoder.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.625M21 21l-5.25-11.625M3 10.5h18M4.5 3.75l-1.5 1.5M4.5 3.75l1.5 1.5M19.5 3.75l-1.5 1.5M19.5 3.75l1.5 1.5" /></svg>' },
            { id: 'timezone-converter', title: '时区转换器', description: '在不同时区之间转换时间。', styleType: 'tertiary', href: '/tools/timezone-converter.html', icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
        ]
    }
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
    };

    renderSidebar();
    initSharedEventListeners();
});
