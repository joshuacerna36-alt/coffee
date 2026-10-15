(function () {
  'use strict';

  var SELECTORS = {
    searchInput: '#search-input, .menu-search input[type="search"], [data-search-input]',
    clearSearchBtn: '.clear-search, #clear-search, [data-clear-search]',
    categoryBtn: '.category-btn, [data-category-btn]',
    productCard: '.product-card, [data-product]',
    emptyState: '.empty-state, #empty-state, #no-results, [data-empty-state]',
    productName: '.product-name, h3, [data-product-name]',
    productImage: '.product-image, [data-product-image]',
    productDescription: '.product-description, [data-description]',
    productPrice: '.product-price, [data-price]',
    modal: '#product-modal, [data-modal]',
    modalContent: '.modal-content',
    modalClose: '.modal-close, [data-modal-close]',
    modalImage: '.modal-image, #modal-image',
    modalTitle: '.modal-title, #modal-product-name',
    modalDescription: '.modal-description, #modal-description',
    modalPrice: '.modal-price, #modal-price'
  };

  var DEBOUNCE_MS = 150;

  var searchInput = document.querySelector(SELECTORS.searchInput);
  var clearSearchBtn = document.querySelector(SELECTORS.clearSearchBtn);
  var categoryButtons = document.querySelectorAll(SELECTORS.categoryBtn);
  var productCards = document.querySelectorAll(SELECTORS.productCard);
  var emptyState = document.querySelector(SELECTORS.emptyState);

  var modal = document.querySelector(SELECTORS.modal);
  var modalContentEl = modal ? modal.querySelector(SELECTORS.modalContent) : null;
  var modalClose = modal ? modal.querySelector(SELECTORS.modalClose) : null;
  var modalImage = modal ? modal.querySelector(SELECTORS.modalImage) : null;
  var modalTitle = modal ? modal.querySelector(SELECTORS.modalTitle) : null;
  var modalDescription = modal ? modal.querySelector(SELECTORS.modalDescription) : null;
  var modalPrice = modal ? modal.querySelector(SELECTORS.modalPrice) : null;

  var activeCategory = 'all';
  var searchQuery = '';
  var searchTimer = null;
  var lastFocusedEl = null;

  function getCardName(card) {
    if (card.dataset.name) return card.dataset.name;
    if (card.dataset.productName) return card.dataset.productName;
    var nameEl = card.querySelector(SELECTORS.productName);
    if (nameEl) return nameEl.textContent.trim();
    return card.textContent.trim();
  }

  function getCardCategory(card) {
    return (card.dataset.category || 'all').toLowerCase();
  }

  function getCardDescription(card) {
    if (card.dataset.description) return card.dataset.description;
    var descEl = card.querySelector(SELECTORS.productDescription);
    if (descEl) return descEl.textContent.trim();
    return '';
  }

  function getCardPrice(card) {
    if (card.dataset.price) return card.dataset.price;
    var priceEl = card.querySelector(SELECTORS.productPrice);
    if (priceEl) return priceEl.textContent.trim();
    return '';
  }

  function getCardImage(card) {
    var img = card.querySelector(SELECTORS.productImage);
    if (img) return img;
    return card.querySelector('img');
  }

  function matchesSearch(card) {
    if (!searchQuery) return true;
    return getCardName(card).toLowerCase().indexOf(searchQuery) !== -1;
  }

  function matchesCategory(card) {
    if (activeCategory === 'all') return true;
    return getCardCategory(card) === activeCategory;
  }

  function shouldShow(card) {
    return matchesSearch(card) && matchesCategory(card);
  }

  function applyFilters() {
    var visibleCount = 0;
    productCards.forEach(function (card) {
      var show = shouldShow(card);
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  function setActiveCategory(category) {
    activeCategory = category.toLowerCase();
    categoryButtons.forEach(function (btn) {
      var btnCategory = (btn.dataset.category || btn.textContent.trim()).toLowerCase();
      btn.classList.toggle('active', btnCategory === activeCategory);
    });
  }

  function initActiveCategory() {
    var allBtn = Array.prototype.find.call(categoryButtons, function (btn) {
      var cat = (btn.dataset.category || btn.textContent.trim()).toLowerCase();
      return cat === 'all';
    });
    if (allBtn) {
      setActiveCategory('all');
    }
  }

  if (searchInput) {
    var form = searchInput.closest('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
      });
    }

    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyFilters();
      }, DEBOUNCE_MS);
    });
  }

  categoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.dataset.category || btn.textContent.trim();
      setActiveCategory(category);
      applyFilters();
    });
  });

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      searchInput.value = '';
      searchQuery = '';
      applyFilters();
    });
    clearSearchBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        searchInput.value = '';
        searchQuery = '';
        applyFilters();
      }
    });
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    DEBOUNCE_MS = 0;
  }

  initActiveCategory();
  applyFilters();

  function openModal(card) {
    lastFocusedEl = document.activeElement;

    var img = getCardImage(card);
    var name = getCardName(card);
    var desc = getCardDescription(card);
    var price = getCardPrice(card);

    if (modalImage && img) {
      modalImage.src = img.src;
      modalImage.alt = name;
    }
    if (modalTitle) {
      modalTitle.textContent = name;
    }
    if (modalDescription) {
      modalDescription.textContent = desc;
    }
    if (modalPrice) {
      modalPrice.textContent = price;
    }

    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (modalClose) {
        modalClose.focus();
      }
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) {
      lastFocusedEl.focus();
    }
  }

  if (modal) {
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.target === modalClose) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          closeModal();
        }
      }
      if (e.key === 'Escape' || e.keyCode === 27) {
        if (modal.classList.contains('is-open')) {
          closeModal();
        }
      }
    });
  }

  if (!productCards.length) return;

  productCards.forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card);
    });
  });
})();
