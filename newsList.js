const categoryMap = {
    "지진": { en: "earthquake", color: "red", priority: "High Priority" },
    "홍수": { en: "flood", color: "red", priority: "High Priority" },
    "태풍": { en: "typhoon", color: "yellow", priority: "Medium Priority" },
    "산불": { en: "fire", color: "yellow", priority: "Medium Priority" }
};

// Select the container where news will be rendered
const newsContainer = document.getElementById("news-container");

// Function to render articles
function renderArticles(articles) {
    articles.forEach(article => {
        const mappedCategory = categoryMap[article.category];

        // Create a new div for each article
        const articleHTML = `
            <div class="news-bg" data-category="${mappedCategory.en}">
                <div class="flex items-center mb-2">
                    <i class="fas fa-exclamation-circle text-${mappedCategory.color}-600 mr-2"></i>
                    <h2 class="text-lg font-semibold text-${mappedCategory.color}-600">${article.summary}</h2>
                </div>
                <div class="flex items-center text-gray-500 text-sm mb-2">
                    <i class="far fa-clock mr-1"></i> ${article.date}
                    <i class="fas fa-map-marker-alt mx-2"></i> ${article.location}
                    <span class="ml-auto px-2 py-1 bg-${mappedCategory.color}-200 text-${mappedCategory.color}-600 rounded-md">
                        ${mappedCategory.priority}
                    </span>
                </div>
                <p class="text-gray-700">Category: ${article.category} (${mappedCategory.en})</p>
            </div>
        `;

        // Append the article HTML to the container
        newsContainer.innerHTML += articleHTML;
    });
}

// Call the function to render articles
renderArticles(articles);

