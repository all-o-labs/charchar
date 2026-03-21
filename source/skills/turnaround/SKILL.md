---
name: turnaround
description: Generate multi-view turnaround sheets showing a character from front, three-quarter, side, and back
user-invocable: true
args:
  - name: character
    description: Character to create turnaround for
    required: true
  - name: views
    description: View set scope (basic=4 views, full=8 views)
    required: false
category: 강화
license: MIT
---

# Turnaround Sheet

Generate a multi-view turnaround sheet that shows a character from all key angles, maintaining perfect proportion consistency across views.

## View Sets

### Basic (4 views)
Front, Three-Quarter (3/4), Side (Profile), Back

### Full (8 views)
Front, Front 3/4, Side, Back 3/4, Back, Back 3/4 (opposite), Side (opposite), Front 3/4 (opposite)

## Workflow

### Step 1: Establish Proportion Guide

Create horizontal guide lines that remain constant across all views:

```
─── Top of head ───────────────────────────
─── Chin ──────────────────────────────────
─── Shoulders ─────────────────────────────
─── Chest / Nipple line ───────────────────
─── Waist / Elbow ─────────────────────────
─── Hip / Wrist ───────────────────────────
─── Fingertip ─────────────────────────────
─── Knee ──────────────────────────────────
─── Ankle ─────────────────────────────────
─── Foot base ─────────────────────────────
```

```css
.turnaround-guides {
  --guide-color: rgba(255, 0, 0, 0.2);
  background-image:
    repeating-linear-gradient(
      0deg,
      var(--guide-color) 0px,
      var(--guide-color) 1px,
      transparent 1px,
      transparent calc(100% / var(--head-units))
    );
}
```

### Step 2: Front View (anchor)

The front view is the primary reference. All other views derive from it:

- Establish the character's width at each guide line
- Define symmetry (or intentional asymmetry)
- This view sets the canonical proportions

### Step 3: Side View

Derive from the front view, maintaining height consistency:

- Same height at every guide line
- Depth information: nose projection, chest depth, foot length
- Hair/accessory profile shape

### Step 4: Three-Quarter View

The hardest view — combines front and side information:

- Width narrows compared to front (foreshortening)
- Near side shows more detail than far side
- Features wrap around the form (eyes, belt, etc.)

### Step 5: Back View

Mirror of front with back-specific details:

- Same silhouette width as front at each guide
- Hair from behind, clothing back details
- Any back-specific features (wings, backpack, cape)

### Step 6: Grid Layout

```css
.turnaround-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  align-items: end; /* align feet */
  padding: 40px;
}

.turnaround-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.turnaround-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-top: 12px;
}
```

### Step 7: Consistency Verification

Check these across all views:

```
Checklist:
[ ] Height is identical in all views
[ ] Head size is consistent
[ ] Shoulder width is consistent (accounting for foreshortening)
[ ] Key features appear in correct positions across views
[ ] Color palette is identical across all views
[ ] Line weight is consistent
[ ] Accessories maintain correct relative position
[ ] Clothing details wrap logically around the form
```

## Do

- Always use horizontal guide lines across the entire sheet
- Draw the front view first as the canonical reference
- Keep the character in a neutral A-pose or T-pose for clarity
- Include color and outline versions if possible
- Label each view clearly

## Don't

- Change proportions between views (this is the #1 turnaround mistake)
- Use dramatic perspective — turnarounds should be orthographic
- Add action poses (turnarounds are reference sheets, not action shots)
- Forget to show how asymmetric details look from the opposite side
- Skip the back view (it's the most commonly needed for game sprites)
