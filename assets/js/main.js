/* Axia Engineering Services — site behaviour (no dependencies) */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) { setOpen(false); } });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------------- Reveal on entry ----------------
     Hidden states only exist under html.js and prefers-reduced-motion:
     no-preference, so content is never lost without script. */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(revealables, function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
      Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
      window.addEventListener("load", function () {
        setTimeout(function () {
          Array.prototype.forEach.call(revealables, function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add("is-in"); }
          });
        }, 2500);
      });
    }
  }

  /* ---------------- Warehouse diagram: pick a system ----------------
     Without script every panel shows and the drawing stays neutral. */
  var shed = document.querySelector(".shed");
  if (shed) {
    var tablist = shed.querySelector("[role=tablist]");
    var tabs = Array.prototype.slice.call(shed.querySelectorAll("[role=tab]"));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      shed.setAttribute("data-active", tabs[i].getAttribute("data-sys"));
      if (focus) { tabs[i].focus(); }
    };
    tablist.hidden = false;
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length;
        if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); select((i + 1) % n, true); }
        else if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); select((i - 1 + n) % n, true); }
        else if (k === "Home") { e.preventDefault(); select(0, true); }
        else if (k === "End") { e.preventDefault(); select(n - 1, true); }
      });
    });
    select(0, false);
  }

  /* ---------------- Projects: filter by system ---------------- */
  var filter = document.querySelector(".filter");
  if (filter) {
    var buttons = Array.prototype.slice.call(filter.querySelectorAll("[data-filter]"));
    var projects = Array.prototype.slice.call(document.querySelectorAll(".project[data-sys]"));
    filter.hidden = false;
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        var f = b.getAttribute("data-filter");
        buttons.forEach(function (o) { o.setAttribute("aria-pressed", String(o === b)); });
        projects.forEach(function (p) {
          p.hidden = f !== "all" && p.getAttribute("data-sys").split(" ").indexOf(f) === -1;
        });
      });
    });
  }

  /* ---------------- Photo viewer for project strips ---------------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll("[data-zoom] img"));
  if (shots.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Project photo viewer");
    box.innerHTML =
      '<button type="button" class="lightbox__prev" aria-label="Previous photo">&#8249;</button>' +
      '<figure><img alt=""><figcaption><span class="lightbox__text"></span>' +
      '<span class="lightbox__count"></span></figcaption></figure>' +
      '<button type="button" class="lightbox__next" aria-label="Next photo">&#8250;</button>' +
      '<button type="button" class="lightbox__close" aria-label="Close photo viewer">&times;</button>';
    document.body.appendChild(box);

    var big = box.querySelector("img"), text = box.querySelector(".lightbox__text"),
        count = box.querySelector(".lightbox__count"), closeBtn = box.querySelector(".lightbox__close"),
        boxButtons = box.querySelectorAll("button"), index = 0, lastFocus = null;

    var visible = function () { return shots.filter(function (s) { return !s.closest("[hidden]"); }); };
    var show = function () {
      var list = visible(), img = list[index], cap = img.closest("figure").querySelector("figcaption");
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      text.textContent = cap ? cap.textContent : img.alt;
      count.textContent = (index + 1) + " / " + list.length;
    };
    var open = function (img) {
      index = Math.max(0, visible().indexOf(img)); show();
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
    var move = function (d) { var n = visible().length; index = (index + d + n) % n; show(); };

    shots.forEach(function (img) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Enlarge photo: " + img.alt);
      img.addEventListener("click", function () { open(img); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); }
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
        var first = boxButtons[0], last = boxButtons[boxButtons.length - 1];
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
     completed enquiry to the visitor's own mail client via a mailto: link.
     Swap this for a real endpoint (Formspree, Netlify Forms, a serverless
     function) when hosting allows. */
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
        "Site location: " + (get("location") || "—"),
        "Floor area: " + (get("size") || "—"),
        "Timeline: " + (get("timeline") || "—"),
        "",
        "Details:",
        get("message")
      ];

      window.location.href = "mailto:" + form.dataset.mailto +
        "?subject=" + encodeURIComponent("Website enquiry — " + serviceLabel) +
        "&body=" + encodeURIComponent(lines.join("\n"));

      if (status) {
        status.textContent =
          "Opening your email app with the enquiry filled in. Press send there to reach us. " +
          "If nothing opened, email " + form.dataset.mailto + " directly.";
      }
    });
  }
})();
