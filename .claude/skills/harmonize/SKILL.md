---
name: harmonize
description: Unify visual style across multiple characters — line weight, color palette, proportions, and detail density
user-invocable: true
args:
  - name: character_files
    description: Paths to character files to harmonize
    required: true
category: 품질
license: MIT
---


# Harmonize Characters

Analyze multiple characters and unify their visual style while preserving individual identity. Ensures a cohesive cast that looks like it belongs in the same world.

## Workflow

### Step 1: Inventory Scan

Read all character files and extract style metrics:

```javascript
const styleMetrics = {
  lineWeight: { outline: null, internal: null, detail: null },
  palette: { hues: [], saturations: [], lightnesses: [] },
  proportions: { headRatio: null, bodyWidth: null },
  detailDensity: null, // low / medium / high
  shadingMethod: null, // cel / gradient / flat
  outlineStyle: null,  // solid / tapered / none
};
```

### Step 2: Detect Inconsistencies

Compare metrics across the cast:

| Check | What to Compare |
|-------|----------------|
| Line weight | stroke-width values across all characters |
| Outline style | solid vs tapered vs none — must be same |
| Shading method | cel vs gradient vs flat — must be same |
| Head ratio | head-to-body proportion units |
| Eye style | level of detail, shape language |
| Hand/foot detail | simplification level |
| Saturation range | min/max saturation values |
| Detail density | amount of surface detail per unit area |

### Step 3: Establish Canon

Determine the target style based on the majority or the best-executed character:

```yaml
# Harmonization Canon
line_weight:
  outline: 3px
  internal: 1.5px
  detail: 1px
outline_style: solid
shading: cel
head_ratio: 3
eye_style: large_round
hand_detail: mitten
saturation_range: [40, 70]
detail_density: medium
```

### Step 4: Generate Harmony Report

```
Cast Harmony Report
════════════════════════════════════════
Characters analyzed: 5

LINE WEIGHT
  Hero:     outline=3, internal=1.5  ✓
  Villain:  outline=4, internal=2    ✗ → normalize to 3/1.5
  Healer:   outline=3, internal=1    ✗ → normalize internal to 1.5

COLOR HARMONY
  Hero:     sat range 45-65         ✓
  Villain:  sat range 80-95         ✗ → reduce saturation by 20%
  Healer:   sat range 30-50         ✓

PROPORTIONS
  Hero:     3.0 heads               ✓
  Villain:  3.5 heads               ✗ → adjust to 3.0
  Healer:   3.0 heads               ✓

OVERALL: 6/9 checks pass, 3 adjustments needed
```

### Step 5: Apply Fixes

For each inconsistency, generate specific modifications:

- Normalize stroke-width values
- Adjust saturation/lightness to match the cast range
- Scale proportions to match the head ratio
- Unify eye rendering style
- Match detail density level

### Step 6: Cast Balance Check

Verify the full cast works together:

- Line up all characters side by side — do they look like they belong together?
- Test distinguishability — each character should still be unique
- Check color distribution — no two characters share the same dominant hue
- Verify size hierarchy — relative sizes make narrative sense

## Do

- Harmonize toward the strongest design in the cast
- Preserve each character's unique silhouette and personality
- Check harmony at the actual game display size
- Document the established style canon for future characters

## Don't

- Make all characters look identical in the name of consistency
- Change a character's signature color to avoid palette overlap
- Force realistic proportions on a stylized cast (or vice versa)
- Harmonize without considering animation — style must work in motion
