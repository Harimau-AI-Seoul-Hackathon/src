document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.news-btn .btn');
  const newsItems = document.querySelectorAll('.news-bg');

  buttons.forEach(button => {
      button.addEventListener('click', function() {
          const filter = this.textContent.toLowerCase(); // Get the button text

          newsItems.forEach(item => {
              const category = item.getAttribute('data-category'); // Get the category of the news item

              // Show or hide the news item based on the filter
              if (filter === 'all updates' || category === filter) {
                  item.style.display = 'block'; // Show item
              } else {
                  item.style.display = 'none'; // Hide item
              }
          });
      });
  });
});