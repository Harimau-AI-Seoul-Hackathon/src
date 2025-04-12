// static/news.js

const categoryMap = {
    지진: { en: "Earthquake", color: "red",    priority: "High Priority"   },
    홍수: { en: "Flood",      color: "red",    priority: "High Priority"   },
    태풍: { en: "Typhoon",    color: "yellow", priority: "Medium Priority" },
    산불: { en: "Fire",       color: "yellow", priority: "Medium Priority" }
  };
  
  // 1) Fetch the JSON array from Flask
  async function loadNews() {
    const res = await fetch('/disaster_summary');
    if (!res.ok) throw new Error(res.statusText);
    return res.json();  // → [{summary, category, location, date}, …]
  }
  
  // 2) Render cards into #news-container
  function renderArticles(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = '';  // clear old content
  
    articles.forEach(a => {
      const m = categoryMap[a.category] || {};
      const card = document.createElement('div');
      card.className = 'news-bg';
      card.dataset.category = m.en;  // e.g. "earthquake", "flood", etc.
  
      card.innerHTML = `
        <div class="flex items-center mb-2">
          <i class="fas fa-exclamation-circle text-${m.color}-600 mr-2"></i>
          <h2 class="text-lg font-semibold text-${m.color}-600">${a.summary}</h2>
        </div>
        <div class="flex items-center text-gray-500 text-sm mb-2">
          <i class="far fa-clock mr-1"></i> ${a.date}
          <i class="fas fa-map-marker-alt mx-2"></i> ${a.location}
          <span class="ml-auto px-2 py-1 bg-${m.color}-200 text-${m.color}-600 rounded-md">
            ${m.priority}
          </span>
        </div>
        <p class="text-gray-700">Category: ${a.category} (${m.en})</p>
      `;
      container.appendChild(card);
    });
  }
  
  // 3) Initialize filter button behavior
  function initFilters() {
    // Grab all buttons under .news-btn
    const buttons = document.querySelectorAll('.news-btn .btn');
    // Grab all rendered cards
    const newsItems = document.querySelectorAll('.news-bg');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.textContent.trim().toLowerCase();
  
        newsItems.forEach(item => {
          const category = item.dataset.category.toLowerCase(); // same as m.en above
  
          // Show all if filter is “all updates”, otherwise match category
          if (filter === 'all updates' || category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
  
  // 4) On DOM ready, load & render, then wire filters
  document.addEventListener('DOMContentLoaded', () => {
    loadNews()
      .then(articles => {
        renderArticles(articles);
        initFilters();  // now that .news-bg exist, wire up your filters :contentReference[oaicite:0]{index=0}
      })
      .catch(err => console.error('Failed to load news:', err));
  });
  