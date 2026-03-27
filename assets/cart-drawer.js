/**
 * Aura Running — AJAX Cart Drawer
 * Handles add to cart, quantity updates, removal, and checkout
 */

(function() {
  'use strict';

  const CartDrawer = {
    drawer: null,
    overlay: null,
    itemsContainer: null,
    footer: null,
    totalEl: null,

    init() {
      this.drawer = document.getElementById('cart-drawer');
      this.overlay = document.getElementById('cart-overlay');
      this.itemsContainer = document.getElementById('cart-items');
      this.footer = document.getElementById('cart-footer');
      this.totalEl = document.getElementById('cart-total');

      // Listen for add-to-cart events
      document.addEventListener('cart:add', (e) => {
        this.addItem(e.detail);
      });

      // Update cart count on load
      this.updateCount();
    },

    open() {
      this.drawer.classList.add('is-open');
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.fetchAndRender();
    },

    close() {
      this.drawer.classList.remove('is-open');
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    },

    async fetchCart() {
      const res = await fetch('/cart.js');
      return res.json();
    },

    async addItem({ id, quantity = 1 }) {
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id, quantity }] })
        });
        this.updateCount();
        this.open();
      } catch (err) {
        console.error('Failed to add to cart:', err);
      }
    },

    async updateQuantity(key, quantity) {
      try {
        await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: key, quantity })
        });
        this.fetchAndRender();
        this.updateCount();
      } catch (err) {
        console.error('Failed to update quantity:', err);
      }
    },

    async removeItem(key) {
      return this.updateQuantity(key, 0);
    },

    async updateCount() {
      try {
        const cart = await this.fetchCart();
        const badges = document.querySelectorAll('.cart-count-badge');
        badges.forEach(badge => {
          if (cart.item_count > 0) {
            badge.textContent = cart.item_count;
            badge.style.display = 'flex';
          } else {
            badge.style.display = 'none';
          }
        });
      } catch (err) {
        // Silently fail on count update
      }
    },

    async fetchAndRender() {
      try {
        const cart = await this.fetchCart();
        this.render(cart);
      } catch (err) {
        this.itemsContainer.innerHTML = '<p class="text-sm text-muted-foreground">Failed to load cart.</p>';
      }
    },

    render(cart) {
      if (!cart.items || cart.items.length === 0) {
        this.itemsContainer.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full text-center">
            <p class="text-sm text-muted-foreground mb-6">Your cart is empty</p>
            <a href="/collections/all" onclick="window.CartDrawer.close()" class="text-sm font-medium underline underline-offset-4 hover:opacity-60 transition-opacity">
              Continue Shopping
            </a>
          </div>
        `;
        this.footer.style.display = 'none';
        return;
      }

      let html = '';
      cart.items.forEach(item => {
        const image = item.featured_image ? item.featured_image.url : '';
        const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';

        html += `
          <div class="flex gap-4 p-3 border border-border mb-3">
            ${image ? `
              <a href="${item.url}" class="shrink-0 w-20 h-20 bg-muted overflow-hidden">
                <img src="${image}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy">
              </a>
            ` : ''}
            <div class="flex-1 min-w-0">
              <a href="${item.url}" class="text-sm font-medium tracking-tight hover:opacity-60 transition-opacity block truncate">${item.product_title}</a>
              ${variantTitle ? `<p class="text-xs text-muted-foreground mt-0.5">${variantTitle}</p>` : ''}
              <p class="text-sm font-light mt-1">${this.formatMoney(item.final_line_price)}</p>
              <div class="flex items-center gap-2 mt-2">
                <button onclick="window.CartDrawer.updateQuantity('${item.key}', ${item.quantity - 1})" class="w-6 h-6 flex items-center justify-center border border-border hover:bg-muted transition-colors" aria-label="Decrease quantity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/></svg>
                </button>
                <span class="text-xs w-6 text-center">${item.quantity}</span>
                <button onclick="window.CartDrawer.updateQuantity('${item.key}', ${item.quantity + 1})" class="w-6 h-6 flex items-center justify-center border border-border hover:bg-muted transition-colors" aria-label="Increase quantity">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </button>
                <button onclick="window.CartDrawer.removeItem('${item.key}')" class="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                  Remove
                </button>
              </div>
            </div>
          </div>
        `;
      });

      this.itemsContainer.innerHTML = html;
      this.footer.style.display = 'block';
      this.totalEl.textContent = this.formatMoney(cart.total_price);
    },

    formatMoney(cents) {
      return '$' + (cents / 100).toFixed(2);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CartDrawer.init());
  } else {
    CartDrawer.init();
  }

  // Expose globally
  window.CartDrawer = CartDrawer;
})();
