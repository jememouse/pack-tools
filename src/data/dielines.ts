export type DielineCategory =
  | '折叠纸盒'
  | '邮寄盒'
  | '礼盒 / 硬盒'
  | '展示用品'
  | '异形结构';

export interface DielineTemplate {
  id: string;
  name: string;
  category: DielineCategory;
  description: string;
  finishedSize: string;
  materialSuggestion: string;
  fileFormats: string[];
  downloadPath: string;
  tags: string[];
}

export const dielineTemplates: DielineTemplate[] = [
  {
    id: 'rigid-magnet-box',
    name: '磁吸盖礼盒 (240 × 180 × 60 mm)',
    category: '礼盒 / 硬盒',
    description: '经典天地盖结构，含糊口与磁吸位置标注，适合高端礼盒与电子产品包装。',
    finishedSize: '展开 360 × 260 mm',
    materialSuggestion: '157g 铜版纸 + 2mm 灰板，裱糊工艺',
    fileFormats: ['SVG'],
    downloadPath: 'resources/dielines/rigid-magnet-box.svg',
    tags: ['礼盒', '裱糊', '磁吸'],
  },
  {
    id: 'folding-carton-a6',
    name: '折叠纸盒 (A6 台版)',
    category: '折叠纸盒',
    description: '常用直线糊结构，适合化妆品、快消等小规格彩盒，可直接用于叠楞排版。',
    finishedSize: '成品 105 × 148 × 40 mm',
    materialSuggestion: '300g 白卡 / 350g 双铜',
    fileFormats: ['SVG'],
    downloadPath: 'resources/dielines/folding-carton-a6.svg',
    tags: ['直线糊', '自动糊盒', '快消'],
  },
  {
    id: 'mailer-box-medium',
    name: '邮寄盒 (320 × 230 × 80 mm)',
    category: '邮寄盒',
    description: 'Fefco 0427 结构，包含折盖与插舌，适合电商发货及订阅礼盒。',
    finishedSize: '展开 560 × 440 mm',
    materialSuggestion: 'E 瓦楞 / F 瓦楞 单坑',
    fileFormats: ['SVG'],
    downloadPath: 'resources/dielines/mailer-box-medium.svg',
    tags: ['Fefco', '电商', '邮寄'],
  },
  {
    id: 'counter-display',
    name: '台式展示架 (180 × 120 × 250 mm)',
    category: '展示用品',
    description: '含后背板与货架托盘，适合零售端台面展示小包装或体验装。',
    finishedSize: '展开 420 × 560 mm',
    materialSuggestion: '400g 白卡 / E 瓦楞 覆膜',
    fileFormats: ['SVG'],
    downloadPath: 'resources/dielines/display-stand.svg',
    tags: ['展示', '陈列', '促销'],
  },
  {
    id: 'pillow-box-small',
    name: '枕式盒 (180 × 60 × 40 mm)',
    category: '异形结构',
    description: '轻巧异形结构，左侧含自动扣锁，适合饰品、配件等轻质产品。',
    finishedSize: '展开 240 × 150 mm',
    materialSuggestion: '250g-300g 白卡 / 特种纸',
    fileFormats: ['SVG'],
    downloadPath: 'resources/dielines/pillow-box-small.svg',
    tags: ['异形', '快消', '手工'],
  },
];

export const dielineCategories: Array<{ value: DielineCategory | '全部'; label: string }> = [
  { value: '全部', label: '全部结构' },
  { value: '折叠纸盒', label: '折叠纸盒' },
  { value: '邮寄盒', label: '邮寄盒' },
  { value: '礼盒 / 硬盒', label: '礼盒 / 硬盒' },
  { value: '展示用品', label: '展示用品' },
  { value: '异形结构', label: '异形结构' },
];
