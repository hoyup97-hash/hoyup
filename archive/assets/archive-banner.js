/* =============================================================
   아카이브 공통 배너 — 한 곳에서 관리
   모든 /archive/ 페이지가 이 스크립트 한 줄만 include 하면
   최상단에 배너가 삽입된다. (PLAN 3.7절)
   ============================================================= */
(function () {
  "use strict";

  var BANNER_HTML =
    '이 페이지는 2026 지방선거 캠페인 당시 제작된 아카이브입니다. ' +
    '현재의 활동과 다를 수 있습니다. ' +
    '<a class="archive-banner__link" href="/">메인으로 →</a>';

  var CSS =
    ".archive-banner{position:relative;z-index:9999;box-sizing:border-box;width:100%;" +
    "padding:12px 20px;font-family:'Pretendard Variable',Pretendard,-apple-system," +
    "BlinkMacSystemFont,system-ui,'Segoe UI',Roboto,sans-serif;font-size:14px;" +
    "line-height:1.5;letter-spacing:-0.01em;text-align:center;color:#1A1A1A;" +
    "background:#F1F1EE;border-bottom:1px solid #E3E3DF;}" +
    ".archive-banner__link{margin-left:6px;font-weight:700;color:#B84A00;" +
    "text-decoration:none;white-space:nowrap;}" +
    ".archive-banner__link:hover{color:#E55D00;text-decoration:underline;}";

  function inject() {
    if (document.querySelector(".archive-banner")) return; // 중복 방지

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var banner = document.createElement("div");
    banner.className = "archive-banner";
    banner.setAttribute("role", "note");
    banner.innerHTML = BANNER_HTML;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
