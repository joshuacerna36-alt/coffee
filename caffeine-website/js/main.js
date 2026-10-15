(function () {
  'use strict';

  var SELECTORS = {
    menuToggle: '.menu-toggle',
    navList: '.nav-list',
    navLinks: '.nav-link',
    navBackdrop: '.nav-backdrop',
    currentYear: '#current-year'
  };

  var menuToggle = document.querySelector(SELECTORS.menuToggle);
  var navList = document.querySelector(SELECTORS.navList);
  var currentYear = document.querySelector(SELECTORS.currentYear);

  function createNavBackdrop() {
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
    return backdrop;
  }

  var navBackdrop = document.querySelector(SELECTORS.navBackdrop);
  if (!navBackdrop) {
    navBackdrop = createNavBackdrop();
  }

  function isMenuOpen() {
    return navList && navList.classList.contains('is-open');
  }

  function openMenu() {
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
    }
    if (navList) {
      navList.classList.add('is-open');
    }
    if (navBackdrop) {
      navBackdrop.classList.add('is-active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (navList) {
      navList.classList.remove('is-open');
    }
    if (navBackdrop) {
      navBackdrop.classList.remove('is-active');
    }
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  if (navList) {
    var navLinks = navList.querySelectorAll(SELECTORS.navLinks);
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (isMenuOpen()) {
          closeMenu();
        }
      });
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', function () {
      if (isMenuOpen()) {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      if (isMenuOpen()) {
        closeMenu();
      }
    }
  });

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
})();
