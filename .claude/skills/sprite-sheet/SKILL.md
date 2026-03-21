---
name: sprite-sheet
description: Pack animation frames into optimized sprite sheets with metadata and game engine loader code
user-invocable: true
args:
  - name: sprites
    description: Sprite frames to pack (files or directory)
    required: true
  - name: columns
    description: Number of columns in the sheet
    required: false
  - name: padding
    description: Padding between frames in pixels
    required: false
category: 강화
license: MIT
---


# Sprite Sheet

Pack multiple character animation frames into a single optimized sprite sheet image with accompanying metadata for game engine consumption.

## Workflow

### Step 1: Collect Frames

Gather all animation frames. Determine frame dimensions and validate consistency:

```javascript
// All frames must have identical dimensions
function validateFrames(frames) {
  const { width, height } = frames[0];
  const inconsistent = frames.filter(f => f.width !== width || f.height !== height);
  if (inconsistent.length > 0) {
    throw new Error(`Frame size mismatch: expected ${width}x${height}`);
  }
  return { width, height, count: frames.length };
}
```

### Step 2: Calculate Layout

Determine optimal grid dimensions:

```javascript
function calculateLayout(frameCount, preferredColumns) {
  const columns = preferredColumns || Math.ceil(Math.sqrt(frameCount));
  const rows = Math.ceil(frameCount / columns);
  return { columns, rows };
}

// With padding
function sheetDimensions(frameW, frameH, cols, rows, padding = 1) {
  return {
    width: cols * (frameW + padding) + padding,
    height: rows * (frameH + padding) + padding,
  };
}
```

### Step 3: Pack Frames

Render frames into the sheet with consistent spacing:

```javascript
function packSpriteSheet(ctx, frames, layout, padding = 1) {
  const { columns } = layout;
  const { width: fw, height: fh } = frames[0];

  frames.forEach((frame, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = padding + col * (fw + padding);
    const y = padding + row * (fh + padding);
    ctx.drawImage(frame.image, x, y);
  });
}
```

### Step 4: Generate Metadata

Output TexturePacker-compatible JSON:

```json
{
  "frames": {
    "hero-idle-0": {
      "frame": { "x": 1, "y": 1, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 },
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 }
    },
    "hero-idle-1": {
      "frame": { "x": 34, "y": 1, "w": 32, "h": 32 },
      "sourceSize": { "w": 32, "h": 32 },
      "spriteSourceSize": { "x": 0, "y": 0, "w": 32, "h": 32 }
    }
  },
  "animations": {
    "idle": ["hero-idle-0", "hero-idle-1", "hero-idle-2", "hero-idle-3"],
    "walk": ["hero-walk-0", "hero-walk-1", "hero-walk-2", "hero-walk-3"]
  },
  "meta": {
    "image": "hero-spritesheet.png",
    "size": { "w": 256, "h": 128 },
    "format": "RGBA8888",
    "scale": 1
  }
}
```

### Step 5: Generate Loader Code

#### CSS Sprite Animation

```css
.character-sprite {
  width: 32px;
  height: 32px;
  background-image: url('hero-spritesheet.png');
  background-size: 256px 128px;
  image-rendering: pixelated;
}

.anim-idle {
  animation: idle 0.6s steps(4) infinite;
}

@keyframes idle {
  from { background-position: -1px -1px; }
  to { background-position: -133px -1px; }
}
```

#### Phaser 3

```javascript
// Load
this.load.atlas('hero', 'hero-spritesheet.png', 'hero-spritesheet.json');

// Create animations
this.anims.create({
  key: 'idle',
  frames: this.anims.generateFrameNames('hero', {
    prefix: 'hero-idle-', start: 0, end: 3
  }),
  frameRate: 8,
  repeat: -1,
});
```

#### PixiJS

```javascript
const sheet = await PIXI.Assets.load('hero-spritesheet.json');
const sprite = new PIXI.AnimatedSprite(sheet.animations['idle']);
sprite.animationSpeed = 0.15;
sprite.play();
```

## Do

- Use power-of-2 sheet dimensions when possible (256, 512, 1024) for GPU efficiency
- Add 1px padding between frames to prevent texture bleeding
- Name frames with consistent patterns: `{character}-{animation}-{frame}`
- Include all animation states in a single sheet when total size allows

## Don't

- Mix different character sizes in one sheet
- Forget padding (causes bleeding artifacts at edges)
- Create sheets larger than 2048x2048 (compatibility issues on mobile)
- Use lossy compression (JPEG) for sprite sheets — always PNG
