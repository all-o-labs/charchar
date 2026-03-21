---
name: pixel-art
description: Convert or create a character in pixel art style with authentic retro constraints
user-invocable: true
args:
  - name: character
    description: Character SVG, description, or existing design to pixelate
    required: true
  - name: resolution
    description: Pixel grid size — 8 | 16 | 32 | 64 (default: 32)
    required: false
  - name: palette
    description: Color palette constraint — nes | snes | gba | cga | free (default: free)
    required: false
category: 스타일
license: MIT
---

# pixel-art

캐릭터를 픽셀아트 스타일로 변환하거나 새로 생성합니다. 각 픽셀이 의미를 가져야 하며, 해상도와 팔레트 제약 안에서 최대한의 표현력을 구현합니다.

## 픽셀아트의 핵심 원칙

### 1. 픽셀 경제성 (Pixel Economy)
각 픽셀은 이유가 있어야 합니다. 불필요한 픽셀은 형태를 흐립니다.

```
나쁜 예 (클러스터):    좋은 예 (경제적):
. . X X X X . .        . . . X X . . .
. X X X X X X .        . X X X X X X .
X X X X X X X X        X X . . . . X X
X X X X X X X X   →   X X . . . . X X
X X X X X X X X        X X . . . . X X
. X X X X X X .        . X X X X X X .
. . X X X X . .        . . . X X . . .
```

### 2. 클러스터 방지 (No Jaggies)
대각선 픽셀이 뭉치면 계단 현상이 심해집니다. L자형 배치를 사용합니다.

```
나쁜 클러스터:          좋은 라인:
X X .                   X . .
X X X          →        . X .
. X X                   . . X
```

### 3. 아웃라인 우선 (Outline First)
외곽선을 먼저 그리고 내부를 채웁니다. 아웃라인은 캐릭터의 실루엣을 정의합니다.

### 4. 색상 램핑 (Color Ramp)
각 색상은 최소 3단계 명암(어두움/기본/밝음)으로 구성합니다.

```javascript
// 좋은 색상 램프 예시 (파란색 의상)
const blueRamp = {
  shadow:   '#1A2E5A',  // 가장 어두운 그림자
  base:     '#2C4A8C',  // 기본 색상
  mid:      '#4A6EB5',  // 중간 하이라이트
  highlight:'#7A9AD4',  // 밝은 하이라이트
  specular: '#C8D9F0',  // 정반사 (선택)
};
```

---

## 해상도별 가이드

### 8x8 - 극미니멀 (Ultra Minimal)

아이콘, 탄환, 소형 오브젝트에 사용합니다. 캐릭터를 표현할 경우 실루엣만으로 승부합니다.

```
8x8 캐릭터 레이아웃:
행 0-1: 머리 (2픽셀 높이)
행 2:   목/어깨
행 3-5: 몸통 (3픽셀)
행 6-7: 다리 (2픽셀)

실제 픽셀맵 (S=피부, B=옷, O=아웃라인):
. O O O O O . .
O S S S S S O .
O S S S S S O .
O B B B B B O .
O B . B B . O .
O B B B B B O .
. O B O B O . .
. . O . O . . .
```

8x8 Canvas 구현:
```javascript
function draw8x8Character(ctx, x, y, colors) {
  const { O, S, B } = colors; // outline, skin, body
  const map = [
    [0,O,O,O,O,O,0,0],
    [O,S,S,S,S,S,O,0],
    [O,S,S,S,S,S,O,0],
    [O,B,B,B,B,B,O,0],
    [O,B,0,B,B,0,O,0],
    [O,B,B,B,B,B,O,0],
    [0,O,B,O,B,O,0,0],
    [0,0,O,0,O,0,0,0],
  ];
  map.forEach((row, dy) =>
    row.forEach((color, dx) => {
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x + dx, y + dy, 1, 1);
      }
    })
  );
}
```

### 16x16 - 표준 레트로 (Retro Standard)

클래식 게임(NES, GB) 스타일의 주요 캐릭터 크기입니다.

```
16x16 구역 배분:
머리:   4x4 (행 1-4, 열 6-9)
몸통:   8x6 (행 6-11, 열 4-11)
팔:     각 3x5 (행 6-10)
다리:   각 4x5 (행 12-16)
```

16x16 픽셀 드로잉:
```javascript
// 16x16 캐릭터 데이터 (행 배열)
// 0=투명, 색상코드로 팔레트 인덱스 표현
const char16Data = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,3,2,3,2,1,0,0,0,0,0], // 눈
  [0,0,0,0,1,2,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,4,2,2,2,1,0,0,0,0,0], // 입
  [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
  // ... 몸통, 팔, 다리
];

function renderPixelData(ctx, data, palette, scale = 1) {
  data.forEach((row, y) => {
    row.forEach((colorIdx, x) => {
      if (colorIdx === 0) return;
      ctx.fillStyle = palette[colorIdx];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
  });
}
```

### 32x32 - 표준 (Standard)

대부분의 2D 게임에서 사용하는 기준 해상도입니다. 표정과 의상 디테일이 가능합니다.

**32x32 구역 배분:**
```
머리:   10x10 (행 2-11, 중앙)
몸통:   12x10 (행 12-21, 중앙)
팔:     각 5x10 (행 12-21, 양쪽)
다리:   각 6x10 (행 22-31, 중앙)
```

**표현 가능한 디테일:**
- 눈: 2x3픽셀 (하이라이트 포함)
- 눈썹: 3x1픽셀
- 코: 1x1픽셀 그림자
- 머리카락: 개별 가닥 표현 가능
- 의상: 단추, 벨트, 포켓 등

### 64x64 - 상세 (Detailed)

고해상도 픽셀아트. 풍부한 디테일과 음영이 가능합니다.

**64x64에서 가능한 것들:**
- 얼굴 표정의 미묘한 차이
- 의상의 주름과 재질감
- 머리카락 개별 가닥
- 장신구 세부 묘사
- 3단계 이상의 명암 램프

---

## 팔레트 제한 모드

`palette` 인수로 레트로 시스템의 색상 제약을 적용합니다.

### NES 팔레트 (4색 제한)
```javascript
// NES는 실제 54색 마스터 팔레트에서 스프라이트당 3+투명 색상
const nesPalette = {
  // 세트 1: 어두운 캐릭터
  set1: ['transparent', '#000000', '#0000BB', '#FFFFFF'],
  // 세트 2: 밝은 캐릭터
  set2: ['transparent', '#FF0000', '#FFAA00', '#FFFFFF'],
  // 세트 3: 초록 캐릭터
  set3: ['transparent', '#006600', '#00BB00', '#FFFFFF'],
};

// 사용 시 4색 제한으로 팔레트 양자화
function quantizeToNES(imageData, palette) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i+1], data[i+2], data[i+3]];
    if (a < 128) continue; // 투명 처리
    const closest = findClosestColor(r, g, b, palette);
    [data[i], data[i+1], data[i+2]] = closest;
  }
  return imageData;
}
```

### SNES 팔레트 (16색 제한)
```javascript
// 스프라이트당 15색 + 투명 = 16색
// 더 넓은 색상 공간 (BGR555: 32768색 중 16 선택)
const snesPaletteExample = [
  'transparent',
  '#080808', '#282828', '#484848',  // 그레이 스케일
  '#1830A8', '#2848E0', '#5070F8',  // 파랑 계열
  '#F83818', '#F86030', '#F89858',  // 빨강/주황 계열
  '#F8E018', '#F8F840',             // 노랑 계열
  '#F8D8B0', '#E8A870',             // 피부 계열
  '#F8F8F8',                        // 흰색
];
```

### GBA 팔레트 (256색, 15색/스프라이트)
```javascript
// GBA는 256색 팔레트를 16개 블록으로 나눔 (각 16색)
// 실질적으로 스프라이트당 15색 + 투명
const gbaPaletteBlock = Array.from({length: 15}, (_, i) => {
  // HSL 기반 색상 생성 예시
  const hue = (i * 24) % 360;
  return `hsl(${hue}, 70%, ${30 + i * 3}%)`;
});
```

### CGA 팔레트 (4색, 레트로 PC)
```javascript
// CGA 모드 4, 팔레트 1 (가장 흔한 조합)
const cgaPalette = ['#000000', '#55FFFF', '#FF55FF', '#FFFFFF'];
// 팔레트 0
const cgaPalette0 = ['#000000', '#00AA00', '#AA0000', '#AA5500'];
```

---

## 핵심 기법

### 디더링 (Dithering)

제한된 색상으로 색상 전환을 부드럽게 표현합니다.

```javascript
// 체커보드 디더링 (2x2 패턴)
function checkerDither(ctx, x, y, w, h, color1, color2) {
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const color = (px + py) % 2 === 0 ? color1 : color2;
      ctx.fillStyle = color;
      ctx.fillRect(x + px, y + py, 1, 1);
    }
  }
}

// 50% 디더링으로 중간 색조 표현
checkerDither(ctx, 10, 15, 4, 4, '#2C4A8C', '#4A6EB5');
```

### 서브픽셀 음영 (Sub-pixel Shading)

경계선에 중간 색상 픽셀을 배치해 부드러운 전환을 만듭니다.

```
아웃라인 + 서브픽셀:
O O O O O        (O = 아웃라인 #1A1A2E)
O S M B O        (S = 피부, M = 중간색, B = 배경)
O S S B O    →   M 픽셀이 O와 S 사이의 전환을 부드럽게 함
O S S B O
O O O O O
```

### 셀프 아웃라인 (Self-Outline)

캐릭터 내부에서 영역을 구분할 때 사용합니다.

```javascript
// 주조색보다 어두운 색으로 내부 경계 표현
const selfOutline = darken(primaryColor, 0.4); // 40% 어둡게
// 순수 검정(#000000)보다 자연스러운 경계
```

---

## CSS 렌더링 설정

픽셀아트를 웹에서 흐리지 않게 표시하는 필수 CSS:

```css
/* 픽셀아트 캔버스 */
.pixel-art-canvas {
  image-rendering: -moz-crisp-edges;    /* Firefox */
  image-rendering: -webkit-crisp-edges; /* Safari (구버전) */
  image-rendering: pixelated;           /* Chrome, Edge, Opera */
  image-rendering: crisp-edges;         /* 표준 */
}

/* 픽셀아트 이미지 태그 */
img.pixel-sprite {
  image-rendering: pixelated;
  width: 128px;    /* 실제 해상도의 배수로 확대 */
  height: 128px;   /* 32px 원본 → 4배 확대 */
}

/* 픽셀아트 배경 스프라이트 */
.sprite-pixel {
  background-image: url('sprite.png');
  background-size: 128px 32px;
  image-rendering: pixelated;
  width: 32px;
  height: 32px;
}
```

Canvas nearest-neighbor 스케일링:
```javascript
function renderPixelArtScaled(sourceCanvas, targetCtx, scale) {
  targetCtx.imageSmoothingEnabled = false;
  targetCtx.msImageSmoothingEnabled = false;
  targetCtx.webkitImageSmoothingEnabled = false;

  const sw = sourceCanvas.width;
  const sh = sourceCanvas.height;
  targetCtx.drawImage(sourceCanvas, 0, 0, sw * scale, sh * scale);
}

// 32x32 → 256x256 (8배 확대, 픽셀 유지)
renderPixelArtScaled(spriteCanvas, displayCtx, 8);
```

---

## 해상도별 체크리스트

### 모든 해상도 공통
- [ ] 단색 배경에서 실루엣이 명확히 읽히는가
- [ ] 아웃라인 픽셀에 클러스터(2x2 뭉침)가 없는가
- [ ] 각 색상 영역에 최소 밝음/중간/어두움 3단계 램프가 있는가
- [ ] 대칭이 필요한 부위(눈, 어깨)가 픽셀 단위로 정확히 대칭인가

### 해상도별 추가 확인
- **8x8**: 실루엣만으로 무엇인지 알 수 있는가
- **16x16**: 눈이 2픽셀 이상인가 (1픽셀 눈은 표정이 없어 보임)
- **32x32**: 팔레트 색이 16색 이하인가
- **64x64**: 디더링 경계가 자연스럽게 전환되는가

---

## Do

- 아웃라인을 먼저 그리고 내부를 채운다 — 실루엣이 형태를 정의하기 때문이다
- 각 색상 영역에 최소 3단계 명암 램프(어두움/기본/밝음)를 적용한다
- 대각선 픽셀은 L자형 배치로 계단 현상(jaggies)을 최소화한다
- `image-rendering: pixelated` CSS를 적용해 확대 시 픽셀 선명도를 유지한다

## Don't

- 불필요한 픽셀을 채워 형태를 메운다 — 각 픽셀에는 이유가 있어야 하며 클러스터(2x2 뭉침)는 실루엣을 흐린다
- 해상도 제한을 초과한 디테일을 억지로 넣는다 — 16x16에서 세밀한 손가락을 표현하려 하면 오히려 뭉개진다
- 팔레트 제한을 무시하고 색을 자유롭게 사용한다 — NES 4색, SNES 16색 제약이 레트로 감성의 핵심이다
- Canvas 렌더링 시 `imageSmoothingEnabled`를 true로 둔다 — 픽셀아트가 흐릿하게 보간되어 손상된다
