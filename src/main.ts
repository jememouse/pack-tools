import './styles/tailwind.css';
import { toolModals, ToolModalId } from './components/toolModals';
import {
  initLogisticsCalculator,
  initPaperCalculator,
  initPalletPlanner,
} from './utils/calculators';
import type { ResourceItem } from './data/resources';
import { resourceChannels, resources as fallbackResources } from './data/resources';
import type { SupplierItem } from './data/suppliers';
import { suppliers as fallbackSuppliers } from './data/suppliers';

type Focusable = HTMLElement | null;

const body = document.body;
const modalRoot = document.getElementById('modal-root');
const modalBackdrop = modalRoot?.querySelector<HTMLElement>('[data-modal-backdrop]');
const modalContainer = modalRoot?.querySelector<HTMLElement>('[data-modal-container]');

const RESOURCE_ENDPOINT = (import.meta.env.VITE_RESOURCE_API ?? '').toString().trim();
const SUPPLIER_ENDPOINT = (import.meta.env.VITE_SUPPLIER_API ?? '').toString().trim();
const NEWSLETTER_ENDPOINT = (import.meta.env.VITE_NEWSLETTER_API ?? '').toString().trim();

let activeModalId: ToolModalId | null = null;
let lastFocusedElement: Focusable = null;
let supplierFilters: { service: string; region: string } = { service: '', region: '' };
let resourceData: ResourceItem[] = [...fallbackResources];
let supplierData: SupplierItem[] = [...fallbackSuppliers];
let resourceStatusElement: HTMLElement | null = null;
let supplierStatusElement: HTMLElement | null = null;
let toolboxObserver: IntersectionObserver | null = null;

type StatusTone = 'info' | 'success' | 'error';

function setStatus(element: HTMLElement | null, message: string, tone: StatusTone = 'info') {
  if (!element) {
    return;
  }
  element.textContent = message;
  element.classList.remove('text-gray-500', 'text-green-600', 'text-red-600');
  switch (tone) {
    case 'success':
      element.classList.add('text-green-600');
      break;
    case 'error':
      element.classList.add('text-red-600');
      break;
    default:
      element.classList.add('text-gray-500');
  }
}

function renderModals() {
  if (!modalContainer) {
    return;
  }

  modalContainer.innerHTML = '';
  toolModals.forEach((modal) => {
    const section = document.createElement('section');
    section.setAttribute('data-modal', modal.id);
    section.setAttribute('role', 'dialog');
    section.setAttribute('aria-modal', 'true');
    section.setAttribute('aria-labelledby', `${modal.id}-title`);
    section.className = 'modal-panel relative w-full max-w-3xl transition transform origin-top';
    section.innerHTML = `
      <div class="relative w-full rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 id="${modal.id}-title" class="text-2xl font-semibold text-gray-900">${modal.title}</h2>
            <p class="mt-2 text-sm text-gray-600">${modal.description}</p>
          </div>
          <button type="button" class="text-gray-500 hover:text-gray-700" data-modal-close aria-label="关闭工具">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="mt-6">
          ${modal.content}
        </div>
      </div>
    `;
    section.classList.add('hidden');
    modalContainer.append(section);
  });
}

function lockScroll() {
  body.classList.add('overflow-hidden');
}

function unlockScroll() {
  body.classList.remove('overflow-hidden');
}

function openModal(id: ToolModalId) {
  if (!modalRoot || !modalBackdrop || !modalContainer) {
    return;
  }

  const target = modalContainer.querySelector<HTMLElement>(`[data-modal="${id}"]`);
  if (!target) {
    return;
  }

  lastFocusedElement = (document.activeElement as Focusable) ?? null;
  activeModalId = id;

  modalRoot.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
  modalContainer.classList.remove('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'false');

  modalContainer.querySelectorAll<HTMLElement>('[data-modal]').forEach((panel) => {
    if (panel === target) {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
    } else {
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  lockScroll();

  const focusableInput = target.querySelector<HTMLElement>('input, select, textarea, button');
  focusableInput?.focus();
}

function closeModal() {
  if (!modalRoot || !modalBackdrop || !modalContainer) {
    return;
  }

  modalBackdrop.classList.add('hidden');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  modalContainer.classList.add('hidden');
  modalContainer.querySelectorAll<HTMLElement>('[data-modal]').forEach((panel) => {
    panel.classList.add('hidden');
    panel.setAttribute('aria-hidden', 'true');
  });
  modalRoot.classList.add('hidden');
  activeModalId = null;
  unlockScroll();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function handleDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeModalId) {
    closeModal();
  }
}

function bindModalTriggers() {
  const triggers = document.querySelectorAll<HTMLElement>('[data-modal-target]');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-target') as ToolModalId | null;
      if (targetId) {
        openModal(targetId);
      }
    });
  });

  modalBackdrop?.addEventListener('click', closeModal);
  modalContainer?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.modalClose !== undefined) {
      closeModal();
    }
  });

  modalContainer?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.matches('[data-modal-close], [data-modal-close] *')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', handleDocumentKeydown);
}

function renderResources() {
  const container = document.querySelector<HTMLElement>('[data-resources-list]');
  if (!container) {
    return;
  }

  const categoryOrder = new Map([
    ['设计与规范手册', 0],
    ['实用清单与模板', 1],
    ['行业洞察', 2],
  ] as const);

  const categorySlugMap: Record<string, string> = {
    '设计与规范手册': 'resources-design',
    '实用清单与模板': 'resources-checklists',
    '行业洞察': 'resources-insights',
  };

  const grouped = new Map<string, ResourceItem[]>();
  resourceData.forEach((item) => {
    const list = grouped.get(item.category) ?? [];
    list.push(item);
    grouped.set(item.category, list);
  });

  container.innerHTML = '';

  const channelSection = document.createElement('div');
  channelSection.className = 'space-y-4';

  const channelHeading = document.createElement('h3');
  channelHeading.className = 'text-xl font-semibold text-gray-800';
  channelHeading.textContent = '资源频道导航';
  channelSection.append(channelHeading);

  const channelGrid = document.createElement('div');
  channelGrid.className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-5';

  resourceChannels.forEach((channel) => {
    const link = document.createElement('a');
    link.href = channel.url;
    link.className = 'group flex h-full flex-col justify-between rounded-2xl border border-blue-100 bg-blue-50/70 p-6 transition hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500';
    link.setAttribute('data-resource-channel', channel.id);
    link.innerHTML = `
      <div class="flex items-center justify-between gap-3">
        <span class="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700">${channel.badge}</span>
        <svg class="h-5 w-5 text-blue-500 transition group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </div>
      <div class="mt-4">
        <h4 class="text-lg font-semibold text-gray-900">${channel.title}</h4>
        <p class="mt-3 text-sm leading-relaxed text-gray-600">${channel.summary}</p>
      </div>
      <div class="mt-4 rounded-xl border border-white/70 bg-white/80 p-4 text-xs font-medium text-blue-800">关注重点：${channel.focus}</div>
    `;
    channelGrid.append(link);
  });

  channelSection.append(channelGrid);
  container.append(channelSection);

  const categoriesInOrder = [...grouped.entries()]
    .sort((a, b) => (categoryOrder.get(a[0]) ?? 99) - (categoryOrder.get(b[0]) ?? 99));

  if (categoriesInOrder.length === 0) {
    container.innerHTML = '<div class="rounded-xl border border-dashed border-gray-300 bg-white/70 px-6 py-12 text-center text-sm text-gray-500">资源库暂未提供内容，您可以稍后再试或联系团队获取离线资料。</div>';
    return;
  }

  categoriesInOrder.forEach(([category, items]) => {
    if (items.length === 0) {
      return;
    }

    items.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));

    const section = document.createElement('div');
    section.className = 'space-y-4';
    const sectionId = categorySlugMap[category] ?? `resources-${category.replace(/\s+/g, '-').toLowerCase()}`;
    section.id = sectionId;

    const heading = document.createElement('h3');
    heading.className = 'text-xl font-semibold text-gray-800';
    heading.textContent = category;

    const grid = document.createElement('div');
    grid.className = 'grid gap-6 md:grid-cols-2 lg:grid-cols-3';

    items.forEach((item) => {
      const tagBadges = (item.tags.length > 0
        ? item.tags
        : ['待补充']
      )
        .map(
          (tag) =>
            `<li class="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">${tag}</li>`,
        )
        .join('');

      const card = document.createElement('article');
      card.className = 'group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md';
      card.setAttribute('data-resource-id', item.id);
      const detailButton = item.url
        ? `<a href="${item.url}" class="mt-4 inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700" data-resource-link aria-label="查看 ${item.title} 详情">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <span>查看详情</span>
          </a>`
        : '';

      card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">${category}</span>
          <span class="text-xs uppercase tracking-widest text-gray-400">${item.id.replace(/[-_]/g, ' ').toUpperCase()}</span>
        </div>
        <div class="mt-4">
          <h4 class="text-lg font-semibold text-gray-900">${item.title}</h4>
          <p class="mt-3 text-sm leading-relaxed text-gray-600">${item.summary}</p>
        </div>
        <div class="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-sm text-gray-700">
          <p class="font-semibold text-gray-800">重点导引</p>
          <p class="mt-2 text-gray-600">围绕以下主题展开，适用于制订标准、团队培训与供应链协同：</p>
          <ul class="mt-3 flex flex-wrap gap-2 list-none p-0" aria-label="资源关键词">
            ${tagBadges}
          </ul>
        </div>
        ${detailButton}
        <p class="mt-4 text-xs text-gray-400">完整资料将在资源库正式版中提供下载，如需提前介入可通过页面底部联系方式咨询顾问团队。</p>
      `;

      grid.append(card);
    });

    section.append(heading);
    section.append(grid);
    container.append(section);
  });

  setupToolboxNavigation();
}

function formatRating(rating: number): string {
  return rating.toFixed(1);
}

function populateSupplierFilters(data: SupplierItem[]) {
  const serviceSelect = document.querySelector<HTMLSelectElement>('[data-supplier-filter="service"]');
  const regionSelect = document.querySelector<HTMLSelectElement>('[data-supplier-filter="region"]');

  if (!serviceSelect || !regionSelect) {
    return;
  }

  const serviceSet = new Set<string>();
  const regionSet = new Set<string>();

  data.forEach((supplier) => {
    supplier.services.forEach((service) => serviceSet.add(service));
    regionSet.add(supplier.region);
  });

  const appendOptions = (select: HTMLSelectElement, values: string[]) => {
    const previousValue = select.value;
    const placeholder = select.dataset.placeholder ?? '';
    select.innerHTML = '';
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    select.append(placeholderOption);
    values
      .sort((a, b) => a.localeCompare(b, 'zh-CN'))
      .forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.append(option);
      });

    if (previousValue && values.includes(previousValue)) {
      select.value = previousValue;
    } else {
      select.value = '';
    }
  };

  appendOptions(serviceSelect, Array.from(serviceSet));
  appendOptions(regionSelect, Array.from(regionSet));

  supplierFilters = {
    service: serviceSelect.value,
    region: regionSelect.value,
  };
}

function renderSupplierCards() {
  const list = document.querySelector<HTMLElement>('[data-supplier-list]');
  const countEl = document.querySelector<HTMLElement>('[data-supplier-count]');

  if (!list || !countEl) {
    return;
  }

  const filtered = supplierData
    .filter((supplier) => {
      const matchService = supplierFilters.service
        ? supplier.services.includes(supplierFilters.service)
        : true;
      const matchRegion = supplierFilters.region ? supplier.region === supplierFilters.region : true;
      return matchService && matchRegion;
    })
    .sort((a, b) => b.rating - a.rating);

  countEl.textContent = `当前共 ${filtered.length} 家匹配供应商。`;
  list.innerHTML = '';

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500';
    emptyState.innerHTML = '暂未找到符合筛选条件的供应商，请尝试调整筛选条件或联系我们的顾问团队。';
    list.append(emptyState);
    return;
  }

  filtered.forEach((supplier) => {
    const article = document.createElement('article');
    article.className = 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-green-500';

    const certifications = supplier.certifications
      .map((cert) => `<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs text-green-700">${cert}</span>`)
      .join('');

    const services = supplier.services
      .map((service) => `<span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700">${service}</span>`)
      .join('');

    const websiteLink = supplier.website
      ? `<a href="${supplier.website}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600">官网</a>`
      : '';

    const phoneLink = supplier.contactPhone
      ? `<a href="tel:${supplier.contactPhone.replace(/\s+/g, '')}" class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600">电话</a>`
      : '';

    article.innerHTML = `
      <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-900">${supplier.name}</h3>
            <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">${supplier.city}</span>
            <span class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700" aria-label="综合评分 ${formatRating(supplier.rating)} / 5">评分 ${formatRating(supplier.rating)}</span>
          </div>
          <p class="mt-3 text-sm text-gray-600">${supplier.description}</p>
        </div>
        <div class="flex flex-wrap gap-2" aria-label="资质认证">${certifications}</div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2" aria-label="服务类型">${services}</div>
      <dl class="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-3">
        <div><dt class="font-medium text-gray-700">区域</dt><dd>${supplier.region}</dd></div>
        <div><dt class="font-medium text-gray-700">响应时间</dt><dd>约 ${supplier.responseTimeHours} 小时</dd></div>
        <div><dt class="font-medium text-gray-700">联系方式</dt><dd><a class="text-blue-600 hover:underline" href="mailto:${supplier.contactEmail}">${supplier.contactEmail}</a></dd></div>
      </dl>
      <div class="mt-4 flex flex-wrap gap-3">
        ${websiteLink}
        <a href="mailto:${supplier.contactEmail}" class="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600">邮件</a>
        ${phoneLink}
      </div>
    `;

    list.append(article);
  });
}

function setupSupplierDirectory() {
  populateSupplierFilters(supplierData);
  renderSupplierCards();

  const filters = document.querySelectorAll<HTMLSelectElement>('[data-supplier-filter]');
  filters.forEach((filter) => {
    filter.addEventListener('change', () => {
      const key = filter.dataset.supplierFilter as 'service' | 'region';
      if (key) {
        supplierFilters = {
          ...supplierFilters,
          [key]: filter.value,
        };
        renderSupplierCards();
      }
    });
  });
}

function handleNewsletterForm() {
  const form = document.querySelector<HTMLFormElement>('[data-newsletter-form]');
  const feedback = document.querySelector<HTMLElement>('[data-newsletter-feedback]');
  if (!form || !feedback) {
    return;
  }

  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  const setFeedback = (message: string, type: 'success' | 'error' | 'info') => {
    feedback.textContent = message;
    feedback.classList.remove('text-red-600', 'text-green-600', 'text-gray-500');
    if (type === 'success') {
      feedback.classList.add('text-green-600');
    } else if (type === 'error') {
      feedback.classList.add('text-red-600');
    } else {
      feedback.classList.add('text-gray-500');
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = (formData.get('email') as string | null)?.trim() ?? '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFeedback('请输入有效的邮箱地址。', 'error');
      return;
    }

    submitButton?.setAttribute('disabled', 'true');
    setFeedback('提交中，请稍候...', 'info');

    if (NEWSLETTER_ENDPOINT) {
      fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json().catch(() => ({}));
        })
        .then(() => {
          setFeedback('订阅成功！我们会定期为您推送行业精选资讯。', 'success');
          form.reset();
        })
        .catch(() => {
          setFeedback('提交失败，请稍后重试或发送邮件至 contact@packaging-toolbox.site。', 'error');
        })
        .finally(() => {
          submitButton?.removeAttribute('disabled');
        });
      return;
    }

    window.setTimeout(() => {
      setFeedback('订阅成功！我们会定期为您推送行业精选资讯。', 'success');
      form.reset();
      submitButton?.removeAttribute('disabled');
    }, 600);
  });
}

function setSupplierData(data: SupplierItem[]) {
  supplierData = [...data];
  populateSupplierFilters(supplierData);
  renderSupplierCards();
}

async function loadSuppliersFromAPI() {
  if (!SUPPLIER_ENDPOINT) {
    setStatus(supplierStatusElement, '使用平台精选供应商列表，更多合作伙伴可在后台开通。', 'info');
    return;
  }

  setStatus(supplierStatusElement, '正在同步供应商名录...', 'info');

  try {
    const response = await fetch(SUPPLIER_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Supplier request failed with status ${response.status}`);
    }
    const payload = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error('Supplier response is not an array');
    }
    setSupplierData(payload as SupplierItem[]);
    setStatus(supplierStatusElement, `已加载 ${supplierData.length} 家供应商。`, 'success');
  } catch (error) {
    console.error('Failed to load suppliers:', error);
    setSupplierData([...fallbackSuppliers]);
    setStatus(supplierStatusElement, '供应商服务暂不可用，已展示平台精选列表。', 'error');
  }
}

function setResourceData(data: ResourceItem[]) {
  resourceData = [...data];
  renderResources();
}

async function loadResourcesFromAPI() {
  if (!RESOURCE_ENDPOINT) {
    setStatus(resourceStatusElement, '展示平台精选资源，更多内容即将上线。', 'info');
    return;
  }

  setStatus(resourceStatusElement, '正在同步资源库...', 'info');

  try {
    const response = await fetch(RESOURCE_ENDPOINT);
    if (!response.ok) {
      throw new Error(`Resource request failed with status ${response.status}`);
    }
    const payload = await response.json();
    if (!Array.isArray(payload)) {
      throw new Error('Resource response is not an array');
    }
    setResourceData(payload as ResourceItem[]);
    setStatus(resourceStatusElement, `已同步 ${resourceData.length} 条最新资源。`, 'success');
  } catch (error) {
    console.error('Failed to load resources:', error);
    setResourceData([...fallbackResources]);
    setStatus(resourceStatusElement, '资源服务暂不可用，已显示精选内容。', 'error');
  }
}

function setupMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-navigation');

  if (!menuToggle || !mobileNav) {
    return;
  }

  const hideMenu = () => {
    mobileNav.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', () => {
    const isHidden = mobileNav.classList.toggle('hidden');
    menuToggle.setAttribute('aria-expanded', String(!isHidden));
  });

  mobileNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.closest('a')) {
      hideMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideMenu();
    }
  });
}

function setupToolboxNavigation(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-toolbox-link]'));
  if (links.length === 0) {
    return;
  }

  const toggleButton = document.querySelector<HTMLButtonElement>('[data-toolbox-nav-toggle]');
  const mobileNav = document.querySelector<HTMLElement>('[data-toolbox-nav-mobile]');

  if (toggleButton && !toggleButton.dataset.toolboxToggleInit) {
    toggleButton.addEventListener('click', () => {
      if (!mobileNav) {
        return;
      }
      const isHidden = mobileNav.classList.toggle('hidden');
      toggleButton.setAttribute('aria-expanded', String(!isHidden));
    });
    toggleButton.dataset.toolboxToggleInit = 'true';
  }

  const ACTIVE_CLASSES = ['bg-blue-50', 'text-blue-700', 'font-semibold'];

  const setActive = (hash: string | null) => {
    links.forEach((link) => {
      const baseClass = link.dataset.baseClass;
      if (baseClass) {
        link.classList.remove('text-blue-700', 'text-blue-600', ...ACTIVE_CLASSES);
        link.classList.add(baseClass);
      } else {
        link.classList.remove(...ACTIVE_CLASSES);
      }

      if (hash && link.getAttribute('href') === hash) {
        if (baseClass) {
          link.classList.remove(baseClass);
        }
        link.classList.add(...ACTIVE_CLASSES);
      }
    });
  };

  if (toolboxObserver) {
    toolboxObserver.disconnect();
    toolboxObserver = null;
  }

  const sections = links
    .map((link) => {
      const target = link.getAttribute('href');
      if (!target || !target.startsWith('#')) {
        return null;
      }
      const element = document.querySelector<HTMLElement>(target);
      return element ? { id: target, element } : null;
    })
    .filter((item): item is { id: string; element: HTMLElement } => Boolean(item));

  const defaultHash = links.some((link) => link.getAttribute('href') === window.location.hash)
    ? window.location.hash
    : '#toolbox-core';

  if (sections.length === 0) {
    setActive(defaultHash);
    return;
  }

  toolboxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(`#${entry.target.id}`);
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0.1 },
  );

  sections.forEach(({ element }) => toolboxObserver?.observe(element));

  links.forEach((link) => {
    if (link.dataset.toolboxListener === 'true') {
      return;
    }
    const target = link.getAttribute('href');
    if (!target || !target.startsWith('#')) {
      return;
    }
    const section = document.querySelector<HTMLElement>(target);
    if (!section) {
      return;
    }
    link.addEventListener('click', (event) => {
      event.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', target);
      setActive(target);
      if (mobileNav && !mobileNav.classList.contains('hidden')) {
        mobileNav.classList.add('hidden');
        toggleButton?.setAttribute('aria-expanded', 'false');
      }
    });
    link.dataset.toolboxListener = 'true';
  });

  setActive(defaultHash);
}

function initialise() {
  resourceStatusElement = document.querySelector('[data-resources-status]');
  supplierStatusElement = document.querySelector('[data-supplier-status]');
  renderModals();
  setupMenuToggle();
  setupToolboxNavigation();
  bindModalTriggers();
  renderResources();
  setupSupplierDirectory();
  void loadResourcesFromAPI();
  void loadSuppliersFromAPI();
  handleNewsletterForm();
  initLogisticsCalculator();
  initPaperCalculator();
  initPalletPlanner();
}

document.addEventListener('DOMContentLoaded', initialise);
