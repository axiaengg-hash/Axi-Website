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

  /* ---------------- Header shadow once the page scrolls ---------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- Stat counters ----------------
     The final figure is in the HTML, so the page reads correctly without
     JavaScript or with reduced motion; the count-up is decoration only. */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduced && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        var el = entry.target, target = parseInt(el.getAttribute("data-count"), 10), start = null;
        countObserver.unobserve(el);
        var step = function (t) {
          if (start === null) { start = t; }
          var p = Math.min((t - start) / 1100, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) { requestAnimationFrame(step); }
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
  }

  /* ---------------- Project photo viewer ---------------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll(".project__media img"));
  if (shots.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Project photo viewer");
    box.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close photo viewer">&times;</button>' +
      '<button type="button" class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<figure><img alt=""><figcaption><span class="lightbox__text"></span>' +
      '<span class="lightbox__count"></span></figcaption></figure>' +
      '<button type="button" class="lightbox__next" aria-label="Next photo">&#8250;</button>';
    document.body.appendChild(box);

    var big = box.querySelector("img"), text = box.querySelector(".lightbox__text"),
        count = box.querySelector(".lightbox__count"), closeBtn = box.querySelector(".lightbox__close"),
        buttons = box.querySelectorAll("button"), index = 0, lastFocus = null;

    var show = function () {
      var img = shots[index], project = img.closest(".project"), title = project && project.querySelector("h3");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      text.textContent = (title ? title.textContent.trim() + " — " : "") + img.alt;
      count.textContent = (index + 1) + " / " + shots.length;
    };
    var open = function (i) {
      index = i; show();
      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };
    var close = function () {
      box.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus) { lastFocus.focus(); }
    };
    var move = function (d) { index = (index + d + shots.length) % shots.length; show(); };

    shots.forEach(function (img, i) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Enlarge photo: " + img.alt);
      img.addEventListener("click", function () { open(i); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });
    closeBtn.addEventListener("click", close);
    box.querySelector(".lightbox__prev").addEventListener("click", function () { move(-1); });
    box.querySelector(".lightbox__next").addEventListener("click", function () { move(1); });
    box.addEventListener("click", function (e) { if (e.target === box) { close(); } });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) { return; }
      if (e.key === "Escape") { close(); }
      else if (e.key === "ArrowLeft") { move(-1); }
      else if (e.key === "ArrowRight") { move(1); }
      else if (e.key === "Tab") {
        // keep focus on the viewer's own buttons while it is open
        var first = buttons[0], last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

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
