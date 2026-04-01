document.addEventListener("DOMContentLoaded", function () {
  // --- DOM Elements ---
  // FIX: Changed ID to match the HTML ('menu-toggle-btn')
  const mobileBtn = document.getElementById('menu-toggle-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  const mainView = document.getElementById('blog-main-view');
  const articleView = document.getElementById('blog-article-view');
  
  const filterButtons = document.querySelectorAll(".filter-pill");
  const cards = document.querySelectorAll(".blog-card");
  const searchInput = document.getElementById("blog-search");

  // --- 1. Mobile Menu Logic ---
  if (mobileBtn && mobileMenu) {
    // Toggle menu on button click
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden') &&
          !mobileMenu.contains(e.target) &&
          !mobileBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });

    // NEW: Close menu when a link inside the menu is clicked
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // --- 2. Router Logic (Template System) ---
  function loadPage() {
    const hash = window.location.hash;

    // Case A: We are on a specific article (hash starts with #article-)
    if (hash && hash.startsWith('#article-')) {
      const templateId = hash.substring(1); // remove #
      const template = document.getElementById(templateId);

      if (template) {
        // 1. Hide Main View
        mainView.style.display = 'none';
        
        // 2. Clear and Populate Article View
        articleView.innerHTML = '';
        const clone = template.content.cloneNode(true);
        articleView.appendChild(clone);
        
        // 3. Show Article View
        articleView.style.display = 'block';
        
        // 4. Scroll to top
        window.scrollTo(0, 0);
        
        // 5. Re-bind "Back" links in the new DOM
        const backLinks = articleView.querySelectorAll('.article-back');
        backLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear hash to return to list
            history.pushState("", document.title, window.location.pathname + window.location.search);
            loadPage(); // Re-run logic
          });
        });
        
        return; // Stop here
      }
    }

    // Case B: Default / List View
    if (articleView && mainView) {
        articleView.style.display = 'none';
        mainView.style.display = 'block';
    }
  }

  // Listen for hash changes (Forward/Back buttons)
  window.addEventListener('popstate', loadPage);
  
  // Handle initial load
  loadPage();

  // --- 3. Filter & Search Logic ---
  function applyFilters() {
    const activeButton = document.querySelector(".filter-pill.is-active");
    const activeFilter = activeButton ? activeButton.dataset.filter : "all";
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    cards.forEach(card => {
      const category = card.dataset.category;
      
      // Safe check for text content
      const titleEl = card.querySelector('.blog-title');
      const excEl = card.querySelector('.blog-excerpt');
      const title = titleEl ? titleEl.innerText.toLowerCase() : "";
      const excerpt = excEl ? excEl.innerText.toLowerCase() : "";
      const text = title + " " + excerpt;

      const matchesCategory = activeFilter === "all" || category === activeFilter;
      const matchesSearch = !searchTerm || text.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("is-hidden");
        // Add animation class
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add("is-hidden");
      }
    });
  }

  // Bind Filter Buttons
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilters();
    });
  });

  // Bind Search Input
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  
  // Initial filter run
  applyFilters();
});
