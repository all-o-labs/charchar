---
name: retro
description: Create retro 8-bit/16-bit/32-bit era characters with authentic hardware constraints
user-invocable: true
args:
  - name: character
    description: Character concept or existing character to convert
    required: true
  - name: era
    description: Target hardware era
    required: false
  - name: platform
    description: Specific platform to emulate
    required: false
category: 스타일
license: MIT
---


# Retro Style Characters

Create characters that authentically emulate classic gaming hardware aesthetics. Each era has specific constraints that define its visual identity.

## Era Specifications

### 8-bit Era (NES / Game Boy / Master System)

| Constraint | NES | Game Boy | Master System |
|-----------|-----|----------|---------------|
| Sprite size | 8x8 or 8x16 | 8x8 or 8x16 | 8x8 or 8x16 |
| Colors/sprite | 3 + transparent | 4 shades | 15 + transparent |
| Palette | 54 colors total | 4 greens | 64 colors total |
| Resolution | 256x240 | 160x144 | 256x192 |

```javascript
// NES palette (simplified — 3 colors + transparent per sprite)
const NES_SPRITE_PALETTE = {
  skin: ['#FCE4C0', '#E8A060', '#A05020'],
  blue: ['#6888FC', '#3050C8', '#102078'],
  red: ['#F83800', '#C81010', '#680000'],
};

// Game Boy palette
const GB_PALETTE = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'];
```

### 16-bit Era (SNES / Genesis / GBA)

| Constraint | SNES | Genesis | GBA |
|-----------|------|---------|-----|
| Sprite size | Up to 64x64 | Up to 32x32 | Up to 64x64 |
| Colors/sprite | 16 | 16 | 256 |
| Palette | 256 on screen | 64 on screen | 32768 total |
| Resolution | 256x224 | 320x224 | 240x160 |

```javascript
// SNES 16-color sprite palette example
const SNES_HERO = [
  'transparent',
  '#000000', '#1a1a2e', '#2d3a5c', // darks
  '#4a6fa5', '#7ba3d4', '#a8d0f0', // blues
  '#f0c8a0', '#d4a070', '#a06830', // skin
  '#f8f8f8', '#c0c0c0', '#808080', // metals
  '#e83820', '#a02010', '#601008', // accent red
];
```

### 32-bit Era (PS1 / Saturn / N64)

| Constraint | PS1 | Saturn | N64 |
|-----------|-----|--------|-----|
| Style | Low-poly 3D or 2D | 2D with scaling | Low-poly 3D |
| Colors | Full color | Full color | Full color |
| Texture | 256x256 max | Variable | 64x64 common |
| Polygon budget | 300-800/character | N/A | 500-1500 |

## Workflow

### Step 1: Choose Era and Platform
Select the target hardware era. Each platform has unique constraints that define the visual style. When in doubt, start with SNES — it's the sweet spot between constraint and expressiveness.

### Step 2: Set Up Constraints
Apply the hardware's actual limitations:

```css
/* Force pixel-perfect rendering */
.retro-canvas {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}

/* NES resolution container */
.nes-viewport {
  width: 256px;
  height: 240px;
  overflow: hidden;
  background: #000;
}
```

### Step 3: Design Within Grid
Build the character on the platform's sprite grid:

```javascript
// 8x16 NES sprite grid
const SPRITE_WIDTH = 8;
const SPRITE_HEIGHT = 16;
const SCALE = 4; // display scale

function drawPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
}
```

### Step 4: Apply Palette Constraints
Strict palette adherence is what makes retro art feel authentic:

```javascript
// Snap any color to the nearest NES palette color
function snapToNESPalette(r, g, b) {
  let closest = NES_COLORS[0];
  let minDist = Infinity;
  for (const color of NES_COLORS) {
    const dist = Math.sqrt(
      (r - color.r) ** 2 + (g - color.g) ** 2 + (b - color.b) ** 2
    );
    if (dist < minDist) { minDist = dist; closest = color; }
  }
  return closest;
}
```

### Step 5: Add CRT/Scanline Effects (Optional)

```css
/* Scanline overlay */
.crt-effect::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
}

/* CRT curvature */
.crt-curve {
  border-radius: 20px / 15px;
  box-shadow:
    inset 0 0 60px rgba(0,0,0,0.3),
    inset 0 0 10px rgba(0,0,0,0.2);
}

/* Phosphor glow */
.crt-glow {
  filter: contrast(1.1) brightness(1.05)
    drop-shadow(0 0 2px rgba(100, 200, 100, 0.15));
}
```

## Do

- Research the actual hardware constraints before designing
- Use the exact palette of the target platform
- Design at native resolution, then scale up with nearest-neighbor
- Respect tile grid boundaries (8x8 tiles for most platforms)
- Study real games from the era for reference

## Don't

- Use anti-aliased lines in pixel art (breaks the retro feel)
- Exceed the platform's color-per-sprite limit
- Mix constraints from different platforms (NES palette + SNES sprite size)
- Add modern effects (drop shadows, gradients) unless they're CSS post-processing
- Use sub-pixel positioning for sprite rendering
