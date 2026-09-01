/* MINI BIKE KLUB — checkout.js
   Renders order summary from the cart, validates billing fields + agreement,
   reveals payment instructions, and creates a placeholder order on submit.
   NOTE: Section 45 of the spec applies — this is a client-side UX layer only.
   A production build must re-validate everything server-side before an
   order is accepted, and must never expose payment credentials or API keys
   in frontend source. */

document.addEventListener("DOMContentLoaded", function(){
  const summaryEl = document.querySelector("[data-order-summary-lines]");
  const subtotalEl = document.querySelector("[data-checkout-subtotal]");
  const shippingEl = document.querySelector("[data-checkout-shipping]");
  const totalEl = document.querySelector("[data-checkout-total]");
  const form = document.querySelector("[data-checkout-form]");

  function renderSummary(){
    if (!summaryEl) return;
    const items = MbkCart.read();

    if (items.length === 0){
      summaryEl.innerHTML = '<p style="padding:16px 0;">Your cart is empty. <a href="/shop.html" style="text-decoration:underline;color:var(--text);">Continue shopping</a></p>';
      if (form) form.querySelector("[data-place-order]").setAttribute("disabled", "disabled");
    }

    summaryEl.innerHTML = items.map(function(i){
      return '<div class="order-line">' +
        '<span class="name">' + i.name + ' × ' + i.quantity + '</span>' +
        '<span>' + MBK.formatPrice(i.price * i.quantity) + '</span>' +
        '</div>';
    }).join("");

    const subtotal = MbkCart.subtotal();
    const shipping = MbkCart.shipping();
    const total = MbkCart.total();

    if (subtotalEl) subtotalEl.textContent = MBK.formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? "FREE" : MBK.formatPrice(shipping);
    if (totalEl) totalEl.textContent = MBK.formatPrice(total);
  }

  renderSummary();

  /* Payment method selection reveals instructions */
  document.querySelectorAll(".payment-option").forEach(function(option){
    const radio = option.querySelector("input[type='radio']");
    radio.addEventListener("change", function(){
      document.querySelectorAll(".payment-option").forEach(function(o){ o.classList.remove("selected"); });
      option.classList.add("selected");
    });
  });

  /* Validation + submission */
  if (form){
    form.addEventListener("submit", function(e){
      e.preventDefault();

      let valid = true;
      form.querySelectorAll("[required]").forEach(function(field){
        const errorEl = field.closest(".field")?.querySelector(".field-error");
        if (!field.value.trim()){
          valid = false;
          if (errorEl) errorEl.textContent = "This field is required.";
          field.style.borderColor = "#B33A3A";
        } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)){
          valid = false;
          if (errorEl) errorEl.textContent = "Enter a valid email address.";
          field.style.borderColor = "#B33A3A";
        } else {
          if (errorEl) errorEl.textContent = "";
          field.style.borderColor = "";
        }
      });

      const agree = form.querySelector("[data-agreement]");
      const agreeError = document.querySelector("[data-agreement-error]");
      if (agree && !agree.checked){
        valid = false;
        if (agreeError) agreeError.textContent = "You must agree to the Terms & Conditions and Privacy Policy.";
      } else if (agreeError){
        agreeError.textContent = "";
      }

      const paymentSelected = form.querySelector("input[name='payment']:checked");
      const paymentError = document.querySelector("[data-payment-error]");
      if (!paymentSelected){
        valid = false;
        if (paymentError) paymentError.textContent = "Select a payment method.";
      } else if (paymentError){
        paymentError.textContent = "";
      }

      if (MbkCart.read().length === 0){
        valid = false;
      }

      if (!valid) return;

      /* Create a placeholder order. In production this call goes to a
         serverless function that re-validates everything server-side,
         persists the order, and triggers Resend order-confirmation emails
         (customer + admin) per spec section 33. */
      const orderNumber = "MBK-" + Math.floor(10000 + Math.random() * 89999);
      const order = {
        orderNumber: orderNumber,
        items: MbkCart.read(),
        subtotal: MbkCart.subtotal(),
        shipping: MbkCart.shipping(),
        total: MbkCart.total(),
        paymentMethod: paymentSelected.value,
        billing: Object.fromEntries(new FormData(form).entries()),
        createdAt: new Date().toISOString()
      };

      sessionStorage.setItem("mbk-last-order", JSON.stringify(order));
      MbkCart.clear();
      window.location.href = "order-confirmation.html";
    });
  }
});
