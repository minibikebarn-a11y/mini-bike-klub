/* MINI BIKE KLUB — main.js
   Mobile nav, scroll reveal, shop grid + filtering, product detail rendering,
   accordion, cart page rendering. Runs after theme.js / products.js / cart.js. */

document.addEventListener("DOMContentLoaded", function(){

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (navToggle && mobileMenu){
    navToggle.addEventListener("click", function(){
      const isOpen = mobileMenu.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileMenu.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mobileMenu.classList.remove("open");
        navToggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* ---------------- Stat count-up ---------------- */
  const statEls = document.querySelectorAll("[data-count-to]");
  if (statEls.length){
    const easeOutQuint = function(t){ return 1 - Math.pow(1 - t, 5); };

    function animateStat(el){
      const target = parseInt(el.getAttribute("data-count-to"), 10);
      const duration = 1800;
      const start = performance.now();

      function tick(now){
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * easeOutQuint(progress));
        el.textContent = value.toLocaleString("en-US") + (progress >= 1 ? "+" : "");
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window){
      const statIo = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            animateStat(entry.target);
            statIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      statEls.forEach(function(el){ statIo.observe(el); });
    } else {
      statEls.forEach(function(el){
        el.textContent = parseInt(el.getAttribute("data-count-to"), 10).toLocaleString("en-US") + "+";
      });
    }
  }

  /* ---------------- Product card markup helper ----------------
     Works from both root-level pages (shop.html) and pages inside
     /products/, by detecting the current folder depth. */
  const inProductsFolder = window.location.pathname.indexOf("/products/") !== -1;
  const assetPrefix = inProductsFolder ? "../" : "";
  const productLinkPrefix = inProductsFolder ? "" : "products/";

  function productCard(p){
    return '' +
      '<article class="product-card" data-category="' + p.category + '">' +
        '<a href="' + productLinkPrefix + p.id + '.html" class="product-image">' +
          '<img src="' + assetPrefix + p.image + '" alt="' + p.name + '" loading="lazy">' +
        '</a>' +
        '<div class="product-body">' +
          '<h3 class="product-name">' + p.name + '</h3>' +
          '<p class="product-desc">' + p.description + '</p>' +
          '<div class="product-meta">' +
            '<span>' + p.color + '</span><span>' + p.style + '</span>' +
          '</div>' +
          '<div class="product-price">' + MBK.formatPrice(p.price) + '</div>' +
        '</div>' +
        '<div class="product-actions">' +
          '<a href="' + productLinkPrefix + p.id + '.html" class="btn">VIEW PRODUCT</a>' +
          '<button class="btn btn-solid" data-add-to-cart="' + p.id + '">ADD TO CART</button>' +
        '</div>' +
      '</article>';
  }

  /* ---------------- Shop grid ---------------- */
  const grid = document.querySelector("[data-product-grid]");
  if (grid){
    const params = new URLSearchParams(window.location.search);
    let activeCategory = params.get("category") || "all";

    function render(category){
      const items = MBK.byCategory(category);
      grid.innerHTML = items.map(productCard).join("");
      document.querySelectorAll("[data-filter]").forEach(function(btn){
        btn.classList.toggle("active", btn.getAttribute("data-filter") === category);
      });
      bindAddToCart();
    }

    document.querySelectorAll("[data-filter]").forEach(function(btn){
      btn.addEventListener("click", function(){
        activeCategory = btn.getAttribute("data-filter");
        const url = new URL(window.location);
        if (activeCategory === "all"){ url.searchParams.delete("category"); }
        else { url.searchParams.set("category", activeCategory); }
        window.history.replaceState({}, "", url);
        render(activeCategory);
      });
    });

    render(activeCategory);
  }

  /* ---------------- Related products (used on shop-adjacent sections) ---------------- */
  const relatedGrid = document.querySelector("[data-related-grid]");
  if (relatedGrid){
    const currentId = relatedGrid.getAttribute("data-related-grid");
    const current = MBK.byId(currentId);
    if (current){
      const related = MBK.related(current, 3);
      relatedGrid.innerHTML = related.map(productCard).join("");
      bindAddToCart();
    }
  }

  /* ---------------- Add to cart (event delegation, covers dynamic cards) ---------------- */
  function bindAddToCart(){
    document.querySelectorAll("[data-add-to-cart]").forEach(function(btn){
      if (btn.dataset.bound) return;
      btn.dataset.bound = "true";
      btn.addEventListener("click", function(){
        const id = btn.getAttribute("data-add-to-cart");
        const product = MBK.byId(id);
        if (!product) return;
        const qtyInput = document.querySelector("[data-qty-input]");
        const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        MbkCart.add(product, qty);
        const originalText = btn.textContent;
        btn.textContent = "ADDED";
        setTimeout(function(){ btn.textContent = originalText; }, 1200);
      });
    });
  }
  bindAddToCart();

  /* ---------------- Product detail page ---------------- */
  const pdpRoot = document.querySelector("[data-pdp]");
  if (pdpRoot){
    const qtyInput = document.querySelector("[data-qty-input]");
    const qtyMinus = document.querySelector("[data-qty-minus]");
    const qtyPlus = document.querySelector("[data-qty-plus]");
    if (qtyMinus && qtyInput){
      qtyMinus.addEventListener("click", function(){
        qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
      });
    }
    if (qtyPlus && qtyInput){
      qtyPlus.addEventListener("click", function(){
        qtyInput.value = (parseInt(qtyInput.value, 10) || 1) + 1;
      });
    }

    const buyNow = document.querySelector("[data-buy-now]");
    if (buyNow){
      buyNow.addEventListener("click", function(){
        const id = buyNow.getAttribute("data-buy-now");
        const product = MBK.byId(id);
        const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
        if (product){
          MbkCart.add(product, qty);
          window.location.href = "../checkout.html";
        }
      });
    }
  }

  /* ---------------- Accordion (product detail) ---------------- */
  document.querySelectorAll(".acc-trigger").forEach(function(trigger){
    trigger.addEventListener("click", function(){
      const item = trigger.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".acc-item.open").forEach(function(openItem){
        openItem.classList.remove("open");
        openItem.querySelector(".acc-panel").style.maxHeight = null;
      });

      if (!isOpen){
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------------- Cart page ---------------- */
  const cartListEl = document.querySelector("[data-cart-list]");
  if (cartListEl){
    renderCartPage();
  }

  function renderCartPage(){
    const items = MbkCart.read();
    const emptyEl = document.querySelector("[data-cart-empty]");
    const summaryEl = document.querySelector("[data-cart-summary]");

    if (items.length === 0){
      cartListEl.classList.add("hidden");
      if (summaryEl) summaryEl.classList.add("hidden");
      if (emptyEl) emptyEl.classList.add("show");
      return;
    }
    if (emptyEl) emptyEl.classList.remove("show");
    cartListEl.classList.remove("hidden");
    if (summaryEl) summaryEl.classList.remove("hidden");

    cartListEl.innerHTML = items.map(function(i){
      return '' +
        '<div class="cart-item" data-cart-item="' + i.id + '">' +
          '<div class="cart-item-image"><img src="' + i.image + '" alt="' + i.name + '" loading="lazy"></div>' +
          '<div>' +
            '<div class="cart-item-name">' + i.name + '</div>' +
            '<div class="cart-item-cat">' + (i.category === "mini-bikes" ? "Mini Bike" : i.category === "mini-drift-trikes" ? "Mini Drift Trike" : "Parts & Accessories") + '</div>' +
          '</div>' +
          '<div class="cart-item-price">' + MBK.formatPrice(i.price) + '</div>' +
          '<div class="qty-selector">' +
            '<button data-cart-minus="' + i.id + '" aria-label="Decrease quantity">−</button>' +
            '<input type="text" value="' + i.quantity + '" data-cart-qty="' + i.id + '" readonly>' +
            '<button data-cart-plus="' + i.id + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<div class="cart-item-total">' + MBK.formatPrice(i.price * i.quantity) + '</div>' +
          '<button class="cart-item-remove" data-cart-remove="' + i.id + '">REMOVE</button>' +
        '</div>';
    }).join("");

    updateCartSummary();
    bindCartControls();
  }

  function updateCartSummary(){
    const subtotalEl = document.querySelector("[data-cart-subtotal]");
    const shippingEl = document.querySelector("[data-cart-shipping]");
    const totalEl = document.querySelector("[data-cart-total]");
    const freeShipNote = document.querySelector("[data-free-shipping-note]");

    if (subtotalEl) subtotalEl.textContent = MBK.formatPrice(MbkCart.subtotal());
    if (shippingEl) shippingEl.textContent = MbkCart.shipping() === 0 ? "FREE" : MBK.formatPrice(MbkCart.shipping());
    if (totalEl) totalEl.textContent = MBK.formatPrice(MbkCart.total());

    if (freeShipNote){
      const remaining = 3 - MbkCart.vehicleCount();
      freeShipNote.textContent = MbkCart.qualifiesForFreeShipping()
        ? "Free shipping applied — your order includes 3 or more bikes/trikes."
        : "Add " + remaining + " more bike" + (remaining === 1 ? "" : "s") + "/trike" + (remaining === 1 ? "" : "s") + " to qualify for free shipping.";
    }
  }

  function bindCartControls(){
    document.querySelectorAll("[data-cart-remove]").forEach(function(btn){
      btn.addEventListener("click", function(){
        MbkCart.remove(btn.getAttribute("data-cart-remove"));
        renderCartPage();
      });
    });
    document.querySelectorAll("[data-cart-minus]").forEach(function(btn){
      btn.addEventListener("click", function(){
        const id = btn.getAttribute("data-cart-minus");
        const items = MbkCart.read();
        const item = items.find(function(i){ return i.id === id; });
        if (item && item.quantity > 1){
          MbkCart.setQuantity(id, item.quantity - 1);
        } else if (item){
          MbkCart.remove(id);
        }
        renderCartPage();
      });
    });
    document.querySelectorAll("[data-cart-plus]").forEach(function(btn){
      btn.addEventListener("click", function(){
        const id = btn.getAttribute("data-cart-plus");
        const items = MbkCart.read();
        const item = items.find(function(i){ return i.id === id; });
        if (item) MbkCart.setQuantity(id, item.quantity + 1);
        renderCartPage();
      });
    });
  }

  /* ---------------- Order confirmation page ---------------- */
  const orderNumEl = document.querySelector("[data-order-number]");
  if (orderNumEl){
    try{
      const order = JSON.parse(sessionStorage.getItem("mbk-last-order"));
      if (order && order.orderNumber){
        orderNumEl.textContent = "ORDER #" + order.orderNumber;
      }
    }catch(e){ /* no-op — falls back to static placeholder in markup */ }
  }

  /* ---------------- Tawk.to live chat + Google Analytics ----------------
     Set your real IDs below, then both auto-load on every page — no need
     to edit each HTML file individually. Leave a value blank to keep that
     integration disabled. */
  window.MBK_CONFIG = window.MBK_CONFIG || {
    TAWK_TO_PROPERTY_ID: "6a971a694bf4e4344960a7f5",
    TAWK_TO_WIDGET_ID: "1k1f3ucd9",
    GA4_MEASUREMENT_ID: "G-QRLWQPPTWL" // from Google Analytics → Admin → Data Streams
  };

  (function loadTawkTo(){
    var id = window.MBK_CONFIG.TAWK_TO_PROPERTY_ID;
    var widget = window.MBK_CONFIG.TAWK_TO_WIDGET_ID;
    if (!id || !widget) return; // not configured yet — skip silently

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    var s1 = document.createElement("script");
    var s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = "https://embed.tawk.to/" + id + "/" + widget;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0.parentNode.insertBefore(s1, s0);
  })();

  (function loadGoogleAnalytics(){
    var id = window.MBK_CONFIG.GA4_MEASUREMENT_ID;
    if (!id) return; // not configured yet — skip silently

    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s1);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", id);
  })();
});