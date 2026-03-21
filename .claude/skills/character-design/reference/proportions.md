# 캐릭터 비율 가이드 (Character Proportions Reference)

비율은 캐릭터의 첫인상을 결정합니다. 등신(頭身) 수에 따라 캐릭터의 분위기가 완전히 달라집니다.

---

## 1. 등신 비율 가이드

"등신"은 캐릭터 전체 높이를 머리 높이로 나눈 값입니다.
머리 1개 높이 = 1등신.

### 2등신 (Super Chibi)

```
용도: 아이콘, 이모티콘, 매우 귀엽고 단순한 표현
특징:
  - 머리 = 전체의 50%
  - 팔다리가 극도로 짧음
  - 목이 거의 없음
  - 발이 타원형으로 단순화
```

```javascript
const PROPORTION_2HEAD = {
  totalHeads: 2,
  headRatio: 0.50,      // 50%
  neckVisible: false,
  torsoHeight: 0.4,     // heads
  armLength: 0.6,       // heads
  legLength: 0.6,       // heads
  shoulderWidth: 1.5,   // head-widths
  personality: ['cute', 'comedy', 'icon'],
};
```

### 2.5등신 (Chibi)

```
용도: 치비 캐릭터, SD(Super Deformed), 귀여운 게임
특징:
  - 가장 대중적인 치비 비율
  - 눈이 매우 크고 표현적
  - 손발이 작고 뭉툭함
```

```javascript
const PROPORTION_2_5HEAD = {
  totalHeads: 2.5,
  headRatio: 0.40,
  neckVisible: false,
  torsoHeight: 0.7,
  armLength: 0.8,
  legLength: 1.0,
  shoulderWidth: 1.7,
  eyeSizeMultiplier: 2.2,   // 기준 대비 눈 크기
  personality: ['chibi', 'cute', 'casual'],
};
```

### 4등신 (Cartoon)

```
용도: 어린이 애니메이션, 카툰, 웹툰 조연
특징:
  - 귀여움과 성인감의 중간
  - 일본 4컷 만화 캐릭터 스타일
  - 표현이 과장되기 쉬움
```

```javascript
const PROPORTION_4HEAD = {
  totalHeads: 4,
  headRatio: 0.25,
  neckVisible: true,
  torsoHeight: 1.2,
  armLength: 1.5,
  legLength: 1.8,
  shoulderWidth: 2.0,
  eyeSizeMultiplier: 1.5,
  personality: ['cartoon', 'expressive', 'youthful'],
};
```

### 6등신 (Standard Stylized)

```
용도: RPG 게임 캐릭터, 일반 만화/애니, 웹툰 주인공
특징:
  - 현실적이면서도 이상화된 비율
  - 가장 범용적인 캐릭터 비율
  - 어떤 장르에도 무난하게 어울림
```

```javascript
const PROPORTION_6HEAD = {
  totalHeads: 6,
  headRatio: 1 / 6,      // ~16.7%
  neckHeight: 0.4,        // heads
  torsoHeight: 2.0,
  armLength: 3.0,
  legLength: 3.5,
  shoulderWidth: 2.2,
  eyeSizeMultiplier: 1.0, // 기준
  personality: ['heroic', 'balanced', 'versatile'],
};
```

### 7등신 (Heroic)

```
용도: 히어로 만화, 액션 게임, 근육질 전사
특징:
  - 영웅적이고 위압감 있는 비율
  - 다리가 특히 길어 보임
  - 서양 코믹스 스타일
```

```javascript
const PROPORTION_7HEAD = {
  totalHeads: 7,
  headRatio: 1 / 7,      // ~14.3%
  neckHeight: 0.5,
  torsoHeight: 2.2,
  armLength: 3.3,
  legLength: 4.0,
  shoulderWidth: 2.5,
  eyeSizeMultiplier: 0.9,
  personality: ['heroic', 'powerful', 'action'],
};
```

### 8등신 (Fashion / Realistic)

```
용도: 패션 일러스트, 사실적 캐릭터, 성인 만화
특징:
  - 실제 인체보다 이상화된 비율
  - 다리가 매우 길고 우아함
  - 패션 모델 실루엣
```

```javascript
const PROPORTION_8HEAD = {
  totalHeads: 8,
  headRatio: 0.125,      // 12.5%
  neckHeight: 0.6,
  torsoHeight: 2.5,
  armLength: 3.5,
  legLength: 4.5,
  shoulderWidth: 2.3,
  eyeSizeMultiplier: 0.85,
  personality: ['elegant', 'fashion', 'adult', 'realistic'],
};
```

---

## 2. 연령별 비율 차이

```javascript
const AGE_PROPORTION_MODIFIERS = {
  // 유아 (0-3세): 머리가 몸의 1/4
  toddler: {
    headRatio: 0.28,
    legShortFactor: 0.6,   // 다리가 비례 대비 짧음
    torsoRoundness: 1.4,   // 몸통이 둥글고 통통
    headWidth: 0.95,       // 머리가 거의 동그람
  },
  // 아동 (4-10세): 5~6등신
  child: {
    headRatio: 0.19,
    legShortFactor: 0.8,
    torsoRoundness: 1.1,
    headWidth: 0.9,
  },
  // 청소년 (11-17세): 6~7등신
  teen: {
    headRatio: 0.155,
    legShortFactor: 0.95,
    torsoRoundness: 1.0,
    headWidth: 0.88,
  },
  // 성인 (18-40세): 7~8등신
  adult: {
    headRatio: 0.14,
    legShortFactor: 1.0,   // 기준
    torsoRoundness: 1.0,
    headWidth: 0.85,
  },
  // 노인 (60세+): 키가 줄고 구부정
  elder: {
    headRatio: 0.16,       // 키가 줄어 상대적으로 머리가 커짐
    legShortFactor: 0.9,
    torsoRoundness: 1.05,
    spineCompression: 0.9, // 전체 키 감소
    postureAngle: 10,      // 앞으로 기울어진 각도(도)
  },
};
```

---

## 3. 체형별 비율 차이

```javascript
const BODY_TYPE_MODIFIERS = {
  // 슬림
  slim: {
    shoulderWidthFactor: 0.9,
    waistWidthFactor: 0.8,
    hipWidthFactor: 0.9,
    limbWidthFactor: 0.85,
    muscleDefinition: 0.3,
  },
  // 표준
  average: {
    shoulderWidthFactor: 1.0,
    waistWidthFactor: 1.0,
    hipWidthFactor: 1.0,
    limbWidthFactor: 1.0,
    muscleDefinition: 0.5,
  },
  // 근육질
  muscular: {
    shoulderWidthFactor: 1.3,
    waistWidthFactor: 1.1,
    hipWidthFactor: 1.1,
    limbWidthFactor: 1.4,
    muscleDefinition: 0.9,
  },
  // 통통
  chubby: {
    shoulderWidthFactor: 1.1,
    waistWidthFactor: 1.4,
    hipWidthFactor: 1.3,
    limbWidthFactor: 1.25,
    muscleDefinition: 0.2,
    torsoRoundness: 1.5,
  },
  // 키 크고 마름 (장신)
  tall_slim: {
    shoulderWidthFactor: 0.95,
    waistWidthFactor: 0.75,
    hipWidthFactor: 0.85,
    limbWidthFactor: 0.9,
    heightFactor: 1.15,
  },
};
```

---

## 4. 화면 크기별 적정 비율

```javascript
// 렌더 크기와 최적 등신 매핑
const SIZE_TO_HEAD_COUNT = {
  // 아이콘 크기: 단순화 필수
  icon_16:  { heads: 2.0, detailLevel: 'minimal' },
  icon_32:  { heads: 2.0, detailLevel: 'simple' },
  icon_48:  { heads: 2.5, detailLevel: 'simple' },
  icon_64:  { heads: 2.5, detailLevel: 'basic' },

  // 스프라이트 크기
  sprite_48:  { heads: 3.0, detailLevel: 'basic' },
  sprite_64:  { heads: 4.0, detailLevel: 'standard' },
  sprite_96:  { heads: 5.0, detailLevel: 'standard' },
  sprite_128: { heads: 6.0, detailLevel: 'detailed' },

  // 포트레이트 / 큰 이미지
  portrait_256: { heads: 6.0, detailLevel: 'full' },
  portrait_512: { heads: 7.0, detailLevel: 'full' },
  full_1024:    { heads: 8.0, detailLevel: 'full+' },
};

function getOptimalProportions(pixelHeight) {
  const breakpoints = [16, 32, 48, 64, 96, 128, 256, 512, 1024];
  const sizes = Object.keys(SIZE_TO_HEAD_COUNT);
  // 가장 가까운 브레이크포인트 찾기
  const nearest = breakpoints.reduce((prev, curr) =>
    Math.abs(curr - pixelHeight) < Math.abs(prev - pixelHeight) ? curr : prev
  );
  const key = sizes.find(k => k.includes(String(nearest)));
  return SIZE_TO_HEAD_COUNT[key] || SIZE_TO_HEAD_COUNT['sprite_128'];
}
```

---

## 5. 비율 상수 정의 방법

### JavaScript 모듈

```javascript
// proportions.js - 비율 상수 중앙 관리
export const HEAD_UNITS = {
  // 전체 높이에서 머리 단위(hu) 계산
  fromPixelHeight: (pixelHeight, headCount) => pixelHeight / headCount,
  fromHeadPixels: (headPixels) => headPixels,
};

export const PROPORTION_PRESETS = {
  CHIBI:    { heads: 2.5, eyeScale: 2.2, limbScale: 0.7 },
  CARTOON:  { heads: 4.0, eyeScale: 1.5, limbScale: 0.85 },
  STANDARD: { heads: 6.0, eyeScale: 1.0, limbScale: 1.0 },
  HEROIC:   { heads: 7.0, eyeScale: 0.9, limbScale: 1.1 },
  FASHION:  { heads: 8.0, eyeScale: 0.85, limbScale: 1.15 },
};

export function buildProportions(preset, totalPixelHeight) {
  const p = PROPORTION_PRESETS[preset];
  const hu = totalPixelHeight / p.heads;   // head unit in pixels

  return {
    headUnit: hu,
    head:     { w: hu * 0.85, h: hu },
    neck:     { w: hu * 0.35, h: hu * 0.4 },
    torso:    { w: hu * 2.2, h: hu * 2.0 },
    upperArm: { w: hu * 0.45, h: hu * 1.3 * p.limbScale },
    forearm:  { w: hu * 0.38, h: hu * 1.2 * p.limbScale },
    hand:     { w: hu * 0.5 * p.limbScale, h: hu * 0.75 * p.limbScale },
    thigh:    { w: hu * 0.6, h: hu * 2.0 * p.limbScale },
    shin:     { w: hu * 0.48, h: hu * 1.8 * p.limbScale },
    foot:     { w: hu * 1.0 * p.limbScale, h: hu * 0.4 },
  };
}
```

### CSS Custom Properties

```css
/* 비율 변수 시스템 */
:root {
  /* 기준 단위: 머리 높이 */
  --char-head-unit: 64px;

  /* 6등신 표준 비율 */
  --char-total-height: calc(var(--char-head-unit) * 6);
  --char-head-height: var(--char-head-unit);
  --char-head-width: calc(var(--char-head-unit) * 0.85);

  --char-neck-height: calc(var(--char-head-unit) * 0.4);
  --char-torso-height: calc(var(--char-head-unit) * 2.0);
  --char-torso-width: calc(var(--char-head-unit) * 2.2);

  --char-arm-upper-height: calc(var(--char-head-unit) * 1.3);
  --char-arm-lower-height: calc(var(--char-head-unit) * 1.2);

  --char-leg-upper-height: calc(var(--char-head-unit) * 2.0);
  --char-leg-lower-height: calc(var(--char-head-unit) * 1.8);
}

/* 치비 변형: head-unit만 바꿔도 전체 비율 조정 */
.char-style-chibi {
  --char-head-unit: 80px;   /* 치비는 머리가 더 큼 */
  --char-total-height: calc(var(--char-head-unit) * 2.5);
  --char-torso-height: calc(var(--char-head-unit) * 0.7);
  --char-arm-upper-height: calc(var(--char-head-unit) * 0.7);
  --char-leg-upper-height: calc(var(--char-head-unit) * 0.9);
}
```

---

## 6. 스케일링 가이드 (Responsive Character Sizing)

```javascript
// 뷰포트에 따라 캐릭터 크기를 반응형으로 조정
class ResponsiveCharacterScaler {
  constructor(baseHeight = 512, minHeight = 64, maxHeight = 1024) {
    this.baseHeight = baseHeight;
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
  }

  // 컨테이너 크기에 따라 최적 캐릭터 높이 계산
  getOptimalHeight(containerWidth, containerHeight) {
    // 컨테이너 높이의 80%를 기본으로
    const target = containerHeight * 0.8;
    return Math.max(this.minHeight, Math.min(this.maxHeight, target));
  }

  // 해상도별 디테일 레벨 결정
  getDetailLevel(pixelHeight) {
    if (pixelHeight < 48)  return 0;   // 실루엣만
    if (pixelHeight < 96)  return 1;   // 기본 형태
    if (pixelHeight < 192) return 2;   // 주요 디테일
    if (pixelHeight < 384) return 3;   // 전체 디테일
    return 4;                          // 최고 품질
  }

  // CSS transform scale로 벡터 SVG 스케일링
  getCSSScale(desiredHeight) {
    return desiredHeight / this.baseHeight;
  }
}

// CSS에서 반응형 캐릭터 크기
/*
.character-container {
  container-type: inline-size;
}

.character {
  height: 80cqh;      -- 컨테이너 높이의 80%
  width: auto;
  max-height: 512px;
  min-height: 64px;
}

@container (max-width: 200px) {
  .character--detail-high { display: none; }
}
*/
```

---

## 7. 비율 검증 유틸리티

```javascript
// 비율이 기준에서 얼마나 벗어났는지 검사
function validateProportions(character, preset = 'STANDARD') {
  const expected = PROPORTION_PRESETS[preset];
  const actual = measureCharacterProportions(character);
  const tolerance = 0.15; // ±15% 허용

  const issues = [];

  const headRatio = actual.headHeight / actual.totalHeight;
  const expectedHeadRatio = 1 / expected.heads;

  if (Math.abs(headRatio - expectedHeadRatio) > tolerance * expectedHeadRatio) {
    issues.push({
      part: 'head',
      expected: `${(expectedHeadRatio * 100).toFixed(1)}%`,
      actual: `${(headRatio * 100).toFixed(1)}%`,
      severity: 'warning',
    });
  }

  // ... 각 파트 검사

  return {
    valid: issues.length === 0,
    issues,
    score: Math.max(0, 100 - issues.length * 10),
  };
}
```
