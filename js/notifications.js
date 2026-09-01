/* MINI BIKE KLUB — notifications.js
   "Recent order" social-proof toast. Pops up bottom-left every ~10 seconds
   with a different customer name + product, to show shoppers that others
   are actively ordering.

   NOTE: the data below is SIMULATED for demo/placeholder purposes. Before
   launch, wire this to real order events (e.g. a lightweight endpoint that
   returns the last few actual orders) rather than shipping fake activity —
   showing invented purchase activity as if real can be misleading to
   customers. Swap FAKE_CUSTOMERS / the product pick for a real recent-orders
   feed and this file's job is done. */

(function(){

  const FAKE_CUSTOMERS = [
    { name: "Marcus", state: "California" },
    { name: "Jordan", state: "Texas" },
    { name: "Alicia", state: "Florida" },
    { name: "DeShawn", state: "Georgia" },
    { name: "Sofia", state: "Arizona" },
    { name: "Riley", state: "Nevada" },
    { name: "Hunter", state: "Ohio" },
    { name: "Priya", state: "Illinois" },
    { name: "Tyler", state: "New York" },
    { name: "Maya", state: "Washington" },
    { name: "Connor", state: "Colorado" },
    { name: "Nadia", state: "Oregon" },
    { name: "Elijah", state: "North Carolina" },
    { name: "Grace", state: "Michigan" }
  ];

  const TIME_LABELS = ["Just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "5 minutes ago"];

  const CYCLE_MS = 10000;   // a new notification every 10 seconds
  const VISIBLE_MS = 6000;  // how long each one stays on screen
  const FIRST_DELAY_MS = 3500;

  let lastCustomerIndex = -1;
  let lastProductIndex = -1;
  let toastEl = null;
  let hideTimer = null;

  function pick(arr, lastIndex){
    if (arr.length < 2) return { item: arr[0], index: 0 };
    let index;
    do { index = Math.floor(Math.random() * arr.length); } while (index === lastIndex);
    return { item: arr[index], index };
  }

  function ensureToast(){
    if (toastEl) return toastEl;
    toastEl = document.createElement("div");
    toastEl.className = "order-toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);
    return toastEl;
  }

  function showNext(){
    if (typeof MBK_PRODUCTS === "undefined" || !MBK_PRODUCTS.length) return;

    const customerPick = pick(FAKE_CUSTOMERS, lastCustomerIndex);
    const productPick = pick(MBK_PRODUCTS, lastProductIndex);
    lastCustomerIndex = customerPick.index;
    lastProductIndex = productPick.index;

    const customer = customerPick.item;
    const product = productPick.item;
    const timeLabel = TIME_LABELS[Math.floor(Math.random() * TIME_LABELS.length)];

    const el = ensureToast();
    clearTimeout(hideTimer);

    el.innerHTML =
      '<button class="order-toast-close" aria-label="Dismiss notification">&times;</button>' +
      '<div class="order-toast-body">' +
        '<div class="order-toast-dot"></div>' +
        '<div>' +
          '<p class="order-toast-text"><strong>' + customer.name + '</strong> from ' + customer.state +
            ' just ordered the <strong>' + product.name + '</strong></p>' +
          '<p class="order-toast-time">' + timeLabel + '</p>' +
        '</div>' +
      '</div>';

    el.querySelector(".order-toast-close").addEventListener("click", function(){
      el.classList.remove("in");
      clearTimeout(hideTimer);
    });

    // Force reflow so the transition retriggers even if already visible
    el.classList.remove("in");
    void el.offsetWidth;
    el.classList.add("in");

    hideTimer = setTimeout(function(){
      el.classList.remove("in");
    }, VISIBLE_MS);
  }

  document.addEventListener("DOMContentLoaded", function(){
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTimeout(function(){
      showNext();
      setInterval(showNext, CYCLE_MS);
    }, FIRST_DELAY_MS);
  });

})();
