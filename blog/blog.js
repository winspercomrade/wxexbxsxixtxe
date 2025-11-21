document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-pill");
  const cards = document.querySelectorAll(".blog-card");
  const searchInput = document.getElementById("blog-search");
  const navToggle = document.querySelector(".wb-nav-toggle");
  const navLinks = document.querySelector(".wb-nav-links");

  // === FILTER + SEARCH LOGIC ===
  function applyFilters() {
    const activeButton = document.querySelector(".filter-pill.is-active");
    const activeFilter = activeButton ? activeButton.dataset.filter : "all";
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";

    cards.forEach(card => {
      const category = card.dataset.category;
      const text = card.innerText.toLowerCase();

      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch = !searchTerm || text.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  }

  // Category filter buttons
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("is-active"));
      button.classList.add("is-active");
      applyFilters();
    });
  });

  // Live search
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // Initial filter state
  applyFilters();

  // === MOBILE NAV TOGGLE (optional, if using nav) ===
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.style.display === "flex";
      // On mobile, CSS sets display:none; inline style here overrides it.
      navLinks.style.display = isOpen ? "none" : "flex";

      if (!isOpen) {
        navLinks.style.flexDirection = "column";
        navLinks.style.gap = "0.75rem";
        navLinks.style.marginTop = "0.75rem";
      }
    });
  }
});
