/* MINI BIKE KLUB — cart.js
   Client-side cart: add / remove / update quantity, persisted in localStorage.
   NOTE: prices/totals shown here are for UX only. Per spec section 45,
   production checkout must re-validate products, prices, quantities and
   shipping/free-shipping eligibility server-side before an order is accepted. */

const MBK_CART_KEY = "mbk-cart";
const FREE_SHIPPING_BIKE_QTY = 3;   // 3+ bikes/trikes qualifies for free shipping
const FLAT_SHIPPING_RATE = 75;      // placeholder store rate — wire to real rates before launch

const MbkCart = {

  read(){
    try{
      const raw = localStorage.getItem(MBK_CART_KEY);
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  },

  write(items){
    localStorage.setItem(MBK_CART_KEY, JSON.stringify(items));
    this.updateCountBadges();
  },

  add(product, qty){
    qty = qty || 1;
    const items = this.read();
    const existing = items.find(function(i){ return i.id === product.id; });
    if (existing){
      existing.quantity += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        category: product.category,
        image: product.image
      });
    }
    this.write(items);
  },

  remove(id){
    const items = this.read().filter(function(i){ return i.id !== id; });
    this.write(items);
  },

  setQuantity(id, qty){
    const items = this.read();
    const item = items.find(function(i){ return i.id === id; });
    if (item){
      item.quantity = Math.max(1, qty);
    }
    this.write(items);
  },

  clear(){
    this.write([]);
  },

  count(){
    return this.read().reduce(function(sum, i){ return sum + i.quantity; }, 0);
  },

  /* count of items that are bikes or drift trikes, for the free-shipping promo */
  vehicleCount(){
    return this.read().reduce(function(sum, i){
      return (i.category === "mini-bikes" || i.category === "mini-drift-trikes") ? sum + i.quantity : sum;
    }, 0);
  },

  subtotal(){
    return this.read().reduce(function(sum, i){ return sum + (i.price * i.quantity); }, 0);
  },

  qualifiesForFreeShipping(){
    return this.vehicleCount() >= FREE_SHIPPING_BIKE_QTY;
  },

  shipping(){
    if (this.read().length === 0) return 0;
    return this.qualifiesForFreeShipping() ? 0 : FLAT_SHIPPING_RATE;
  },

  total(){
    return this.subtotal() + this.shipping();
  },

  updateCountBadges(){
    const n = this.count();
    document.querySelectorAll("[data-cart-count]").forEach(function(el){
      el.textContent = n;
    });
  }
};

document.addEventListener("DOMContentLoaded", function(){
  MbkCart.updateCountBadges();
});
