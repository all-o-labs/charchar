---
name: animate-char
description: Add life to a character with frame-by-frame or CSS animations — idle, walk, run, attack and more
user-invocable: true
args:
  - name: character
    description: Character SVG, sprite sheet reference, or design file to animate
    required: true
  - name: animation_type
    description: "Animation to generate — idle | walk | run | attack | hurt | death | jump (default: idle)"
    required: false
  - name: fps
    description: Frames per second for the animation (default varies by type)
    required: false
category: 강화
license: MIT
---


# animate-char

캐릭터에 생동감을 불어넣는 애니메이션을 생성합니다. 디즈니의 12가지 애니메이션 원칙을 게임/웹 캐릭터에 맞게 적용하고, CSS `@keyframes`, Canvas `requestAnimationFrame`, 스프라이트시트 기반 애니메이션 코드를 출력합니다.

## 디즈니 12원칙 (게임 적용 버전)

| 원칙 | 게임 적용 |
|------|---------|
| **Squash & Stretch** | 착지 시 몸체 납작해짐, 점프 시 길게 늘어남 |
| **Anticipation** | 공격 전 뒤로 당기기, 점프 전 쪼그림 |
| **Staging** | 가장 중요한 동작을 실루엣으로 읽히게 |
| **Straight Ahead** | idle, walk: 첫 프레임부터 순서대로 |
| **Ease In/Out** | 동작 시작/끝은 천천히, 중간은 빠르게 |
| **Arcs** | 팔, 다리는 직선이 아닌 호를 그리며 이동 |
| **Secondary Action** | 머리카락, 망토, 귀가 주요 동작에 따라 반응 |
| **Timing** | fps와 프레임 수로 동작의 무게감 결정 |
| **Exaggeration** | 실제보다 과장해야 자연스럽게 보임 |
| **Solid Drawing** | 각 프레임이 3D 형태감을 유지 |
| **Appeal** | 캐릭터의 개성이 움직임에도 드러남 |
| **Follow Through** | 동작 후 관성: 멈춰도 머리카락/옷은 계속 움직임 |

---

## 애니메이션 유형별 가이드

### Idle (대기 애니메이션)

**목표**: 살아있음을 느끼게 하는 최소한의 움직임. 2~4프레임이 이상적.

**기본 FPS**: 4~6 fps (느리고 부드럽게)

**핵심 움직임:**
- 호흡에 의한 미세한 상하 이동 (1~2픽셀)
- 눈 깜빡임 (타이밍: 3~4초에 한 번)
- 무게 중심의 좌우 이동 (아주 미세하게)

**4프레임 Idle 구성:**
```
프레임 0 (0ms):   기준 포즈 - 중립
프레임 1 (200ms): 살짝 위 (+1px 몸통, +1px 머리)
프레임 2 (400ms): 중립으로 복귀
프레임 3 (600ms): 살짝 아래 (-1px), 눈 깜빡임 시작
→ 다시 프레임 0으로 (총 800ms 사이클)
```

**CSS @keyframes Idle:**
```css
@keyframes char-idle {
  0%, 100% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-1px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(1px);
  }
}

@keyframes char-idle-blink {
  0%, 85%, 100% { transform: scaleY(1); }
  90%           { transform: scaleY(0.1); }
  95%           { transform: scaleY(1); }
}

.character-idle {
  animation: char-idle 1.2s ease-in-out infinite;
}

.character-idle .eyes {
  animation: char-idle-blink 4s ease-in-out infinite;
  transform-origin: center;
}
```

**SVG 기반 Idle (SMIL 애니메이션):**
```svg
<g id="character-body">
  <animateTransform
    attributeName="transform"
    type="translate"
    values="0,0; 0,-1; 0,0; 0,1; 0,0"
    dur="1.2s"
    repeatCount="indefinite"
    calcMode="spline"
    keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>
  <!-- 캐릭터 요소들 -->
</g>

<!-- 눈 깜빡임 -->
<g id="character-eyes">
  <animateTransform
    attributeName="transform"
    type="scale"
    values="1,1; 1,1; 1,1; 1,1; 1,1; 1,1; 1,1; 1,1; 1,0.1; 1,1"
    dur="4s"
    repeatCount="indefinite"/>
</g>
```

**Canvas requestAnimationFrame Idle:**
```javascript
class IdleAnimation {
  constructor(character, fps = 4) {
    this.character = character;
    this.fps = fps;
    this.frameInterval = 1000 / fps;
    this.frames = this.buildFrames();
    this.currentFrame = 0;
    this.lastTime = 0;
    this.elapsed = 0;
  }

  buildFrames() {
    // 4프레임 idle: 오프셋 Y값 배열
    return [
      { bodyOffsetY: 0,  eyeScale: 1.0 },
      { bodyOffsetY: -1, eyeScale: 1.0 },
      { bodyOffsetY: 0,  eyeScale: 1.0 },
      { bodyOffsetY: 1,  eyeScale: 0.1 }, // 눈 깜빡임 프레임
    ];
  }

  update(timestamp) {
    this.elapsed += timestamp - this.lastTime;
    this.lastTime = timestamp;

    if (this.elapsed >= this.frameInterval) {
      this.elapsed = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }

  draw(ctx, x, y) {
    const frame = this.frames[this.currentFrame];
    ctx.save();
    ctx.translate(x, y + frame.bodyOffsetY);
    this.character.draw(ctx, { eyeScaleY: frame.eyeScale });
    ctx.restore();
  }
}
```

---

### Walk (걷기 애니메이션)

**기본 FPS**: 8 fps (4프레임 루프)

**핵심 규칙:**
- 팔과 다리는 반대 방향으로 스윙 (오른발 앞 = 왼팔 앞)
- 몸통은 걸음마다 좌우로 약간 기울기 (5~10도)
- 머리는 수직으로 약간 상하 바운스
- Contact → Down → Pass → Up 4단계 사이클

**8프레임 Walk 상세:**
```
프레임 0 (Contact L): 왼발 앞 착지, 오른팔 앞
프레임 1 (Down):      왼발 눌림, 몸 최저점
프레임 2 (Pass):      양발 교차, 몸 기본
프레임 3 (Up):        오른발 앞으로, 몸 최고점
프레임 4 (Contact R): 오른발 앞 착지, 왼팔 앞
프레임 5 (Down):      오른발 눌림, 몸 최저점
프레임 6 (Pass):      양발 교차, 몸 기본
프레임 7 (Up):        왼발 앞으로, 몸 최고점
```

**CSS 스프라이트 Walk:**
```css
@keyframes walk-sprite {
  0%    { background-position: 0px 0px; }
  12.5% { background-position: -32px 0px; }
  25%   { background-position: -64px 0px; }
  37.5% { background-position: -96px 0px; }
  50%   { background-position: -128px 0px; }
  62.5% { background-position: -160px 0px; }
  75%   { background-position: -192px 0px; }
  87.5% { background-position: -224px 0px; }
  100%  { background-position: 0px 0px; }
}

.character.walking {
  animation: walk-sprite 0.5s steps(1, end) infinite;
}
```

**CSS 절차적 Walk (스프라이트 없이):**
```css
@keyframes walk-body {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25%       { transform: translateY(-2px) rotate(-2deg); }
  50%       { transform: translateY(0) rotate(0deg); }
  75%       { transform: translateY(-2px) rotate(2deg); }
}

@keyframes walk-leg-left {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-30deg); }
  50%       { transform: rotate(0deg); }
  75%       { transform: rotate(30deg); }
}

@keyframes walk-leg-right {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(30deg); }
  50%       { transform: rotate(0deg); }
  75%       { transform: rotate(-30deg); }
}

.char-body    { animation: walk-body 0.5s ease-in-out infinite; }
.char-leg-l   { animation: walk-leg-left 0.5s ease-in-out infinite; transform-origin: top center; }
.char-leg-r   { animation: walk-leg-right 0.5s ease-in-out infinite; transform-origin: top center; }
.char-arm-l   { animation: walk-leg-right 0.5s ease-in-out infinite; transform-origin: top center; }
.char-arm-r   { animation: walk-leg-left 0.5s ease-in-out infinite; transform-origin: top center; }
```

---

### Run (달리기 애니메이션)

**기본 FPS**: 12 fps (4~6프레임)

**Walk와의 차이:**
- 더 큰 팔다리 스윙 각도 (Walk의 1.5~2배)
- 몸통이 앞으로 기울어짐 (10~20도)
- 공중에 뜨는 프레임 존재 (양발이 지면에서 떨어짐)
- 더 과장된 스쿼시&스트레치

**4프레임 Run 구성:**
```
프레임 0: 왼발 착지 (Squash - 살짝 납작)
프레임 1: 추진 (몸 기울기 최대)
프레임 2: 공중 (양발 지면 이탈, Stretch - 살짝 늘어남)
프레임 3: 오른발 착지 (Squash)
```

---

### Attack (공격 애니메이션)

**기본 FPS**: 12~15 fps (3~5프레임)

**3단계 필수 구조:**

1. **예비 동작 (Anticipation)**: 공격 반대 방향으로 후퇴
   - 칼 공격: 칼을 뒤로 당김
   - 마법: 손을 가슴으로 모음
   - 펀치: 주먹을 뒤로

2. **타격 (Strike)**: 가장 빠른 프레임, 이펙트 최대
   - 이 프레임이 히트박스 활성화 구간
   - 모션 블러 효과 (잔상 1~2픽셀)

3. **회복 (Recovery)**: 공격 후 기본 포즈로 복귀
   - Follow Through: 관성에 의한 오버슈팅
   - 다시 Ease Out으로 정지

**CSS 공격 애니메이션:**
```css
@keyframes char-attack {
  0%   { transform: translateX(0) rotate(0deg); }        /* 기준 */
  20%  { transform: translateX(-4px) rotate(-15deg); }   /* 예비 (뒤로 당김) */
  50%  { transform: translateX(8px) rotate(20deg); }     /* 타격 (빠르게) */
  65%  { transform: translateX(10px) rotate(25deg); }    /* 오버슈팅 */
  100% { transform: translateX(0) rotate(0deg); }        /* 회복 */
}

.character.attacking .weapon-arm {
  animation: char-attack 0.3s cubic-bezier(0.25, 0, 0.0, 1.0) forwards;
  transform-origin: shoulder;
}

/* 히트 이펙트 */
@keyframes hit-effect {
  0%   { opacity: 1; transform: scale(0.5); }
  50%  { opacity: 1; transform: scale(1.5); }
  100% { opacity: 0; transform: scale(2.0); }
}

.hit-effect {
  animation: hit-effect 0.2s ease-out forwards;
}
```

---

## 타이밍 / 이징 가이드

### 동작별 이징 커브

```css
/* 중력 영향 받는 동작 (점프, 낙하) */
.gravity-motion {
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 기계적 동작 (로봇, 자동화) */
.mechanical-motion {
  animation-timing-function: steps(1, end); /* 스냅 */
}

/* 탄력있는 동작 (치비, 카툰) */
.bouncy-motion {
  animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* 공격처럼 빠른 동작 */
.snap-motion {
  animation-timing-function: cubic-bezier(0.25, 0, 0.0, 1.0);
}

/* 자연스러운 동작 (기본) */
.natural-motion {
  animation-timing-function: ease-in-out;
}
```

### FPS별 동작 느낌

| FPS | 프레임 간격 | 느낌 | 적합한 동작 |
|-----|-----------|------|-----------|
| 2~4 | 250~500ms | 느리고 무거움 | idle 호흡, 느린 NPC |
| 6~8 | 125~167ms | 자연스러운 걸음 | walk, 느린 공격 |
| 10~12 | 83~100ms | 활기찬 동작 | run, 빠른 공격 |
| 15~24 | 42~67ms | 유동적, 영화적 | 특수 이펙트 |
| 30+ | <33ms | 완전히 부드러움 | CSS 전환 애니메이션 |

---

## 스프라이트시트 기반 프레임 애니메이션

```javascript
class FrameAnimator {
  constructor(spritesheet, animationDefs) {
    this.sheet = spritesheet;
    this.anims = animationDefs;
    this.current = 'idle';
    this.frame = 0;
    this.elapsed = 0;
  }

  play(name, { loop = true, onComplete } = {}) {
    if (this.current === name) return;
    this.current = name;
    this.frame = 0;
    this.elapsed = 0;
    this.loop = loop;
    this.onComplete = onComplete;
  }

  update(deltaMs) {
    const anim = this.anims[this.current];
    if (!anim) return;

    this.elapsed += deltaMs;
    const frameDuration = 1000 / anim.fps;

    if (this.elapsed >= frameDuration) {
      this.elapsed -= frameDuration;
      this.frame++;

      if (this.frame >= anim.frames.length) {
        if (this.loop) {
          this.frame = 0;
        } else {
          this.frame = anim.frames.length - 1;
          this.onComplete?.();
        }
      }
    }
  }

  draw(ctx, x, y) {
    const anim = this.anims[this.current];
    const frameIndex = anim.frames[this.frame];
    const fw = anim.frameWidth;
    const fh = anim.frameHeight;
    const sx = (frameIndex % anim.cols) * fw;
    const sy = Math.floor(frameIndex / anim.cols) * fh;

    ctx.drawImage(this.sheet, sx, sy, fw, fh, x, y, fw, fh);
  }
}

// 사용 예시
const animator = new FrameAnimator(spritesheet, {
  idle:   { frames: [0, 1, 2, 3],         fps: 4,  frameWidth: 32, frameHeight: 32, cols: 4 },
  walk:   { frames: [4, 5, 6, 7, 8, 9, 10, 11], fps: 8, frameWidth: 32, frameHeight: 32, cols: 4 },
  attack: { frames: [12, 13, 14, 15],      fps: 12, frameWidth: 32, frameHeight: 32, cols: 4 },
  hurt:   { frames: [16, 17],              fps: 10, frameWidth: 32, frameHeight: 32, cols: 4 },
});

// 게임 루프 연동
function gameLoop(timestamp) {
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  animator.update(delta);
  animator.draw(ctx, playerX, playerY);

  requestAnimationFrame(gameLoop);
}

---

## Do

- Squash & Stretch와 Anticipation을 핵심 동작(점프, 공격)에 반드시 적용한다
- 루프 애니메이션의 첫 프레임과 마지막 프레임을 동일하게 맞춰 자연스럽게 연결한다
- 동작 시작/끝에는 ease-in/out을 적용하고 중간 구간은 빠르게 유지한다
- 공격 같은 단발성 애니메이션에는 Follow Through(관성 오버슈팅)를 넣어 무게감을 부여한다

## Don't

- 모든 프레임에 동일한 간격을 사용한다 — linear 타이밍은 기계적으로 보인다
- easing 없이 직선 움직임만 사용한다 — arc(호 궤적)가 없으면 동작이 딱딱해진다
- idle 애니메이션에 과도한 프레임을 넣는다 — 2~4프레임으로 충분하며 많을수록 산만해진다
- 공격 전 Anticipation(예비 동작)을 생략한다 — 예비 없이 바로 타격하면 임팩트가 없어 보인다
```

---

## GSAP / Lottie 연동

**GSAP 연동 (SVG 캐릭터):**
```javascript
import { gsap } from 'gsap';

// Idle 타임라인
const idleTL = gsap.timeline({ repeat: -1, yoyo: true });
idleTL
  .to('#char-body', { y: -2, duration: 0.6, ease: 'sine.inOut' })
  .to('#char-hair', { rotation: 2, duration: 0.6, ease: 'sine.inOut' }, '<');

// Attack 시퀀스
function playAttack() {
  const attackTL = gsap.timeline();
  attackTL
    .to('#char-weapon-arm', { rotation: -30, duration: 0.1, ease: 'power2.in' })  // 예비
    .to('#char-weapon-arm', { rotation: 45, duration: 0.08, ease: 'power4.out' }) // 타격
    .to('#hit-effect', { scale: 1.5, opacity: 0, duration: 0.15 }, '<0.05')       // 이펙트
    .to('#char-weapon-arm', { rotation: 0, duration: 0.2, ease: 'back.out(1.5)' });// 회복
}
```

**Lottie 연동:**
```javascript
import lottie from 'lottie-web';

const anim = lottie.loadAnimation({
  container: document.getElementById('character-container'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'character-idle.json' // Bodymovin/AE 익스포트
});

// 상태 전환
function switchToWalk() {
  anim.stop();
  lottie.loadAnimation({
    container: document.getElementById('character-container'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'character-walk.json'
  });
}
```
