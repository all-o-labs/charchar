---
name: create-3d
description: Generate a Three.js-based 3D character model with rigging and texture mapping
user-invocable: true
args:
  - name: character
    description: "캐릭터 이름 또는 설명 (예: warrior, cute-robot, fox-girl)"
    required: true
  - name: polycount
    description: "폴리곤 복잡도 (low|medium|high, 기본값: low)"
    required: false
  - name: texture
    description: "텍스처 스타일 (flat|gradient|detailed, 기본값: flat)"
    required: false
category: 생성
license: MIT
---


# create-3d — Three.js 3D 캐릭터 생성 가이드

`/create-3d character="캐릭터명" polycount="low" texture="flat"` 명령을 받으면
아래 가이드에 따라 Three.js BufferGeometry 기반 3D 캐릭터 코드를 생성합니다.

---

## 1. 폴리카운트 기준

| 레벨   | 버텍스 수      | 용도                         |
|--------|---------------|------------------------------|
| low    | < 500         | 모바일, 인스턴싱, 배경 NPC   |
| medium | 500 – 2,000   | 주인공, 웹 게임               |
| high   | 2,000 – 8,000 | 포트폴리오, 데스크탑 쇼케이스 |

**Low-poly 황금률**: 곡선 대신 면 각도로 형태를 표현한다. 구체는 최소 8각형으로.

---

## 2. BufferGeometry 구조 패턴

캐릭터를 부위별 Mesh 로 분리하고 `Group`으로 계층 구성합니다.

```typescript
import * as THREE from 'three';

function buildCharacter(polycount: 'low' | 'medium' | 'high' = 'low') {
  const root = new THREE.Group();
  root.name = 'character-root';

  // 몸통
  const bodyGeo = new THREE.BoxGeometry(0.6, 0.8, 0.4, 1, 1, 1);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x4a90d9 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.name = 'body';
  body.position.y = 0.9;
  root.add(body);

  // 머리
  const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.45, 1, 1, 1);
  const headMat = new THREE.MeshStandardMaterial({ color: 0xf5cba7 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.name = 'head';
  head.position.y = 1.6;
  root.add(head);

  // 팔 (좌/우 대칭 생성)
  [-1, 1].forEach((side) => {
    const armGeo = new THREE.BoxGeometry(0.2, 0.6, 0.2, 1, 1, 1);
    const arm = new THREE.Mesh(armGeo, bodyMat.clone());
    arm.name = side === -1 ? 'arm-left' : 'arm-right';
    arm.position.set(side * 0.42, 0.9, 0);
    root.add(arm);
  });

  // 다리 (좌/우)
  [-1, 1].forEach((side) => {
    const legGeo = new THREE.BoxGeometry(0.22, 0.6, 0.22, 1, 1, 1);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.name = side === -1 ? 'leg-left' : 'leg-right';
    leg.position.set(side * 0.16, 0.3, 0);
    root.add(leg);
  });

  return root;
}
```

> **Do**: 각 Mesh에 `name` 을 설정해 이후 리깅/애니메이션에서 참조 가능하게 할 것
> **Don't**: 모든 부위를 단일 merged geometry로 합치지 말 것 — 독립 애니메이션 불가

---

## 3. 기본 리깅 (Bone / Skeleton)

```typescript
import * as THREE from 'three';

function buildSkeleton() {
  const bones: THREE.Bone[] = [];

  const root = new THREE.Bone();
  root.name = 'root';
  root.position.set(0, 0, 0);
  bones.push(root);

  const spine = new THREE.Bone();
  spine.name = 'spine';
  spine.position.set(0, 0.9, 0);
  root.add(spine);
  bones.push(spine);

  const neck = new THREE.Bone();
  neck.name = 'neck';
  neck.position.set(0, 0.45, 0);
  spine.add(neck);
  bones.push(neck);

  const headBone = new THREE.Bone();
  headBone.name = 'head';
  headBone.position.set(0, 0.3, 0);
  neck.add(headBone);
  bones.push(headBone);

  // 팔
  ['left', 'right'].forEach((side, i) => {
    const shoulder = new THREE.Bone();
    shoulder.name = `shoulder-${side}`;
    shoulder.position.set(i === 0 ? -0.35 : 0.35, 0.35, 0);
    spine.add(shoulder);
    bones.push(shoulder);

    const elbow = new THREE.Bone();
    elbow.name = `elbow-${side}`;
    elbow.position.set(0, -0.3, 0);
    shoulder.add(elbow);
    bones.push(elbow);
  });

  const skeleton = new THREE.Skeleton(bones);
  return { skeleton, bones };
}
```

**리깅 원칙**:
- Bone 이름은 kebab-case로 통일 (`shoulder-left`, `elbow-right`)
- 계층 구조: root → spine → neck → head
- 팔: spine → shoulder → elbow → wrist
- 다리: root → hip → knee → ankle

---

## 4. UV 매핑 가이드

```typescript
// BoxGeometry UV 레이아웃 (6면 기준)
// face index: 0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back
// 각 face는 UV 좌표 2개 삼각형 = 4 UV 버텍스

function applyFaceTexture(geo: THREE.BoxGeometry, faceIndex: number, u0: number, v0: number, u1: number, v1: number) {
  const uvAttribute = geo.attributes.uv;
  const baseIndex = faceIndex * 4;
  uvAttribute.setXY(baseIndex + 0, u0, v1);
  uvAttribute.setXY(baseIndex + 1, u1, v1);
  uvAttribute.setXY(baseIndex + 2, u0, v0);
  uvAttribute.setXY(baseIndex + 3, u1, v0);
  uvAttribute.needsUpdate = true;
}

// 텍스처 아틀라스 (256x256 기준)
// 얼굴: (0,0.75) ~ (0.25,1.0)
// 몸통 앞면: (0.25,0.75) ~ (0.5,1.0)
applyFaceTexture(headGeo, 4, 0, 0.75, 0.25, 1.0);   // 앞면 = 얼굴
applyFaceTexture(headGeo, 0, 0.25, 0.75, 0.5, 1.0); // 오른쪽 옆면
```

**텍스처 아틀라스 규칙**:
- 512×512 이하로 유지 (모바일 호환)
- 각 부위 영역을 power-of-2 그리드로 분할
- 미러링 가능한 부위(좌/우 팔)는 UV를 공유하고 X축 반전

---

## 5. React Three Fiber 통합

```tsx
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Character3D({ polycount = 'low' }: { polycount?: 'low' | 'medium' | 'high' }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // 대기 애니메이션: 살짝 상하 부동
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* body */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="#4a90d9" />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.45]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>
    </group>
  );
}

export function Scene() {
  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 3]} intensity={1} castShadow />
      <Character3D polycount="low" />
      <OrbitControls target={[0, 1, 0]} />
    </Canvas>
  );
}
```

---

## 6. 조명/재질 설정

```typescript
// 권장 조명 구성 (3-point lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);   // 기본 환경광
const keyLight = new THREE.DirectionalLight(0xfff5e0, 1.2);   // 메인 광원
keyLight.position.set(3, 5, 3);
keyLight.castShadow = true;

const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.5);  // 보조 광원
fillLight.position.set(-3, 2, -1);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);   // 윤곽 강조
rimLight.position.set(0, 3, -4);

// 재질 권장 설정
const characterMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.8,       // 낮을수록 반사 강함 (캐릭터: 0.6-0.9)
  metalness: 0.0,       // 금속 부위만 0.5-1.0
  envMapIntensity: 0.5, // 환경맵 반사 강도
});
```

**재질 Do/Don't**:
- Do: `MeshStandardMaterial` (PBR, 물리 기반) 사용
- Do: `roughness` 0.7–0.9 (만화풍), 0.3–0.6 (사실적)
- Don't: `MeshBasicMaterial` (조명 무시, 플랫하게만 사용)
- Don't: `shininess` 100 이상 (과도한 반짝임)

---

## 7. Low-poly 스타일 가이드

**형태 원칙**:
- 원통 대신 6–8각형 프리즘 사용
- 구체 대신 icosahedron (detail=1, 약 80 tri)
- 모든 모서리를 bevel 없이 날카롭게 유지
- 면 법선을 flat shading으로 설정: `geometry.computeVertexNormals()` 후 `material.flatShading = true`

**색상 원칙**:
- 그림자를 텍스처가 아닌 별도 면 색상으로 표현
- 최대 5–7가지 색상 사용
- 채도 높고 명도 대비가 뚜렷한 팔레트

**체크리스트**:
- [ ] 총 tri 수가 목표 polycount 이내인가?
- [ ] 카메라에서 보이지 않는 면을 제거했는가?
- [ ] flatShading이 활성화되어 있는가?
- [ ] 텍스처 없이도 인식 가능한 실루엣인가?
