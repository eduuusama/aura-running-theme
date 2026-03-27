/**
 * Aura Running — Global Theme JS
 * Header scroll behavior, mobile menu, accordions
 */

(function() {
  'use strict';

  /* ========================================
     Header Scroll Behavior
     ======================================== */
  const header = document.querySelector('.site-header');
  if (header) {
    // Product pages get a dark header always (no transparent-to-dark scroll transition)
    var isProductPage = document.body.classList.contains('template-product');
    if (isProductPage) {
      header.classList.add('is-scrolled');
    }

    let lastScrollY = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (isProductPage) {
        // Always dark on product pages
        header.classList.add('is-scrolled');
      } else if (scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ========================================
     Mobile Menu
     ======================================== */
  window.MobileMenu = {
    open() {
      document.getElementById('mobile-menu').classList.add('is-open');
      document.getElementById('mobile-menu-overlay').classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },
    close() {
      document.getElementById('mobile-menu').classList.remove('is-open');
      document.getElementById('mobile-menu-overlay').classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  /* ========================================
     Accordion
     ======================================== */
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('.accordion-trigger');
    if (!trigger) return;

    const item = trigger.closest('.accordion-item');
    if (!item) return;

    const isOpen = item.classList.contains('is-open');

    // Close siblings in same accordion group
    const group = item.closest('.accordion-group');
    if (group) {
      group.querySelectorAll('.accordion-item.is-open').forEach(function(openItem) {
        openItem.classList.remove('is-open');
      });
    }

    if (!isOpen) {
      item.classList.add('is-open');
    }
  });

  /* ========================================
     Ingredient Background Swap
     ======================================== */
  function switchIngredientBg(section, index) {
    section.querySelectorAll('.ingredient-bg').forEach(function(bg) {
      bg.classList.toggle('is-active', bg.dataset.ingredientBg === index);
    });
  }

  // Desktop — hover
  document.addEventListener('mouseenter', function(e) {
    const trigger = e.target.closest('[data-ingredient-trigger]');
    if (!trigger) return;

    const index = trigger.dataset.ingredientTrigger;
    const section = trigger.closest('[data-ingredient-section]');
    if (!section) return;

    section.querySelectorAll('[data-ingredient-trigger]').forEach(function(t) {
      t.style.opacity = t.dataset.ingredientTrigger === index ? '1' : '0.4';
    });

    switchIngredientBg(section, index);
  }, true);

  document.addEventListener('mouseleave', function(e) {
    const trigger = e.target.closest('[data-ingredient-trigger]');
    if (!trigger) return;

    const section = trigger.closest('[data-ingredient-section]');
    if (!section) return;

    section.querySelectorAll('[data-ingredient-trigger]').forEach(function(t) {
      t.style.opacity = '1';
    });

    switchIngredientBg(section, '0');
  }, true);

  // Mobile — click/tap (accordion items)
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('.accordion-item[data-ingredient-trigger]');
    if (!trigger) return;

    const index = trigger.dataset.ingredientTrigger;
    const section = trigger.closest('[data-ingredient-section]');
    if (!section) return;

    switchIngredientBg(section, index);
  }, true);

})();
