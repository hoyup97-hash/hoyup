/* =============================================================
   hoyup.kr — main.js (2026-07-31 전면 개정)
   케이스 그리드 렌더링(data/cases.json) + 수치 카운트업
   + 약력 타임라인 상세 주입(data/timeline.json) + 라이트박스
   외부 라이브러리 0 — 바닐라 JS.
   ============================================================= */

"use strict";

(function () {
  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 고정 헤더: 브랜드 클릭 시 최상단 스크롤 (3.1) ---------- */
  var scrollTopEl = document.querySelector("[data-scroll-top]");
  if (scrollTopEl) {
    scrollTopEl.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* =====================================================================
     스크롤 리빌 유틸 (5.4) — 섹션 진입 시 아래→위 + 페이드인, 형제 스태거, 1회만.
     동적으로 추가된 요소는 revealScan() 재호출로 편입.
     ===================================================================== */
  var revealObserver = null;
  function revealScan() {
    var els = document.querySelectorAll(".reveal:not(.reveal-init)");
    if (!els.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("reveal-init", "is-in");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              revealObserver.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
    }

    /* 같은 섹션 내 형제에 60~100ms 스태거 부여 */
    var groups = [];
    var counts = [];
    els.forEach(function (el) {
      el.classList.add("reveal-init");
      var sec = el.closest("section") || el.closest("footer") || el.parentNode;
      var gi = groups.indexOf(sec);
      if (gi === -1) {
        groups.push(sec);
        counts.push(0);
        gi = groups.length - 1;
      }
      var n = counts[gi]++;
      el.style.transitionDelay = Math.min(n * 80, 320) + "ms";
      revealObserver.observe(el);
    });
  }
  revealScan();

  /* =====================================================================
     수치 카운트업 (5.4) — 뷰포트 진입 시 0 → 목표값 1.2초 ease-out.
     최종 텍스트는 HTML에 그대로 있으므로 JS가 꺼져도 숫자가 읽힌다.
     ===================================================================== */
  function formatCount(n, group, suffix) {
    var s = group ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));
    return s + (suffix || "");
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var group = el.getAttribute("data-group") === "1";
    var duration = 1200;
    var start = null;
    var done = false;

    function settle() {
      if (done) return;
      done = true;
      el.textContent = formatCount(target, group, suffix);
    }

    function step(ts) {
      if (done) return;
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      if (p >= 1) return settle();
      var eased = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = formatCount(target * eased, group, suffix);
      window.requestAnimationFrame(step);
    }

    /* 안전장치: 탭이 백그라운드로 가면 rAF가 멈추고 숫자가 중간값에 굳는다.
       (5배여야 할 자리에 1배가 남는 축소 표기 — 이 사이트에서 가장 나쁜 실패다)
       타이머로 최종값을 보장하고, 탭 복귀 시에도 즉시 확정한다. */
    window.setTimeout(settle, duration + 400);
    document.addEventListener("visibilitychange", function onVis() {
      if (document.visibilityState === "visible") {
        settle();
        document.removeEventListener("visibilitychange", onVis);
      }
    });

    el.textContent = formatCount(0, group, suffix);
    window.requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll("[data-count]");
  if (countEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            countObserver.unobserve(e.target);
            animateCount(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  /* =====================================================================
     라이트박스 (증거 이미지 확대)
     ===================================================================== */
  var IMAGE_RE = /\.(webp|jpe?g|png|gif|avif|svg)(\?.*)?$/i;

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector(".lightbox__img") : null;
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox__close") : null;
  var lastFocused = null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.setAttribute("src", src);
    lightboxImg.setAttribute("alt", alt || "");
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* =====================================================================
     케이스 그리드 (3.3) — data/cases.json이 단일 소스.
     배열 순서 = 표시 순서. featured:true → 2칸 폭. image:null → 타이포 썸네일.
     ===================================================================== */
  var casesGrid = document.querySelector("[data-cases-grid]");

  function buildThumb(c) {
    if (c.image) {
      var img = document.createElement("img");
      img.className = "case-card__thumb";
      img.src = c.image;
      img.alt = c.imageAlt || c.title;
      img.loading = "lazy";
      return img;
    }

    /* 이미지가 없으면 회색 빈 박스 대신 핵심 수치를 크게 띄운 타이포 썸네일 */
    var box = document.createElement("div");
    box.className = "case-card__thumb case-card__thumb--typo";
    box.setAttribute("aria-hidden", "true");

    var v = document.createElement("span");
    v.className = "case-card__thumb-value";
    v.textContent = (c.metric && c.metric.value) || c.title;
    box.appendChild(v);

    if (c.metric && c.metric.label) {
      var l = document.createElement("span");
      l.className = "case-card__thumb-label";
      l.textContent = c.metric.label;
      box.appendChild(l);
    }
    return box;
  }

  function buildCaseCard(c) {
    var li = document.createElement("li");
    li.className = "case-card reveal" + (c.featured ? " case-card--featured" : "");
    if (c.id) li.setAttribute("data-case-id", c.id);

    var inner = document.createElement("div");
    inner.className = "case-card__inner";

    inner.appendChild(buildThumb(c));

    var body = document.createElement("div");
    body.className = "case-card__body";

    if (c.period) {
      var period = document.createElement("p");
      period.className = "case-card__period";
      period.textContent = c.period;
      body.appendChild(period);
    }

    var title = document.createElement("h3");
    title.className = "case-card__title";
    title.textContent = c.title;
    body.appendChild(title);

    if (c.tagline) {
      var tagline = document.createElement("p");
      tagline.className = "case-card__tagline";
      tagline.textContent = c.tagline;
      body.appendChild(tagline);
    }

    if (c.metric && c.metric.value) {
      var metric = document.createElement("div");
      metric.className = "case-card__metric";
      var mv = document.createElement("span");
      mv.className = "case-card__metric-value";
      mv.textContent = c.metric.value;
      var ml = document.createElement("span");
      ml.className = "case-card__metric-label";
      ml.textContent = c.metric.label || "";
      metric.appendChild(mv);
      metric.appendChild(ml);
      body.appendChild(metric);
    }

    var cta = document.createElement("a");
    cta.className = "case-card__cta";
    cta.href = c.url;
    /* 상세 페이지는 S4에서 제작한다 (PLAN.md 7장) */
    cta.setAttribute("data-todo", "case-page");
    cta.textContent = "자세히 보기 →";
    cta.setAttribute("aria-label", c.title + " 자세히 보기");
    body.appendChild(cta);

    inner.appendChild(body);
    li.appendChild(inner);
    return li;
  }

  if (casesGrid && window.fetch) {
    fetch("data/cases.json")
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (!data || !data.cases || !data.cases.length) return;
        data.cases.forEach(function (c) {
          casesGrid.appendChild(buildCaseCard(c));
        });
        revealScan(); /* 새로 렌더된 카드도 리빌 대상에 편입 */
      })
      .catch(function () {
        /* 실패 시 noscript 폴백 목록이 핵심 정보를 대신 노출한다 */
      });
  }

  /* =====================================================================
     약력 타임라인 상세(접기) 주입 (3.5)
     ===================================================================== */
  function buildEvidence(evidence, labelText) {
    if (!evidence) return null;

    if (IMAGE_RE.test(evidence)) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tl-evidence tl-evidence--img";
      btn.textContent = "이미지 보기";
      btn.setAttribute("data-src", evidence);
      btn.addEventListener("click", function () {
        openLightbox(evidence, labelText);
      });
      return btn;
    }

    var a = document.createElement("a");
    a.className = "tl-evidence tl-evidence--link";
    a.href = evidence;
    a.textContent = "링크 보기 →";
    if (/^https?:\/\//.test(evidence)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    return a;
  }

  function buildDetails(details) {
    if (!details || !details.length) return null;

    var wrap = document.createElement("details");
    wrap.className = "tl-details";

    var summary = document.createElement("summary");
    summary.className = "tl-details__summary";
    summary.textContent = "자세히";
    wrap.appendChild(summary);

    var ul = document.createElement("ul");
    ul.className = "tl-details__list";

    details.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "tl-details__item";

      var span = document.createElement("span");
      span.className = "tl-details__text";
      span.textContent = item.text;
      li.appendChild(span);

      var ev = buildEvidence(item.evidence, item.text);
      if (ev) {
        li.appendChild(document.createTextNode(" "));
        li.appendChild(ev);
      }
      ul.appendChild(li);
    });

    wrap.appendChild(ul);
    return wrap;
  }

  if (window.fetch && document.querySelector(".tl-card[data-id]")) {
    fetch("data/timeline.json")
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (!data || !data.timeline) return;
        var byId = {};
        data.timeline.forEach(function (item) {
          byId[item.id] = item;
        });
        document.querySelectorAll(".tl-card[data-id]").forEach(function (card) {
          var item = byId[card.getAttribute("data-id")];
          if (!item) return;
          var slot = card.querySelector("[data-detail]");
          if (!slot) return;
          var det = buildDetails(item.details);
          if (det) slot.appendChild(det);
        });
      })
      .catch(function () {
        /* 로드 실패 시에도 요약은 HTML에 그대로 노출된다 (no-JS 원칙) */
      });
  }
})();
