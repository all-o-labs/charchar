# Character Style Guide

## Line Weight Standards

Line weight should scale with character size and maintain consistency across your cast:

| Character Height | Outline | Internal Lines | Detail Lines |
|-----------------|---------|----------------|-------------|
| < 32px | 1px solid | 1px | none |
| 32-64px | 2px | 1px | 0.5px |
| 64-128px | 3px | 1.5px | 1px |
| 128-256px | 4px | 2px | 1px |
| 256px+ | 5-6px | 3px | 1.5px |

```css
/* Line weight system using CSS custom properties */
:root {
  --line-outline: 3px;
  --line-internal: 1.5px;
  --line-detail: 1px;
}

.character-outline { stroke-width: var(--line-outline); }
.character-internal { stroke-width: var(--line-internal); }
.character-detail { stroke-width: var(--line-detail); }
```

### SVG stroke consistency

```svg
<!-- Consistent line weights across character parts -->
<g class="character" stroke="var(--char-outline-color)" stroke-linecap="round" stroke-linejoin="round">
  <!-- Body outline — heaviest -->
  <path d="..." stroke-width="3"/>

  <!-- Internal structure — medium -->
  <path d="..." stroke-width="1.5"/>

  <!-- Detail (buttons, stitching) — lightest -->
  <path d="..." stroke-width="1"/>
</g>
```

## Outline Styles

### Solid Outline
Clean, consistent width. Most common for game characters.

```css
.style-solid {
  stroke: var(--outline-color, #1a1a2e);
  stroke-width: var(--line-outline);
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

### Tapered Outline
Variable width suggests hand-drawn quality. Thicker at bottom, thinner at top.

```svg
<!-- Simulate tapered lines with variable stroke-width -->
<path d="M 10,80 Q 15,40 20,10"
  stroke="black"
  stroke-width="3"
  style="stroke-dasharray: 0; paint-order: stroke;"
  vector-effect="non-scaling-stroke"/>

<!-- Or use a tapered path approach -->
<path d="M 10,80 C 8,60 12,40 11,20 L 13,20 C 14,40 10,60 12,80 Z"
  fill="black"/>
```

### No Outline (flat style)
Shapes defined by color contrast only. Requires careful color selection.

```css
.style-no-outline {
  stroke: none;
  /* Rely on color contrast between adjacent shapes */
}

/* Ensure adjacent parts have sufficient contrast */
.body { fill: var(--char-primary); }      /* hsl(220, 60%, 45%) */
.jacket { fill: var(--char-secondary); }  /* hsl(220, 60%, 30%) — darker */
```

## Shading Methods

### Cel-Shading (anime/cartoon)
Hard edge between light and shadow. 2-3 values per color.

```css
.cel-shade {
  /* Base color */
  --base: hsl(220, 60%, 50%);
  /* Shadow: same hue, lower lightness */
  --shadow: hsl(220, 55%, 35%);
  /* Highlight: same hue, higher lightness, lower saturation */
  --highlight: hsl(215, 40%, 70%);
}
```

```svg
<!-- Cel-shaded character part -->
<g class="arm">
  <path d="..." fill="var(--base)"/>             <!-- base shape -->
  <path d="..." fill="var(--shadow)"/>            <!-- shadow shape, hard edge -->
  <path d="..." fill="var(--highlight)"/>          <!-- highlight, small area -->
</g>
```

### Gradient Shading (soft)
Smooth transitions between light and shadow.

```svg
<defs>
  <linearGradient id="bodyShade" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="var(--highlight)"/>
    <stop offset="60%" stop-color="var(--base)"/>
    <stop offset="100%" stop-color="var(--shadow)"/>
  </linearGradient>
</defs>
<path d="..." fill="url(#bodyShade)"/>
```

### Flat Shading (no shading)
Single color per area. Simplest and cleanest.

```css
.flat-shade {
  /* One color per part, no gradients, no shadows */
  --skin: #f0c090;
  --hair: #3a2010;
  --shirt: #4080c0;
  --pants: #2a4060;
}
```

## Texture Approaches

### Pattern Fills (SVG)

```svg
<defs>
  <!-- Crosshatch texture -->
  <pattern id="crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
    <path d="M 0,8 L 8,0 M -1,1 L 1,-1 M 7,9 L 9,7"
      stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
  </pattern>

  <!-- Dot texture -->
  <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
    <circle cx="3" cy="3" r="1" fill="rgba(0,0,0,0.1)"/>
  </pattern>
</defs>

<!-- Apply texture overlay -->
<rect fill="url(#crosshatch)" opacity="0.3"/>
```

### CSS Texture Overlay

```css
.textured {
  position: relative;
}
.textured::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.05) 2px,
    rgba(0,0,0,0.05) 4px
  );
  pointer-events: none;
  mix-blend-mode: multiply;
}
```

## Style Consistency Checklist

Before declaring a character cast complete, verify these 10 items:

1. [ ] **Line weight**: All characters use the same outline/internal/detail weight ratio
2. [ ] **Outline style**: Consistent choice (solid, tapered, none) across all characters
3. [ ] **Shading method**: Same approach (cel, gradient, flat) for everyone
4. [ ] **Eye style**: Same level of detail and shape language across the cast
5. [ ] **Hand/foot detail**: Same simplification level (mitten hands, detailed fingers, etc.)
6. [ ] **Proportions system**: All characters reference the same head-to-body ratio scale
7. [ ] **Color saturation range**: No character is drastically more/less saturated than others
8. [ ] **Detail density**: Similar amount of surface detail (buttons, seams, patterns) per character
9. [ ] **Edge treatment**: Consistent corner rounding (sharp vs soft edges)
10. [ ] **Shadow direction**: Light source consistent across all characters in the same scene

## Common Anti-Patterns

### Inconsistent line weight
```
Character A: stroke-width="2"
Character B: stroke-width="4"
Character C: stroke-width="1"
```
Fix: Define a line weight system and apply globally.

### Mixed shading styles
```
Head: cel-shaded with hard shadows
Body: soft gradient shading
Legs: flat, no shading at all
```
Fix: Choose one shading method and apply consistently to all body parts.

### Detail density mismatch
One character has individually drawn buttons, zippers, and stitching while another is a flat silhouette. Even if intentional, they will look like they belong to different projects.

Fix: Define a "detail budget" per character size and stick to it.

### Over-rendering at game size
Adding wrinkles, pores, and strand-level hair detail to a character that will be displayed at 48px tall.

Fix: Design at target resolution. Detail that isn't visible is wasted effort and file size.

## Style Reference Template

When starting a new project, fill this out first:

```yaml
# .charchar style reference
outline:
  style: solid          # solid | tapered | none
  weight: 3px           # base outline width
  color: "#1a1a2e"      # outline color

shading:
  method: cel           # cel | gradient | flat
  levels: 3             # number of value steps per color
  shadow_shift: -15     # hue shift for shadows (degrees)
  shadow_darken: 15     # lightness reduction (%)

proportions:
  head_ratio: 3         # body heights per head
  eye_size: large       # small | medium | large
  hand_detail: mitten   # mitten | 3finger | 5finger

detail:
  density: medium       # minimal | low | medium | high
  texture: none         # none | crosshatch | dots | noise
```
