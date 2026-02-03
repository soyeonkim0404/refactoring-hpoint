document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('[data-parallax-lock]');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const root = document.documentElement;
  const stage = section.querySelector('.stage');
  const cardsWrap = section.querySelector('.cards');
  const cards = Array.from(section.querySelectorAll('.card[data-i]'));
  if (!stage || !cardsWrap || !cards.length) return;

  // ===== helpers =====
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  };

  // ===== BG fade =====
  function updateBgFade(p) {
    const s1 = smoothstep(0.00, 0.40, p);
    const s2 = smoothstep(0.30, 0.70, p);
    const s3 = smoothstep(0.60, 1.00, p);

    const bg1 = 1 - s1;
    const bg2 = s1 - s2;
    const bg3 = s2 - s3;
    const bg4 = s3;

    root.style.setProperty('--bg1', Math.max(0, bg1).toFixed(4));
    root.style.setProperty('--bg2', Math.max(0, bg2).toFixed(4));
    root.style.setProperty('--bg3', Math.max(0, bg3).toFixed(4));
    root.style.setProperty('--bg4', Math.max(0, bg4).toFixed(4));
  }

  // 카드 이동에 필요한 총 거리 계산 + 섹션 높이를 그에 맞게 자동 세팅
  function measureAndSetSectionHeight() {
    const stageH = stage.getBoundingClientRect().height || window.innerHeight;

    // cardsWrap 내부 콘텐츠 실제 높이 (grid 전체 높이)
    const contentH = cardsWrap.scrollHeight;

    // 스테이지에서 보이는 영역(= cardsWrap 높이)
    const visibleH = cardsWrap.getBoundingClientRect().height || stageH;

    // 카드가 “끝까지” 올라가려면 필요한 기본 이동 거리
    const baseTravel = Math.max(0, contentH - visibleH);

    // ✅ 영상처럼 마지막에 카드가 더 “빠져나가는” 거리(연출용)
    // 값 키우면 더 멀리 넘어감
    const EXIT_EXTRA = Math.round(stageH * 0.55);

    const totalTravel = baseTravel + EXIT_EXTRA;

    // ✅ 섹션 높이를 "스테이지 높이 + 이동거리"로 맞춰주면
    // 스크롤이 끝날 때 progress가 정확히 1이 됨
    section.style.height = `${stageH + totalTravel}px`;

    return { stageH, visibleH, contentH, baseTravel, totalTravel };
  }

  // progress = 섹션 내 스크롤 비율
  function calcProgress() {
    const rect = section.getBoundingClientRect();
    const sectionTopInDoc = window.scrollY + rect.top;

    const stageH = stage.getBoundingClientRect().height || window.innerHeight;
    const sectionH = section.offsetHeight;

    const maxScroll = Math.max(1, sectionH - stageH);
    const y = window.scrollY - sectionTopInDoc;

    return clamp01(y / maxScroll);
  }

  function layoutCards(p, metrics) {
    // ✅ progress에 따라 cardsWrap 전체를 위로 이동
    const offsetY = lerp(0, metrics.totalTravel, p);
    cardsWrap.style.transform = `translate3d(0, ${-offsetY}px, 0)`;

    // thumb(있으면)
    root.style.setProperty('--p', p.toFixed(4));

    // ✅ 중앙 강조(스테이지 중앙 기준)
    const stageRect = stage.getBoundingClientRect();
    const centerY = stageRect.top + stageRect.height * 0.5;

    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const cardCenter = (r.top + r.bottom) / 2;
      const dist = Math.abs(cardCenter - centerY);

      const focus = clamp01(1 - dist / (stageRect.height * 0.70));
      const scale = lerp(0.92, 1.0, focus);
      const blur = lerp(2.2, 0.0, focus);
      const op = lerp(0.45, 1.0, focus);

      //card.style.transform = `scale(${scale})`;
      card.style.filter = `blur(${blur}px)`;
      card.style.opacity = op.toFixed(3);
    });
  }

  // ===== rAF scroll loop (부드럽고 안정적) =====
  let metrics = null;
  let ticking = false;

  function update() {
    ticking = false;
    if (!metrics) metrics = measureAndSetSectionHeight();

    const p = calcProgress();
    updateBgFade(p);
    layoutCards(p, metrics);
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  // init
  metrics = measureAndSetSectionHeight();
  update();

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', () => {
    metrics = measureAndSetSectionHeight();
    requestTick();
  });
});
