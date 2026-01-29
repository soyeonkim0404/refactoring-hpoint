# Figma 디자인 분석 결과

## 📄 파일 정보
- **파일 이름**: S. h.point
- **마지막 수정**: 2026-01-26T01:13:27Z
- **버전**: 2313146756274074565

## 🎨 디자인 시스템 색상

### Primary Colors
- **h.point Purple/5500EB**: `#5500EB` (rgb(85, 0, 235)) - 메인 브랜드 컬러
- **h.point Purple/8741F5**: `#8741F5` - 보조 퍼플
- **h.point Purple/BE8CFF**: `#BE8CFF` - 연한 퍼플

### Accent Colors
- **h.point Green/00F596**: `#00F596` - 그린 컬러
- **h.point Green/7DFFD2**: `#7DFFD2` - 연한 그린
- **h.point Green/AAFFE6**: `#AAFFE6` - 더 연한 그린

### Pink Colors
- **h.point Pink/FA64EB**: `#FA64EB`
- **h.point Pink/FFCDFA**: `#FFCDFA`
- **h.point Pink/FFB4F5**: `#FFB4F5`

### Grayscale
- **Grayscale/000000**: `#000000` - 검정
- **Grayscale/FFFFFF**: `#FFFFFF` - 흰색
- **Grayscale/F2F2F2**: `#F2F2F2` - 연한 회색
- **Grayscale/DCDCDC**: `#DCDCDC` - 중간 회색
- **Grayscale/B9B9B9**: `#B9B9B9` - 진한 회색

## 📐 노드 ID 91-492 분석

### 구조
- **타입**: CANVAS
- **이름**: Design
- **자식 노드 수**: 12개

### 주요 섹션
1. **Design** (CANVAS)
   - 20260116 (SECTION)
   - 20260119 (SECTION)
   - h.point (SECTION)
   - 20260123 (SECTION)
   - A_Benefit (FRAME)

2. **UIUX Improvements** (CANVAS)
   - UIUX Improvements (SECTION)

3. **Strategy** (CANVAS)
   - 여러 FRAME 요소들

4. **Analysis** (CANVAS)
   - 홈 (SECTION)
   - 홈 > 서비스 (SECTION)
   - 홈 > Play (SECTION)
   - 홈 > 고객센터 (SECTION)
   - 홈 > 혜택 (SECTION)

## 🎯 주요 디자인 특징

### 타이포그래피
- **폰트 패밀리**: 
  - Happiness Sans (Regular 400, Bold 700, Black 900)
  - Yellix TRIAL (Bold 700)
- **주요 텍스트 크기**:
  - 제목: 18px, 24px, 40px, 100px
  - 본문: 12px, 14px
  - 라인 높이: 15px, 17.5px, 22.5px, 48px

### 레이아웃
- **주요 레이아웃 모드**: VERTICAL, HORIZONTAL
- **간격(Gap)**: 4px, 6px, 8px, 10px, 16px, 24px, 40px, 44px, 100px
- **패딩**: 다양한 값 사용
- **모서리 반경**: 20px, 100px (완전히 둥근 모서리)

### UI 컴포넌트
1. **카드 UI**: 
   - 배경색: #F2F2F2, #F7F7F7, #F9F7F5
   - 모서리: 20px
   - 수직/수평 레이아웃

2. **버튼**:
   - 테두리: 1px 검정
   - 모서리: 100px (완전히 둥근)
   - 텍스트 색상: #5500EB (퍼플)
   - 폰트: Happiness Sans 700 12px

3. **배지/태그**:
   - 할인율 표시: Yellix TRIAL 700 24px
   - 색상: #5500EB (퍼플)

### 디자인 원칙 (디자인 설명 섹션에서 추출)

#### 워싱 (개선된 디자인)
- KV 영역 배경을 h.point 퍼플 컬러로 적용하여 브랜드 정체성 강조
- 카드 UI 기반 그룹핑으로 정보 구조화
- 텍스트와 아이콘의 유기적 조합
- 주요 콘텐츠 영역에 배경 컬러 적용으로 중요도 구분
- 간결한 그래픽 요소 사용
- 주요 콘텐츠에 애니메이션 효과 적용
- 하단 메뉴바에 리퀴드 글래스(Liquid Glass) 스타일 적용

#### 원본 (기존 디자인)
- KV 배경컬러를 h.point 퍼플 컬러로 브랜드 정체성 연출
- 카드 UI로 그룹핑하여 구분 명확화
- 텍스트와 아이콘 조합으로 정보 시각화
- 주요 컨텐츠에 배경컬러로 강조
- 간결한 그래픽 요소
- 주요 컨텐츠 애니메이션 적용
- 하단 메뉴바 리퀴드 글래스 스타일

## 🔍 주요 컴포넌트 분석

### 혜택 섹션
- 할인율 표시: 20%, 25%, 30%
- 포인트 표시: 3,000P
- 제목 폰트: Happiness Sans 700 14px
- 설명 폰트: Happiness Sans 400 12px
- 날짜/장소 정보: #666666 (회색)

### 클럽 섹션
- 카드 크기: 88×211px
- 아이콘 영역: 88×88px
- 배경색: #F2F2F2, #F7F7F7
- 모서리: 20px

### 네비게이션
- 하단 메뉴바: 리퀴드 글래스 스타일
- 아이콘과 텍스트 조합

## 💡 개발 시 참고사항

1. **색상 변수화**: SCSS 변수로 디자인 시스템 색상 정의 필요
2. **폰트 설정**: Happiness Sans와 Yellix TRIAL 폰트 로드 필요
3. **카드 컴포넌트**: 재사용 가능한 카드 UI 컴포넌트 개발
4. **애니메이션**: 주요 콘텐츠에 애니메이션 효과 적용
5. **리퀴드 글래스 효과**: backdrop-filter를 사용한 하단 메뉴바 스타일링
6. **반응형**: 다양한 화면 크기 고려 필요
