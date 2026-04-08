(function () {
  // nav.js는 항상 /assets/nav.js 위치 → 그 한 단계 위가 사이트 루트
  const scriptSrc = document.currentScript ? document.currentScript.src : '';
  const root = scriptSrc.replace(/assets\/nav\.js.*$/, '');
  const CSS = `
    #hy-nav-btn {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 9999;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: rgba(15,15,15,0.85);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 0;
    }
    #hy-nav-btn span {
      display: block;
      width: 20px;
      height: 2px;
      background: #fff;
      border-radius: 2px;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }
    #hy-nav-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #hy-nav-btn.open span:nth-child(2) { opacity: 0; }
    #hy-nav-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    #hy-nav-drawer {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 280px;
      background: #0f0f0f;
      border-right: 1px solid #1e1e1e;
      z-index: 9998;
      transform: translateX(-100%);
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      padding: 80px 0 40px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    #hy-nav-drawer.open {
      transform: translateX(0);
    }
    #hy-nav-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9997;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    #hy-nav-overlay.open {
      opacity: 1;
      pointer-events: auto;
    }
    .hy-nav-logo {
      font-size: 0.75rem;
      font-weight: 700;
      color: #555;
      letter-spacing: 0.15em;
      padding: 0 24px 24px;
      border-bottom: 1px solid #1e1e1e;
      margin-bottom: 16px;
      font-family: 'Pretendard', sans-serif;
    }
    .hy-nav-item {
      display: block;
      padding: 12px 24px;
      color: #ccc;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: 'Pretendard', sans-serif;
      transition: color 0.15s, background 0.15s;
    }
    .hy-nav-item:hover {
      color: #fff;
      background: #1a1a1a;
    }
    .hy-nav-group-label {
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #444;
      padding: 20px 24px 6px;
      font-family: 'Pretendard', sans-serif;
    }
    .hy-nav-sub {
      display: block;
      padding: 10px 24px 10px 36px;
      color: #888;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      font-family: 'Pretendard', sans-serif;
      transition: color 0.15s, background 0.15s;
    }
    .hy-nav-sub:hover {
      color: #fff;
      background: #1a1a1a;
    }
    .hy-nav-divider {
      border: none;
      border-top: 1px solid #1e1e1e;
      margin: 12px 0;
    }
  `;

  // 아파트 공약 공개일: 2026-05-15
  const APT_UNLOCK = new Date('2026-05-15T00:00:00');
  const aptUnlocked = new Date() >= APT_UNLOCK;

  const HTML = `
    <button id="hy-nav-btn" aria-label="메뉴 열기">
      <span></span><span></span><span></span>
    </button>
    <div id="hy-nav-overlay"></div>
    <nav id="hy-nav-drawer" aria-label="사이트 네비게이션">
      <div class="hy-nav-logo">이호엽 · 성북구의회</div>

      <a class="hy-nav-item" href="${root}">홈</a>

      <hr class="hy-nav-divider">

      <a class="hy-nav-item" href="${root}#pledges" data-anchor="pledges">핵심 공약</a>
      <a class="hy-nav-sub" href="${root}bus/">버스 공약</a>
      <a class="hy-nav-sub" href="${root}tax/">세금 공약</a>

      <a class="hy-nav-item" href="${root}#pinpoint" data-anchor="pinpoint">핀포인트 공약</a>
      <a class="hy-nav-sub" href="${root}#pinpoint" data-modal="pinpoint" data-idx="0">쓰레기 불법투기 근절</a>
      <a class="hy-nav-sub" href="${root}#pinpoint" data-modal="pinpoint" data-idx="1">0.6리터 음식물봉투 도입</a>
      <a class="hy-nav-sub" href="${root}#pinpoint" data-modal="pinpoint" data-idx="2">주차 공유 프로그램</a>
      <a class="hy-nav-sub" href="${root}#pinpoint" data-modal="pinpoint" data-idx="3">야간·공휴일 병원 알림</a>

      <a class="hy-nav-item" href="${root}#pledge10" data-anchor="pledge10">10대 공약</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="0">01 안심 골목길 프로젝트</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="1">02 보행환경 개선</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="2">03 공보육·돌봄 강화</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="3">04 어르신 복지</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="4">05 주거환경·도시재생</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="5">06 소상공인·지역상권</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="6">07 공원·녹지 확충</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="7">08 청소년 활동공간</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="8">09 무장애 이동환경</a>
      <a class="hy-nav-sub" href="${root}#pledge10" data-modal="pledge10" data-idx="9">10 주민참여·투명행정</a>

      <a class="hy-nav-item" href="${root}#universities" data-anchor="universities">대학별 공약</a>
      <a class="hy-nav-sub" href="${root}ku/">고려대</a>
      <a class="hy-nav-sub" href="${root}sungshin/">성신여대</a>
      <a class="hy-nav-sub" href="${root}hansung/">한성대</a>

      <hr class="hy-nav-divider">
      <a class="hy-nav-item" href="${root}#donate" data-anchor="donate">후원하기</a>

      ${aptUnlocked ? `<hr class="hy-nav-divider"><a class="hy-nav-item" href="${root}apt/">아파트 공약</a>` : ''}
    </nav>
  `;

  // 스타일 주입
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // HTML 주입
  const wrapper = document.createElement('div');
  wrapper.innerHTML = HTML;
  document.body.appendChild(wrapper);

  // 동작
  const btn = document.getElementById('hy-nav-btn');
  const drawer = document.getElementById('hy-nav-drawer');
  const overlay = document.getElementById('hy-nav-overlay');

  function openNav() {
    btn.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.setAttribute('aria-label', '메뉴 닫기');
  }
  function closeNav() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.setAttribute('aria-label', '메뉴 열기');
  }

  btn.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeNav() : openNav();
  });
  overlay.addEventListener('click', closeNav);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // 앵커 링크: 같은 페이지면 스크롤, 다른 페이지면 이동
  drawer.querySelectorAll('[data-anchor]').forEach(link => {
    link.addEventListener('click', (e) => {
      const anchorId = link.dataset.anchor;
      const target = document.getElementById(anchorId);
      if (target) {
        e.preventDefault();
        closeNav();
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
      } else {
        closeNav();
      }
    });
  });

  // 모달 직접 열기: 스크롤 먼저 → 모달 오픈. 이미 열린 모달은 먼저 닫기.
  drawer.querySelectorAll('[data-modal]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = link.dataset.modal;
      const idx = +link.dataset.idx;
      const sectionId = modal === 'pinpoint' ? 'pinpoint' : 'pledge10';
      const section = document.getElementById(sectionId);

      closeNav();

      // 열려있는 모달 전부 닫기
      ['ppOverlay', 'p10Overlay'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('open');
      });
      document.body.style.overflow = '';

      if (section) {
        // 메인 페이지: 드로어 닫힌 뒤 섹션으로 스크롤, 그다음 모달 오픈
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 320);
        setTimeout(() => {
          if (modal === 'pinpoint' && typeof window.openPinpoint === 'function') {
            window.openPinpoint(idx);
          } else if (modal === 'pledge10' && typeof window.openPledge10 === 'function') {
            window.openPledge10(idx);
          }
        }, 950);
      } else {
        // 다른 페이지: 섹션 URL로 이동 (모달은 cross-page 불가)
        window.location.href = link.href;
      }
    });
  });
})();
