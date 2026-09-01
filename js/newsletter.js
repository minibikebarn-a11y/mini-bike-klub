/* MINI BIKE KLUB — newsletter.js
   Validates email input and prepares the call site for a future email-service
   integration (Resend, or a list provider) via a serverless function. */

(function(){
  function isValidEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  document.addEventListener("DOMContentLoaded", function(){
    const form = document.querySelector("[data-newsletter-form]");
    if (!form) return;

    const input = form.querySelector("input[type='email']");
    const msg = form.parentElement.querySelector("[data-form-msg]");

    form.addEventListener("submit", async function(e){
      e.preventDefault();
      const value = input.value.trim();

      if (!isValidEmail(value)){
        showMsg("Enter a valid email address.", "error");
        return;
      }

      showMsg("Subscribing…", "");

      try{
        const res = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: value })
        });
        if (!res.ok) throw new Error("Signup failed");
        showMsg("You're on the list. Welcome to the klub.", "success");
        form.reset();
      } catch(err){
        showMsg("Something went wrong. Please try again.", "error");
      }
    });

    function showMsg(text, type){
      if (!msg) return;
      msg.textContent = text;
      msg.className = "form-msg" + (type ? " " + type : "");
    }
  });
})();