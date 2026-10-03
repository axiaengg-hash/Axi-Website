/* Axia Engineering Services — site behaviour (no dependencies) */
(function () {
  "use strict";

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------------- Mark the current page in the nav ---------------- */
  var here = window.location.pathname.split("/").pop() || "index.html";
  Array.prototype.forEach.call(document.querySelectorAll(".nav a[href]"), function (link) {
    var target = link.getAttribute("href").split("#")[0].split("/").pop();
    if (target && target === here) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealables = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!revealables.length) {
    /* nothing to do */
  } else if (reduced || !("IntersectionObserver" in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });
  }

  /* ---------------- Anchor landings ----------------
     A .reveal element starts shifted down by a transform. When the page is
     opened on a #fragment the browser computes the scroll position while that
     shift is still applied, so the target settles under the sticky header once
     the animation clears it. Reveal the target and its ancestors first, then
     scroll again against the final layout. */
  function settleHash() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) { return; }

    var target;
    try { target = document.querySelector(hash); } catch (err) { return; }
    if (!target) { return; }

    var node = target;
    while (node && node !== document.body) {
      if (node.classList && node.classList.contains("reveal")) {
        node.classList.add("is-visible");
      }
      node = node.parentElement;
    }

    requestAnimationFrame(function () {
      target.scrollIntoView();
    });
  }

  settleHash();
  window.addEventListener("hashchange", settleHash);

  /* ---------------- Current year in the footer ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------- Enquiry form ----------------
     The site is static, so there is no server to post to. The form hands the
     completed enquiry to the visitor's own mail client via a mailto: link and
     tells them what happened. Swap this out for a real endpoint (Formspree,
     Netlify Forms, a serverless function) when hosting allows. */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var status = document.getElementById("form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) { return; }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || "").toString().trim(); };

      var serviceLabel = get("service") || "General enquiry";
      var lines = [
        "Service required: " + serviceLabel,
        "Name: " + get("name"),
        "Company: " + (get("company") || "—"),
        "Email: " + get("email"),
        "Phone: " + (get("phone") || "—"),
        "Site / location: " + (get("location") || "—"),
        "Preferred timeline: " + (get("timeline") || "—"),
        "",
        "Details:",
        get("message")
      ];

      var subject = "Website enquiry — " + serviceLabel;
      var mailto = "mailto:" + form.dataset.mailto +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      window.location.href = mailto;

      if (status) {
        status.textContent =
          "Opening your email app with the enquiry pre-filled — press send to reach us. " +
          "If nothing opened, email " + form.dataset.mailto + " directly.";
        status.classList.add("is-visible");
      }
    });
  }
})();
