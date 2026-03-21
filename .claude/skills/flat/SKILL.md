---
name: flat
description: Apply flat design principles to a character with minimal colors and geometric shapes
user-invocable: true
args:
  - name: character
    description: 플랫 디자인으로 표현할 캐릭터 이름 또는 설명
    required: true
  - name: complexity
    description: "복잡도 수준 (minimal|standard|detailed, 기본값: standard)"
    required: false
category: 스타일
license: MIT
---


# flat — 플랫 디자인 캐릭터 스타일 가이드

`/flat character="캐릭터명" complexity="standard"` 명령을 받으면
아래 가이드에 따라 외곽선 없는 기하학적 플랫 캐릭터를 생성합니다.

---

## 1. 플랫 디자인 핵심 원칙

플랫 디자인 캐릭터의 3가지 금지사항:
1. **외곽선 금지** — `stroke` 사용 금지 (단, 아이콘 구분용 얇은 선 예외)
2. **그라디언트 금지** — 단색 면만 사용 (minimal/standard 한정)
3. **그림자 금지** — `drop-shadow` 필터 금지 (레이어드 색상으로 대체)

대신 다음으로 입체감과 구분을 표현합니다:
- 색상의 명도 차이로 그림자 표현
- 형태의 겹침으로 레이어 표현
- 크기와 위치의 대비로 계층 표현

---

## 2. 복잡도별 색상 팔레트

```typescript
const FLAT_PALETTE = {
  minimal: {
    // 3색 팔레트: 배경 + 주색 + 강조
    colors: ['#f5f5f5', '#4a90d9', '#f39c12'],
    maxColors: 3,
    // 그림자는 주색의 어두운 버전
    shadowRatio: 0.75, // HSL lightness × 0.75
  },
  standard: {
    // 5색 팔레트
    colors: ['#ecf0f1', '#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
    maxColors: 5,
    shadowRatio: 0.80,
  },
  detailed: {
    // 최대 7색 (Material Design 팔레트 활용)
    colors: ['#fafafa', '#2196f3', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#607d8b'],
    maxColors: 7,
    // detailed에서는 subtle 그라디언트 허용 (linear만)
    allowGradient: true,
    shadowRatio: 0.85,
  },
} as const;

// 그림자 색상 자동 계산 (HSL 기반)
function flatShadowColor(baseHex: string, ratio: number): string {
  // HSL로 변환 후 Lightness × ratio
  // 예: #4a90d9 → hsl(210, 62%, 56%) → hsl(210, 62%, 42%)
  const [h, s, l] = hexToHsl(baseHex);
  return hslToHex(h, s, l * ratio);
}
```

---

## 3. 기하학적 형태 분해

캐릭터의 모든 요소를 기본 도형으로 분해합니다.

```typescript
// 복잡한 형태 → 기본 도형 조합 원칙
const SHAPE_MAPPING = {
  // 신체 부위 → 도형
  head:   'ellipse 또는 circle (머리)',
  torso:  'rect with rx (몸통)',
  arm:    'rect 또는 rounded-rect (팔)',
  leg:    'rect (다리)',
  hair:   'ellipse + path (머리카락)',
  eye:    'circle (눈)',
  mouth:  'path arc (입)',
  // 의상
  shirt:  'path (상의)',
  pants:  'rect pair (바지)',
  skirt:  'path trapezoid (치마)',
  shoes:  'ellipse (신발)',
} as const;
```

```svg
<!-- 플랫 캐릭터 예시 (standard, 5색) -->
<svg viewBox="0 0 120 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 머리 -->
  <circle cx="60" cy="45" r="32" fill="#f5cba7" />

  <!-- 머리카락 그림자 (어두운 피부색으로 볼륨 표현) -->
  <ellipse cx="60" cy="42" rx="32" ry="20" fill="#3d2b1f" />

  <!-- 몸통 -->
  <rect x="28" y="74" width="64" height="72" rx="8" fill="#3498db" />

  <!-- 팔 -->
  <rect x="10" y="76" width="20" height="52" rx="10" fill="#3498db" />
  <rect x="90" y="76" width="20" height="52" rx="10" fill="#3498db" />

  <!-- 손 -->
  <circle cx="20" cy="134" r="11" fill="#f5cba7" />
  <circle cx="100" cy="134" r="11" fill="#f5cba7" />

  <!-- 바지 -->
  <rect x="28" y="144" width="28" height="52" rx="6" fill="#2c3e50" />
  <rect x="64" y="144" width="28" height="52" rx="6" fill="#2c3e50" />

  <!-- 신발 -->
  <ellipse cx="42" cy="197" rx="18" ry="8" fill="#1a252f" />
  <ellipse cx="78" cy="197" rx="18" ry="8" fill="#1a252f" />

  <!-- 눈 -->
  <circle cx="48" cy="47" r="5" fill="#2c3e50" />
  <circle cx="72" cy="47" r="5" fill="#2c3e50" />
  <!-- 눈 하이라이트 -->
  <circle cx="46" cy="45" r="2" fill="white" />
  <circle cx="70" cy="45" r="2" fill="white" />

  <!-- 입 -->
  <path d="M 50,60 Q 60,67 70,60" stroke="#2c3e50" stroke-width="2.5" fill="none" stroke-linecap="round" />
</svg>
```

---

## 4. 명암 표현 (색상 레이어)

외곽선과 그라디언트 없이 입체감 표현:

```svg
<!-- 얼굴 명암: 어두운 피부색 면을 뒤에 배치 -->
<!-- 1. 어두운 면 (그림자) -->
<ellipse cx="60" cy="52" rx="28" ry="20" fill="#d4956a" />
<!-- 2. 밝은 면 (메인) -->
<circle cx="60" cy="45" r="30" fill="#f5cba7" />

<!-- 몸통 명암 -->
<!-- 1. 어두운 면 (우측 그림자) -->
<rect x="68" y="74" width="24" height="72" rx="8" fill="#2980b9" />
<!-- 2. 메인 면 -->
<rect x="28" y="74" width="64" height="72" rx="8" fill="#3498db" />
```

**명암 색상 계산 규칙**:
- 그림자: 기본색 HSL lightness × 0.75–0.85
- 하이라이트: 기본색 HSL lightness × 1.15 (상한 95%)
- 채도는 그림자에서 약간 증가 (+5–10%)

---

## 5. Material / iOS 스타일 호환

### Material Design 적용

```typescript
// Material 3 색상 시스템과 호환
const materialFlatPalette = {
  primary:        '#6750a4', // Material primary
  onPrimary:      '#ffffff',
  primaryContainer: '#eaddff',
  secondary:      '#625b71',
  tertiary:       '#7d5260',
  surface:        '#fffbfe',
  error:          '#b3261e',
};

// 캐릭터 색상 매핑
const characterColors = {
  background: materialFlatPalette.surface,
  body:       materialFlatPalette.primary,
  accent:     materialFlatPalette.tertiary,
  skin:       '#f5cba7', // 피부는 Material 독립 색상
};
```

### iOS SF Symbols 스타일

- 선 두께: 중간 (medium weight)
- 모서리 반경: 뷰 사이즈의 22–30%
- 색상: SF Symbol 계층 색상 시스템 활용

```swift
// SwiftUI 통합 예시 (참고용)
// Image(systemName: "person.fill")
//   .foregroundStyle(.blue, .red) // 2-layer symbol
```

---

## 6. Do/Don't

| 구분 | Good | Bad |
|------|------|-----|
| 색상 수 | minimal 3색, standard 5색 | 10색 이상 혼용 |
| 외곽선 | 없음 (형태로만 구분) | `stroke` 남발 |
| 그림자 | 어두운 색 면으로 표현 | CSS `drop-shadow` |
| 형태 | 원/사각형/단순 path | 복잡한 bezier 곡선 |
| 입체감 | 색상 명도 차이 | 3D 원근 효과 |
| 눈 | 단색 원 + 흰 하이라이트 | 세밀한 홍채/동공 |

**체크리스트**:
- [ ] 색상이 complexity에 맞는 최대 수를 초과하지 않는가?
- [ ] 모든 외곽선(stroke)이 제거되었는가?
- [ ] 모든 도형이 기본 SVG 도형(rect, circle, ellipse, path)으로 표현되는가?
- [ ] 색상만 봤을 때도 형태 구분이 가능한가?
- [ ] CSS 변수로 색상이 선언되어 테마 전환 가능한가?
- [ ] 16×16px 크기에서도 형태가 식별 가능한가?

---

## Do

- 입체감을 색상 명도 차이로만 표현한다 — 어두운 면을 뒤에 배치하고 밝은 면을 앞에 겹친다
- 색상 수를 complexity에 맞게 제한한다 — minimal 3색, standard 5색, detailed 7색
- 모든 형태를 원, 사각형, 단순 path 등 기본 SVG 도형으로 분해한다
- 그림자 색상은 기본색의 HSL lightness × 0.75~0.85로 자동 계산해 통일성을 유지한다

## Don't

- `stroke`(외곽선)를 사용한다 — 플랫 디자인의 핵심 금지 사항이며 스타일을 무너뜨린다
- CSS `drop-shadow` 필터를 사용한다 — 명도 차이 색상 면으로 그림자를 대체한다
- minimal/standard에서 gradient를 사용한다 — detailed 복잡도에서만 linear gradient가 허용된다
- 10색 이상을 혼용한다 — 색이 많아질수록 플랫 디자인 특유의 명쾌함이 사라진다
