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

// Main Bottom Nav Tab Switching Logic
function switchMainTab(targetTab) {
  if (!targetTab) return;

  // Hide all main tabs
  const allTabs = document.querySelectorAll('.tab-content');
  allTabs.forEach((tab) => tab.classList.remove('active'));

  // Show target main tab
  const targetElement = document.getElementById(`tab-${targetTab}`);
  if (targetElement) {
    targetElement.classList.add('active');
  }

  // Update active state on bottom nav items
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach((item) => {
    if (item.getAttribute('data-tab') === targetTab) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// Day Sub-tab Switching Logic (Inside Itinerary Tab)
function switchDayTab(targetDayId) {
  if (!targetDayId) return;

  // Make sure we are on the itinerary tab first
  switchMainTab('itinerary');

  // Hide all day contents inside itinerary
  const dayContents = document.querySelectorAll('.day-content');
  dayContents.forEach((day) => day.classList.remove('active'));

  // Show target day content
  const targetDayElement = document.getElementById(targetDayId);
  if (targetDayElement) {
    targetDayElement.classList.add('active');
  }

  // Update active state on sub-tab buttons
  const subTabBtns = document.querySelectorAll('.sub-tab-btn');
  subTabBtns.forEach((btn) => {
    if (btn.getAttribute('data-day') === targetDayId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Smooth scroll up to top of main container
  const container = document.querySelector('.main-container');
  if (container && window.scrollY > 100) {
    window.scrollTo({ top: container.offsetTop - 70, behavior: 'smooth' });
  }
}

// Event Listeners for Bottom Navigation Bar Items
document.querySelectorAll('.bottom-nav .nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-tab');
    switchMainTab(target);
  });
});

// Event Listeners for Day Sub-tab Buttons
document.querySelectorAll('.sub-tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-day');
    switchDayTab(target);
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
            <button onclick="closeSearchModal(); switchMainTab('rooms');" class="btn-action btn-map" style="font-size:0.75rem; margin-top:0;">🛏️ 查看房間表</button>
            <button onclick="closeSearchModal(); switchDayTab('day-1');" class="btn-action btn-phone" style="font-size:0.75rem; margin-top:0; background:var(--sky-light); color:var(--sky); border-color:rgba(2,132,199,0.2);">📅 查看 7/25 行程</button>
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

// ==================== PACKING CHECKLIST LOGIC ====================
const defaultChecklist = [
  // ☀️ 防曬抗暑
  { id: '1', name: '防曬乳 / 防曬噴霧', category: '☀️ 防曬抗暑', checked: false },
  { id: '2', name: '遮陽傘 / 晴雨傘', category: '☀️ 防曬抗暑', checked: false },
  { id: '3', name: '太陽眼鏡 / 墨鏡', category: '☀️ 防曬抗暑', checked: false },
  { id: '4', name: '遮陽帽 / 大沿帽', category: '☀️ 防曬抗暑', checked: false },
  { id: '5', name: '攜帶型小風扇 / 涼感巾', category: '☀️ 防曬抗暑', checked: false },

  // 💦 童玩節玩水
  { id: '6', name: '泳衣 / 泳褲', category: '💦 童玩節玩水', checked: false },
  { id: '7', name: '泳帽 / 蛙鏡', category: '💦 童玩節玩水', checked: false },
  { id: '8', name: '手機防水套 / 防水袋', category: '💦 童玩節玩水', checked: false },
  { id: '9', name: '大浴巾 / 毛巾', category: '💦 童玩節玩水', checked: false },
  { id: '10', name: '換洗乾淨衣物 (多備一套)', category: '💦 童玩節玩水', checked: false },
  { id: '11', name: '防滑水鞋 / 海灘拖鞋', category: '💦 童玩節玩水', checked: false },

  // 💊 藥品保健
  { id: '12', name: '暈車藥 (遊覽車必備)', category: '💊 藥品保健', checked: false },
  { id: '13', name: '個人常備藥 / 慢性病藥', category: '💊 藥品保健', checked: false },
  { id: '14', name: '防蚊液 / 蚊蟲止癢膏', category: '💊 藥品保健', checked: false },
  { id: '15', name: '感冒藥 / 止痛藥 / 胃藥', category: '💊 藥品保健', checked: false },
  { id: '16', name: 'OK 繃 (創可貼) / 消毒棉片', category: '💊 藥品保健', checked: false },

  // 🆔 證件金錢
  { id: '17', name: '健保卡 / 身分證', category: '🆔 證件金錢', checked: false },
  { id: '18', name: '現金 / 零錢 / 信用卡', category: '🆔 證件金錢', checked: false },

  // 🎒 個人隨身
  { id: '19', name: '行動電源 / 手機充電線', category: '🎒 個人隨身', checked: false },
  { id: '20', name: '個人盥洗用品 / 牙刷牙膏', category: '🎒 個人隨身', checked: false },
  { id: '21', name: '濕紙巾 / 隨身面紙', category: '🎒 個人隨身', checked: false },
  { id: '22', name: '輕便雨衣 / 折疊傘', category: '🎒 個人隨身', checked: false },
  { id: '23', name: '水壺 / 保溫瓶', category: '🎒 個人隨身', checked: false },
  { id: '24', name: '大塑膠袋 / 夾鏈袋 (裝濕衣服)', category: '🎒 個人隨身', checked: false }
];

let packingItems = [];
let currentPackingFilter = 'all';

function getPackingList() {
  const saved = localStorage.getItem('family_packing_list_v1');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultChecklist;
    }
  }
  return defaultChecklist;
}

function savePackingList(items) {
  localStorage.setItem('family_packing_list_v1', JSON.stringify(items));
}

function resetPackingList() {
  if (confirm('確定要將物品檢查表重置為預設清單嗎？（新增的自訂項目將被清空）')) {
    packingItems = [...defaultChecklist];
    savePackingList(packingItems);
    renderPackingList();
  }
}

function togglePackingItem(id) {
  packingItems = packingItems.map(item => {
    if (item.id === String(id)) {
      return { ...item, checked: !item.checked };
    }
    return item;
  });
  savePackingList(packingItems);
  renderPackingList();
}

function deletePackingItem(id) {
  packingItems = packingItems.filter(item => item.id !== String(id));
  savePackingList(packingItems);
  renderPackingList();
}

function addPackingItem(name, category) {
  if (!name.trim()) return;
  const newItem = {
    id: String(Date.now()),
    name: name.trim(),
    category: category || '🎒 個人隨身',
    checked: false
  };
  packingItems.unshift(newItem);
  savePackingList(packingItems);
  renderPackingList();
}

function renderPackingList() {
  const container = document.getElementById('packing-list-container');
  const progressText = document.getElementById('packing-progress-text');
  const progressBar = document.getElementById('packing-progress-bar');
  if (!container) return;

  const totalCount = packingItems.length;
  const checkedCount = packingItems.filter(i => i.checked).length;
  const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  if (progressText) progressText.textContent = `${checkedCount} / ${totalCount} (${percent}%)`;
  if (progressBar) progressBar.style.width = `${percent}%`;

  let filtered = packingItems;
  if (currentPackingFilter === 'pending') {
    filtered = packingItems.filter(i => !i.checked);
  } else if (currentPackingFilter === 'done') {
    filtered = packingItems.filter(i => i.checked);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; color:var(--text-muted); padding:24px 0; font-size:0.88rem;">
        目前沒有 ${currentPackingFilter === 'pending' ? '待準備' : currentPackingFilter === 'done' ? '已完成' : ''} 物品。
      </div>
    `;
    return;
  }

  const categories = ['☀️ 防曬抗暑', '💦 童玩節玩水', '💊 藥品保健', '🆔 證件金錢', '🎒 個人隨身'];
  let html = '';

  categories.forEach(cat => {
    const catItems = filtered.filter(i => i.category === cat);
    if (catItems.length > 0) {
      html += `<div class="checklist-cat-title"><span>${cat}</span><span>(${catItems.filter(i=>i.checked).length}/${catItems.length})</span></div>`;
      catItems.forEach(item => {
        html += `
          <div class="checklist-item ${item.checked ? 'checked' : ''}">
            <label class="checklist-label">
              <input type="checkbox" class="checklist-checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingItem('${item.id}')">
              <span class="checklist-text">${item.name}</span>
            </label>
            <button type="button" class="item-delete-btn" onclick="deletePackingItem('${item.id}')" title="刪除物品">🗑️</button>
          </div>
        `;
      });
    }
  });

  const otherItems = filtered.filter(i => !categories.includes(i.category));
  if (otherItems.length > 0) {
    html += `<div class="checklist-cat-title"><span>📌 其他自訂物資</span><span>(${otherItems.filter(i=>i.checked).length}/${otherItems.length})</span></div>`;
    otherItems.forEach(item => {
      html += `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
          <label class="checklist-label">
            <input type="checkbox" class="checklist-checkbox" ${item.checked ? 'checked' : ''} onchange="togglePackingItem('${item.id}')">
            <span class="checklist-text">${item.name} (${item.category})</span>
          </label>
          <button type="button" class="item-delete-btn" onclick="deletePackingItem('${item.id}')" title="刪除物品">🗑️</button>
        </div>
      `;
    });
  }

  container.innerHTML = html;
}

// Initialize packing list
document.addEventListener('DOMContentLoaded', () => {
  packingItems = getPackingList();
  renderPackingList();

  const addBtn = document.getElementById('add-item-btn');
  const inputEl = document.getElementById('new-item-input');
  const catEl = document.getElementById('new-item-category');

  if (addBtn && inputEl) {
    addBtn.addEventListener('click', () => {
      addPackingItem(inputEl.value, catEl ? catEl.value : '🎒 個人隨身');
      inputEl.value = '';
    });

    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addPackingItem(inputEl.value, catEl ? catEl.value : '🎒 個人隨身');
        inputEl.value = '';
      }
    });
  }

  document.querySelectorAll('.packing-filter-group .packing-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.packing-filter-group .packing-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPackingFilter = btn.getAttribute('data-filter') || 'all';
      renderPackingList();
    });
  });
});
