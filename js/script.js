/* ===== Edit these two lines before you upload ===== */
const SITE = {
  email: "your-email@example.com",   // your real email address
  github: ""                          // your GitHub link, like https://github.com/yourname (leave empty to hide)
};
/* ================================================== */

(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Email and GitHub links
  document.querySelectorAll("[data-email]").forEach(function (a) {
    a.href = "mailto:" + SITE.email; a.textContent = SITE.email;
  });
  var gh = document.querySelector("[data-github]");
  if (gh && SITE.github) { gh.href = SITE.github; gh.hidden = false; }

  // Year
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Photo: shows assets/img/photo.jpg if you add it
  var photo = document.querySelector(".crest img");
  if (photo) {
    var test = new Image();
    test.onload = function () { photo.src = test.src; photo.hidden = false; document.querySelector(".crest").classList.add("has-photo"); };
    test.src = "assets/img/photo.jpg";
  }

  // Mobile menu
  var btn = document.querySelector(".menu-btn"), menu = document.getElementById("menu");
  function closeMenu() { btn.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); }
  btn.addEventListener("click", function () {
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open)); menu.classList.toggle("open", !open);
  });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // Light / dark switch
  document.querySelector(".theme-btn").addEventListener("click", function () {
    var dark = root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark"; root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Highlight the menu link of the section you are reading
  var links = {};
  menu.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (k) { var s = document.getElementById(k); if (s) spy.observe(s); });

    // Reveal on scroll
    if (!reduce) {
      root.classList.add("js");
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold: 0.1 });
      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    }
  }

  // Back to top
  var top = document.querySelector(".to-top");
  window.addEventListener("scroll", function () { top.hidden = window.scrollY < 700; }, { passive: true });
  top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  // Contact form: opens the visitor's email app
  var form = document.getElementById("form"), msg = document.getElementById("msg");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = new FormData(form), name = (d.get("name") || "").trim(), mail = (d.get("email") || "").trim(), text = (d.get("message") || "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(mail) || !text) { msg.textContent = "Please fill in your name, a valid email and a message."; msg.className = "msg err"; return; }
    var body = text + "\n\n" + name + "\n" + mail;
    window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent("Message from " + name + " (portfolio)") + "&body=" + encodeURIComponent(body);
    msg.textContent = "Your email app should open now. Press send there to finish."; msg.className = "msg ok";
  });
})();
