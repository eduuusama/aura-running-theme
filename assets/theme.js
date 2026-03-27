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
    let lastScrollY = 0;
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 20) {
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
     Ingredient Hover (Desktop)
     ======================================== */
  document.addEventListener('mouseenter', function(e) {
    const trigger = e.target.closest('[data-ingredient-trigger]');
    if (!trigger) return;

    const index = trigger.dataset.ingredientTrigger;
    const section = trigger.closest('[data-ingredient-section]');
    if (!section) return;

    // Update all triggers opacity
    section.querySelectorAll('[data-ingredient-trigger]').forEach(function(t) {
      t.style.opacity = t.dataset.ingredientTrigger === index ? '1' : '0.4';
    });

    // Update background images
    section.querySelectorAll('.ingredient-bg').forEach(function(bg) {
      bg.classList.toggle('is-active', bg.dataset.ingredientBg === index);
    });
  }, true);

  document.addEventListener('mouseleave', function(e) {
    const trigger = e.target.closest('[data-ingredient-trigger]');
    if (!trigger) return;

    const section = trigger.closest('[data-ingredient-section]');
    if (!section) return;

    // Reset all triggers
    section.querySelectorAll('[data-ingredient-trigger]').forEach(function(t) {
      t.style.opacity = '1';
    });

    // Show default background
    section.querySelectorAll('.ingredient-bg').forEach(function(bg, i) {
      bg.classList.toggle('is-active', i === 0);
    });
  }, true);

})();
