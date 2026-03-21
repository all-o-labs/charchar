---
name: color-palette
description: Generate harmonious color palettes for characters based on personality, role, and mood
user-invocable: true
args:
  - name: character
    description: Character to design palette for
    required: false
  - name: mood
    description: Target mood or emotion
    required: false
  - name: scheme
    description: Color harmony scheme to use
    required: false
category: 강화
license: MIT
---


# Color Palette

Design a harmonious, purposeful color palette for a character based on their personality, narrative role, and target mood.

## Workflow

### Step 1: Define Character Attributes

Identify the key traits that should drive color selection:
- **Role**: Hero, villain, mentor, comic relief, mysterious
- **Personality**: Bold, shy, aggressive, calm, chaotic
- **Element/Theme**: Fire, water, nature, tech, shadow
- **Mood**: Warm, cool, neutral, vibrant, muted

### Step 2: Select Color Harmony Scheme

Choose based on the character's narrative needs:

| Scheme | Colors | Best For |
|--------|--------|----------|
| Complementary | 2 (opposite) | High contrast, hero vs villain |
| Analogous | 3 (adjacent) | Harmonious, natural, calm |
| Triadic | 3 (equally spaced) | Vibrant, balanced, playful |
| Split-complementary | 3 (base + 2 near-opposite) | Contrast with less tension |
| Tetradic | 4 (two pairs) | Rich, complex characters |

```javascript
function generateScheme(baseHue, scheme) {
  const schemes = {
    complementary: [baseHue, (baseHue + 180) % 360],
    analogous: [baseHue, (baseHue + 30) % 360, (baseHue - 30 + 360) % 360],
    triadic: [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360],
    splitComplementary: [baseHue, (baseHue + 150) % 360, (baseHue + 210) % 360],
  };
  return schemes[scheme] || schemes.analogous;
}
```

### Step 3: Apply the 60-30-10 Rule

Distribute colors with purpose:

```css
:root {
  /* 60% — Dominant: main body/clothing color */
  --char-primary: hsl(220, 55%, 45%);
  --char-primary-light: hsl(220, 45%, 60%);
  --char-primary-dark: hsl(220, 60%, 30%);

  /* 30% — Secondary: supporting elements */
  --char-secondary: hsl(35, 50%, 40%);
  --char-secondary-light: hsl(35, 40%, 55%);
  --char-secondary-dark: hsl(35, 55%, 28%);

  /* 10% — Accent: eye-catching detail */
  --char-accent: hsl(45, 90%, 55%);
  --char-accent-glow: hsl(45, 100%, 70%);
}
```

### Step 4: Generate Value Ramps

Each hue needs light/mid/dark variants for shading:

```javascript
function generateRamp(hue, sat, baseLightness, steps = 5) {
  const ramp = [];
  const range = 40; // lightness range
  for (let i = 0; i < steps; i++) {
    const l = baseLightness + range / 2 - (range / (steps - 1)) * i;
    const s = sat - (i * 3); // slightly desaturate shadows
    ramp.push(`hsl(${hue}, ${Math.max(s, 10)}%, ${Math.max(l, 5)}%)`);
  }
  return ramp;
}
```

### Step 5: Validate Accessibility

Check WCAG contrast ratios for all color pairs that appear adjacent:

```javascript
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}
// Minimum 3:1 for large elements, 4.5:1 for small detail
```

### Step 6: Create Environment Variants

Adapt the palette for different lighting conditions:

```css
/* Day (default) */
.scene-day { /* use base palette */ }

/* Night — shift hues toward blue, reduce saturation */
.scene-night {
  --char-primary: hsl(230, 30%, 30%);
  --char-secondary: hsl(240, 25%, 25%);
  --char-accent: hsl(50, 60%, 40%);
}

/* Sunset — shift warm, boost saturation */
.scene-sunset {
  --char-primary: hsl(210, 50%, 42%);
  --char-secondary: hsl(25, 55%, 40%);
  --char-accent: hsl(40, 95%, 55%);
}
```

### Step 7: Export

Output formats:
- **CSS custom properties** (primary output)
- **JSON palette** with hex, HSL, and RGB values
- **Design tokens** compatible with Tailwind/CSS-in-JS
- **Swatch HTML** for visual reference

## Do

- Start with the character's narrative role, not aesthetic preference
- Test the palette on a grayscale version — values should still read
- Create palettes for the entire cast together for visual harmony
- Include skin tone in the palette planning (not as an afterthought)

## Don't

- Pick colors randomly or based solely on personal preference
- Use maximum saturation for all colors (causes visual fatigue)
- Ignore how colors shift under different lighting
- Copy another character's exact palette — derive related palettes instead
