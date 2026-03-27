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
