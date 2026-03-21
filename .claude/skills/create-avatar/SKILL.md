---
name: create-avatar
description: Generate a platform-optimized SVG avatar with dark mode and accessibility support
user-invocable: true
args:
  - name: style
    description: "아바타 스타일 (minimal|cartoon|geometric, 기본값: minimal)"
    required: false
  - name: size
    description: "출력 크기 px (예: 80, 기본값: 플랫폼 자동)"
    required: false
  - name: platform
    description: "대상 플랫폼 (github|slack|discord, 기본값: github)"
    required: false
category: 생성
license: MIT
---


# create-avatar — 플랫폼 최적화 SVG 아바타 생성 가이드

`/create-avatar style="minimal" platform="github"` 명령을 받으면
아래 가이드에 따라 접근성과 다크모드를 갖춘 SVG 아바타를 생성합니다.

---

## 1. 플랫폼별 사이즈 규격

| 플랫폼  | 표시 크기    | 권장 내보내기 | 모양    | 비고               |
|---------|------------|--------------|---------|-------------------|
| GitHub  | 40×40px    | 80×80px @2x  | 원형    | PNG fallback 필수  |
| Slack   | 36×36px    | 512×512px    | 원형    | 고해상도 SVG 권장  |
| Discord | 32×32px    | 128×128px    | 원형    | GIF 애니메이션 가능|
| 일반    | 지정 size  | size×2       | 정사각형| viewBox 기준       |

```typescript
const PLATFORM_SIZES: Record<string, { display: number; export: number; shape: 'circle' | 'square' }> = {
  github:  { display: 40,  export: 80,  shape: 'circle' },
  slack:   { display: 36,  export: 512, shape: 'circle' },
  discord: { display: 32,  export: 128, shape: 'circle' },
  default: { display: 64,  export: 128, shape: 'square' },
};
```

---

## 2. SVG 기반 확장 가능 디자인

viewBox를 `0 0 100 100`으로 고정하고 모든 좌표를 상대값으로 작성합니다.

```svg
<!-- minimal 스타일 아바타 기본 구조 -->
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 100 100"
  role="img"
  aria-label="캐릭터 아바타"
>
  <defs>
    <!-- 클리핑: 원형 마스크 -->
    <clipPath id="avatar-clip">
      <circle cx="50" cy="50" r="50" />
    </clipPath>
    <!-- 다크모드 토큰 -->
    <style>
      :root {
        --av-bg: #e8f0fe;
        --av-skin: #f5cba7;
        --av-hair: #2c3e50;
        --av-accent: #4a90d9;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --av-bg: #1e2a3a;
          --av-skin: #d4a574;
          --av-hair: #ecf0f1;
          --av-accent: #6bb3f0;
        }
      }
    </style>
  </defs>

  <g clip-path="url(#avatar-clip)">
    <!-- 배경 -->
    <rect width="100" height="100" fill="var(--av-bg)" />
    <!-- 몸통 -->
    <ellipse cx="50" cy="85" rx="28" ry="20" fill="var(--av-accent)" />
    <!-- 얼굴 -->
    <circle cx="50" cy="42" r="22" fill="var(--av-skin)" />
    <!-- 머리카락 -->
    <ellipse cx="50" cy="25" rx="22" ry="12" fill="var(--av-hair)" />
  </g>
</svg>
```

---

## 3. 스타일별 가이드

### 3-1. minimal

- 도형 수: 5–8개
- 선 없음, 단색 면만 사용
- 눈: 원 2개, 입: 반원 1개
- 배경: 단색 원

```svg
<!-- 눈 예시 -->
<circle cx="43" cy="44" r="3" fill="var(--av-hair)" />
<circle cx="57" cy="44" r="3" fill="var(--av-hair)" />
<!-- 입 -->
<path d="M 44 52 Q 50 57 56 52" stroke="var(--av-hair)" stroke-width="2" fill="none" stroke-linecap="round" />
```

### 3-2. cartoon

- 검은 외곽선 (`stroke-width: 2–3`)
- 눈에 하이라이트 원 추가
- 볼 터치 (blush): 반투명 분홍 원
- 머리카락에 명암 면 추가

```svg
<!-- 볼 터치 -->
<circle cx="35" cy="50" r="6" fill="#ff8fa3" opacity="0.4" />
<circle cx="65" cy="50" r="6" fill="#ff8fa3" opacity="0.4" />
<!-- 눈 하이라이트 -->
<circle cx="44.5" cy="43" r="1" fill="white" />
```

### 3-3. geometric

- 모든 형태를 polygon/path의 직선으로만 표현
- 원 사용 금지 (눈도 다이아몬드 polygon)
- 얼굴: 오각형 또는 육각형
- 배경: 그라디언트 허용

```svg
<!-- 기하학적 얼굴 -->
<polygon points="50,20 72,35 72,65 50,80 28,65 28,35" fill="var(--av-skin)" />
<!-- 기하학적 눈 -->
<polygon points="43,42 46,39 49,42 46,45" fill="var(--av-hair)" />
<polygon points="51,42 54,39 57,42 54,45" fill="var(--av-hair)" />
```

---

## 4. 다크모드 / 라이트모드 대응

```typescript
// React 컴포넌트로 래핑
interface AvatarProps {
  size?: number;
  platform?: 'github' | 'slack' | 'discord';
  className?: string;
}

export function Avatar({ size = 64, platform = 'github', className }: AvatarProps) {
  const config = PLATFORM_SIZES[platform] ?? PLATFORM_SIZES.default;
  const finalSize = size ?? config.display;

  return (
    <svg
      width={finalSize}
      height={finalSize}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="사용자 아바타"
      className={className}
      style={{
        borderRadius: config.shape === 'circle' ? '50%' : '0',
      }}
    >
      {/* SVG 내용 */}
    </svg>
  );
}
```

**CSS 변수 토큰 네이밍 규칙**:
- `--av-bg`: 배경색
- `--av-skin`: 피부색
- `--av-hair`: 머리/눈 등 어두운 색
- `--av-accent`: 강조색 (옷, 장식)
- `--av-outline`: 외곽선색 (cartoon only)

---

## 5. 접근성 (고대비, 색각이상)

```svg
<defs>
  <!-- 고대비 모드 -->
  <style>
    @media (forced-colors: active) {
      .avatar-body { forced-color-adjust: none; }
    }
    @media (prefers-contrast: more) {
      :root {
        --av-bg: #000080;
        --av-skin: #ffff00;
        --av-hair: #ffffff;
        --av-accent: #00ff00;
      }
    }
  </style>
</defs>
```

**색각이상 대응 체크리스트**:
- [ ] 빨강-초록만으로 구분되는 정보가 없는가?
- [ ] 색상 외 모양/위치로도 요소를 구별할 수 있는가?
- [ ] 배경과 전경 명도 대비 4.5:1 이상인가? (WCAG AA)
- [ ] `aria-label` 또는 `title` 요소가 포함되어 있는가?

```svg
<!-- 접근성 title 포함 예시 -->
<svg role="img" aria-labelledby="avatar-title">
  <title id="avatar-title">사용자 아바타: 파란 머리카락의 캐릭터</title>
  <!-- 내용 -->
</svg>
```

---

## 6. CSS 아바타 컴포넌트 패턴

SVG 없이 순수 CSS로 아바타를 생성하는 패턴:

```css
.avatar {
  --size: 64px;
  position: relative;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--av-bg, #e8f0fe);
  overflow: hidden;
}

/* 얼굴 */
.avatar::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: var(--av-skin, #f5cba7);
  top: 20%;
  left: 20%;
}

/* 머리카락 */
.avatar::after {
  content: '';
  position: absolute;
  width: 68%;
  height: 35%;
  border-radius: 50% 50% 0 0;
  background: var(--av-hair, #2c3e50);
  top: 8%;
  left: 16%;
}
```

**Do/Don't**:
- Do: viewBox를 항상 `0 0 100 100`으로 고정
- Do: 색상을 CSS 변수로 선언해 테마 전환 가능하게
- Do: `role="img"` + `aria-label` 필수 포함
- Don't: 픽셀 하드코딩 (`cx="320"`) — 상대 좌표 사용
- Don't: 플랫폼 사이즈를 SVG width/height에 직접 박기 — viewBox 활용
- Don't: 외부 이미지나 폰트를 SVG 내부에 임베드 (보안, 용량 문제)

---

## Do

- viewBox를 `0 0 100 100`으로 고정하고 모든 좌표를 상대값으로 작성한다
- 색상을 CSS 변수(`--av-bg`, `--av-skin` 등)로 선언해 다크모드 전환을 지원한다
- `role="img"` + `aria-label`을 반드시 포함해 스크린리더 접근성을 확보한다
- 플랫폼별 사이즈 규격(GitHub 80px, Slack 512px 등)에 맞게 export 해상도를 설정한다

## Don't

- 픽셀 좌표를 하드코딩한다 (`cx="320"`) — viewBox 상대 좌표를 사용해야 확장성이 유지된다
- SVG `width`/`height`에 플랫폼 표시 크기를 직접 박는다 — viewBox + CSS 크기 제어를 활용한다
- 외부 폰트나 이미지를 SVG 안에 임베드한다 — 보안 정책 위반 및 용량 증가 문제가 발생한다
- 색상 대비를 무시한다 — 배경과 전경의 명도 대비가 4.5:1 미만이면 가독성이 떨어진다
