/**
 * Aura Running — Product Form
 * Variant selection, quantity, add to cart
 */

(function() {
  'use strict';

  const ProductForm = {
    variants: [],
    selectedOptions: {},

    init() {
      const json = document.getElementById('product-variants-json');
      if (json) {
        try {
          this.variants = JSON.parse(json.textContent);
        } catch (e) {
          console.error('Failed to parse variants:', e);
        }
      }

      // Initialize selected options from first available variant
      if (this.variants.length > 0) {
        const first = this.variants.find(v => v.available) || this.variants[0];
        if (first.options) {
          first.options.forEach((val, i) => {
            this.selectedOptions[i] = val;
          });
        }
      }
    },

    selectOption(btn) {
      const index = parseInt(btn.dataset.optionIndex);
      const value = btn.dataset.value;

      this.selectedOptions[index] = value;

      // Update active states
      const group = btn.parentElement;
      group.querySelectorAll('.variant-option').forEach(b => {
        b.classList.remove('bg-foreground', 'text-background');
      });
      btn.classList.add('bg-foreground', 'text-background');

      // Find matching variant
      const variant = this.findVariant();
      if (variant) {
        this.updatePrice(variant);
        this.updateAvailability(variant);
      }
    },

    findVariant() {
      const selectedValues = Object.values(this.selectedOptions);
      return this.variants.find(v => {
        return v.options.every((opt, i) => opt === selectedValues[i]);
      });
    },

    updatePrice(variant) {
      const priceEl = document.getElementById('product-price');
      if (priceEl && variant.price) {
        priceEl.textContent = '$' + (variant.price / 100).toFixed(2);
      }
    },

    updateAvailability(variant) {
      const btn = document.getElementById('add-to-cart-btn');
      if (!btn) return;

      if (variant.available) {
        btn.disabled = false;
        btn.textContent = 'Add to Cart';
      } else {
        btn.disabled = true;
        btn.textContent = 'Sold Out';
      }
    },

    updateQty(delta) {
      const input = document.getElementById('product-quantity');
      if (!input) return;
      const current = parseInt(input.value) || 1;
      const next = Math.max(1, current + delta);
      input.value = next;
    },

    addToCart() {
      const variant = this.findVariant();
      if (!variant) {
        // Fallback to first variant
        const firstAvailable = this.variants.find(v => v.available);
        if (!firstAvailable) return;
        this.doAdd(firstAvailable.id);
        return;
      }
      this.doAdd(variant.id);
    },

    selectPurchaseType(btn) {
      const selector = btn.closest('[data-purchase-selector]');
      if (!selector) return;

      // Reset all options in this selector
      selector.querySelectorAll('.purchase-option').forEach(function(opt) {
        opt.classList.remove('is-selected', 'border-foreground');
        opt.classList.add('border-border');
        var dot = opt.querySelector('.radio-dot');
        if (dot) {
          dot.classList.remove('border-foreground');
          dot.classList.add('border-muted-foreground');
          dot.innerHTML = '';
        }
      });

      // Activate clicked option
      btn.classList.add('is-selected', 'border-foreground');
      btn.classList.remove('border-border');
      var dot = btn.querySelector('.radio-dot');
      if (dot) {
        dot.classList.add('border-foreground');
        dot.classList.remove('border-muted-foreground');
        dot.innerHTML = '<div class="w-2 h-2 rounded-full bg-foreground"></div>';
      }

      // Repeat for all selectors on the page (mobile + desktop)
      var type = btn.dataset.type;
      document.querySelectorAll('[data-purchase-selector]').forEach(function(sel) {
        sel.querySelectorAll('.purchase-option').forEach(function(opt) {
          if (opt === btn) return;
          if (opt.dataset.type === type && sel !== selector) {
            // Sync the other selector
            opt.classList.add('is-selected', 'border-foreground');
            opt.classList.remove('border-border');
            var d = opt.querySelector('.radio-dot');
            if (d) {
              d.classList.add('border-foreground');
              d.classList.remove('border-muted-foreground');
              d.innerHTML = '<div class="w-2 h-2 rounded-full bg-foreground"></div>';
            }
          } else if (opt.dataset.type !== type) {
            opt.classList.remove('is-selected', 'border-foreground');
            opt.classList.add('border-border');
            var d2 = opt.querySelector('.radio-dot');
            if (d2) {
              d2.classList.remove('border-foreground');
              d2.classList.add('border-muted-foreground');
              d2.innerHTML = '';
            }
          }
        });
      });
    },

    doAdd(variantId) {
      const qty = parseInt(document.getElementById('product-quantity')?.value) || 1;
      document.dispatchEvent(new CustomEvent('cart:add', {
        detail: { id: variantId, quantity: qty }
      }));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProductForm.init());
  } else {
    ProductForm.init();
  }

  window.ProductForm = ProductForm;
})();
