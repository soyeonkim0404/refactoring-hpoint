document.addEventListener('DOMContentLoaded', () => {
    const cardSectionParallax = document.querySelector('.card-section-parallax');
    if (!cardSectionParallax) return;

    const parallaxContent = cardSectionParallax.querySelector('.card-parallax-content');
    const parallaxBgImages = cardSectionParallax.querySelectorAll('.card-parallax-bg_image');
    
    if (!parallaxContent || parallaxBgImages.length === 0) return;

    // 배경 이미지 개수
    const bgImageCount = parallaxBgImages.length; // 4개
    
    // card-parallax-content의 전체 높이 계산
    function calculateContentHeight() {
        const contentRect = parallaxContent.getBoundingClientRect();
        const contentHeight = parallaxContent.scrollHeight;
        return contentHeight;
    }
    
    // 섹션 높이를 4등분된 구간으로 설정 (각 구간 = 100vh)
    function setSectionHeight() {
        const contentHeight = calculateContentHeight();
        // 4등분된 구간으로 나누기 (각 구간은 100vh)
        const sectionHeight = bgImageCount * 100; // 4 * 100vh = 400vh
        cardSectionParallax.style.height = `${sectionHeight}vh`;
    }
    
    // 섹션의 시작 위치 저장
    let sectionStartOffset = 0;
    let currentBgIndex = -1; // 현재 활성화된 배경 이미지 인덱스 추적
    
    // 섹션 시작 위치 계산
    function calculateSectionStart() {
        const rect = cardSectionParallax.getBoundingClientRect();
        sectionStartOffset = window.scrollY + rect.top;
        return sectionStartOffset;
    }
    
    // 스크롤 진행도에 따라 배경 이미지 전환
    function updateBackgroundImage() {
        const scrollY = window.scrollY;
        const sectionRect = cardSectionParallax.getBoundingClientRect();
        const sectionTop = sectionRect.top;
        const sectionHeight = cardSectionParallax.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // 섹션이 뷰포트에 들어왔는지 확인
        const isSectionVisible = sectionTop <= windowHeight && sectionTop >= -sectionHeight;
        
        if (!isSectionVisible) {
            // 섹션이 뷰포트 밖에 있을 때
            if (sectionTop > windowHeight) {
                // 섹션 위에 있을 때: 첫 번째 이미지
                if (currentBgIndex !== 0) {
                    parallaxBgImages.forEach((img, index) => {
                        if (index === 0) {
                            img.classList.add('is-active');
                        } else {
                            img.classList.remove('is-active');
                        }
                    });
                    currentBgIndex = 0;
                }
            } else {
                // 섹션 아래에 있을 때: 마지막 이미지
                if (currentBgIndex !== bgImageCount - 1) {
                    parallaxBgImages.forEach((img, index) => {
                        if (index === bgImageCount - 1) {
                            img.classList.add('is-active');
                        } else {
                            img.classList.remove('is-active');
                        }
                    });
                    currentBgIndex = bgImageCount - 1;
                }
            }
            return;
        }
        
        // 섹션 내에서의 스크롤 진행도 계산
        // 섹션의 상단이 뷰포트 상단에 닿았을 때부터 시작
        const sectionStart = sectionStartOffset;
        const relativeScroll = scrollY - sectionStart;
        
        // 스크롤 진행도 계산 (0: 섹션 시작, 1: 섹션 끝)
        const scrollProgress = Math.max(0, Math.min(1, relativeScroll / sectionHeight));
        
        // 4등분된 구간에 따라 배경 이미지 인덱스 결정
        // 0 ~ 0.25: 이미지 0 (첫 번째)
        // 0.25 ~ 0.5: 이미지 1 (두 번째)
        // 0.5 ~ 0.75: 이미지 2 (세 번째)
        // 0.75 ~ 1: 이미지 3 (네 번째)
        let newBgIndex = 0;
        
        if (scrollProgress >= 0.75) {
            newBgIndex = 3; // 4/4 지점
        } else if (scrollProgress >= 0.5) {
            newBgIndex = 2; // 3/4 지점
        } else if (scrollProgress >= 0.25) {
            newBgIndex = 1; // 2/4 지점
        } else {
            newBgIndex = 0; // 1/4 지점 (섹션 시작)
        }
        
        // 배경 이미지가 변경되었을 때만 업데이트
        if (currentBgIndex !== newBgIndex) {
            parallaxBgImages.forEach((img, index) => {
                if (index === newBgIndex) {
                    img.classList.add('is-active');
                } else {
                    img.classList.remove('is-active');
                }
            });
            currentBgIndex = newBgIndex;
            
            // 디버깅용 로그
            console.log(`[BG Change] Progress: ${(scrollProgress * 100).toFixed(1)}%, Section: ${sectionTop.toFixed(0)}px, Scroll: ${scrollY.toFixed(0)}px, BG Index: ${newBgIndex}`);
        }
    }
    
    // 초기 설정
    setSectionHeight();
    
    // 초기 섹션 시작 위치 계산 (약간의 딜레이를 두고 실행)
    setTimeout(() => {
        calculateSectionStart();
        // 첫 번째 배경 이미지 활성화
        if (parallaxBgImages.length > 0) {
            parallaxBgImages[0].classList.add('is-active');
            currentBgIndex = 0;
        }
        updateBackgroundImage();
    }, 100);
    
    // 스크롤 이벤트 핸들러
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateBackgroundImage();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // 리사이즈 이벤트 핸들러
    function handleResize() {
        setSectionHeight();
        setTimeout(() => {
            calculateSectionStart();
            updateBackgroundImage();
        }, 100);
    }
    
    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
});
