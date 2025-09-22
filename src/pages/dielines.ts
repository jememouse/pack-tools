import '../styles/tailwind.css';
import { dielineCategories, dielineTemplates } from '../data/dielines';

document.addEventListener('DOMContentLoaded', () => {
  const categorySelect = document.querySelector<HTMLSelectElement>('#dieline-category');
  const searchInput = document.querySelector<HTMLInputElement>('#dieline-search');
  const resultsContainer = document.querySelector<HTMLElement>('[data-dieline-results]');
  const emptyState = document.querySelector<HTMLElement>('[data-dieline-empty]');

  if (!categorySelect || !searchInput || !resultsContainer || !emptyState) {
    return;
  }

  dielineCategories.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    categorySelect.append(option);
  });

  const state = {
    search: '',
    category: '全部',
  };

  const normalise = (value: string): string => value.trim().toLowerCase();

  const filterTemplates = () => {
    const keywords = normalise(state.search);

    return dielineTemplates.filter((template) => {
      if (state.category !== '全部' && template.category !== state.category) {
        return false;
      }

      if (keywords.length === 0) {
        return true;
      }

      const haystack = [
        template.name,
        template.description,
        template.finishedSize,
        template.materialSuggestion,
        template.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return keywords.split(/\s+/).every((word) => haystack.includes(word));
    });
  };

  const renderTemplates = () => {
    const matches = filterTemplates();

    if (matches.length === 0) {
      resultsContainer.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    resultsContainer.innerHTML = '';

    matches.forEach((template) => {
      const card = document.createElement('article');
      card.className = 'template-card';
      card.innerHTML = `
        <header>
          <p class="chip" aria-label="结构类型">${template.category}</p>
          <h3>${template.name}</h3>
        </header>
        <p>${template.description}</p>
        <dl class="template-meta">
          <div><dt style="font-weight:600;">展开/成品尺寸：</dt><dd>${template.finishedSize}</dd></div>
          <div><dt style="font-weight:600;">建议材料：</dt><dd>${template.materialSuggestion}</dd></div>
          <div><dt style="font-weight:600;">文件格式：</dt><dd>${template.fileFormats.join(', ')}</dd></div>
        </dl>
        <div class="chips" aria-label="标签">
          ${template.tags
            .map((tag) => `<span class="chip">${tag}</span>`)
            .join('')}
        </div>
        <div class="template-actions">
          <a class="download" href="${template.downloadPath}" download>下载模板</a>
          <a class="preview" href="${template.downloadPath}" target="_blank" rel="noopener">预览刀线</a>
        </div>
      `;

      resultsContainer.append(card);
    });
  };

  categorySelect.addEventListener('change', () => {
    state.category = categorySelect.value;
    renderTemplates();
  });

  searchInput.addEventListener('input', () => {
    state.search = searchInput.value;
    renderTemplates();
  });

  renderTemplates();
});
