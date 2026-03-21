# Silhouette Design

## Why Silhouettes Matter

A character's silhouette is the single most important visual test. If your character isn't recognizable as a solid black shape at 32x32 pixels, the design needs work.

## The Silhouette Test

Apply this CSS filter to test any character:

```css
.silhouette-test {
  filter: brightness(0) saturate(0);
  /* or for SVG: */
  /* fill: black; stroke: none; */
}

/* Scale-down test */
.silhouette-test-small {
  filter: brightness(0) saturate(0);
  width: 32px;
  height: 32px;
  image-rendering: auto; /* let it blur naturally */
}
```

### JavaScript silhouette check

```javascript
function createSilhouetteTest(element) {
  const clone = element.cloneNode(true);
  clone.style.filter = 'brightness(0) saturate(0)';
  clone.style.position = 'fixed';
  clone.style.top = '10px';
  clone.style.right = '10px';
  clone.style.width = '64px';
  clone.style.zIndex = '9999';
  clone.style.border = '1px solid #666';
  document.body.appendChild(clone);
  return clone;
}
```

## Role-Based Silhouette Patterns

Different character roles should have distinct silhouette shapes:

### Hero / Protagonist
- **Shape**: Triangle (broad shoulders, narrow waist) or inverted triangle
- **Key features**: Confident stance, strong vertical line, distinctive hair or headgear
- **Proportion**: Balanced, symmetrical

```
    ▲          Broad shoulders
   ╱ ╲         Narrow waist
  ╱   ╲        Strong legs planted
 ╱     ╲       Upright posture
╱_______╲      Stable base
```

### Villain / Antagonist
- **Shape**: Angular, sharp edges, asymmetric elements
- **Key features**: Pointed shoulders, cape/cloak creating drama, tall or imposing
- **Proportion**: Often elongated or exaggerated

```
   ╱╲         Sharp, angular top
  ╱  ╲╲       Asymmetric elements
 ╱    ╲╲╲     Cape or flowing fabric
╱      ╲╲╲╲   Creates visual mass
╲______╱╱╱╱   Unstable, threatening
```

### Support / Healer
- **Shape**: Round, soft curves, approachable
- **Key features**: Open posture, rounded accessories, gentle proportions
- **Proportion**: Compact, non-threatening

```
   ○○○         Soft, rounded top
  ○   ○        Open, gentle shape
 ○     ○       Approachable width
  ○   ○        Tapers gently
   ○○○         Stable, grounded
```

### Tank / Warrior
- **Shape**: Rectangle or barrel, massive, wide
- **Key features**: Wide stance, heavy armor silhouette, thick limbs
- **Proportion**: Wide > tall, emphasis on mass

```
 ██████████    Wide, blocky top
 ██████████    No taper — pure mass
 ██████████    Thick, solid body
 ██  ████  █   Wide, planted legs
 ██  ████  █   Immovable base
```

### Scout / Rogue
- **Shape**: Slim, dynamic, asymmetric lean
- **Key features**: Action pose, hood or mask, tools visible on silhouette
- **Proportion**: Lean and angular, suggests speed

```
     ╱╲        Pointed hood/hair
    ╱  │       Asymmetric lean
   ╱   │       Slim, agile body
  ╱   ╱        Dynamic pose
 ╱___╱         Forward momentum
```

## Silhouette Differentiation Techniques

### 1. Headwear and Hair

The head is the first thing players see. Make it distinct:

```svg
<!-- Distinct head silhouettes -->
<!-- Wizard: pointed hat -->
<polygon points="50,5 40,30 60,30"/>
<!-- Knight: flat top helmet -->
<rect x="38" y="10" width="24" height="20" rx="2"/>
<!-- Rogue: hood -->
<path d="M 35,30 Q 50,5 65,30"/>
<!-- Berserker: wild hair -->
<path d="M 30,25 Q 35,5 50,15 Q 65,5 70,25"/>
```

### 2. Body Shape Variation

Avoid same-body-different-head syndrome:

- Vary shoulder width (narrow / standard / broad)
- Vary torso taper (hourglass / barrel / inverted)
- Vary leg proportions (long-legged / stocky / standard)
- Vary stance width (narrow / shoulder-width / wide)

### 3. Props and Accessories

Use equipment to break the basic body silhouette:

- Weapons: Sword on back, staff in hand, bow at side
- Capes/cloaks: Add drama and visual mass
- Bags/pouches: Break symmetry, add character
- Wings/tails: Unique profiles for non-human characters

### 4. Asymmetry

Perfect symmetry is boring. Break it intentionally:

- One pauldron larger than the other
- Hair parted to one side
- Weapon on one hip
- One arm different (prosthetic, wrapped, armored)

## Size Hierarchy

Characters should be identifiable at multiple sizes:

| Size | What Must Read |
|------|----------------|
| 128px+ | Full detail, facial expression, accessories |
| 64px | Overall shape, key features, role identification |
| 32px | Basic silhouette, dominant color, general shape |
| 16px | Shape + primary color blob only |

### Testing at different scales

```css
.char-preview-lg { width: 128px; height: 128px; }
.char-preview-md { width: 64px; height: 64px; }
.char-preview-sm { width: 32px; height: 32px; image-rendering: pixelated; }
.char-preview-xs { width: 16px; height: 16px; image-rendering: pixelated; }
```

## Silhouette Checklist

Before finalizing a character design, verify:

1. [ ] Recognizable as a solid black shape?
2. [ ] Distinct from other characters in the same project?
3. [ ] Role/personality readable from shape alone?
4. [ ] Identifiable at 32x32 pixel size?
5. [ ] At least one unique feature breaks the generic human outline?
6. [ ] Head shape is distinctive?
7. [ ] Asymmetry is present and intentional?
8. [ ] Negative space (gaps between limbs/props) is used effectively?
9. [ ] Action pose conveys character personality?
10. [ ] Silhouette works from multiple angles (front, side, 3/4)?

## Do / Don't

### Do
- Design the silhouette FIRST, then add internal detail
- Use negative space between arms and body for readability
- Give every character at least one "signature" silhouette element
- Test at game-resolution size early in the process

### Don't
- Start with color and add shape later
- Make all characters the same height and build
- Rely on color or internal detail for character identification
- Ignore how the silhouette looks in the actual game context
