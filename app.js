/* ==========================================================================
   2026 老石人的幸福之旅 - PWA Main Interactive Logic & Search Engine
   ========================================================================== */

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('SW Registered successfully:', reg.scope))
      .catch((err) => console.warn('SW Registration failed:', err));
  });
}

// PWA Install Prompt handling
let deferredPrompt;
const pwaBanner = document.getElementById('pwa-banner');
const installBtn = document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (pwaBanner) pwaBanner.style.display = 'flex';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      deferredPrompt = null;
      if (pwaBanner) pwaBanner.style.display = 'none';
    }
  });
}

// Bottom Navigation Tab Switching
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
const tabContents = document.querySelectorAll('.tab-content');

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const targetTab = item.getAttribute('data-tab');
    
    navItems.forEach((n) => n.classList.remove('active'));
    tabContents.forEach((c) => c.classList.remove('active'));
    
    item.classList.add('active');
    const activeContent = document.getElementById(`tab-${targetTab}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Day Sub-tabs Switching inside Itinerary Tab
const subTabBtns = document.querySelectorAll('.sub-tab-btn');
const dayContents = document.querySelectorAll('.day-content');

subTabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetDay = btn.getAttribute('data-day');
    
    subTabBtns.forEach((b) => b.classList.remove('active'));
    dayContents.forEach((d) => d.classList.remove('active'));
    
    btn.classList.add('active');
    const activeDay = document.getElementById(`day-${targetDay}`);
    if (activeDay) {
      activeDay.classList.add('active');
    }

    // 平滑捲動至行程頂部以提升手機視覺反饋
    const container = document.querySelector('.main-container');
    if (container && window.scrollY > 120) {
      window.scrollTo({ top: container.offsetTop - 70, behavior: 'smooth' });
    }
  });
});

// Search Index Database
const memberDatabase = [
  { name: '妙怡姑姑', phone: '0928-191-866', room: '雙人房 第5間', day1Activity: '傳藝中心(9人)', day1Pickup: '08:10 桃園高鐵站', day2Return: '7/26 13:10前往羅東車站搭13:56火車離團', day3Activity: '-' },
  { name: '維傑', phone: '0912-140-842', room: '雙人房 第6間', day1Activity: '童玩節玩水(21人)', day1Pickup: '08:30 桃園文中路331號(萊爾富旁)', day3Activity: '金特務(18人) + 撈蝦(18人)', day3Return: '7/27 午餐後礁溪車站離團(4人)' },
  { name: '石大哥', phone: '0918-192-592', room: '四人房', day1Pickup: '08:45 桃園新埔六街154號(同安親子公園旁)', day3Return: '7/27 19:00 桃園(6人)' },
  { name: '瑋庭', phone: '0965-017-733', room: '四人房 第1間', day1Activity: '傳藝中心(9人)', day1Pickup: '10:00 松山機場', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)', day3Return: '7/27 19:15 立榮航班' },
  { name: '爸媽', phone: '-', room: '雙人房 第1間', day1Activity: '傳藝中心(9人)', day1Pickup: '08:45 桃園新埔六街154號', day3Activity: '鴨寮故事館(12人)', day3Return: '7/27 19:15 立榮航班' },
  { name: '爸爸', phone: '-', room: '雙人房 第1間', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 釣魚體驗(6人)' },
  { name: '媽媽', phone: '-', room: '雙人房 第1間', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)' },
  { name: '希拉', phone: '-', room: '雙人房 第2間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '阿玥', phone: '-', room: '雙人房 第2間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '儼翰', phone: '-', room: '雙人房 第3間', day1Activity: '傳藝中心(9人)', day3Activity: '金特務(18人) + 釣魚體驗(6人)', day3Return: '7/27 18:00 南京三民捷運站(2人)' },
  { name: '洎銘', phone: '-', room: '雙人房 第3間', day1Activity: '傳藝中心(9人)', day3Activity: '金特務(18人) + 釣魚體驗(6人)' },
  { name: '育豐', phone: '-', room: '雙人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)' },
  { name: '步步', phone: '-', room: '雙人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)' },
  { name: '瑜欣', phone: '-', room: '雙人房 第6間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '阿峻', phone: '-', room: '雙人房 第6間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '阿庭', phone: '-', room: '雙人房 第6間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '姑姑', phone: '-', room: '四人房 第1間', day1Pickup: '10:00 松山機場', day3Return: '7/27 19:15 立榮航班' },
  { name: '姑丈', phone: '-', room: '四人房 第1間' },
  { name: '芷菱', phone: '-', room: '四人房 第1間', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 釣魚體驗(6人)' },
  { name: '蒂蒂', phone: '-', room: '四人房 第1間', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 釣魚體驗(6人)' },
  { name: '叔叔', phone: '-', room: '四人房 第2間', day1Pickup: '10:00 松山機場', day3Return: '7/27 19:15 立榮航班' },
  { name: '嬸嬸', phone: '-', room: '四人房 第2間' },
  { name: '佳馨', phone: '-', room: '四人房 第2間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '崧愉', phone: '-', room: '四人房 第2間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '強強', phone: '-', room: '四人房 第3間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '昭瑜', phone: '-', room: '四人房 第3間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '小逸', phone: '-', room: '四人房 第3間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '浩浩', phone: '-', room: '四人房 第3間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '珮蓉', phone: '-', room: '四人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '鴨寮故事館(12人) + 撈蝦(18人)' },
  { name: '珮娣', phone: '-', room: '四人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)' },
  { name: '丕丞', phone: '-', room: '四人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)', day3Return: '7/27 19:00 桃園' },
  { name: '于欣', phone: '-', room: '四人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '炘倫', phone: '-', room: '四人房 第4間', day1Activity: '童玩節玩水(21人)', day3Activity: '鴨寮故事館(12人) + 撈蝦(18人)' },
  { name: '永耀', phone: '-', room: '行程分流', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 釣魚體驗(6人)' },
  { name: '採娥', phone: '-', room: '行程分流', day1Activity: '傳藝中心(9人)', day3Activity: '鴨寮故事館(12人) + 手作魚丸(6人)' },
  { name: '永堯', phone: '-', room: '行程分流', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '麗姿', phone: '-', room: '行程分流', day1Activity: '童玩節玩水(21人)', day3Activity: '金特務(18人) + 撈蝦(18人)' },
  { name: '阿豐', phone: '-', room: '乘車名單', day1Pickup: '08:30 桃園文中路331號', day3Return: '7/27 19:00 桃園' }
];

// Interactive Search Logic (Fixed Mobile Floating Modal & UX Optimization)
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchBackdrop = document.getElementById('search-backdrop');
const searchResultsOverlay = document.getElementById('search-results-overlay');
const searchResultsContainer = document.getElementById('search-results-container');
const searchResultCount = document.getElementById('search-result-count');
const searchCloseBtn = document.getElementById('search-close-btn');
const appHeader = document.querySelector('.app-header');

function updateSearchOverlayPosition() {
  if (appHeader && searchResultsOverlay) {
    const rect = appHeader.getBoundingClientRect();
    const topPos = Math.max(rect.bottom, 0) + 6;
    searchResultsOverlay.style.top = `${topPos}px`;
  }
}

function openSearchModal() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  updateSearchOverlayPosition();
  if (searchBackdrop) searchBackdrop.classList.add('active');
  if (searchResultsOverlay) searchResultsOverlay.classList.add('active');
}

function closeSearchModal() {
  if (searchBackdrop) searchBackdrop.classList.remove('active');
  if (searchResultsOverlay) searchResultsOverlay.classList.remove('active');
}

if (searchInput) {
  searchInput.addEventListener('focus', () => {
    openSearchModal();
    if (searchInput.value.trim().length > 0) {
      performSearch(searchInput.value.trim().toLowerCase());
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length > 0) {
      if (searchClear) searchClear.classList.add('active');
      openSearchModal();
      performSearch(query);
    } else {
      if (searchClear) searchClear.classList.remove('active');
      closeSearchModal();
    }
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    searchClear.classList.remove('active');
    closeSearchModal();
  });
}

if (searchCloseBtn) {
  searchCloseBtn.addEventListener('click', closeSearchModal);
}

if (searchBackdrop) {
  searchBackdrop.addEventListener('click', closeSearchModal);
}

window.addEventListener('resize', updateSearchOverlayPosition);
window.addEventListener('scroll', updateSearchOverlayPosition);

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="search-mark">$1</mark>');
}

function performSearch(query) {
  const matches = memberDatabase.filter((m) => m.name.toLowerCase().includes(query));
  
  if (matches.length > 0) {
    if (searchResultCount) {
      searchResultCount.textContent = `🔍 搜尋結果 (${matches.length}人)`;
    }
    let html = '';
    matches.forEach((m) => {
      const highlightedName = highlightMatch(m.name, query);
      html += `
        <div class="search-item">
          <div class="search-item-header">
            <span>👤 ${highlightedName}</span>
            ${m.phone !== '-' ? `<a href="tel:${m.phone}" class="btn-action btn-phone" style="margin-top:0;">📞 ${m.phone}</a>` : ''}
          </div>
          <div class="search-item-detail">
            🛏️ 房間：<strong>${m.room || '詳見房間分配'}</strong>
          </div>
          ${m.day1Activity ? `<div class="search-item-detail">📌 7/25 下午：${m.day1Activity}</div>` : ''}
          ${m.day3Activity ? `<div class="search-item-detail">🎯 7/27 體驗：${m.day3Activity}</div>` : ''}
          ${m.day1Pickup ? `<div class="search-item-detail">🚌 7/25 上車：${m.day1Pickup}</div>` : ''}
          ${m.day3Return ? `<div class="search-item-detail">🛫 回程資訊：${m.day3Return}</div>` : ''}
          
          <div style="margin-top:10px; display:flex; gap:8px;">
            <button onclick="closeSearchModal(); document.querySelector('.nav-item[data-tab=rooms]').click();" class="btn-action btn-map" style="font-size:0.75rem; margin-top:0;">🛏️ 查看房間表</button>
            <button onclick="closeSearchModal(); document.querySelector('.nav-item[data-tab=itinerary]').click();" class="btn-action btn-phone" style="font-size:0.75rem; margin-top:0; background:var(--sky-light); color:var(--sky); border-color:rgba(2,132,199,0.2);">📅 查看行程</button>
          </div>
        </div>
      `;
    });
    searchResultsContainer.innerHTML = html;
  } else {
    if (searchResultCount) {
      searchResultCount.textContent = `🔍 搜尋結果 (0人)`;
    }
    searchResultsContainer.innerHTML = `
      <div style="font-size:0.9rem; color:var(--text-secondary); text-align:center; padding:20px 0;">
        查無包含「<strong style="color:var(--rose);">${query}</strong>」的成員資訊<br>
        <span style="font-size:0.8rem; color:var(--text-muted); margin-top:6px; display:block;">請嘗試輸入姓名關鍵字（例如：維傑、妙怡、強強、儼翰）</span>
      </div>
    `;
  }
}
