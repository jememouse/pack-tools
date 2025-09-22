export interface SupplierItem {
  id: string;
  name: string;
  region: '华东' | '华南' | '华北' | '华中' | '西南' | '海外';
  city: string;
  services: string[];
  certifications: string[];
  responseTimeHours: number;
  rating: number;
  description: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
}

export const suppliers: SupplierItem[] = [
  {
    id: 'su-01',
    name: '杭州智包科技有限公司',
    region: '华东',
    city: '浙江·杭州',
    services: ['彩盒定制', '结构工程共创', '供应链代采'],
    certifications: ['ISO 9001', 'FSC', 'BRC'],
    responseTimeHours: 6,
    rating: 4.8,
    description: '专注 3C 与消费电子彩盒，提供从结构设计到落地生产的一体化解决方案，交期可压缩 15%。',
    website: 'https://www.smartpack.cn/',
    contactEmail: 'sales@smartpack.cn',
    contactPhone: '0571-8888 1234',
  },
  {
    id: 'su-02',
    name: '深圳蓝海绿色包装',
    region: '华南',
    city: '广东·深圳',
    services: ['环保材料', '彩箱印刷', '物流配送'],
    certifications: ['ISO 14001', 'FSC'],
    responseTimeHours: 4,
    rating: 4.6,
    description: '拥有可降解 PLA、甘蔗浆等材料供应链，配套华南区域仓配服务，适合跨境电商品牌。',
    website: 'https://www.bluepack.cn/',
    contactEmail: 'contact@bluepack.cn',
  },
  {
    id: 'su-03',
    name: '天津恒达瓦楞纸业',
    region: '华北',
    city: '天津',
    services: ['重型瓦楞', '防震包装设计', '批量代工'],
    certifications: ['ISO 9001'],
    responseTimeHours: 12,
    rating: 4.2,
    description: '服务新能源与汽车零部件领域，提供重型瓦楞纸箱与内衬设计，支持 ISTA 运输测试。',
    contactEmail: 'service@hengdapack.com',
    contactPhone: '022-6666 8888',
  },
  {
    id: 'su-04',
    name: '成都精匠包装设计工作室',
    region: '西南',
    city: '四川·成都',
    services: ['品牌策略', '结构设计', '小批量打样'],
    certifications: ['SGS 食品接触认证'],
    responseTimeHours: 8,
    rating: 4.7,
    description: '面向食品与新茶饮品牌，擅长品牌调性包装、创意刀线开发及 3D 渲染展示。',
    website: 'https://www.craftboxstudio.cn/',
    contactEmail: 'hello@craftboxstudio.cn',
  },
  {
    id: 'su-05',
    name: '香港联贸国际物流',
    region: '海外',
    city: '中国香港',
    services: ['国际空运', '海运拼箱', 'FBA 头程'],
    certifications: ['IATA', 'WCA'],
    responseTimeHours: 3,
    rating: 4.5,
    description: '覆盖美欧 FBA 头程与退货处理，为跨境包装成品出口提供全链路物流支持。',
    website: 'https://www.globalpacklogistics.com/',
    contactEmail: 'cs@globalpacklogistics.com',
  },
  {
    id: 'su-06',
    name: '苏州匠心印艺',
    region: '华东',
    city: '江苏·苏州',
    services: ['精品礼盒', '工艺打样', '数码短版印刷'],
    certifications: ['ISO 12647', 'Disney FAMA'],
    responseTimeHours: 5,
    rating: 4.9,
    description: '擅长高端礼盒与复杂工艺叠加，提供 PANTONE 管控与数字打样服务，广受奢侈品客户好评。',
    contactEmail: 'project@soulprint.cn',
  },
];
