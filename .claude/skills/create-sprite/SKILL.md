---
name: create-sprite
description: Generate sprite sheets and animation frames for a character in pixel, vector, or canvas format
user-invocable: true
args:
  - name: character
    description: Character SVG/description or file reference to base the sprite on
    required: true
  - name: format
    description: "Output format — pixel | vector | canvas (default: pixel)"
    required: false
  - name: resolution
    description: "Sprite resolution in px — 16 | 32 | 64 | 128 (default: 32)"
    required: false
category: 생성
license: MIT
---


# create-sprite

캐릭터 정보를 입력받아 게임 엔진에서 바로 사용 가능한 스프라이트시트를 생성합니다. 포맷(pixel/vector/canvas)과 해상도에 따라 최적화된 구현 코드를 출력합니다.

## 워크플로우

### 1단계: 캐릭터 분석 (Character Analysis)

입력된 `character`를 분석해 스프라이트 생성에 필요한 정보를 추출합니다.

**분석 항목:**
- 전체 실루엣 및 외곽선 형태
- 주요 색상 목록 (팔레트 추출)
- 움직임이 필요한 파츠 분리:
  - 고정 파츠: 몸통, 머리 기본형
  - 움직임 파츠: 팔, 다리, 머리카락, 꼬리, 망토
- 캐릭터 크기 비율 (머리:몸)
- 특수 요소 존재 여부 (날개, 무기, 이펙트)

파츠 분리 SVG 예시:
```svg
<svg viewBox="0 0 32 32">
  <g id="part-shadow">...</g>
  <g id="part-legs">...</g>
  <g id="part-body">...</g>   <!-- 고정 -->
  <g id="part-arm-l">...</g>  <!-- 움직임 -->
  <g id="part-arm-r">...</g>  <!-- 움직임 -->
  <g id="part-head">...</g>   <!-- 고정 -->
  <g id="part-hair">...</g>   <!-- 움직임 (약간) -->
</svg>
```

### 2단계: 해상도 결정 (Resolution Guide)

`resolution` 인수 또는 캐릭터 복잡도에 따라 해상도를 결정합니다.

| 해상도 | 용도 | 디테일 수준 | 권장 색상 수 |
|--------|------|------------|------------|
| **16x16** | 극미니멀, 맵 아이콘 | 핵심 실루엣만 | 4~6색 |
| **32x32** | 표준 게임 스프라이트 | 기본 디테일 | 8~16색 |
| **64x64** | HD 게임, 웹 게임 | 중간 디테일 | 16~32색 |
| **128x128** | 상세 캐릭터, UI 초상화 | 높은 디테일 | 32~64색 |

해상도별 1픽셀의 의미:
- 16x16: 1픽셀 = 눈 전체
- 32x32: 1픽셀 = 눈동자 하이라이트
- 64x64: 1픽셀 = 속눈썹 한 올
- 128x128: 1픽셀 = 얼굴 미세 음영

### 3단계: 기본 포즈 (Idle Frame)

모든 스프라이트의 기준이 되는 idle 포즈를 먼저 생성합니다.

**Idle 포즈 원칙:**
- 자연스러운 휴식 자세 (S-커브 또는 약간의 무게 이동)
- 완전한 좌우 대칭은 피함 (한쪽 무릎 약간 굽힘)
- 이 프레임이 스프라이트시트의 첫 번째 프레임

**포맷별 Idle 구현:**

**Canvas pixel 방식:**
```javascript
// 32x32 idle 스프라이트 픽셀 데이터
function drawIdle(ctx, x, y, palette) {
  const { primary, secondary, skin, outline } = palette;

  // 머리 (8x8 영역, y=2~10)
  fillRect(ctx, x+12, y+2, 8, 8, skin);
  // 눈
  setPixel(ctx, x+14, y+5, outline);
  setPixel(ctx, x+17, y+5, outline);
  // 몸통 (10x10 영역, y=10~20)
  fillRect(ctx, x+11, y+10, 10, 10, primary);
  // 팔 (각 4x8)
  fillRect(ctx, x+7, y+11, 4, 8, primary);
  fillRect(ctx, x+21, y+11, 4, 8, primary);
  // 다리 (각 4x8)
  fillRect(ctx, x+11, y+20, 5, 8, secondary);
  fillRect(ctx, x+16, y+20, 5, 8, secondary);
}

function setPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

function fillRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
```

**SVG vector 방식:**
```svg
<!-- 32x32 idle 프레임 SVG -->
<svg id="idle-frame-0" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g id="shadow">
    <ellipse cx="16" cy="31" rx="7" ry="1.5" fill="rgba(0,0,0,0.2)"/>
  </g>
  <g id="body" fill="#2C4A8C" stroke="#1A1A2E" stroke-width="0.8">
    <rect x="11" y="14" width="10" height="10" rx="2"/>
  </g>
  <g id="arms" fill="#2C4A8C" stroke="#1A1A2E" stroke-width="0.8">
    <rect x="7" y="14" width="4" height="8" rx="1.5"/>   <!-- 왼팔 -->
    <rect x="21" y="14" width="4" height="8" rx="1.5"/>  <!-- 오른팔 -->
  </g>
  <g id="legs" fill="#1A2E5A" stroke="#1A1A2E" stroke-width="0.8">
    <rect x="11" y="24" width="4" height="6" rx="1.5"/>  <!-- 왼다리 -->
    <rect x="17" y="24" width="4" height="6" rx="1.5"/>  <!-- 오른다리 -->
  </g>
  <g id="head">
    <circle cx="16" cy="9" r="6" fill="#F4C794" stroke="#1A1A2E" stroke-width="0.8"/>
    <circle cx="14" cy="9" r="1" fill="#1A1A2E"/>
    <circle cx="18" cy="9" r="1" fill="#1A1A2E"/>
  </g>
</svg>
```

### 4단계: 추가 포즈 생성 (Animation Frames)

Idle 기준으로 각 애니메이션 포즈를 생성합니다.

**기본 포즈 세트 (최소 권장):**

| 애니메이션 | 프레임 수 | 설명 |
|-----------|---------|------|
| idle | 2~4 | 미세한 상하 호흡 움직임 |
| walk | 4~8 | 걷기 사이클 |
| run | 4~6 | 달리기 사이클 |
| jump | 3 | 도약→최고점→착지 |
| attack | 3~5 | 예비→타격→회복 |
| hurt | 2 | 피격 반응 |
| death | 4~6 | 쓰러짐 |

**Walk 사이클 핵심 프레임 (4프레임 기준):**
```
프레임 0: 기본 서기 (중립)
프레임 1: 오른발 앞, 왼발 뒤, 몸 약간 왼쪽 기울기
프레임 2: 중립 (양발 교차)
프레임 3: 왼발 앞, 오른발 뒤, 몸 약간 오른쪽 기울기
```

### 5단계: 스프라이트시트 조립 (Sprite Sheet Layout)

프레임들을 하나의 스프라이트시트로 조립합니다.

**레이아웃 방식:**
- 가로 스트립: 한 줄에 한 애니메이션 (`frameWidth * frameCount` x `frameHeight`)
- 그리드: 모든 프레임을 정사각형 그리드로 배치

**Canvas 스프라이트시트 생성:**
```javascript
class SpriteSheet {
  constructor(frameWidth, frameHeight, framesPerRow) {
    this.fw = frameWidth;
    this.fh = frameHeight;
    this.fpr = framesPerRow;
    this.frames = [];
  }

  addFrame(drawFn) {
    const offscreen = new OffscreenCanvas(this.fw, this.fh);
    const ctx = offscreen.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx);
    this.frames.push(offscreen);
    return this;
  }

  export() {
    const cols = this.fpr;
    const rows = Math.ceil(this.frames.length / cols);
    const canvas = document.createElement('canvas');
    canvas.width = cols * this.fw;
    canvas.height = rows * this.fh;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    this.frames.forEach((frame, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      ctx.drawImage(frame, col * this.fw, row * this.fh);
    });

    return canvas;
  }

  toDataURL() {
    return this.export().toDataURL('image/png');
  }
}

// 사용 예시
const sheet = new SpriteSheet(32, 32, 4);
sheet.addFrame(ctx => drawIdle(ctx, 0, 0, palette));
sheet.addFrame(ctx => drawWalk1(ctx, 0, 0, palette));
sheet.addFrame(ctx => drawWalk2(ctx, 0, 0, palette));
sheet.addFrame(ctx => drawWalk3(ctx, 0, 0, palette));
```

**CSS 스프라이트 방식:**
```css
.sprite {
  width: 32px;
  height: 32px;
  background-image: url('sprite-sheet.png');
  background-size: 128px 32px; /* 4 frames x 1 row */
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

.sprite-idle   { background-position: 0px 0px; }
.sprite-walk-1 { background-position: -32px 0px; }
.sprite-walk-2 { background-position: -64px 0px; }
.sprite-walk-3 { background-position: -96px 0px; }

/* 애니메이션 */
@keyframes walk {
  0%   { background-position: 0px 0px; }
  25%  { background-position: -32px 0px; }
  50%  { background-position: -64px 0px; }
  75%  { background-position: -96px 0px; }
  100% { background-position: 0px 0px; }
}

.sprite.walking {
  animation: walk 0.4s steps(1) infinite;
}
```

### 6단계: 게임 엔진 통합 (Engine Integration)

생성된 스프라이트시트를 게임 프레임워크에 연동하는 코드를 출력합니다.

**Phaser 3 통합:**
```javascript
// Preload
this.load.spritesheet('character', 'sprite-sheet.png', {
  frameWidth: 32,
  frameHeight: 32
});

// Create
this.anims.create({
  key: 'idle',
  frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
  frameRate: 4,
  repeat: -1
});

this.anims.create({
  key: 'walk',
  frames: this.anims.generateFrameNumbers('character', { start: 4, end: 11 }),
  frameRate: 8,
  repeat: -1
});

const player = this.add.sprite(100, 100, 'character');
player.anims.play('idle');
```

**PixiJS 통합:**
```javascript
import * as PIXI from 'pixi.js';

const texture = PIXI.Texture.from('sprite-sheet.png');
const frames = [];
const FRAME_W = 32, FRAME_H = 32, COLS = 4;

for (let i = 0; i < 8; i++) {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  frames.push(new PIXI.Texture(
    texture.baseTexture,
    new PIXI.Rectangle(col * FRAME_W, row * FRAME_H, FRAME_W, FRAME_H)
  ));
}

const sprite = new PIXI.AnimatedSprite(frames);
sprite.animationSpeed = 0.15;
sprite.play();
app.stage.addChild(sprite);
```

---

## 히트박스 / 콜리전 정의

스프라이트와 함께 히트박스를 정의합니다.

```javascript
// 히트박스 스펙 (프레임 크기 기준 비율로 정의)
const hitboxes = {
  idle: {
    body:   { x: 0.25, y: 0.20, w: 0.50, h: 0.60 }, // 주요 충돌 영역
    head:   { x: 0.30, y: 0.02, w: 0.40, h: 0.30 }, // 머리 (취약점)
    feet:   { x: 0.28, y: 0.80, w: 0.44, h: 0.18 }, // 발 (지면 판정)
  },
  attack: {
    body:   { x: 0.25, y: 0.20, w: 0.50, h: 0.60 },
    weapon: { x: 0.70, y: 0.30, w: 0.30, h: 0.25 }, // 무기 공격 범위
  }
};

// 절대 픽셀 값으로 변환
function toAbsolute(box, frameW, frameH) {
  return {
    x: box.x * frameW,
    y: box.y * frameH,
    w: box.w * frameW,
    h: box.h * frameH
  };
}
```

---

## 포맷별 출력 요약

| format | 출력 | 장점 | 단점 |
|--------|------|------|------|
| `pixel` | Canvas PNG 데이터 | 파일 크기 최소 | 확대 시 픽셀화 |
| `vector` | SVG 프레임 세트 | 해상도 무관 | 복잡한 캐릭터에 용량 큼 |
| `canvas` | JS 드로우 코드 | 런타임 생성 | CPU 비용 |

---

## Do

- Idle 포즈를 먼저 완성하고 이를 기준으로 나머지 애니메이션 프레임을 파생시킨다
- 각 파트(몸통, 팔, 다리, 머리카락)를 별도 `<g>` 레이어로 분리해 이후 수정을 쉽게 한다
- 히트박스를 스프라이트 크기 기준 비율로 정의해 해상도 변경에도 대응 가능하게 한다
- CSS에서 `image-rendering: pixelated`를 적용해 픽셀 스프라이트가 흐리게 확대되지 않도록 한다

## Don't

- 스프라이트시트 없이 개별 PNG를 프레임마다 로드한다 — HTTP 요청이 폭발적으로 증가한다
- 프레임 크기를 불규칙하게 혼용한다 — 엔진 통합 시 좌표 계산이 어긋난다
- Walk 사이클에서 팔과 다리를 같은 방향으로 흔든다 — 반드시 반대 방향(오른발 앞 = 왼팔 앞)을 유지한다
- 해상도를 필요 이상으로 높게 잡는다 — 32x32로 충분한 캐릭터를 128x128로 만들면 불필요한 용량이 생긴다
