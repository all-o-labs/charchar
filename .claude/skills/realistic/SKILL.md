---
name: realistic
description: Apply realistic 7.5-8 head proportions with anatomy, lighting, and texture rendering
user-invocable: true
args:
  - name: character
    description: 사실적으로 그릴 캐릭터 이름 또는 설명
    required: true
  - name: detail_level
    description: "디테일 수준 (basic|detailed|photorealistic, 기본값: basic)"
    required: false
category: 스타일
license: MIT
---


# realistic — 사실적 캐릭터 렌더링 가이드

`/realistic character="캐릭터명" detail_level="basic"` 명령을 받으면
아래 가이드에 따라 해부학적으로 정확한 사실적 캐릭터를 생성합니다.

---

## 1. 7.5–8등신 해부학 비율

전체 신장을 머리 높이 단위(H)로 분할합니다.

```
0H   ─── 두정부 (정수리)
1H   ─── 턱
1.5H ─── 어깨 (쇄골 하단)
2H   ─── 가슴 중앙 / 겨드랑이
3H   ─── 배꼽
3.5H ─── 골반 상단 (ASIS)
4H   ─── 사타구니 / 대퇴골두
5H   ─── 무릎 중앙
6H   ─── 종아리 중앙
7H   ─── 발목
7.5H ─── 발바닥 (7.5등신)
8H   ─── 발바닥 (8등신, 패션/히어로)
```

```typescript
interface RealisticProportions {
  totalHeads: 7.5 | 8;
  // 각 랜드마크의 H 단위 위치
  landmarks: {
    chin: 1;
    shoulder: 1.5;
    chest: 2;
    navel: 3;
    pelvis: 3.5;
    crotch: 4;
    knee: 5;
    ankle: 7;
    floor: 7.5 | 8;
  };
  // 너비 비율 (어깨 너비를 1로 정규화)
  widths: {
    head: 0.42;       // 어깨 대비 머리 폭
    shoulder: 1.0;
    waist: 0.65;      // 남성 0.72, 여성 0.58
    hip: 0.90;        // 남성 0.82, 여성 0.95
  };
}
```

---

## 2. 디테일 수준별 구현

### 2-1. basic

SVG로 윤곽선 + 단순 면 처리:

```svg
<svg viewBox="0 0 200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      :root {
        --skin-base: #f0c8a0;
        --skin-shadow: #d4956a;
        --hair: #3d2b1f;
        --cloth: #4a6fa5;
      }
    </style>
  </defs>

  <!-- 머리 -->
  <ellipse cx="100" cy="50" rx="42" ry="48" fill="var(--skin-base)" stroke="var(--skin-shadow)" stroke-width="1" />

  <!-- 목 -->
  <rect x="88" y="95" width="24" height="20" fill="var(--skin-base)" />

  <!-- 어깨/몸통 -->
  <path d="M 40,115 C 40,110 88,108 88,108 L 112,108 C 112,108 160,110 160,115 L 155,300 L 45,300 Z"
        fill="var(--cloth)" />
</svg>
```

### 2-2. detailed

Canvas API + 그라디언트로 명암 처리:

```typescript
function drawRealisticFace(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  // 피부 기본 그라디언트
  const skinGrad = ctx.createRadialGradient(
    x + scale * 0.45, y + scale * 0.35, scale * 0.1,
    x + scale * 0.5,  y + scale * 0.5,  scale * 0.5,
  );
  skinGrad.addColorStop(0,   '#fde8cb'); // 하이라이트
  skinGrad.addColorStop(0.6, '#f0c8a0'); // 미드톤
  skinGrad.addColorStop(1,   '#c4845a'); // 섀도우

  ctx.beginPath();
  ctx.ellipse(x + scale * 0.5, y + scale * 0.5, scale * 0.42, scale * 0.48, 0, 0, Math.PI * 2);
  ctx.fillStyle = skinGrad;
  ctx.fill();

  // 눈 소켓 그림자
  const eyeSocketGrad = ctx.createRadialGradient(
    x + scale * 0.35, y + scale * 0.42, 0,
    x + scale * 0.35, y + scale * 0.42, scale * 0.12,
  );
  eyeSocketGrad.addColorStop(0,   'rgba(80,40,20,0.3)');
  eyeSocketGrad.addColorStop(1,   'rgba(80,40,20,0)');
  ctx.fillStyle = eyeSocketGrad;
  ctx.beginPath();
  ctx.ellipse(x + scale * 0.35, y + scale * 0.42, scale * 0.12, scale * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();
}
```

### 2-3. photorealistic

WebGL / Three.js PBR 재질 설정:

```typescript
import * as THREE from 'three';

// 피부 PBR 재질
const skinMaterial = new THREE.MeshStandardMaterial({
  map:              skinColorTexture,        // Albedo (베이스 컬러)
  normalMap:        skinNormalTexture,       // 모공/주름 법선 맵
  roughnessMap:     skinRoughnessTexture,    // 피지선 분포
  roughness:        0.7,
  metalness:        0.0,
  // 서브서피스 스캐터링 근사
  // (실제 SSS는 커스텀 셰이더 필요)
  emissiveMap:      skinSSSTexture,
  emissive:         new THREE.Color(0.05, 0.02, 0.01),
  emissiveIntensity: 0.15,
});

// 머리카락 재질
const hairMaterial = new THREE.MeshStandardMaterial({
  map:          hairColorTexture,
  alphaMap:     hairAlphaTexture,  // 가장자리 투명도
  transparent:  true,
  alphaTest:    0.3,
  roughness:    0.5,
  metalness:    0.0,
  side:         THREE.DoubleSide,  // 앞뒤 모두 렌더링
});
```

---

## 3. 광원/명암 처리

```typescript
// 3-point lighting (사실적 캐릭터 표준)
const lighting = {
  key: {
    position: [1.5, 2.0, 2.0],   // 우상단 앞
    intensity: 1.0,
    color: 0xfff5e4,              // 따뜻한 흰색
  },
  fill: {
    position: [-2.0, 0.5, 1.0],  // 좌측 보조
    intensity: 0.4,
    color: 0xd0e8ff,              // 차가운 흰색
  },
  rim: {
    position: [0, 1.0, -3.0],    // 뒤쪽 윤곽
    intensity: 0.6,
    color: 0xffffff,
  },
};

// 명암 단계 (5단계)
const SHADING_STOPS = [
  { value: 0.0, label: 'ambient',   color: '#8b4a2b' },  // 최대 그림자
  { value: 0.3, label: 'shadow',    color: '#c4845a' },
  { value: 0.6, label: 'midtone',   color: '#f0c8a0' },  // 기본 피부색
  { value: 0.8, label: 'highlight', color: '#fde8cb' },
  { value: 1.0, label: 'specular',  color: '#ffffff' },  // 반사 하이라이트
];
```

---

## 4. 피부/머리카락/옷감 텍스처

### 피부

```typescript
// Canvas 기반 절차적 피부 텍스처
function generateSkinTexture(width: number, height: number): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const noise = Math.random() * 8 - 4; // ±4 노이즈
    data[i * 4 + 0] = 240 + noise; // R
    data[i * 4 + 1] = 200 + noise; // G
    data[i * 4 + 2] = 160 + noise; // B
    data[i * 4 + 3] = 255;
  }
  return new ImageData(data, width, height);
}
```

### 머리카락

- 개별 가닥보다 레이어드 면 사용 (퍼포먼스)
- 광원 방향으로 롤(roll) 하이라이트 추가
- 알파 마스크로 외곽 처리

### 옷감

```typescript
const fabricTypes = {
  cotton:  { roughness: 0.9, metalness: 0.0, specularIntensity: 0.1 },
  silk:    { roughness: 0.3, metalness: 0.0, specularIntensity: 0.8 },
  leather: { roughness: 0.5, metalness: 0.1, specularIntensity: 0.6 },
  metal:   { roughness: 0.2, metalness: 1.0, specularIntensity: 1.0 },
};
```

---

## 5. Do/Don't

| Do | Don't |
|----|-------|
| 머리 크기를 전체의 1/7.5–1/8로 유지 | 치비처럼 머리를 크게 그리기 |
| 그림자를 5단계 이상으로 부드럽게 | 흑/백 2단계 명암만 사용 |
| 눈을 두상 높이의 절반 위치에 배치 | 눈을 너무 위나 아래에 배치 |
| 귀를 눈-코 사이 높이에 배치 | 귀 위치를 임의로 설정 |
| 어깨 폭이 골반 폭의 약 1.1배 (남성) | 어깨와 골반을 같은 너비로 그리기 |
| 손이 얼굴 길이와 비슷한 크기 | 손을 지나치게 작게 표현 |

**체크리스트**:
- [ ] 머리~턱이 전체의 1/7.5 or 1/8인가?
- [ ] 어깨-허리-골반 너비 비율이 적절한가?
- [ ] 광원 방향이 일관되는가?
- [ ] 명암이 최소 3단계 이상인가?
- [ ] 텍스처 해상도가 2의 제곱수인가? (512, 1024, 2048)

---

## Do

- 머리 크기를 전체 신장의 1/7.5~1/8로 유지해 성인 해부학 비율을 지킨다
- 광원을 3-point lighting(key/fill/rim) 구조로 설정하고 모든 부위에 일관되게 적용한다
- 명암을 최소 5단계(ambient/shadow/midtone/highlight/specular)로 부드럽게 표현한다
- 눈을 두상 높이의 절반(50%) 위치에, 귀를 눈-코 사이 높이에 배치한다

## Don't

- 치비처럼 머리를 크게 그린다 — 사실적 스타일에서 머리가 크면 즉시 비율이 어색해진다
- 흑/백 2단계 명암만 사용한다 — 피부의 서브서피스 스캐터링 특성상 최소 3단계 이상이 필요하다
- 손을 얼굴보다 훨씬 작게 그린다 — 사실적 비율에서 손 길이는 얼굴 길이와 비슷하다
- 어깨와 골반을 같은 너비로 그린다 — 남성은 어깨가 골반의 약 1.1배, 여성은 골반이 어깨에 가깝게 표현해야 한다
