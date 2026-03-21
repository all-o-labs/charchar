---
name: character-design
description: Automatic character design best practices — loaded whenever character-related work is detected
user-invocable: false
category: system
license: MIT
---


# Character Design Best Practices

캐릭터 관련 작업 감지 시 자동으로 로드되는 시스템 스킬입니다.
이 스킬은 AI가 캐릭터 디자인 작업을 수행할 때 일관된 품질과 구조를 보장합니다.

---

## 핵심 원칙

### 1. 실루엣 가독성 (Silhouette Readability)

캐릭터의 실루엣은 단 하나의 색상만으로도 즉시 인식 가능해야 합니다.
좋은 실루엣은 캐릭터의 역할, 성격, 체형을 1초 안에 전달합니다.

- 흑백으로 변환했을 때 캐릭터를 구분할 수 있는가
- 작은 크기(16x16, 32x32)에서도 윤곽이 명확한가
- 비슷한 캐릭터들과 실루엣이 충분히 차별화되는가

### 2. 컬러 하모니 (Color Harmony)

60-30-10 법칙을 기본으로 팔레트를 구성합니다.

- **60%** 주색(dominant): 캐릭터의 정체성을 나타내는 색
- **30%** 보조색(secondary): 주색을 보완하는 색
- **10%** 악센트(accent): 포인트가 되는 강조색

CSS Custom Properties로 팔레트를 관리하여 테마 전환과 일관성을 보장합니다.

### 3. 비율 일관성 (Proportion Consistency)

같은 세계관의 캐릭터는 동일한 등신 기준을 공유해야 합니다.
비율 상수를 코드로 정의하여 수치를 하드코딩하지 않습니다.

### 4. 성격 표현 (Personality Expression)

체형, 컬러, 의상, 표정 모두가 캐릭터의 성격을 전달하는 수단입니다.
디자인 요소 하나하나가 "왜 이 캐릭터에게 이 선택인가"를 설명할 수 있어야 합니다.

---

## Do / Don't 패턴

### DO 1: SVG path로 깔끔한 실루엣 정의

```svg
<!-- DO: 명확한 그룹 구조와 의미 있는 id -->
<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
  <g id="character-hero">
    <g id="char-head">
      <circle cx="50" cy="25" r="20" class="char-skin"/>
    </g>
    <g id="char-body">
      <path d="M30 45 Q50 40 70 45 L75 120 Q50 130 25 120 Z" class="char-body-main"/>
    </g>
    <g id="char-left-arm">
      <path d="M30 50 Q15 80 20 110" stroke-width="8" stroke-linecap="round"/>
    </g>
    <g id="char-right-arm">
      <path d="M70 50 Q85 80 80 110" stroke-width="8" stroke-linecap="round"/>
    </g>
  </g>
</svg>
```

```svg
<!-- DON'T: 평평한 구조, 의미 없는 id -->
<svg viewBox="0 0 100 200">
  <circle cx="50" cy="25" r="20"/>
  <rect x="30" y="45" width="40" height="75"/>
  <line x1="30" y1="50" x2="20" y2="110"/>
  <line x1="70" y1="50" x2="80" y2="110"/>
</svg>
```

### DO 2: CSS Custom Properties로 컬러 관리

```css
/* DO: 캐릭터별 CSS 변수 시스템 */
:root {
  /* 영웅 캐릭터 팔레트 */
  --char-hero-primary: #2563eb;      /* 60% 주색 */
  --char-hero-secondary: #f1f5f9;    /* 30% 보조색 */
  --char-hero-accent: #f59e0b;       /* 10% 악센트 */
  --char-hero-skin: #fde8c8;
  --char-hero-outline: #1e293b;

  /* 악당 캐릭터 팔레트 */
  --char-villain-primary: #7c3aed;
  --char-villain-secondary: #1e1b4b;
  --char-villain-accent: #ef4444;
  --char-villain-skin: #e2c4a0;
  --char-villain-outline: #0f0a1e;
}

.char-hero .char-body-main { fill: var(--char-hero-primary); }
.char-villain .char-body-main { fill: var(--char-villain-primary); }
```

```css
/* DON'T: 하드코딩된 색상값 */
.hero-body { fill: #2563eb; }
.hero-outfit { fill: #1d4ed8; }   /* 비슷한 값인지 즉시 알기 어려움 */
.villain-body { fill: #7c3aed; }
```

### DO 3: 비율 상수로 캐릭터 크기 정의

```javascript
// DO: 비율 상수를 중앙에서 관리
const CHARACTER_PROPORTIONS = {
  // 6등신 표준 캐릭터
  STANDARD_6HEAD: {
    headRatio: 1 / 6,      // 머리 = 전체 높이의 1/6
    shoulderWidth: 2.2,    // 어깨 너비 = 머리 너비 × 2.2
    waistWidth: 1.5,       // 허리 너비 = 머리 너비 × 1.5
    hipWidth: 2.0,         // 엉덩이 너비 = 머리 너비 × 2.0
    legLength: 3.5,        // 다리 길이 = 머리 높이 × 3.5
    armLength: 3.0,        // 팔 길이 = 머리 높이 × 3.0
  },
  // 2.5등신 치비 캐릭터
  CHIBI_2_5HEAD: {
    headRatio: 1 / 2.5,
    shoulderWidth: 1.8,
    waistWidth: 1.2,
    hipWidth: 1.5,
    legLength: 1.0,
    armLength: 1.2,
  },
};

function buildCharacterSVG(totalHeight, style = 'STANDARD_6HEAD') {
  const props = CHARACTER_PROPORTIONS[style];
  const headHeight = totalHeight * props.headRatio;
  const headWidth = headHeight * 0.85;
  // ... 나머지 부위를 비율로 계산
}
```

```javascript
// DON'T: 매직 넘버 하드코딩
function buildCharacter() {
  const headHeight = 40;    // 왜 40인가?
  const bodyHeight = 180;   // 왜 180인가?
  const armLength = 120;    // 비율 관계를 알 수 없음
}
```

### DO 4: 컴포넌트 기반 캐릭터 구조

```javascript
// DO: 파트별 독립 컴포넌트
class CharacterPart {
  constructor(name, paths, transform = {}) {
    this.name = name;
    this.paths = paths;
    this.transform = { x: 0, y: 0, rotation: 0, scale: 1, ...transform };
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.transform.x, this.transform.y);
    ctx.rotate(this.transform.rotation);
    ctx.scale(this.transform.scale, this.transform.scale);
    this.paths.forEach(path => path.draw(ctx));
    ctx.restore();
  }
}

class Character {
  constructor(id, parts) {
    this.id = id;
    this.parts = new Map(parts.map(p => [p.name, p]));
  }

  getPart(name) { return this.parts.get(name); }
  setPose(poseName) { POSES[poseName](this); }
}
```

### DO 5: 레이어 순서 명시적 관리

```svg
<!-- DO: 레이어 순서를 명시적으로 정의 (뒤에서 앞으로) -->
<svg>
  <!-- Layer 1: 그림자/배경 요소 -->
  <g id="layer-shadow">...</g>

  <!-- Layer 2: 신체 뒷부분 (등, 뒷머리) -->
  <g id="layer-body-back">...</g>

  <!-- Layer 3: 의상 뒷부분 -->
  <g id="layer-costume-back">...</g>

  <!-- Layer 4: 신체 주요 부위 -->
  <g id="layer-body-main">...</g>

  <!-- Layer 5: 의상 앞부분 -->
  <g id="layer-costume-front">...</g>

  <!-- Layer 6: 얼굴 요소 -->
  <g id="layer-face">...</g>

  <!-- Layer 7: 머리카락 앞부분 / 장식 -->
  <g id="layer-hair-front">...</g>

  <!-- Layer 8: UI 오버레이 (이름표 등) -->
  <g id="layer-ui">...</g>
</svg>
```

### DON'T 6: 과도한 디테일 피하기

```svg
<!-- DON'T: 작은 크기에서 사라지는 과도한 디테일 -->
<g id="char-face">
  <!-- 64px 이하에서 전혀 보이지 않는 디테일들 -->
  <path d="..." id="eyelash-upper-left-1"/>
  <path d="..." id="eyelash-upper-left-2"/>
  <!-- ... 속눈썹 20개 -->
  <path d="..." id="pore-texture-forehead"/>
  <circle r="0.5" id="freckle-1"/>
  <circle r="0.5" id="freckle-2"/>
</g>
```

```javascript
// DO: 크기에 따라 디테일 레벨 조정
const DETAIL_LEVELS = {
  ICON: { minSize: 0, maxSize: 64, layers: ['body-main', 'face-simple'] },
  SMALL: { minSize: 64, maxSize: 128, layers: ['body-main', 'costume', 'face-basic'] },
  MEDIUM: { minSize: 128, maxSize: 512, layers: ['body', 'costume', 'face', 'accessories'] },
  LARGE: { minSize: 512, maxSize: Infinity, layers: ['all'] },
};

function getDetailLevel(renderSize) {
  return Object.values(DETAIL_LEVELS).find(
    d => renderSize >= d.minSize && renderSize < d.maxSize
  );
}
```

### DON'T 7: 동일한 체형 반복 금지

```javascript
// DON'T: 모든 캐릭터에 동일한 기본 체형
const characters = [
  { name: '전사', color: 'red', bodyShape: DEFAULT_BODY },
  { name: '마법사', color: 'blue', bodyShape: DEFAULT_BODY },
  { name: '도적', color: 'green', bodyShape: DEFAULT_BODY },
];

// DO: 역할에 맞는 체형 다양화
const BODY_SHAPES = {
  WARRIOR: { shoulderRatio: 2.8, waistRatio: 1.8, muscleDefinition: 'high' },
  MAGE: { shoulderRatio: 1.9, waistRatio: 1.4, muscleDefinition: 'low' },
  ROGUE: { shoulderRatio: 2.0, waistRatio: 1.3, muscleDefinition: 'medium' },
  HEALER: { shoulderRatio: 1.8, waistRatio: 1.5, muscleDefinition: 'low' },
};

const characters = [
  { name: '전사', color: 'red', bodyShape: BODY_SHAPES.WARRIOR },
  { name: '마법사', color: 'blue', bodyShape: BODY_SHAPES.MAGE },
  { name: '도적', color: 'green', bodyShape: BODY_SHAPES.ROGUE },
];
```

### DON'T 8: 비일관적 선 굵기 금지

```svg
<!-- DON'T: 무작위 stroke-width -->
<path d="M..." stroke-width="2"/>
<path d="M..." stroke-width="3.5"/>
<path d="M..." stroke-width="1.2"/>
<path d="M..." stroke-width="4"/>
```

```css
/* DO: 선 굵기 시스템 */
:root {
  --stroke-outer: 3px;      /* 외곽선 */
  --stroke-inner: 1.5px;    /* 내부 구분선 */
  --stroke-detail: 0.75px;  /* 세부 디테일 */
  --stroke-highlight: 1px;  /* 하이라이트 */
}

/* 캐릭터 크기별 스케일 */
.char-small  { --stroke-scale: 0.5; }
.char-medium { --stroke-scale: 1.0; }
.char-large  { --stroke-scale: 2.0; }
```

### DO 9: 에셋 네이밍 컨벤션

```
// DO: 일관된 에셋 파일 명명 규칙
assets/
  characters/
    hero/
      hero-idle-front.svg
      hero-idle-side.svg
      hero-idle-back.svg
      hero-walk-front-00.svg  ~ hero-walk-front-07.svg
      hero-run-front-00.svg   ~ hero-run-front-05.svg
      hero-attack-00.svg      ~ hero-attack-03.svg
      hero-hurt-00.svg        ~ hero-hurt-02.svg
      hero-death-00.svg       ~ hero-death-04.svg
    villain/
      villain-idle-front.svg
      ...

// DON'T: 의미 없는 파일명
assets/
  char1.svg
  char1_v2.svg
  char1_final.svg
  char1_final_REAL.svg
  hero_sprite_NEW.svg
```

### DO 10: 표정 파라미터화

```javascript
// DO: 표정을 수치로 파라미터화하여 블렌딩 가능하게
const EXPRESSION_PARAMS = {
  joy: {
    eyebrowRaise: 0.3,
    eyeSquint: 0.6,
    mouthCurve: 0.9,     // -1(찡그림) ~ 1(미소)
    mouthOpen: 0.4,
    cheekPuff: 0.5,
  },
  anger: {
    eyebrowRaise: -0.8,  // 음수 = 찌푸림
    eyeSquint: 0.7,
    mouthCurve: -0.5,
    mouthOpen: 0.2,
    cheekPuff: 0.0,
  },
};

// 두 표정 사이를 보간
function blendExpression(from, to, t) {
  return Object.fromEntries(
    Object.keys(from).map(key => [key, from[key] + (to[key] - from[key]) * t])
  );
}
```

### DON'T 11: 절대 좌표로 캐릭터 배치 금지

```javascript
// DON'T: 절대 좌표 하드코딩
drawCharacter(x=450, y=380);
drawCharacter(x=512, y=400);

// DO: 정규화된 좌표 또는 앵커 기반 배치
drawCharacter({
  anchor: 'feet',           // 기준점: 발바닥
  position: { x: 0.5, y: 0.8 },  // 화면 비율
  facing: 'right',
  scale: 1.0,
});
```

### DO 12: 접근성 고려한 컬러 설계

```javascript
// DO: 색각 이상자도 구분 가능한 팔레트 검증
function checkColorAccessibility(palette) {
  const issues = [];

  // 명도 대비 체크 (WCAG AA 기준: 4.5:1)
  for (let i = 0; i < palette.length; i++) {
    for (let j = i + 1; j < palette.length; j++) {
      const ratio = getContrastRatio(palette[i], palette[j]);
      if (ratio < 3.0) {
        issues.push(`${palette[i]} vs ${palette[j]}: 대비 부족 (${ratio.toFixed(1)}:1)`);
      }
    }
  }

  // 적록색맹 시뮬레이션
  const deuteranopia = palette.map(c => simulateDeuteranopia(c));
  // 유사한 색이 너무 많으면 경고
  return { issues, deuteranopiaView: deuteranopia };
}
```

---

## 코드에서 캐릭터를 다루는 구조적 패턴

### 컴포넌트 구조

```
CharacterSystem
├── CharacterDefinition    # 정적 데이터 (비율, 팔레트, 메타데이터)
├── CharacterInstance      # 런타임 상태 (위치, 포즈, 표정, HP 등)
├── CharacterRenderer      # 렌더링 로직 (SVG/Canvas/WebGL)
├── CharacterAnimator      # 애니메이션 스테이트 머신
└── CharacterFactory       # 인스턴스 생성 + 팔레트 적용
```

### 에셋 관리 패턴

```javascript
// 지연 로딩 + 캐싱
class CharacterAssetManager {
  #cache = new Map();

  async load(characterId, variant = 'idle-front') {
    const key = `${characterId}/${variant}`;
    if (!this.#cache.has(key)) {
      const svg = await fetch(`/assets/characters/${key}.svg`);
      this.#cache.set(key, await svg.text());
    }
    return this.#cache.get(key);
  }

  preload(characterId, variants = ['idle-front', 'idle-back']) {
    return Promise.all(variants.map(v => this.load(characterId, v)));
  }
}
```

### 레이어 분리 원칙

1. **배경 레이어**: 그림자, 바닥 반사
2. **신체 뒤 레이어**: 뒷머리, 망토 등 신체 뒤에 오는 요소
3. **신체 주 레이어**: 몸통, 사지
4. **의상 레이어**: 옷, 갑옷
5. **얼굴 레이어**: 피부, 눈, 코, 입
6. **장식 레이어**: 머리카락 앞부분, 액세서리
7. **이펙트 레이어**: 빛나는 효과, 마법 오라

---

## Reference 파일 목록

| 파일 | 역할 |
|------|------|
| `reference/anatomy.md` | 캐릭터 해부학 기초, 파트별 구조화 방법 |
| `reference/proportions.md` | 등신 비율 가이드, 비율 상수 정의, 스케일링 |
| `reference/color-theory.md` | 컬러 선택 원칙, 팔레트 설계, CSS 테마 시스템 |
| `reference/expression.md` | 표정 6종, 파라미터 패턴, 애니메이션 전환 |
| `reference/silhouette.md` | 실루엣 가독성 테스트, 역할별 실루엣 패턴 |
| `reference/style-guide.md` | 선 굵기 표준, 명암 처리, 스타일 일관성 체크리스트 |

각 파일은 독립적으로 참조 가능하며, 특정 작업에 집중할 때 해당 파일만 로드해도 충분한 컨텍스트를 제공합니다.
