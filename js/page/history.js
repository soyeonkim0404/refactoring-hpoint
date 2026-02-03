document.addEventListener('DOMContentLoaded', function() {
    // GSAP와 ScrollTrigger가 로드되었는지 확인
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error('GSAP 또는 ScrollTrigger가 로드되지 않았습니다.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const tabs = document.querySelectorAll('.his-tab');
    const activeYearTitle = document.getElementById('activeYear');
    const activeYearDesc = document.getElementById('activeYearDesc');
    const scrollTopBtn = document.querySelector('.his-scroll-top');
    const historyContent = document.getElementById('historyContent');
    
    // 현재 활성화된 연도 추적
    let currentActiveYear = null;
    
    // 연도별 설명 데이터
    let yearDescriptions = {};
    let sections = [];

    // 히스토리 섹션 생성 함수
    function createHistorySection(yearData) {
        if (!yearData || !yearData.year) {
            console.warn('유효하지 않은 yearData:', yearData);
            return null;
        }
        
        const section = document.createElement('section');
        section.className = 'his-section';
        section.id = `year-${yearData.year}`;
        section.setAttribute('data-year', yearData.year);

        const timeline = document.createElement('div');
        timeline.className = 'his-timeline';

        // 타임라인 선을 섹션의 직접 자식으로 생성 (섹션 전체 높이 커버)
        const line = document.createElement('div');
        line.className = 'his-timeline-line';

        const yearTitle = document.createElement('h3');
        yearTitle.className = 'his-section-year';
        yearTitle.textContent = yearData.year;

        const dot = document.createElement('div');
        dot.className = 'his-timeline-dot';

        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'his-events';

        // 이벤트 생성
        if (!yearData.events || !Array.isArray(yearData.events)) {
            console.warn(`연도 ${yearData.year}의 이벤트 데이터가 유효하지 않습니다.`);
        } else {
            yearData.events.forEach(event => {
            const eventArticle = document.createElement('article');
            eventArticle.className = 'his-event';

            const monthSpan = document.createElement('span');
            monthSpan.className = 'his-event-month';
            monthSpan.textContent = event.month;

            const contentDiv = document.createElement('div');
            contentDiv.className = 'his-event-content';

            const textP = document.createElement('p');
            textP.className = 'his-event-text';
            textP.textContent = event.text;

            contentDiv.appendChild(textP);

            eventArticle.appendChild(monthSpan);
            eventArticle.appendChild(contentDiv);

            eventsContainer.appendChild(eventArticle);
            });
        }

        timeline.appendChild(dot);
        timeline.appendChild(yearTitle);
        timeline.appendChild(eventsContainer);
        section.appendChild(line); // 타임라인 선을 섹션의 직접 자식으로 추가
        section.appendChild(timeline);

        return section;
    }

    // 탭 클릭 시 앵커 이동
    function setupTabs() {
        if (!tabs || tabs.length === 0) {
            console.warn('탭 요소를 찾을 수 없습니다.');
            return;
        }
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // scroll-margin-top을 고려한 스크롤 위치 계산
                    const offsetTop = targetSection.offsetTop - 100; // 상단 여백 고려
                    window.scrollTo({
                        top: Math.max(0, offsetTop), // 음수 방지
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 스크롤 시 active 년도 업데이트 (ScrollTrigger로 대체되지만 fallback으로 유지)
    function updateActiveYear() {
        const scrollY = window.scrollY + 200; // 상단 여백 고려
        
        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + window.scrollY;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                const year = section.dataset.year;
                // 연도가 변경되었을 때만 업데이트 (updateActiveTab 내부에서 체크)
                if (currentActiveYear !== year) {
                    updateActiveTab(year);
                }
            }
        });
    }

    // GSAP 스크롤 애니메이션 설정
    function setupScrollAnimations() {
        sections.forEach((section) => {
            const events = section.querySelectorAll('.his-event');
            
            events.forEach((event) => {
                gsap.fromTo(event, 
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: event,
                            start: 'top 85%',
                            end: 'top 60%',
                            toggleActions: 'play none none none',
                            markers: false // 디버깅용, 필요시 true로 변경
                        }
                    }
                );
            });

            // 섹션별 ScrollTrigger로 active 년도 업데이트
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => {
                    const year = section.dataset.year;
                    // 연도가 실제로 변경되었을 때만 업데이트
                    if (currentActiveYear !== year) {
                        updateActiveTab(year);
                    }
                },
                onEnterBack: () => {
                    const year = section.dataset.year;
                    // 연도가 실제로 변경되었을 때만 업데이트
                    if (currentActiveYear !== year) {
                        updateActiveTab(year);
                    }
                }
            });
        });
    }

    // 연도 숫자 롤링 애니메이션 함수
    function createYearRolling(element, targetYear, duration = 1000) {
        if (!element) return;

        // 기존 텍스트 노드 제거 (하드코딩된 텍스트 제거)
        const textNodes = [];
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push(node);
            }
        }
        textNodes.forEach(node => element.removeChild(node));

        // data 속성에서 현재 숫자 가져오기 (없으면 targetYear 사용)
        const currentYear = element.getAttribute('data-current-year') || targetYear;
        const currentDigits = currentYear.split('');
        const targetDigits = targetYear.split('');
        
        // 기존 컨테이너 확인
        const existingContainers = element.querySelectorAll('.his-year-digit-container');
        const needsRebuild = existingContainers.length !== 4;
        
        // 각 자리수를 개별 롤링 컨테이너로 생성
        targetDigits.forEach((digit, index) => {
            let digitContainer, digitWrapper;
            
            if (!needsRebuild && existingContainers[index]) {
                // 기존 컨테이너 재사용
                digitContainer = existingContainers[index];
                digitWrapper = digitContainer.querySelector('.his-year-digit-wrapper');
            } else {
                // 새로 생성
                digitContainer = document.createElement('span');
                digitContainer.className = 'his-year-digit-container';
                
                digitWrapper = document.createElement('span');
                digitWrapper.className = 'his-year-digit-wrapper';
                
                // 0-9를 여러 번 반복 생성 (순환 효과를 위해)
                // 충분한 세트를 생성하여 위/아래로 롤링 가능하도록
                for (let cycle = 0; cycle < 5; cycle++) {
                    for (let i = 0; i <= 9; i++) {
                        const digitSpan = document.createElement('span');
                        digitSpan.className = 'his-year-digit-item';
                        digitSpan.textContent = i;
                        digitWrapper.appendChild(digitSpan);
                    }
                }
                
                digitContainer.appendChild(digitWrapper);
                element.appendChild(digitContainer);
            }
            
            // 현재 숫자와 목표 숫자 비교
            const currentDigit = parseInt(currentDigits[index] || '0', 10);
            const targetDigit = parseInt(digit, 10);
            
            const digitItem = digitWrapper.querySelector('.his-year-digit-item');
            if (!digitItem) {
                console.warn('digit-item을 찾을 수 없습니다.');
                return;
            }
            const digitHeight = digitItem.offsetHeight;
            const basePosition = 20; // 중간 세트 기준
            
            // 바뀌는 숫자만 롤링 애니메이션 적용
            if (currentDigit !== targetDigit) {
                // 현재 위치 설정
                const currentPosition = basePosition + currentDigit;
                const currentY = -(currentPosition * digitHeight);
                digitWrapper.style.transition = 'none';
                digitWrapper.style.transform = `translateY(${currentY}px)`;
                
                // 리플로우 강제 후 애니메이션 시작
                void digitWrapper.offsetHeight;
                
                const delay = index * 80; // 각 자리수마다 약간의 딜레이
                setTimeout(() => {
                    animateYearDigitRolling(digitWrapper, currentDigit, targetDigit, duration);
                }, delay);
            } else {
                // 바뀌지 않는 숫자는 현재 위치 유지 (애니메이션 없이)
                const currentPosition = basePosition + currentDigit;
                const currentY = -(currentPosition * digitHeight);
                digitWrapper.style.transition = 'none';
                digitWrapper.style.transform = `translateY(${currentY}px)`;
            }
        });
        
        // 목표 숫자를 data 속성에 저장 (다음 롤링을 위해)
        element.setAttribute('data-current-year', targetYear);
    }

    // 개별 자리수 Y 방향 롤링 애니메이션
    function animateYearDigitRolling(element, currentDigit, targetDigit, duration) {
        const digitItem = element.querySelector('.his-year-digit-item');
        if (!digitItem) {
            console.warn('digit-item을 찾을 수 없습니다.');
            return;
        }
        const digitHeight = digitItem.offsetHeight;
        
        // 중간 세트(세 번째 세트, 인덱스 20-29)를 기준으로 사용
        // 현재 숫자 위치 계산 (세 번째 세트의 currentDigit 위치)
        const startPosition = 20 + currentDigit;
        const initialY = -(startPosition * digitHeight);
        
        // 초기 위치 설정 (transition 없이 즉시 설정)
        element.style.transition = 'none';
        element.style.transform = `translateY(${initialY}px)`;
        
        // 목표 위치 계산 (세 번째 세트의 targetDigit 위치)
        const targetPosition = 20 + targetDigit;
        const targetY = -(targetPosition * digitHeight);
        
        // 리플로우 강제 후 애니메이션 시작
        void element.offsetHeight;
        
        requestAnimationFrame(() => {
            element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            element.style.transform = `translateY(${targetY}px)`;
        });
    }

    // 설명 텍스트 애니메이션 (아래에서 위로)
    function animateYearDesc(element) {
        if (!element) return;
        
        // 초기 상태로 리셋 (클래스 제거)
        element.classList.remove('show');
        
        // 리플로우 강제 (애니메이션 재시작을 위해)
        void element.offsetHeight;
        
        // 애니메이션 시작
        requestAnimationFrame(() => {
            element.classList.add('show');
        });
    }

    // Active 탭 업데이트 함수 (디바운싱 추가)
    let updateActiveTabTimeout = null;
    function updateActiveTab(year) {
        // 연도가 실제로 변경되었을 때만 애니메이션 실행
        if (currentActiveYear === year) {
            // 같은 연도면 탭과 섹션만 업데이트하고 애니메이션은 스킵
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.his-tab[data-year="${year}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // 섹션 active 클래스 유지
            sections.forEach(section => {
                section.classList.remove('active');
            });
            const activeSection = document.querySelector(`.his-section[data-year="${year}"]`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            return;
        }
        
        // 기존 타이머 취소 (빠른 스크롤 시 중복 실행 방지)
        if (updateActiveTabTimeout) {
            clearTimeout(updateActiveTabTimeout);
        }
        
        // 약간의 딜레이를 두어 빠른 스크롤 시 중복 실행 방지
        updateActiveTabTimeout = setTimeout(() => {
            // 다시 한 번 확인 (스크롤 중 연도가 또 바뀌었을 수 있음)
            if (currentActiveYear === year) {
                return;
            }
            
            // 연도가 변경되었을 때만 실행
            currentActiveYear = year;
            
            // 탭 active 클래스 업데이트
            tabs.forEach(t => t.classList.remove('active'));
            const activeTab = document.querySelector(`.his-tab[data-year="${year}"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // 섹션 active 클래스 업데이트 (타임라인 라인/도트 opacity 제어)
            sections.forEach(section => {
                section.classList.remove('active');
            });
            const activeSection = document.querySelector(`.his-section[data-year="${year}"]`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            
            if (activeYearTitle) {
                // 숫자 롤링 애니메이션 적용 (연도 변경 시에만, 바뀌는 숫자만)
                createYearRolling(activeYearTitle, year, 1000);
            }
            if (activeYearDesc && yearDescriptions[year]) {
                // 설명 텍스트 애니메이션 적용 (연도 변경 시에만)
                activeYearDesc.innerHTML = yearDescriptions[year];
                animateYearDesc(activeYearDesc);
            }
        }, 50); // 50ms 디바운싱
    }

    // 스크롤 이벤트 리스너
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveYear();
                
                // 스크롤 투 탑 버튼 표시/숨김
                if (scrollTopBtn) {
                    if (window.scrollY > 300) {
                        scrollTopBtn.classList.add('show');
                    } else {
                        scrollTopBtn.classList.remove('show');
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }

    // 히스토리 초기화 함수
    function initializeHistory() {
        sections = document.querySelectorAll('.his-section');
        
        if (sections.length === 0) {
            console.warn('히스토리 섹션을 찾을 수 없습니다.');
            return;
        }
        
        // 탭 설정
        setupTabs();
        
        // 스크롤 애니메이션 설정
        setupScrollAnimations();
        
        // 스크롤 이벤트 리스너
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 초기 실행
        const firstYear = sections[0].dataset.year;
        if (!firstYear) {
            console.warn('첫 번째 섹션의 연도를 찾을 수 없습니다.');
            return;
        }
        
        // 초기 로드 시 현재 연도 설정 (애니메이션 없이)
        currentActiveYear = firstYear;
        
        // 초기 섹션 active 클래스 설정
        const firstSection = sections[0];
        if (firstSection) {
            firstSection.classList.add('active');
        }
        
        // 하드코딩된 텍스트 제거 및 초기 롤링 구조 생성
        if (activeYearTitle) {
            // 기존 텍스트 노드 제거
            const textNodes = [];
            for (let i = 0; i < activeYearTitle.childNodes.length; i++) {
                const node = activeYearTitle.childNodes[i];
                if (node.nodeType === Node.TEXT_NODE) {
                    textNodes.push(node);
                }
            }
            textNodes.forEach(node => activeYearTitle.removeChild(node));
            
            // 초기 롤링 구조 생성 (애니메이션 없이)
            createYearRolling(activeYearTitle, firstYear, 0);
        }
        
        // 초기 로드 시 약간의 딜레이를 두고 애니메이션 시작
        setTimeout(() => {
            updateActiveTab(firstYear);
        }, 300);

        // 스크롤 투 탑 버튼 클릭
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // JSON 데이터 로드 및 렌더링
    fetch('../json/history.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // 연도별 설명 데이터 생성
            data.forEach(item => {
                yearDescriptions[item.year] = item.description;
            });

            // 히스토리 섹션 생성
            data.forEach(yearData => {
                const section = createHistorySection(yearData);
                if (section && historyContent) {
                    historyContent.appendChild(section);
                }
            });

            // 모든 섹션이 생성된 후 초기화
            initializeHistory();
        })
        .catch(error => {
            console.error('히스토리 데이터를 불러오는 중 오류가 발생했습니다:', error);
            // 에러 발생 시 기본 동작 (빈 상태로 초기화)
            if (historyContent) {
                initializeHistory();
            }
        });
});
