---
name: expression-sheet
description: Generate a character expression sheet with base and extended emotions at multiple intensity levels
user-invocable: true
args:
  - name: character
    description: Character to generate expressions for
    required: true
  - name: expressions
    description: Expression set scope
    required: false
category: 강화
license: MIT
---


# Expression Sheet

Generate a comprehensive expression sheet for a character, organized as a visual grid with labeled emotions at configurable intensity levels.

## Expression Sets

### Basic (6 expressions)
Joy, Sadness, Anger, Surprise, Fear, Disgust

### Extended (12 expressions)
Basic + Smirk, Confusion, Determination, Embarrassment, Love, Exhaustion

### Full (18 expressions)
Extended + Scheming, Pride, Guilt, Boredom, Pain, Awe

## Workflow

### Step 1: Analyze Character

Read the existing character design and extract:
- Face shape and proportions
- Eye style (round, angular, dot, detailed)
- Mouth style (line, detailed lips, anime)
- Eyebrow style (thick, thin, none)
- Any unique facial features (scars, markings, glasses)

### Step 2: Define Expression Parameters

Map each expression to specific facial feature states:

```javascript
const expressionParams = {
  joy: {
    eyebrows: { angle: 5, height: 2 },
    eyes: { openness: 0.6, shape: 'squint' },
    mouth: { curve: 0.7, width: 1.3, open: 0.3 },
    extras: { blush: 0.2 },
  },
  anger: {
    eyebrows: { angle: -20, height: -2 },
    eyes: { openness: 0.4, shape: 'narrow' },
    mouth: { curve: -0.3, width: 0.9, open: 0.2 },
    extras: { vein: true },
  },
  // ... for each expression
};
```

### Step 3: Generate Grid Layout

Arrange expressions in a readable grid:

```css
.expression-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 24px;
}

.expression-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.expression-label {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### Step 4: Apply Intensity Levels

Each expression at three intensities — subtle, normal, exaggerated:

```
| Subtle (0.3x) | Normal (1.0x) | Exaggerated (1.8x) |
|      😊       |      😄       |        🤣          |
```

### Step 5: Export

Output formats:
- **Grid image**: All expressions in one visual sheet (SVG/HTML)
- **Parameter JSON**: Machine-readable expression data
- **CSS classes**: `.expr-joy`, `.expr-anger`, etc.
- **Individual assets**: Each expression as a separate file

```json
{
  "character": "hero",
  "expressions": {
    "joy": {
      "subtle": { "eyebrowAngle": 1.5, "eyeOpenness": 0.65, "mouthCurve": 0.2 },
      "normal": { "eyebrowAngle": 5, "eyeOpenness": 0.6, "mouthCurve": 0.7 },
      "exaggerated": { "eyebrowAngle": 9, "eyeOpenness": 0.5, "mouthCurve": 1.0 }
    }
  }
}
```

## Do

- Keep the same head angle/position across all expressions for easy comparison
- Include a neutral expression as the baseline reference
- Label every expression clearly
- Maintain character identity across all expressions (same proportions, style)

## Don't

- Change the head size or angle between expressions
- Forget the return-to-neutral transition frames
- Make subtle and exaggerated look identical
- Ignore how expressions look at the character's actual game resolution
