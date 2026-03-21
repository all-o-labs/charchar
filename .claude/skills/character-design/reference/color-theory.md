# Color Theory for Character Design

## The 60-30-10 Rule

Every well-designed character follows the 60-30-10 color distribution:

- **60% — Dominant color**: The base tone. Usually the body, main clothing, or skin.
- **30% — Secondary color**: Supports the dominant. Jacket, pants, or armor.
- **10% — Accent color**: Draws the eye. Belt buckle, eye color, weapon glow.

```css
:root {
  --char-primary: #2d5aa0;    /* 60% — blue tunic */
  --char-secondary: #8b6914;  /* 30% — brown leather */
  --char-accent: #e8c33a;     /* 10% — gold trim */
}
```

## Personality-Based Color Mapping

Colors carry psychological meaning. Use them intentionally:

| Role | Primary Colors | Why |
|------|---------------|-----|
| Hero | Blue, White, Gold | Trust, purity, valor |
| Villain | Purple, Black, Red | Power, mystery, danger |
| Healer | Green, White, Soft Blue | Nature, calm, safety |
| Trickster | Orange, Yellow, Magenta | Energy, chaos, surprise |
| Mentor | Deep Blue, Silver, Brown | Wisdom, age, stability |
| Wild Card | Contrasting combos | Unpredictability |

### Do

```css
/* Hero character — trustworthy blue with warm gold accent */
.hero {
  --skin: #f4c89a;
  --primary: #3b6bb5;
  --secondary: #1a3a6e;
  --accent: #d4a520;
  --highlight: #f0d060;
}
```

### Don't

```css
/* Random colors with no relationship */
.hero {
  --skin: #ffcc99;
  --shirt: #ff00ff;    /* clashes with everything */
  --pants: #00ff00;    /* no harmony */
  --shoes: #0000ff;    /* rainbow soup */
}
```

## Color Harmony Schemes

### Complementary (high contrast)
Colors opposite on the wheel. Strong visual impact.
Best for: Heroes vs villains, highlighting key elements.

```javascript
function complementary(hue) {
  return { primary: hue, complement: (hue + 180) % 360 };
}
```

### Analogous (harmonious)
Colors adjacent on the wheel. Natural, pleasing feel.
Best for: Friendly characters, nature-themed designs.

```javascript
function analogous(hue, spread = 30) {
  return {
    primary: hue,
    left: (hue - spread + 360) % 360,
    right: (hue + spread) % 360,
  };
}
```

### Triadic (balanced variety)
Three colors equally spaced. Vibrant but balanced.
Best for: Playful characters, magical themes.

```javascript
function triadic(hue) {
  return {
    primary: hue,
    second: (hue + 120) % 360,
    third: (hue + 240) % 360,
  };
}
```

## Saturation and Value Guidelines

- **Main characters**: Higher saturation to stand out from backgrounds
- **NPCs**: Slightly desaturated to recede visually
- **Enemies**: High saturation reds/purples for threat recognition
- **Environment characters**: Match the scene's value range

```css
/* Saturation hierarchy */
.protagonist { filter: saturate(1.1); }  /* slightly boosted */
.npc { filter: saturate(0.85); }         /* slightly muted */
.enemy { filter: saturate(1.2); }        /* vivid threat */
```

## Accessibility: Designing for Color Vision Deficiency

8% of males and 0.5% of females have some form of color vision deficiency.

### Rules

1. Never rely on color alone to distinguish characters — use shape, pattern, or value
2. Test palettes with deuteranopia (red-green) simulation
3. Ensure sufficient luminance contrast between adjacent areas (min 3:1)
4. Add patterns or textures as secondary identifiers

### Testing in CSS

```css
/* Simulate deuteranopia for testing */
.cvd-test {
  filter: url('#deuteranopia');
}

/* SVG filter for deuteranopia simulation */
/*
<filter id="deuteranopia">
  <feColorMatrix type="matrix" values="
    0.625 0.375 0 0 0
    0.7   0.3   0 0 0
    0     0.3   0.7 0 0
    0     0     0 1 0
  "/>
</filter>
*/
```

## Environment-Adaptive Palettes

Characters should look right in different lighting:

```css
.character {
  /* Base palette */
  --skin: hsl(25, 70%, 72%);
  --clothes: hsl(220, 60%, 45%);
}

/* Night scene — shift cooler, lower saturation */
.scene-night .character {
  --skin: hsl(230, 30%, 55%);
  --clothes: hsl(230, 40%, 25%);
}

/* Sunset — shift warmer, boost saturation */
.scene-sunset .character {
  --skin: hsl(15, 80%, 70%);
  --clothes: hsl(200, 50%, 40%);
}

/* Indoor warm light */
.scene-indoor .character {
  --skin: hsl(30, 65%, 70%);
  --clothes: hsl(215, 45%, 42%);
}
```

## Palette Size by Style

| Style | Colors | Notes |
|-------|--------|-------|
| Pixel art (8-bit) | 3-4 per character | Include 1 outline, 1 shadow |
| Pixel art (16-bit) | 8-16 per character | Gradient shading possible |
| Flat design | 3-5 per character | No gradients, clean shapes |
| Cel-shaded | 6-8 per character | Base + shadow + highlight per area |
| Realistic | 12+ per character | Subsurface, specular, ambient |

## Anti-Patterns

1. **Rainbow character**: Using every hue makes nothing stand out
2. **Gray-on-gray**: Insufficient contrast between character parts
3. **Neon overload**: All high-saturation colors cause visual fatigue
4. **Skin tone monotone**: Using a single flat color for skin looks lifeless
5. **Ignoring value structure**: Colors that look different in hue but identical in grayscale
