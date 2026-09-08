// Theme Management
(function () {
  const STORAGE_KEY = 'system_commands_theme';
  const html = document.documentElement;

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'auto';
  }

  function applyTheme(theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      html.setAttribute('data-theme', theme);
    }
    updateThemeUI(theme);
  }

  function updateThemeUI(theme) {
    const label = document.getElementById('theme-label');
    const icon = document.getElementById('theme-icon');
    if (!label || !icon) return;

    if (theme === 'dark') {
      label.textContent = 'Dark';
      icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else if (theme === 'light') {
      label.textContent = 'Light';
      icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      label.textContent = 'Auto';
      icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 3a9 9 0 0 0 0 18v-18z" fill="currentColor"></path></svg>`;
    }
  }

  window.setTheme = function(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
    const dropdown = document.getElementById('theme-dropdown');
    if (dropdown) dropdown.classList.remove('open');
  };

  // Initial theme application
  applyTheme(getSavedTheme());

  // Listen to OS theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getSavedTheme() === 'auto') {
      applyTheme('auto');
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeUI(getSavedTheme());

    // Theme dropdown toggle
    const themeBtn = document.getElementById('theme-select-btn');
    const dropdown = document.getElementById('theme-dropdown');
    if (themeBtn && dropdown) {
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    }
  });
})();

document.addEventListener('DOMContentLoaded', function () {
  // 1. Generate "On this page" Table of Contents
  const tocContainer = document.getElementById('on-this-page-toc');
  const contentWrapper = document.querySelector('.content-wrapper');

  if (tocContainer && contentWrapper) {
    const headings = contentWrapper.querySelectorAll('h2, h3');
    if (headings.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'toc-list';

      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = 'section-' + (heading.textContent || '')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-') || `heading-${index}`;
        }

        const li = document.createElement('li');
        li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.textContent.replace(/^#+\s*/, '');
        a.className = 'toc-link';
        li.appendChild(a);
        ul.appendChild(li);
      });

      tocContainer.innerHTML = '';
      tocContainer.appendChild(ul);

      // ScrollSpy for Active Section Indicator
      const tocLinks = ul.querySelectorAll('.toc-link');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            tocLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1
      });

      headings.forEach((h) => observer.observe(h));
    } else {
      const parent = tocContainer.closest('.right-sidebar');
      if (parent) parent.style.display = 'none';
    }
  }

  // 2. Collapsible Sidebar Groups & Auto-Expand Active
  const weekGroups = document.querySelectorAll('.week-group');
  weekGroups.forEach((group) => {
    const header = group.querySelector('.week-header');
    const topicList = group.querySelector('.topic-list');
    const hasActive = group.querySelector('.nav-link.active');

    // Default open if active inside or open first module
    if (hasActive) {
      group.classList.add('open');
    }

    if (header && topicList) {
      header.addEventListener('click', () => {
        group.classList.toggle('open');
      });
    }
  });

  // 3. Search Modal & Filter
  const searchInput = document.getElementById('search-input');
  const searchModal = document.getElementById('search-modal');
  const searchModalInput = document.getElementById('modal-search-input');
  const searchResults = document.getElementById('search-results');
  const searchClose = document.getElementById('search-modal-close');

  function openSearch() {
    if (searchModal) {
      searchModal.classList.add('active');
      setTimeout(() => searchModalInput && searchModalInput.focus(), 50);
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.remove('active');
      if (searchModalInput) searchModalInput.value = '';
      renderSearchResults('');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('click', openSearch);
    searchInput.addEventListener('focus', openSearch);
  }

  if (searchClose) searchClose.addEventListener('click', closeSearch);

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearch();
    });
  }

  // Keyboard shortcut: Ctrl+K or / or Escape
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    } else if (e.key === '/' && document.activeElement !== searchModalInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  function renderSearchResults(query) {
    if (!searchResults) return;
    const navData = window.__NAVIGATION_DATA__ || [];
    const q = query.trim().toLowerCase();

    if (!q) {
      searchResults.innerHTML = `<div class="search-empty-prompt">Type to search system commands, chapters, or topics...</div>`;
      return;
    }

    const matches = [];
    navData.forEach((section) => {
      if (section.topics) {
        section.topics.forEach((topic) => {
          if (topic.title.toLowerCase().includes(q) || section.week.toLowerCase().includes(q)) {
            matches.push({
              week: section.week,
              title: topic.title,
              url: topic.url
            });
          }
        });
      }
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-no-results">No documentation found for "<strong>${escapeHtml(query)}</strong>"</div>`;
      return;
    }

    searchResults.innerHTML = matches.map((item) => `
      <a href="${item.url}" class="search-result-item">
        <div class="search-result-meta">${escapeHtml(item.week)}</div>
        <div class="search-result-title">${highlightMatch(escapeHtml(item.title), q)}</div>
      </a>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function highlightMatch(text, query) {
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;
    return text.substring(0, index) + '<mark>' + text.substring(index, index + query.length) + '</mark>' + text.substring(index + query.length);
  }

  if (searchModalInput) {
    searchModalInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // 4. Code Block Copy Buttons
  document.querySelectorAll('pre').forEach((pre) => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.setAttribute('aria-label', 'Copy code');
    copyBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `;

    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const textToCopy = code ? code.innerText : pre.innerText;

      try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34a853" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="color: #34a853;">Copied!</span>
        `;
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          `;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(copyBtn);
  });

  // 5. Mobile Sidebar Toggle
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (mobileToggle && sidebar && overlay) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }
});
