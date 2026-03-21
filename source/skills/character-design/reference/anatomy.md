# 캐릭터 해부학 기초 (Character Anatomy Reference)

캐릭터를 코드로 구현할 때 해부학적 이해는 자연스러운 비율과 관절 움직임을 만드는 핵심입니다.

---

## 1. 기본 신체 구조

### 머리 (Head)

머리는 캐릭터 비율의 기준 단위입니다. "1 head" = 머리의 세로 높이.

```
머리 구조 비율 (정면 기준):
  ┌─────────────────┐
  │   이마 (35%)    │  눈의 위치: 머리 높이 중앙선
  ├─────────────────┤  ← 눈
  │   중면 (35%)    │  코 끝: 눈~턱 중간
  ├─────────────────┤  ← 코
  │   하면 (30%)    │  입: 코~턱 1/3 지점
  └─────────────────┘  ← 턱
```

```javascript
const HEAD_INTERNAL_RATIOS = {
  // 눈의 Y 위치 (머리 높이 기준)
  eyeY: 0.45,
  // 눈과 눈 사이 간격 = 눈 너비 1개
  eyeSpacing: 1.0,    // 단위: eye-width
  // 코의 Y 위치
  noseY: 0.65,
  // 입의 Y 위치
  mouthY: 0.78,
  // 귀의 Y 범위
  earTop: 0.42,
  earBottom: 0.65,
};
```

### 몸통 (Torso)

```
성인 기준 몸통 비율:
  어깨 ──────── 2.0 ~ 2.5 heads wide
     │
  가슴 ──────── 1.5 heads (흉곽 최대 너비)
     │ 1.5 heads tall
  허리 ──────── 1.3 ~ 1.8 heads wide
     │
  엉덩이 ────── 1.8 ~ 2.2 heads wide
     │ 0.5 heads tall
```

```javascript
const TORSO_RATIOS = {
  // 몸통 총 높이 = head 단위
  totalHeight: 2.0,
  // 각 부위 너비 (head 단위)
  shoulderWidth: 2.2,
  chestWidth: 1.8,
  waistWidth: 1.5,
  hipWidth: 2.0,
  // 세로 위치 (몸통 높이 기준, 0=어깨, 1=엉덩이)
  chestY: 0.3,
  waistY: 0.65,
  hipY: 1.0,
};
```

### 사지 (Limbs)

```
팔 구조:
  어깨 관절 (shoulder)
    │ 상완 (upper arm) = 1.3 heads
  팔꿈치 관절 (elbow)
    │ 전완 (forearm)   = 1.2 heads
  손목 관절 (wrist)
    │ 손 (hand)        = 0.75 heads

다리 구조:
  고관절 (hip joint)
    │ 대퇴 (thigh)     = 2.0 heads
  무릎 관절 (knee)
    │ 하퇴 (shin)      = 1.8 heads
  발목 관절 (ankle)
    │ 발 (foot)        = 0.5 heads tall, 1.0 heads long
```

```javascript
const LIMB_RATIOS = {
  arm: {
    upperArm: 1.3,    // head 단위
    forearm: 1.2,
    hand: 0.75,
    totalReach: 3.25, // 어깨~손 끝
  },
  leg: {
    thigh: 2.0,
    shin: 1.8,
    foot: { height: 0.5, length: 1.0 },
    totalLength: 3.8,
  },
};
```

---

## 2. 스타일별 해부학 차이

### 카툰 (Cartoon / Stylized)

```
특징:
- 머리가 크다 (1/4 ~ 1/5 신체)
- 눈이 크고 표현적이다
- 사지가 단순화된다
- 과장된 비율이 허용된다

```javascript
const CARTOON_ADJUSTMENTS = {
  headScale: 1.4,         // 기준 대비 머리 크기 배율
  eyeScale: 2.0,          // 눈 크기 배율
  limbSimplification: 0.7, // 관절 디테일 감소
  exaggerationLevel: 0.8,  // 포즈 과장 허용도
  outlineWeight: 'heavy',  // 굵은 외곽선
};
```

### 리얼 (Realistic / Semi-realistic)

```
특징:
- 7~8 등신 기준
- 근육 구조가 보인다
- 관절이 해부학적으로 정확하다
- 손/발 디테일이 중요하다
```

```javascript
const REALISTIC_ADJUSTMENTS = {
  headScale: 1.0,          // 기준 비율 유지
  eyeScale: 1.0,
  muscleDefinition: 'high',
  jointDetail: 'anatomical',
  outlineWeight: 'thin-or-none',
  shadingStyle: 'gradient',
};
```

### 치비 (Chibi / Super-deformed)

```
특징:
- 2 ~ 2.5 등신
- 머리가 몸의 절반 이상
- 팔다리가 매우 짧고 통통
- 얼굴은 단순화되지만 눈이 크다
```

```javascript
const CHIBI_ADJUSTMENTS = {
  headRatio: 1 / 2.2,      // 머리 = 전체의 ~45%
  limbLength: 0.5,          // 기준 대비 팔다리 길이 비율
  bodyWidth: 1.3,           // 몸통 통통함
  eyeScale: 2.5,
  noseVisibility: 'minimal',
  mouthSize: 'small',
  outlineWeight: 'medium',
};
```

---

## 3. 관절 위치와 가동 범위

### SVG 기반 관절 구현

```javascript
// 관절 정의
const JOINTS = {
  // 이름: { 부모, 로컬 위치(부모 기준), 가동 범위(degrees) }
  head:       { parent: 'neck',      localPos: { x: 0, y: 0 },     range: { min: -45, max: 45 } },
  neck:       { parent: 'spine_top', localPos: { x: 0, y: 0 },     range: { min: -30, max: 30 } },
  spine_top:  { parent: 'root',      localPos: { x: 0, y: -1.5 },  range: { min: -20, max: 20 } },
  spine_mid:  { parent: 'root',      localPos: { x: 0, y: -0.8 },  range: { min: -15, max: 15 } },
  hip:        { parent: 'root',      localPos: { x: 0, y: 0 },     range: { min: -30, max: 30 } },

  // 팔
  shoulder_l: { parent: 'spine_top', localPos: { x: -1.1, y: -1.3 }, range: { min: -170, max: 60 } },
  elbow_l:    { parent: 'shoulder_l',localPos: { x: 0, y: -1.3 },    range: { min: 0, max: 150 } },
  wrist_l:    { parent: 'elbow_l',   localPos: { x: 0, y: -1.2 },    range: { min: -60, max: 60 } },

  // 다리
  hip_l:      { parent: 'hip',       localPos: { x: -0.5, y: 0 },    range: { min: -120, max: 30 } },
  knee_l:     { parent: 'hip_l',     localPos: { x: 0, y: -2.0 },    range: { min: -150, max: 0 } },
  ankle_l:    { parent: 'knee_l',    localPos: { x: 0, y: -1.8 },    range: { min: -45, max: 45 } },
};
```

### 가동 범위 제한 함수

```javascript
function clampJointRotation(jointName, angle) {
  const joint = JOINTS[jointName];
  if (!joint) return angle;
  return Math.max(joint.range.min, Math.min(joint.range.max, angle));
}

// 포즈 설정 시 자동으로 관절 범위 체크
function setPose(skeleton, poseData) {
  Object.entries(poseData).forEach(([jointName, rotation]) => {
    const clamped = clampJointRotation(jointName, rotation);
    if (clamped !== rotation) {
      console.warn(`Joint ${jointName}: ${rotation}° → clamped to ${clamped}°`);
    }
    skeleton.setJointRotation(jointName, clamped);
  });
}
```

---

## 4. 무게중심과 포즈 안정성

### 무게중심 계산

```javascript
// 각 신체 파트의 질량 비율 (근사값)
const PART_MASS_RATIOS = {
  head:        0.08,
  torso:       0.43,
  upperArm_l:  0.03,
  forearm_l:   0.02,
  hand_l:      0.01,
  upperArm_r:  0.03,
  forearm_r:   0.02,
  hand_r:      0.01,
  thigh_l:     0.10,
  shin_l:      0.05,
  foot_l:      0.01,
  thigh_r:     0.10,
  shin_r:      0.05,
  foot_r:      0.01,
  // total = 0.95 (반올림)
};

function calculateCenterOfMass(partPositions) {
  let totalMass = 0;
  let weightedX = 0;
  let weightedY = 0;

  Object.entries(partPositions).forEach(([part, pos]) => {
    const mass = PART_MASS_RATIOS[part] || 0;
    totalMass += mass;
    weightedX += pos.x * mass;
    weightedY += pos.y * mass;
  });

  return {
    x: weightedX / totalMass,
    y: weightedY / totalMass,
  };
}

// 안정성 체크: 무게중심이 발 지지면 안에 있는가
function isPoseStable(centerOfMass, footPositions) {
  const supportPolygon = convexHull(footPositions);
  return isPointInPolygon(centerOfMass, supportPolygon);
}
```

### 안정적 포즈 패턴

```javascript
const STABLE_POSES = {
  // 두 발이 어깨 너비로 벌어진 기본 자세
  idle: {
    foot_l: { x: -0.5, y: 0 },
    foot_r: { x: 0.5, y: 0 },
    // 무게중심이 양 발 사이 중앙에 위치
    expectedCOM: { x: 0, y: 0 },
  },
  // 한 발로 서기 (불안정 → 다른 요소로 균형)
  oneleg: {
    foot_l: { x: -0.1, y: 0 },
    foot_r: { x: -0.1, y: -0.5 }, // 들린 발
    // 팔을 벌려 균형 보정 필요
    requiresArmBalance: true,
  },
  // 액션 포즈 (의도적 불안정 = 동적인 느낌)
  attack: {
    stabilityNote: '의도적 불안정 - 움직임 중을 표현',
    addMotionBlur: true,
  },
};
```

---

## 5. 코드에서 신체 파트 구조화

### SVG Group 명명 컨벤션

```svg
<!-- 전체 캐릭터 -->
<g id="char-{character-id}" class="character" data-char-id="{id}">

  <!-- 신체 레이어 그룹 -->
  <g class="char-layer char-layer-shadow">...</g>
  <g class="char-layer char-layer-body-back">

    <!-- 파트별 그룹: char-{part}-{side?} -->
    <g class="char-part" data-part="hair-back">...</g>
    <g class="char-part" data-part="arm-upper-l">
      <!-- 관절 피벗 포인트 -->
      <g class="joint-pivot" data-joint="shoulder-l" transform="translate(0, 0)">
        <g class="char-part" data-part="arm-upper-inner">...</g>
      </g>
    </g>

  </g>

  <g class="char-layer char-layer-body-main">
    <g class="char-part" data-part="torso">...</g>
    <g class="char-part" data-part="head">

      <g class="char-layer char-layer-face">
        <g class="char-part" data-part="face-base">...</g>
        <g class="char-part" data-part="eyes">
          <g class="char-part" data-part="eye-l">...</g>
          <g class="char-part" data-part="eye-r">...</g>
        </g>
        <g class="char-part" data-part="mouth">...</g>
        <g class="char-part" data-part="nose">...</g>
      </g>

    </g>
  </g>

</g>
```

### CSS 클래스 명명 시스템

```css
/* BEM 변형 + 캐릭터 네임스페이스 */

/* 블록: 캐릭터 */
.character { }
.character--hero { }
.character--villain { }

/* 엘리먼트: 파트 */
.character__part { }
.character__part--head { }
.character__part--torso { }
.character__part--arm-upper-l { }
.character__part--arm-upper-r { }
.character__part--leg-upper-l { }
.character__part--leg-upper-r { }

/* 모디파이어: 상태 */
.character__part--highlighted { }
.character__part--damaged { }
.character__part--hidden { }
```

---

## 6. 신체 파트 데이터 구조 (JavaScript)

```javascript
// 완전한 캐릭터 스켈레톤 정의
const createSkeleton = (characterId, style = 'standard') => ({
  id: characterId,
  style,
  root: {
    position: { x: 0, y: 0 },
    children: {
      spine: {
        localOffset: { x: 0, y: -1.0 },
        rotation: 0,
        children: {
          torso: {
            localOffset: { x: 0, y: -0.5 },
            rotation: 0,
          },
          neck: {
            localOffset: { x: 0, y: -2.0 },
            rotation: 0,
            children: {
              head: {
                localOffset: { x: 0, y: -0.5 },
                rotation: 0,
              },
            },
          },
          shoulder_l: {
            localOffset: { x: -1.1, y: -1.8 },
            rotation: 0,
            children: {
              elbow_l: { localOffset: { x: 0, y: -1.3 }, rotation: 0,
                children: {
                  wrist_l: { localOffset: { x: 0, y: -1.2 }, rotation: 0 },
                },
              },
            },
          },
          shoulder_r: {
            localOffset: { x: 1.1, y: -1.8 },
            rotation: 0,
            children: {
              elbow_r: { localOffset: { x: 0, y: -1.3 }, rotation: 0,
                children: {
                  wrist_r: { localOffset: { x: 0, y: -1.2 }, rotation: 0 },
                },
              },
            },
          },
        },
      },
      hip: {
        localOffset: { x: 0, y: 0 },
        rotation: 0,
        children: {
          hip_l: {
            localOffset: { x: -0.5, y: 0 },
            rotation: 0,
            children: {
              knee_l: { localOffset: { x: 0, y: -2.0 }, rotation: 0,
                children: {
                  ankle_l: { localOffset: { x: 0, y: -1.8 }, rotation: 0 },
                },
              },
            },
          },
          hip_r: {
            localOffset: { x: 0.5, y: 0 },
            rotation: 0,
            children: {
              knee_r: { localOffset: { x: 0, y: -2.0 }, rotation: 0,
                children: {
                  ankle_r: { localOffset: { x: 0, y: -1.8 }, rotation: 0 },
                },
              },
            },
          },
        },
      },
    },
  },
});
```
