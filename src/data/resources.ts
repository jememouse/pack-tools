export interface ResourceItem {
  id: string;
  title: string;
  category: '设计与规范手册' | '实用清单与模板' | '行业洞察';
  summary: string;
  url: string;
  tags: string[];
}

export interface ResourceChannel {
  id: string;
  title: string;
  summary: string;
  url: string;
  focus: string;
  badge: string;
}

export const resourceChannels: ResourceChannel[] = [
  {
    id: 'resource-library',
    title: '资源库',
    summary: '集中梳理包装业务中的方法论、工具与案例，帮助团队快速对齐语言与基准。',
    url: 'resources/library.html',
    focus: '定位与功能版块',
    badge: '总览',
  },
  {
    id: 'resource-overview',
    title: '资源库概览',
    summary: '四大板块一目了然，提供近期上新主题、内容更新节奏与使用建议。',
    url: 'resources/overview.html',
    focus: '导航与更新计划',
    badge: '导览',
  },
  {
    id: 'resource-design',
    title: '设计与规范手册',
    summary: '覆盖材料、结构、色彩与可持续策略，配套标准化模板与测试指引。',
    url: 'resources/design.html',
    focus: '结构与美学标准',
    badge: '设计',
  },
  {
    id: 'resource-checklists',
    title: '实用清单与模板',
    summary: '提供跨部门协作所需的检查、评估与复盘模版，降低沟通与执行门槛。',
    url: 'resources/checklists.html',
    focus: '流程与执行',
    badge: '清单',
  },
  {
    id: 'resource-insights',
    title: '行业洞察',
    summary: '追踪包装行业政策、材料趋势与创新技术，支持战略判断与布局。',
    url: 'resources/insights.html',
    focus: '趋势与策略',
    badge: '洞察',
  },
];

export const resources: ResourceItem[] = [
  {
    id: 'material-handbook',
    title: '材料速查手册',
    category: '设计与规范手册',
    summary: '按基材、克重与特性整理常用包装材料，为结构与采购提供参数参考。',
    url: 'resources/design.html#material-handbook',
    tags: ['材料参数', '应用建议'],
  },
  {
    id: 'process-handbook',
    title: '工艺速查手册',
    category: '设计与规范手册',
    summary: '涵盖烫金、UV、击凸、激光镂空等特殊工艺的效果展示与适用场景。',
    url: 'resources/design.html#process-handbook',
    tags: ['后道工艺', '成本提示'],
  },
  {
    id: 'structure-guide',
    title: '包装结构指南',
    category: '设计与规范手册',
    summary: '总结开槽、锁底、天地盖等结构特点，附抗压测试与装配要点。',
    url: 'resources/design.html#structure-guide',
    tags: ['结构设计', '性能'],
  },
  {
    id: 'color-management',
    title: '印刷色彩管理',
    category: '设计与规范手册',
    summary: '从打样、柔版到胶印的色彩控制策略，附常用 ΔE 标准与 ICC 配置。',
    url: 'resources/design.html#color-management',
    tags: ['色彩管理', 'ICC'],
  },
  {
    id: 'prepress-checklist',
    title: '印前检查清单',
    category: '实用清单与模板',
    summary: '逐项核对尺寸、出血、色彩与刀线层，减少反复返工与沟通成本。',
    url: 'resources/checklists.html#prepress-checklist',
    tags: ['印前流程', '质量控制'],
  },
  {
    id: 'supplier-audit',
    title: '供应商考察清单',
    category: '实用清单与模板',
    summary: '从资质、设备、质量体系与交付能力四个维度评估潜在供应商。',
    url: 'resources/checklists.html#supplier-audit',
    tags: ['供应链', '评估'],
  },
  {
    id: 'rfq-template',
    title: '报价请求 (RFQ) 模板',
    category: '实用清单与模板',
    summary: '标准化收集材料、工艺、交期与包装要求，确保报价信息完整。',
    url: 'resources/checklists.html#rfq-template',
    tags: ['采购', '模板'],
  },
  {
    id: 'industry-news',
    title: '行业关键资讯',
    category: '行业洞察',
    summary: '每周更新纸价、能源、政策与新技术，帮助团队及时调整策略。',
    url: 'resources/insights.html#industry-news',
    tags: ['市场动态', '趋势'],
  },
  {
    id: 'sustainable-trend',
    title: '可持续包装趋势',
    category: '行业洞察',
    summary: '关注全球减塑、循环再利用与法规动向，助力绿色设计决策。',
    url: 'resources/insights.html#sustainable-trend',
    tags: ['可持续', '法规'],
  },
  {
    id: 'smart-packaging-playbook',
    title: '智慧包装应用指南',
    category: '行业洞察',
    summary: '梳理传感器、序列化与追溯方案，帮助团队评估智慧包装落地价值与技术选型。',
    url: 'resources/smart-packaging.html',
    tags: ['物联网', '序列化', '数据回传'],
  },
  {
    id: 'cold-chain-blueprint',
    title: '冷链包装解决方案蓝图',
    category: '设计与规范手册',
    summary: '聚焦医药与生鲜冷链，给出控温材料、验证流程以及运输监测策略。',
    url: 'resources/cold-chain-packaging.html',
    tags: ['冷链', '保温材料', '验证方案'],
  },
  {
    id: 'cost-optimization-kit',
    title: '包装成本优化指引',
    category: '实用清单与模板',
    summary: '从结构、材料与供应链三方面梳理成本抓手，附带季度复盘模板与 KPI 建议。',
    url: 'resources/packaging-cost.html',
    tags: ['成本控制', '采购协同', '复盘模板'],
  },
];
