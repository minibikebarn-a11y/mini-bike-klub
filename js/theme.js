/* MINI BIKE KLUB — theme.js
   Handles dark/light mode: localStorage persistence, system preference fallback. */

(function(){
  const STORAGE_KEY = "mbk-theme";
  const root = document.documentElement;

  function getPreferredTheme(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme){
    root.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-icon]").forEach(function(el){
      el.setAttribute("data-current", theme);
    });
    document.querySelectorAll("[data-theme-label]").forEach(function(el){
      el.textContent = theme === "dark" ? "LIGHT MODE" : "DARK MODE";
    });
  }

  function toggleTheme(){
    const current = root.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply immediately (before paint is ideal; this script is loaded in <head>)
  applyTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function(){
    document.querySelectorAll("[data-theme-toggle]").forEach(function(btn){
      btn.addEventListener("click", toggleTheme);
    });

    // Respect system changes only if user has not explicitly chosen
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e){
      if (!localStorage.getItem(STORAGE_KEY)){
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  });
})();
