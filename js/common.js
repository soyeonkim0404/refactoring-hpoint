// Swiper 초기화
document.addEventListener('DOMContentLoaded', function() {
    const root = document.documentElement;

    // 헤더 하단 공지 (닫기 애니메이션: 아래 -> 위로 접히며 사라짐)
    const topNotice = document.getElementById('topNotice');
    const setNoticeHeightVar = () => {
        if (!topNotice || !topNotice.isConnected) return;
        root.style.setProperty('--notice-h', `${topNotice.offsetHeight}px`);
    };

    // 초기/리사이즈 시 공지 높이 반영
    if (topNotice) {
        setNoticeHeightVar();
        window.addEventListener('resize', setNoticeHeightVar);

        const closeBtn = topNotice.querySelector('.top-notice__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                // 현재 높이를 기준으로 max-height 애니메이션 준비
                const h = topNotice.offsetHeight;
                topNotice.style.maxHeight = `${h}px`;
                // reflow
                void topNotice.offsetHeight;

                // main 영역도 동시에 부드럽게 올라오도록 먼저 높이를 0으로 전환
                root.style.setProperty('--notice-h', '0px');

                topNotice.classList.add('is-closing');
                topNotice.style.maxHeight = '0px';

                const onEnd = (e) => {
                    if (e.propertyName !== 'max-height') return;
                    topNotice.removeEventListener('transitionend', onEnd);
                    if (topNotice.parentNode) topNotice.parentNode.removeChild(topNotice);
                    window.removeEventListener('resize', setNoticeHeightVar);
                };
                topNotice.addEventListener('transitionend', onEnd);
            });
        }
    } else {
        root.style.setProperty('--notice-h', '0px');
    }

    // 혜택 섹션 Swiper
    const benefitsSwiper = new Swiper('.benefits-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
    });

    // 포인트 적립 Swiper
    const earnSwiper = new Swiper('.earn-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
    });

    // 추천 상품 Swiper
    const recommendSwiper = new Swiper('.recommend-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
    });

    // 금융 혜택 Swiper
    const financeSwiper = new Swiper('.finance-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
    });

    // 문화 콘텐츠 Swiper
    const cultureSwiper = new Swiper('.culture-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        freeMode: true,
    });

    // 공지 스와이퍼
    const noticeSwiper = new Swiper('.notice-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
            el: '.notice-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
    });

    // 하단 네비게이션 클릭 이벤트
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 버튼 클릭 이벤트
    const buttons = document.querySelectorAll('.btn-primary, .voice-btn, .participate-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked:', this.textContent);
        });
    });

    // 메뉴 토글 이벤트
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
});
