---
name: create-character
description: Design a complete 2D character from concept to production-ready SVG/CSS assets
user-invocable: true
args:
  - name: concept
    description: "Character concept, personality, or role (e.g. \"brave knight\", \"shy wizard\", \"robot shopkeeper\")"
    required: true
  - name: style
    description: Visual style (e.g. pixel, flat, chibi, cartoon, realistic)
    required: false
  - name: size
    description: Output canvas size in px (e.g. 64, 128, 256, 512)
    required: false
category: 생성
license: MIT
---


# create-character

`concept` 인수로 전달된 캐릭터 콘셉트를 받아, 6단계 워크플로우를 통해 성격이 드러나는 완성도 높은 2D 캐릭터를 SVG/CSS 코드로 생성합니다.

## 워크플로우

### 1단계: 콘셉트 정의 (Concept Definition)

콘셉트를 아래 4가지 축으로 분해합니다.

- **역할(Role)**: 캐릭터가 세계에서 수행하는 기능 (전사, 마법사, 상인, NPC)
- **성격(Personality)**: 용감함/소심함, 쾌활함/진지함, 신뢰/의심 등 대비 축으로 정의
- **배경(Context)**: 어떤 세계관, 어떤 상황에 등장하는가
- **관계(Relation)**: 플레이어와의 관계 (동료, 적, 중립, 멘토)

콘셉트 분석 결과를 짧은 디자인 브리프로 정리합니다.

```
디자인 브리프 예시:
- 역할: 마을 방어 기사
- 성격: 외면은 엄격하나 내면은 따뜻함 → 딱딱한 갑옷 + 온화한 눈빛
- 배경: 중세 판타지, 항상 전투 준비 상태
- 관계: 플레이어의 보호자 겸 동료
```

### 2단계: 실루엣 설계 (Silhouette Design)

실루엣은 캐릭터의 첫인상이자 가장 중요한 식별 요소입니다.

- 단색 블록으로 실루엣만 먼저 설계 (흑백)
- 실루엣만 보고 캐릭터를 구분할 수 있어야 함
- 과장(exaggeration)을 활용: 특징적인 부위를 20~40% 크게
- 기하학적 기본 도형(원, 삼각형, 사각형)으로 성격 표현:
  - 원형 → 친근함, 귀여움
  - 삼각형(역삼각형) → 강함, 공격성
  - 사각형 → 안정감, 신뢰성

SVG 실루엣 초안:
```svg
<!-- 실루엣 단계: 흑백 블록만 사용 -->
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <g id="silhouette" fill="#1a1a1a">
    <!-- 머리 -->
    <circle cx="32" cy="16" r="10"/>
    <!-- 몸통 -->
    <rect x="20" y="26" width="24" height="22" rx="4"/>
    <!-- 다리 -->
    <rect x="20" y="48" width="10" height="12" rx="2"/>
    <rect x="34" y="48" width="10" height="12" rx="2"/>
  </g>
</svg>
```

### 3단계: 비율 결정 (Proportion System)

스타일에 따른 머리:몸 비율을 결정합니다.

| 스타일 | 머리:몸 비율 | 특징 |
|--------|-------------|------|
| 리얼리스틱 | 1:7~8 | 성인 인체 비율 |
| 카툰 | 1:4~5 | 약간 과장 |
| 치비(chibi) | 1:2~3 | 큰 머리, 짧은 몸 |
| 픽셀(미니) | 1:1.5~2 | 극도로 단순화 |

`size` 인수가 주어진 경우 해당 크기에 맞는 비율로 조정합니다.

비율 시스템을 CSS 변수로 정의:
```css
:root {
  --char-canvas: 128px;
  --char-head-size: 32px;      /* 캔버스의 25% */
  --char-body-height: 48px;    /* 캔버스의 37.5% */
  --char-leg-height: 24px;     /* 캔버스의 18.75% */
  --char-arm-length: 20px;
  --char-shoulder-width: 40px;
}
```

### 4단계: 컬러 팔레트 (Color Palette)

성격과 역할에 맞는 컬러 시스템을 3~5색으로 구성합니다.

**팔레트 구성 원칙:**
- **주조색(Primary)**: 캐릭터의 핵심 색상 (의상의 60%)
- **보조색(Secondary)**: 주조색과 대비되는 포인트 (30%)
- **강조색(Accent)**: 눈, 장신구, 특수 효과 (10%)
- **피부색(Skin)**: 인종/종족에 맞는 자연스러운 톤
- **아웃라인(Outline)**: 검정 대신 주조색을 어둡게 한 색 사용

컬러 팔레트 JSON 출력:
```json
{
  "character": "brave-knight",
  "palette": {
    "primary": "#2C4A8C",
    "primary-dark": "#1A2E5A",
    "primary-light": "#4A6EB5",
    "secondary": "#C8A84B",
    "secondary-dark": "#8C6E28",
    "accent": "#E8F4FF",
    "skin": "#F4C794",
    "skin-shadow": "#D4945A",
    "outline": "#1A1A2E"
  }
}
```

CSS 변수 시스템:
```css
.character-knight {
  --color-primary: #2C4A8C;
  --color-primary-dark: #1A2E5A;
  --color-primary-light: #4A6EB5;
  --color-secondary: #C8A84B;
  --color-accent: #E8F4FF;
  --color-skin: #F4C794;
  --color-skin-shadow: #D4945A;
  --color-outline: #1A1A2E;
}
```

### 5단계: 디테일 추가 (Detail Layer)

실루엣 위에 성격을 드러내는 디테일을 레이어 순서대로 추가합니다.

레이어 순서 (SVG `<g>` 그룹 순서):
1. `shadow` - 발 아래 드롭 섀도
2. `body-base` - 몸통 기본 색상
3. `body-detail` - 의상 디테일 (단추, 패턴)
4. `limbs` - 팔, 다리
5. `accessories` - 장신구, 무기
6. `head-base` - 머리, 얼굴 기본
7. `face-detail` - 눈, 코, 입
8. `hair` - 헤어스타일
9. `fx` - 특수 효과 (발광, 파티클)

**얼굴 표정 원칙:**
- 눈 크기: 전체 머리의 15~25% (치비는 30~40%)
- 눈썹으로 주된 감정을 표현
- 입 모양으로 성격 강조 (직선=진지, 곡선=친근)

완성된 SVG 캐릭터 구조:
```svg
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
     class="character-knight">
  <!-- 1. 그림자 -->
  <g id="shadow">
    <ellipse cx="32" cy="62" rx="14" ry="3" fill="rgba(0,0,0,0.2)"/>
  </g>

  <!-- 2. 몸통 -->
  <g id="body-base">
    <rect x="18" y="28" width="28" height="24" rx="4"
          fill="var(--color-primary)" stroke="var(--color-outline)" stroke-width="1.5"/>
  </g>

  <!-- 3. 의상 디테일 -->
  <g id="body-detail">
    <rect x="28" y="32" width="8" height="12" rx="1"
          fill="var(--color-secondary)" opacity="0.8"/>
  </g>

  <!-- 4. 팔 -->
  <g id="limbs">
    <rect x="8" y="28" width="10" height="18" rx="3"
          fill="var(--color-primary)" stroke="var(--color-outline)" stroke-width="1.5"/>
    <rect x="46" y="28" width="10" height="18" rx="3"
          fill="var(--color-primary)" stroke="var(--color-outline)" stroke-width="1.5"/>
    <!-- 다리 -->
    <rect x="18" y="52" width="12" height="10" rx="2"
          fill="var(--color-primary-dark)" stroke="var(--color-outline)" stroke-width="1.5"/>
    <rect x="34" y="52" width="12" height="10" rx="2"
          fill="var(--color-primary-dark)" stroke="var(--color-outline)" stroke-width="1.5"/>
  </g>

  <!-- 5. 머리 -->
  <g id="head-base">
    <circle cx="32" cy="18" r="12"
            fill="var(--color-skin)" stroke="var(--color-outline)" stroke-width="1.5"/>
  </g>

  <!-- 6. 얼굴 -->
  <g id="face-detail">
    <!-- 눈 -->
    <ellipse cx="28" cy="17" rx="2.5" ry="3" fill="var(--color-outline)"/>
    <ellipse cx="36" cy="17" rx="2.5" ry="3" fill="var(--color-outline)"/>
    <!-- 눈 하이라이트 -->
    <circle cx="29" cy="16" r="0.8" fill="var(--color-accent)"/>
    <circle cx="37" cy="16" r="0.8" fill="var(--color-accent)"/>
    <!-- 입 -->
    <path d="M 28 23 Q 32 26 36 23" stroke="var(--color-outline)"
          stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </g>
</svg>
```

### 6단계: 최종 에셋 패키징 (Asset Export)

생성 완료 후 아래 3가지를 출력합니다.

**출력물 1: SVG 캐릭터 코드**
- 완성된 SVG (인라인 CSS 변수 포함)
- viewBox 기준: 64x64 (기본), 128x128 (HD)
- 모든 레이어 `id` 명명 완료

**출력물 2: 컬러 팔레트 JSON**
```json
{
  "character": "{name}",
  "version": "1.0.0",
  "palette": { ... },
  "usage": {
    "primary-coverage": "60%",
    "secondary-coverage": "30%",
    "accent-coverage": "10%"
  }
}
```

**출력물 3: 디자인 스펙 문서**
```markdown
# {캐릭터명} Design Spec
- Canvas: {size}x{size}px
- Style: {style}
- Head-to-body ratio: 1:{ratio}
- Color count: {n}
- Layer count: {n}
- Animation-ready: yes/no
```

---

## Do / Don't

### Do
- 성격이 **실루엣**에서부터 드러나게 설계
- 한 가지 특징적인 요소(헤어, 무기, 소품)로 즉각 식별 가능하게
- 컬러 팔레트를 3~5색으로 제한하여 통일감 확보
- 눈썹과 눈 모양으로 감정/성격 표현
- CSS 변수를 사용해 테마 변경이 쉽도록 구성
- 아웃라인은 순수 검정 대신 주조색 기반 어두운 색 사용

### Don't
- 제네릭한 기본 인체 비율 그대로 사용하지 않기
- 컬러를 6색 이상 남용하지 않기
- 대칭을 100% 맞추지 않기 (약간의 비대칭이 생동감을 줌)
- 디테일을 과도하게 추가해 작은 크기에서 뭉개지게 하지 않기
- 성격과 무관한 장식 추가하지 않기

---

## 스타일별 빠른 가이드

| style 값 | 비율 | 아웃라인 | 팔레트 크기 | 디테일 |
|----------|------|---------|------------|--------|
| `pixel` | 1:2 | 1px 경계 | 4~8색 | 최소화 |
| `flat` | 1:4 | 없음 | 3~5색 | 단순 |
| `chibi` | 1:2.5 | 2px 둥근 | 5~7색 | 중간 |
| `cartoon` | 1:4 | 2~3px | 5~8색 | 중간 |
| `realistic` | 1:7 | 없음(음영) | 8~12색 | 상세 |
