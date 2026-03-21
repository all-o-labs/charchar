---
name: polish-char
description: Scan and improve character design quality — silhouette, color, proportion, line work, and optimization
user-invocable: true
args:
  - name: character_file
    description: Path to the character file to polish
    required: true
category: 품질
license: MIT
---


# Polish Character

Scan an existing character design and systematically improve its quality across five dimensions. This skill acts as a professional design review and auto-fix pass.

## Workflow

### Step 1: Scan and Diagnose

Read the character file and analyze across all five quality dimensions. Produce a diagnostic report before making any changes.

### Step 2: Silhouette Check

Test the character's silhouette readability:

- Apply a mental `brightness(0)` filter — is the shape distinctive?
- Check at reduced sizes (64px, 32px) — still recognizable?
- Verify negative space between limbs and body
- Confirm at least one unique silhouette feature exists

**Auto-fix**: Adjust poses to open up negative space. Add or refine distinctive elements (hair, accessories, weapon).

### Step 3: Color Harmony Audit

Verify the color palette follows design principles:

- Check 60-30-10 distribution
- Verify color scheme consistency (complementary, analogous, triadic)
- Test for sufficient contrast between adjacent areas (3:1 minimum)
- Validate accessibility for color vision deficiency

```javascript
// Quick contrast ratio check
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
```

**Auto-fix**: Adjust saturation/lightness to improve harmony. Redistribute colors toward 60-30-10. Boost contrast where insufficient.

### Step 4: Proportion Consistency

Verify proportions are internally consistent:

- Head-to-body ratio matches the stated style
- Limb proportions are symmetrical (unless intentionally asymmetric)
- Feature sizes are consistent (both eyes same size, etc.)
- Proportions match other characters in the project (if .charchar config exists)

**Auto-fix**: Normalize proportions to the target ratio. Fix asymmetry in supposedly symmetric elements.

### Step 5: Line Quality

Inspect stroke and path quality:

- Consistent stroke-width across the character
- Clean path data (no unnecessary points)
- Proper stroke-linecap and stroke-linejoin
- Line weight hierarchy (outline > internal > detail)

```svg
<!-- Before: inconsistent lines -->
<path stroke-width="2.3"/>
<path stroke-width="3.1"/>
<path stroke-width="1.8"/>

<!-- After: consistent system -->
<path stroke-width="3"/>   <!-- outline -->
<path stroke-width="1.5"/> <!-- internal -->
<path stroke-width="1"/>   <!-- detail -->
```

**Auto-fix**: Normalize stroke-width values to the nearest standard. Apply consistent linecap/linejoin.

### Step 6: Detail Density Balance

Check that detail is evenly distributed:

- No area has significantly more detail than others
- Detail level matches the target display size
- Unnecessary complexity is removed
- Key areas (face, hands) have appropriate detail priority

**Auto-fix**: Simplify over-detailed areas. Add subtle detail to bare areas.

### Step 7: Optimization

Reduce file size without visual impact:

- Simplify SVG paths (reduce control points)
- Merge redundant groups
- Remove hidden elements
- Optimize color values (use shorthand hex where possible)
- Add appropriate `image-rendering` for pixel art

### Step 8: Generate Report

Output a before/after comparison and change summary:

```
Polish Report
=============
Silhouette:  ✓ Pass (score: 8/10)
Color:       ✓ Fixed — adjusted accent saturation +15%
Proportions: ✓ Pass (consistent 3-head ratio)
Lines:       ✓ Fixed — normalized 4 stroke-width values
Detail:      ✓ Fixed — simplified over-detailed boot area
Optimization: Reduced file size by 23%
```

## Do

- Always scan before fixing — understand the design intent first
- Preserve the character's personality during fixes
- Keep a backup of the original before modifications
- Verify the polish didn't break animations or interactions

## Don't

- Over-polish to the point of losing character personality
- Change the art style during polish (e.g., adding outlines to a flat design)
- Optimize pixel art with anti-aliasing (use nearest-neighbor)
- Remove intentional asymmetry or quirky features
