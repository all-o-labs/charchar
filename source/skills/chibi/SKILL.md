---
name: chibi
description: Apply chibi (super-deformed) proportions to a character with cute style guidelines
user-invocable: true
args:
  - name: character
    description: 치비화할 캐릭터 이름 또는 설명
    required: true
  - name: head_ratio
    description: 등신 비율 (2|2.5|3, 기본값: 2.5)
    required: false
category: 스타일
license: MIT
---

# chibi — 치비(SD) 스타일 가이드

`/chibi character="캐릭터명" head_ratio="2.5"` 명령을 받으면
아래 가이드에 따라 2–3등신 치비 스타일 캐릭터 코드를 생성합니다.

---

## 1. 등신 비율 시스템

치비는 "머리 크기를 1단위"로 했을 때 전체 신장이 몇 단위인지로 정의합니다.

| head_ratio | 전체 높이 | 특징                           | 적합한 용도          |
|------------|----------|-------------------------------|----------------------|
| 2          | 머리×2   | 극단적 귀여움, 팔다리 거의 없음 | 이모티콘, 스탬프     |
| 2.5        | 머리×2.5 | 표준 치비, 팔다리 있음          | 게임 아이콘, 일반 SD |
| 3          | 머리×3   | 성숙한 치비, 약간의 디테일      | RPG 도트, 웹툰 SD컷  |

```typescript
interface ChibiProportions {
  headRatio: 2 | 2.5 | 3;
  // 전체 높이를 1로 정규화했을 때 각 부위 비율
  headHeight: number;   // 전체의 ~40-50%
  torsoHeight: number;  // 전체의 ~20-30%
  legHeight: number;    // 전체의 ~20-30%
  headWidth: number;    // 두상 가로 (머리 세로의 0.9-1.0배)
  eyeSize: number;      // 두상 높이의 ~25-35%
}

const CHIBI_PROPORTIONS: Record<string, ChibiProportions> = {
  '2': {
    headRatio: 2,
    headHeight: 0.50,
    torsoHeight: 0.25,
    legHeight: 0.25,
    headWidth: 0.95,
    eyeSize: 0.35,
  },
  '2.5': {
    headRatio: 2.5,
    headHeight: 0.42,
    torsoHeight: 0.28,
    legHeight: 0.30,
    headWidth: 0.90,
    eyeSize: 0.30,
  },
  '3': {
    headRatio: 3,
    headHeight: 0.36,
    torsoHeight: 0.30,
    legHeight: 0.34,
    headWidth: 0.85,
    eyeSize: 0.25,
  },
};
```

---

## 2. 큰 머리 / 큰 눈 비율 계산

### 머리 형태

치비 머리는 실제 인체보다 폭이 넓고 아래가 둥글습니다.

```svg
<!-- 2.5등신 머리 (viewBox 0 0 100 200 기준) -->
<!-- 두상: 높이 84px, 폭 80px -->
<ellipse
  cx="50" cy="46"
  rx="40" ry="42"
  fill="var(--skin)"
/>
<!-- 볼이 통통: 아래쪽 rx를 늘림 -->
<ellipse
  cx="50" cy="58"
  rx="38" ry="28"
  fill="var(--skin)"
/>
```

### 눈 비율

```typescript
// 눈 높이 = 두상 높이 × eyeSize
// 눈 폭 = 눈 높이 × 1.2 (가로로 약간 넓게)
// 눈 간격 = 두상 폭 × 0.25 (눈 중심 기준)
// 눈 위치 Y = 두상 중심 아래 10%

function calcEyeParams(headH: number, headW: number, eyeSize: number) {
  const eyeH = headH * eyeSize;
  const eyeW = eyeH * 1.2;
  const eyeGap = headW * 0.25; // 각 눈의 중심까지 거리
  const eyeY = headH * 0.55;   // 두상 상단 기준 55%
  return { eyeH, eyeW, eyeGap, eyeY };
}
```

```svg
<!-- 치비 눈 (highlights 포함) -->
<g class="eye-left">
  <!-- 흰자 -->
  <ellipse cx="34" cy="46" rx="10" ry="12" fill="white" />
  <!-- 홍채 -->
  <ellipse cx="34" cy="47" rx="7" ry="9" fill="var(--eye-color)" />
  <!-- 동공 -->
  <ellipse cx="34" cy="48" rx="4" ry="5" fill="#1a1a1a" />
  <!-- 하이라이트 (큰 것) -->
  <circle cx="30" cy="44" r="3" fill="white" opacity="0.9" />
  <!-- 하이라이트 (작은 것) -->
  <circle cx="38" cy="50" r="1.5" fill="white" opacity="0.7" />
</g>
```

---

## 3. 심플한 손/발 처리

치비에서 손과 발은 세부 묘사 없이 단순화합니다.

**손 처리 방식**:

```svg
<!-- 2등신: 동그란 공 손 -->
<circle cx="20" cy="120" r="8" fill="var(--skin)" />

<!-- 2.5등신: 벙어리장갑 형태 -->
<path d="M 15,115 Q 12,108 18,105 Q 25,102 28,108 L 28,120 Q 25,125 20,125 Q 15,125 15,120 Z"
      fill="var(--skin)" />

<!-- 3등신: 손가락 3개 -->
<path d="M 16,118 L 16,108 Q 17,104 20,104 Q 23,104 23,108 L 23,118" fill="var(--skin)" />
<path d="M 23,118 L 23,106 Q 24,102 27,102 Q 30,102 30,106 L 30,118" fill="var(--skin)" />
<path d="M 30,118 L 30,108 Q 31,104 34,104 Q 37,104 37,108 L 37,118" fill="var(--skin)" />
```

**발 처리 방식**:
```svg
<!-- 단순 타원형 발 -->
<ellipse cx="36" cy="185" rx="14" ry="7" fill="var(--shoe-color)" />
<ellipse cx="64" cy="185" rx="14" ry="7" fill="var(--shoe-color)" />
```

**Do/Don't**:
- Do: 손을 단순 원 또는 벙어리장갑으로 표현
- Do: 발을 납작한 타원으로 표현
- Don't: 손가락을 5개 다 그리기 (치비에서 어색함)
- Don't: 발목 관절 디테일 추가 (비율 무너짐)

---

## 4. 과장된 표정

치비의 핵심은 감정을 극적으로 표현하는 것입니다.

```typescript
// 표정별 눈/입 변형 값
const CHIBI_EXPRESSIONS = {
  happy: {
    // 눈: 초승달 (아래로 호)
    eye: 'M 24,46 Q 34,56 44,46',
    // 입: 크게 벌린 웃음
    mouth: 'M 36,62 Q 50,72 64,62',
    // 볼터치 크게
    blushOpacity: 0.6,
  },
  surprised: {
    // 눈: 동그랗게 크게 (기본보다 1.5배)
    eyeScale: 1.5,
    // 입: O자
    mouth: 'M 46,65 Q 50,72 54,65 Q 54,60 50,58 Q 46,60 46,65 Z',
    blushOpacity: 0,
  },
  angry: {
    // 눈썹: 안쪽 아래로 강하게 기울기
    browAngle: -30,
    // 눈: 가늘게 (ry 를 절반으로)
    eyeScaleY: 0.5,
    // 입: 역삼각형 또는 _ 모양
    mouth: 'M 42,66 L 50,62 L 58,66',
    blushOpacity: 0,
  },
  sad: {
    // 눈: 아래로 처진 반원
    eye: 'M 24,50 Q 34,44 44,50',
    // 입: 아래로 꺾인 호
    mouth: 'M 38,67 Q 50,62 62,67',
    // 눈물방울
    showTears: true,
    blushOpacity: 0,
  },
} as const;
```

---

## 5. 귀여움 체크리스트

캐릭터를 완성한 후 아래 항목을 검토합니다.

**비율 체크**:
- [ ] 머리가 전체의 40% 이상을 차지하는가?
- [ ] 눈이 얼굴 면적의 20–35%를 차지하는가?
- [ ] 다리가 지나치게 길지 않은가? (등신 비율 재확인)
- [ ] 몸통이 머리보다 좁은가? (역삼각형 체형 금지)

**표현 체크**:
- [ ] 눈에 최소 1개의 하이라이트가 있는가?
- [ ] 볼터치(blush)가 있는가? (없으면 딱딱해 보임)
- [ ] 표정이 먼 거리에서도 읽히는가? (16px 썸네일 테스트)

**디테일 체크**:
- [ ] 선 굵기가 일정한가? (0.5–2px 범위 내)
- [ ] 명암이 단순 2단계(base+shadow)로 제한되는가?
- [ ] 과도한 디테일로 치비다움이 손상되지 않았는가?

**코드 체크**:
- [ ] 모든 색상이 CSS 변수로 선언되어 있는가?
- [ ] viewBox가 비율에 맞게 설정되어 있는가?
- [ ] 눈/입 등 표정 요소가 별도 `<g>` 그룹으로 분리되어 있는가?

---

## Do

- 머리를 전체 신장의 40~50%로 크게 그려 치비 비율을 유지한다
- 표정을 과장되게 표현한다 — 눈을 1.5배 확대하거나 입을 극단적으로 구부려 감정을 명확히 전달한다
- 눈에 최소 1개의 하이라이트를 넣어 생동감을 부여한다
- 손과 발을 단순화한다 — 동그란 공 손, 납작한 타원 발로 치비다움을 유지한다

## Don't

- 5개 손가락을 모두 그린다 — 치비 비율에서 사실적인 손가락은 어색하고 비율을 무너뜨린다
- 정확한 해부학 비율을 적용한다 — 다리가 길어지거나 몸통이 커지면 치비가 아니라 SD가 무너진다
- 명암을 3단계 이상으로 복잡하게 넣는다 — 치비는 base + shadow 2단계로 단순하게 유지한다
- 역삼각형 체형(어깨가 넓고 허리가 좁음)을 사용한다 — 치비는 몸통이 머리보다 좁아야 한다
