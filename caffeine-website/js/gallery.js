(function () {
  'use strict';

  var SELECTORS = {
    galleryRoot: '#gallery-root',
    lightbox: '.lightbox'
  };

  var GALLERY_DATA = [
    { src: 'assets/images/products/americano.png', alt: 'Americano' },
    { src: 'assets/images/products/cappuccino.png', alt: 'Cappuccino' },
    { src: 'assets/images/products/cinnamon-dulce.png', alt: 'Cinnamon Dolce' },
    { src: 'assets/images/products/caramel-macchiato.png', alt: 'Caramel Macchiato' },
    { src: 'assets/images/products/durian-latte.png', alt: 'Durian Latte' },
    { src: 'assets/images/products/mochaccino.png', alt: 'Mochaccino' },
    { src: 'assets/images/products/latte.png', alt: 'Latte' },
    { src: 'assets/images/products/signature-coffee.png', alt: 'Signature Coffee' },
    { src: 'assets/images/products/spanish-latte.png', alt: 'Spanish Latte' }
  ];

  var root = document.querySelector(SELECTORS.galleryRoot);
  if (!root) return;

  var lightbox = null;
  var lightboxImage = null;
  var lightboxClose = null;
  var lightboxPrev = null;
  var lightboxNext = null;
  var lightboxCounter = null;
  var lastFocusedEl = null;
  var currentIndex = 0;

  function createGalleryMarkup() {
    var section = document.createElement('section');
    section.className = 'gallery-preview';

    var container = document.createElement('div');
    container.className = 'container';

    var intro = document.createElement('p');
    intro.className = 'gallery-intro';
    intro.textContent = 'A curated collection of our finest coffee creations, brewed with passion and artistry.';

    var grid = document.createElement('div');
    grid.className = 'gallery-grid';
    grid.setAttribute('role', 'list');

    GALLERY_DATA.forEach(function (item, index) {
      var galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      galleryItem.setAttribute('role', 'listitem');

      var img = document.createElement('img');
      img.className = 'gallery-image';
      img.src = item.src;
      img.alt = item.alt;
      img.setAttribute('loading', 'lazy');
      img.setAttribute('data-index', index);
      img.tabIndex = 0;

      galleryItem.appendChild(img);
      grid.appendChild(galleryItem);
    });

    var link = document.createElement('a');
    link.className = 'gallery-link';
    link.href = 'menu.html';
    link.textContent = 'View Full Menu';

    container.appendChild(intro);
    container.appendChild(grid);
    container.appendChild(link);
    section.appendChild(container);

    return section;
  }

  function createLightboxMarkup() {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-label', 'Image preview');

    var backdrop = document.createElement('div');
    backdrop.className = 'lightbox-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    var content = document.createElement('div');
    content.className = 'lightbox-content';

    var closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.innerHTML = '&times;';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'lightbox-prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '&#8249;';

    var img = document.createElement('img');
    img.className = 'lightbox-image';
    img.alt = '';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'lightbox-next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '&#8250;';

    var counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.setAttribute('aria-live', 'polite');
    counter.textContent = '';

    content.appendChild(closeBtn);
    content.appendChild(prevBtn);
    content.appendChild(img);
    content.appendChild(nextBtn);
    content.appendChild(counter);

    overlay.appendChild(backdrop);
    overlay.appendChild(content);

    return {
      overlay: overlay,
      image: img,
      close: closeBtn,
      prev: prevBtn,
      next: nextBtn,
      counter: counter
    };
  }

  function renderLightbox() {
    var markup = createLightboxMarkup();
    lightbox = markup.overlay;
    lightboxImage = markup.image;
    lightboxClose = markup.close;
    lightboxPrev = markup.prev;
    lightboxNext = markup.next;
    lightboxCounter = markup.counter;
    document.body.appendChild(lightbox);
  }

  function updateCounter(index) {
    if (lightboxCounter) {
      lightboxCounter.textContent = (index + 1) + ' / ' + GALLERY_DATA.length;
    }
  }

  function updateButtons() {
    if (lightboxPrev) {
      lightboxPrev.disabled = currentIndex === 0;
    }
    if (lightboxNext) {
      lightboxNext.disabled = currentIndex === GALLERY_DATA.length - 1;
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    var item = GALLERY_DATA[currentIndex];

    if (item && lightboxImage) {
      lightboxImage.src = item.src;
      lightboxImage.alt = item.alt;
    }

    updateCounter(currentIndex);
    updateButtons();

    lastFocusedEl = document.activeElement;

    if (lightbox) {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (lightboxClose) {
        lightboxClose.focus();
      }
    }
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedEl) {
      lastFocusedEl.focus();
      lastFocusedEl = null;
    }
  }

  function showPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      var item = GALLERY_DATA[currentIndex];
      if (item && lightboxImage) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
      }
      updateCounter(currentIndex);
      updateButtons();
    }
  }

  function showNext() {
    if (currentIndex < GALLERY_DATA.length - 1) {
      currentIndex++;
      var item = GALLERY_DATA[currentIndex];
      if (item && lightboxImage) {
        lightboxImage.src = item.src;
        lightboxImage.alt = item.alt;
      }
      updateCounter(currentIndex);
      updateButtons();
    }
  }

  function bindGalleryEvents() {
    var galleryItems = document.querySelectorAll('.gallery-image');

    galleryItems.forEach(function (img) {
      img.addEventListener('click', function () {
        var idx = parseInt(img.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          openLightbox(idx);
        }
      });

      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
          e.preventDefault();
          var idx = parseInt(img.getAttribute('data-index'), 10);
          if (!isNaN(idx)) {
            openLightbox(idx);
          }
        }
      });
    });
  }

  function bindLightboxEvents() {
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', showPrev);
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', showNext);
    }

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-backdrop')) {
          closeLightbox();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!lightbox) return;
      if (!lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === 'ArrowLeft' || e.keyCode === 37) {
        e.preventDefault();
        showPrev();
      } else if (e.key === 'ArrowRight' || e.keyCode === 39) {
        e.preventDefault();
        showNext();
      }
    });
  }

  function init() {
    var gallerySection = createGalleryMarkup();
    root.appendChild(gallerySection);
    renderLightbox();
    bindGalleryEvents();
    bindLightboxEvents();
  }

  if (root) {
    init();
  }
})();
