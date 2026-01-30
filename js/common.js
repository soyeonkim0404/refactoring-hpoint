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

        const closeBtn = topNotice.querySelector('.main-top-notice_close');
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

    // 혜택 섹션 더보기 기능 (4개 상품 복제 방식)
    const benefitsMoreBtn = document.getElementById('benefitsMoreBtn');
    const benefitsProductsGrid = document.getElementById('benefitsProductsGrid');
    
    if (benefitsMoreBtn && benefitsProductsGrid) {
        // 기본 4개 상품 템플릿 가져오기
        const templateProducts = Array.from(benefitsProductsGrid.querySelectorAll('.main-product-template'));
        
        benefitsMoreBtn.addEventListener('click', function() {
            // 템플릿 4개를 복제해서 추가 (노출 애니메이션용 클래스 + 스태거 딜레이)
            templateProducts.forEach((template, index) => {
                const clonedProduct = template.cloneNode(true);
                clonedProduct.classList.remove('main-product-template');
                clonedProduct.classList.add('main-benefits-product-reveal');
                clonedProduct.style.animationDelay = `${index * 0.06}s`;
                benefitsProductsGrid.appendChild(clonedProduct);
            });

            benefitsMoreBtn.classList.toggle('expanded');
        });
    }

    // 포인트 적립 Swiper
    const earnSwiper = new Swiper('.main-earn-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        centeredSlides: false,
        loop: true,
        loopedSlides: 6,
        speed: 500,
        watchSlidesProgress: true,
        pagination: {
            el: '.main-earn-pagination',
            clickable: true,
        },
        on: {
            progress(swiper) {
              swiper.slides.forEach(slide => {
                const progress = slide.progress;
                const abs = Math.min(Math.abs(progress), 1);
        
                // slide.style.opacity = 1 - abs * 0.5;
                slide.style.transform = `
                  translateY(${abs * 12}px)
                //   scale(${1 - abs * 0.08})
                `;
              });
            },
            setTransition(swiper, duration) {
              swiper.slides.forEach(slide => {
                slide.style.transitionDuration = `${duration}ms`;
              });
            }
          }
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

    // Green Friends 배너 Swiper (걸쳐져서 보이는 스타일)
    const greenFriendsSwiper = new Swiper('.main-green-friends-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 12,
        centeredSlides: false,
        loop: false,
        pagination: {
            el: '.main-green-friends-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 16,
            },
            375: {
                slidesPerView: 1.3,
                spaceBetween: 16,
            },
            414: {
                slidesPerView: 1.4,
                spaceBetween: 16,
            },
        },
    });

    // 공지 스와이퍼
    const noticeSwiper = new Swiper('.main-notice-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        pagination: {
            el: '.main-notice-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
    });

    // 하단 네비게이션 클릭 이벤트
    const navItems = document.querySelectorAll('.main-nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 버튼 클릭 이벤트
    const buttons = document.querySelectorAll('.main-btn-primary, .voice-btn, .participate-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked:', this.textContent);
        });
    });

    // Side Menu (사이드 메뉴 팝업)
    const menuBtn = document.querySelector('.main-menu-btn');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuClose = document.getElementById('sideMenuClose');
    const sideMenuOverlay = sideMenu ? sideMenu.querySelector('.main-side-menu_overlay') : null;
    const sideMenuTabs = sideMenu ? sideMenu.querySelectorAll('.main-side-menu_tab') : [];
    const sideMenuSections = sideMenu ? sideMenu.querySelectorAll('.main-side-menu_section') : [];
    const sideMenuNav = sideMenu ? sideMenu.querySelector('.main-side-menu_nav') : null;

    // 사이드 메뉴 열기
    function openSideMenu() {
        if (sideMenu && menuBtn) {
            sideMenu.classList.add('show');
            menuBtn.classList.add('active');
            // body 스크롤 방지
            document.body.style.overflow = 'hidden';
            // 첫 번째 탭 활성화 및 첫 번째 섹션으로 스크롤
            if (sideMenuTabs.length > 0 && sideMenuSections.length > 0) {
                sideMenuTabs.forEach((tab, index) => {
                    if (index === 0) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
                // 첫 번째 섹션으로 스크롤
                setTimeout(() => {
                    scrollToSection(sideMenuSections[0].id);
                }, 100);
            }
        }
    }

    // 사이드 메뉴 닫기
    function closeSideMenu() {
        if (sideMenu && menuBtn) {
            sideMenu.classList.remove('show');
            menuBtn.classList.remove('active');
            // body 스크롤 복원
            document.body.style.overflow = '';
        }
    }

    // 탭 클릭 시 해당 섹션으로 스크롤 이동
    function scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection && sideMenuNav) {
            const navRect = sideMenuNav.getBoundingClientRect();
            const sectionRect = targetSection.getBoundingClientRect();
            const scrollTop = sideMenuNav.scrollTop;
            const targetScrollTop = scrollTop + sectionRect.top - navRect.top - 16; // 16px 여백

            sideMenuNav.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }

    // 탭 클릭 이벤트
    sideMenuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // 모든 탭에서 active 제거
            sideMenuTabs.forEach(t => t.classList.remove('active'));
            // 클릭한 탭에 active 추가
            this.classList.add('active');
            
            // 해당 섹션으로 스크롤 이동
            const targetSectionId = `sideMenu${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
            scrollToSection(targetSectionId);
        });
    });

    // 메뉴 버튼 클릭 이벤트
    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (sideMenu.classList.contains('show')) {
                closeSideMenu();
            } else {
                openSideMenu();
            }
        });
    }

    // 닫기 버튼 클릭 이벤트
    if (sideMenuClose) {
        sideMenuClose.addEventListener('click', function() {
            closeSideMenu();
        });
    }

    // 오버레이 클릭 시 닫기
    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', function() {
            closeSideMenu();
        });
    }

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('show')) {
            closeSideMenu();
        }
    });

    document.querySelectorAll('.main-lottie-container').forEach((el) => {
        if (el.dataset.lottieInit) return;
        el.dataset.lottieInit = '1';
      
        lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: window.LOTTIE_TYPE_B_ROULETTE,
        });
    });

    // Top Icon (스크롤 업 버튼)
    const topIcon = document.getElementById('topIcon');
    let scrollTimeout;

    function toggleTopIcon() {
        if (window.scrollY > 300) {
            topIcon.classList.add('show');
        } else {
            topIcon.classList.remove('show');
        }
    }

    // 스크롤 이벤트 (디바운싱)
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleTopIcon, 10);
    });

    // 초기 상태 확인
    toggleTopIcon();

    // Top Icon 클릭 시 맨 위로 스크롤
    if (topIcon) {
        topIcon.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Chatbot 토글 기능
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotBubble = document.getElementById('chatbotBubble');
    let bubbleTimeout;
    let isBubbleVisible = false;

    if (chatbotIcon && chatbotBubble) {
        chatbotIcon.addEventListener('click', function() {
            if (isBubbleVisible) {
                // 말풍선 숨기기
                chatbotBubble.classList.remove('show');
                chatbotBubble.classList.add('hide');
                isBubbleVisible = false;
                clearTimeout(bubbleTimeout);
            } else {
                // 말풍선 보이기
                chatbotBubble.classList.remove('hide');
                chatbotBubble.classList.add('show');
                isBubbleVisible = true;

                // 3초 후 자동으로 숨기기
                clearTimeout(bubbleTimeout);
                bubbleTimeout = setTimeout(function() {
                    chatbotBubble.classList.remove('show');
                    chatbotBubble.classList.add('hide');
                    isBubbleVisible = false;
                }, 3000);
            }
        });
    }

    // Footer 아코디언
    const footerAccordionBtn = document.getElementById('footerAccordionBtn');
    const footerInfo = document.getElementById('footerInfo');

    if (footerAccordionBtn && footerInfo) {
        footerAccordionBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // 닫기
                this.setAttribute('aria-expanded', 'false');
                footerInfo.classList.remove('expanded');
            } else {
                // 열기
                this.setAttribute('aria-expanded', 'true');
                footerInfo.classList.add('expanded');
            }
        });
    }

    // First Popup (첫 로딩 팝업)
    const firstPopup = document.getElementById('firstPopup');
    const firstPopupTodayClose = document.getElementById('firstPopupTodayClose');
    const firstPopupClose = document.getElementById('firstPopupClose');
    const FIRST_POPUP_STORAGE_KEY = 'firstPopupClosedDate';

    // 날짜 비교 함수 (YYYY-MM-DD 형식)
    function getTodayDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 팝업을 닫아야 하는지 확인
    function shouldShowPopup() {
        let closedDate = null;
        try {
            closedDate = localStorage.getItem(FIRST_POPUP_STORAGE_KEY);
        } catch (e) {
            console.error('localStorage 읽기 실패:', e);
        }
        
        const today = getTodayDateString();
        
        // console.log('팝업 표시 확인:', {
        //     closedDate: closedDate,
        //     today: today,
        //     shouldShow: !closedDate || closedDate !== today,
        //     localStorage_available: typeof Storage !== 'undefined'
        // });
        
        if (!closedDate || closedDate === null || closedDate === 'null') {
            return true; // 저장된 날짜가 없으면 표시
        }
        
        return closedDate !== today; // 오늘 날짜와 다르면 표시 (익일부터 다시 표시)
    }

    // 팝업 닫기 함수
    function closePopup(shouldSaveToday = false) {
        if (!firstPopup) return;

        // 오늘 그만보기 클릭 시 오늘 날짜 저장 (애니메이션 전에 저장)
        if (shouldSaveToday) {
            const today = getTodayDateString();
            //console.log('localStorage 저장 시도:', FIRST_POPUP_STORAGE_KEY, '=', today);
            
            try {
                // localStorage 사용 가능 여부 확인
                if (typeof Storage === 'undefined') {
                    console.error('localStorage를 사용할 수 없습니다');
                    return;
                }
                
                // 저장
                localStorage.setItem(FIRST_POPUP_STORAGE_KEY, today);
                
            } catch (e) {
                console.error('localStorage 저장 실패:', e);
                console.error('에러 상세:', e.message, e.name);
            }
        }

        // 닫기 애니메이션 (위에서 아래로)
        firstPopup.classList.add('closing');
        firstPopup.classList.remove('show');

        // 애니메이션 완료 후 제거
        setTimeout(() => {
            firstPopup.style.display = 'none';
        }, 400);
    }

    // 팝업 표시
    if (firstPopup) {
        const showPopup = shouldShowPopup();
        //console.log('firstPopup 요소 존재:', !!firstPopup, 'showPopup:', showPopup);
        
        if (showPopup) {
            // 약간의 지연 후 표시 (페이지 로딩 후)
            setTimeout(() => {
                firstPopup.style.display = 'flex';
                // reflow 강제
                void firstPopup.offsetHeight;
                // 표시 애니메이션 (아래에서 위로)
                firstPopup.classList.add('show');
                console.log('팝업 표시 완료');
            }, 100);
        } else {
            // 표시하지 않을 경우 숨김
            firstPopup.style.display = 'none';
            //console.log('팝업 숨김 (localStorage에 오늘 날짜 저장됨)');
        }
    } else {
        console.error('firstPopup 요소를 찾을 수 없습니다');
    }

    // 오늘 그만보기 버튼 클릭
    if (firstPopupTodayClose) {
        firstPopupTodayClose.addEventListener('click', function() {
            closePopup(true); // 오늘 날짜 저장
        });
    }

    // 닫기 버튼 클릭
    if (firstPopupClose) {
        firstPopupClose.addEventListener('click', function() {
            closePopup(false); // 날짜 저장하지 않음 (다음 로딩 시 다시 표시)
        });
    }

    // First Popup Swiper 초기화
    let firstPopupSwiper = null;
    if (firstPopup && shouldShowPopup()) {
        // 팝업이 표시된 후 Swiper 초기화
        setTimeout(() => {
            if (firstPopup.classList.contains('show')) {
                firstPopupSwiper = new Swiper('.main-first-popup-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 12,
                    loop: true,
                    pagination: {
                        el: '.main-first-popup-pagination',
                        clickable: true,
                        type: 'bullets',
                    },
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                });
            }
        }, 500);
    }

    // Pay Popup (결제 팝업)
    const payPopup = document.getElementById('payPopup');
    const payPopupClose = document.getElementById('payPopupClose');
    const payPopupTabs = payPopup ? payPopup.querySelectorAll('.main-pay-popup_tab') : [];
    const payPopupTabContents = payPopup ? payPopup.querySelectorAll('.main-pay-popup_tab-content') : [];
    const bottomNavCenter = document.querySelector('.main-bottom-nav .main-nav-item.main-center');
    const earnBtn = document.querySelector('.main-earn-btn');
    const useBtn = document.querySelector('.main-use-btn');

    // Pay Popup 열기
    function openPayPopup(activeTab = 'barcode') {
        if (!payPopup) return;

        // 팝업 표시
        payPopup.style.display = 'flex';
        // reflow 강제
        void payPopup.offsetHeight;
        // 표시 애니메이션 (아래에서 위로)
        payPopup.classList.add('show');
        payPopup.classList.remove('closing');
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';

        // 탭 활성화
        payPopupTabs.forEach(tab => {
            const tabType = tab.getAttribute('data-tab');
            if (tabType === activeTab) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // 콘텐츠 활성화
        payPopupTabContents.forEach(content => {
            const contentId = content.id;
            if (activeTab === 'barcode' && contentId === 'payPopupBarcode') {
                content.classList.add('active');
            } else if (activeTab === 'qr' && contentId === 'payPopupQr') {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }

    // Pay Popup 닫기
    function closePayPopup() {
        if (!payPopup) return;

        // 닫기 애니메이션 (위에서 아래로)
        payPopup.classList.add('closing');
        payPopup.classList.remove('show');

        // 애니메이션 완료 후 제거
        setTimeout(() => {
            payPopup.style.display = 'none';
            // body 스크롤 복원
            document.body.style.overflow = '';
        }, 400);
    }

    // 결제 버튼 클릭 이벤트
    if (bottomNavCenter) {
        bottomNavCenter.addEventListener('click', function(e) {
            e.preventDefault();
            openPayPopup('barcode'); // 기본으로 바코드 탭 활성화
        });
    }

    // 바코드 버튼 클릭 이벤트
    if (earnBtn) {
        earnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPayPopup('barcode');
        });
    }

    // QR 버튼 클릭 이벤트
    if (useBtn) {
        useBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPayPopup('qr');
        });
    }

    // 닫기 버튼 클릭 이벤트
    if (payPopupClose) {
        payPopupClose.addEventListener('click', function() {
            closePayPopup();
        });
    }

    // 오버레이 클릭 시 닫기
    const payPopupOverlay = payPopup ? payPopup.querySelector('.main-pay-popup_overlay') : null;
    if (payPopupOverlay) {
        payPopupOverlay.addEventListener('click', function() {
            closePayPopup();
        });
    }

    // 탭 클릭 이벤트
    payPopupTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');

            // 모든 탭에서 active 제거
            payPopupTabs.forEach(t => t.classList.remove('active'));
            // 클릭한 탭에 active 추가
            this.classList.add('active');

            // 모든 콘텐츠에서 active 제거
            payPopupTabContents.forEach(content => content.classList.remove('active'));

            // 해당 콘텐츠 활성화
            if (tabType === 'barcode') {
                const barcodeContent = document.getElementById('payPopupBarcode');
                if (barcodeContent) {
                    barcodeContent.classList.add('active');
                }
            } else if (tabType === 'qr') {
                const qrContent = document.getElementById('payPopupQr');
                if (qrContent) {
                    qrContent.classList.add('active');
                }
            }
        });
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && payPopup && payPopup.classList.contains('show')) {
            closePayPopup();
        }
    });

    // 포인트 숫자 Y 방향 롤링 애니메이션
    function createRollingNumber(element, targetNumber, duration = 1000) {
        if (!element) return;

        // 쉼표 제거하고 숫자만 추출
        const cleanNumber = targetNumber.replace(/,/g, '');
        const digits = cleanNumber.split('');
        
        // 원본 숫자에서 쉼표 위치 찾기
        const originalParts = targetNumber.split(',');
        const commaPositions = [];
        let currentPos = 0;
        for (let i = 0; i < originalParts.length - 1; i++) {
            currentPos += originalParts[i].length;
            commaPositions.push(currentPos);
        }
        
        // 기존 내용 제거
        element.innerHTML = '';
        
        // 각 자리수를 개별 롤링 컨테이너로 생성
        digits.forEach((digit, index) => {
            const digitContainer = document.createElement('span');
            digitContainer.className = 'main-ani-digit-container';
            
            const digitWrapper = document.createElement('span');
            digitWrapper.className = 'main-ani-digit-wrapper';
            
            // 0-9를 여러 번 반복 생성 (순환 효과를 위해)
            // 0-9-0-9-0 구조로 만들어서 9에서 시작해서 0을 거쳐 목표까지 갈 수 있도록
            for (let cycle = 0; cycle < 3; cycle++) {
                for (let i = 0; i <= 9; i++) {
                    const digitSpan = document.createElement('span');
                    digitSpan.className = 'main-ani-digit-item';
                    digitSpan.textContent = i;
                    digitWrapper.appendChild(digitSpan);
                }
            }
            
            digitContainer.appendChild(digitWrapper);
            element.appendChild(digitContainer);
            
            // 쉼표 추가 (원본 위치 기준)
            if (commaPositions.includes(index + 1)) {
                const comma = document.createElement('span');
                comma.className = 'main-ani-comma';
                comma.textContent = ',';
                element.appendChild(comma);
            }
            
            // 롤링 애니메이션 적용
            const targetDigit = parseInt(digit);
            const delay = index * 50; // 각 자리수마다 약간의 딜레이
            
            setTimeout(() => {
                animateDigitRolling(digitWrapper, targetDigit, duration);
            }, delay);
        });
    }

    // 개별 자리수 Y 방향 롤링 애니메이션
    function animateDigitRolling(element, targetDigit, duration) {
        const digitHeight = element.querySelector('.main-ani-digit-item').offsetHeight;
        
        // 초기 위치를 9로 설정 (두 번째 세트의 9 위치)
        // 0-9-0-9-0 구조에서 두 번째 세트의 9 = 인덱스 19
        const startPosition = 19; // 0-9(10개) + 0-9(10개) 중 9번째 = 19
        const initialY = -(startPosition * digitHeight);
        element.style.transform = `translateY(${initialY}px)`;
        
        // 목표 위치 계산
        // 두 번째 세트(10-19)에서 목표 숫자 위치로 이동
        // targetDigit가 0이면 10번째(두 번째 세트의 0), 1이면 11번째...
        const targetPosition = 10 + targetDigit;
        const targetY = -(targetPosition * digitHeight);
        
        // 애니메이션 시작
        requestAnimationFrame(() => {
            element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.transform = `translateY(${targetY}px)`;
        });
    }

    // ani-point 요소 찾아서 애니메이션 적용
    const aniPoint = document.querySelector('.main-ani-point');
    if (aniPoint) {
        const targetNumber = aniPoint.textContent.trim();
        
        // 페이지 로드 후 약간의 딜레이를 두고 애니메이션 시작
        setTimeout(() => {
            createRollingNumber(aniPoint, targetNumber, 1000);
        }, 500);
    }
});
