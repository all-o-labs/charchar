---
name: critique-char
description: Professional design critique with structured tests, scoring, and prioritized improvement recommendations
user-invocable: true
args:
  - name: character_file
    description: Path to the character file to critique
    required: true
  - name: focus
    description: Specific area to focus the critique on
    required: false
category: 품질
license: MIT
---


# Critique Character

Perform a professional design critique on a character using structured tests, produce a scored assessment, and provide prioritized improvement recommendations.

## Critique Framework

### Test 1: Silhouette Test
Fill the character solid black. Is it recognizable? Distinctive?

**Scoring:**
- 10: Instantly recognizable, unique among cast
- 7-9: Recognizable, some distinctive features
- 4-6: Generic shape, could be any character
- 1-3: Unreadable or confusing silhouette

### Test 2: Squash & Stretch Test
Can the character be exaggerated without breaking? This tests design flexibility.

**Scoring:**
- 10: Design stretches and squashes naturally, maintains identity
- 7-9: Works with minor adjustments
- 4-6: Some elements break under deformation
- 1-3: Rigid design that can't be animated expressively

### Test 3: Thumbnail Test
Shrink to 32x32 pixels. Still identifiable?

**Scoring:**
- 10: Clear at tiny sizes, colors and shape read perfectly
- 7-9: Recognizable with some detail loss
- 4-6: Vaguely identifiable, relies on color alone
- 1-3: Unrecognizable blob

### Test 4: Storytelling Test
Does the design communicate the character's personality, role, and world?

**Scoring:**
- 10: Design tells a complete story — role, personality, world all clear
- 7-9: Most attributes are communicated visually
- 4-6: Some personality but role unclear, or vice versa
- 1-3: Generic design, no narrative information

### Test 5: Technical Quality
Code quality, performance, accessibility of the implementation.

**Scoring:**
- 10: Clean code, optimized, accessible, well-structured
- 7-9: Good structure with minor improvements possible
- 4-6: Functional but messy, some optimization needed
- 1-3: Poor code quality, performance issues, no accessibility

## Workflow

### Step 1: Read and Analyze
Read the character file completely. Understand the design intent before critiquing.

### Step 2: Run All Five Tests
Score each test from 1-10 with specific observations.

### Step 3: Generate Score Card

```
╔══════════════════════════════════════╗
║         CHARACTER CRITIQUE           ║
╠══════════════════════════════════════╣
║ Silhouette      ████████░░  8/10    ║
║ Squash/Stretch  ██████░░░░  6/10    ║
║ Thumbnail       █████████░  9/10    ║
║ Storytelling    ███████░░░  7/10    ║
║ Technical       ████████░░  8/10    ║
╠══════════════════════════════════════╣
║ OVERALL         ████████░░  7.6/10  ║
╚══════════════════════════════════════╝
```

### Step 4: Identify Strengths
List 2-3 things the design does well. Be specific:
- "The asymmetric pauldron creates a strong silhouette break"
- "Color palette follows 60-30-10 with good harmony"

### Step 5: Prioritized Improvements
List improvements ranked by impact:

```
Priority  Issue                          Impact  Effort
──────────────────────────────────────────────────────
HIGH      Add negative space in arms     +2 sil  Low
HIGH      Increase accent contrast       +1 col  Low
MEDIUM    Add signature head element     +2 sil  Medium
MEDIUM    Simplify boot detail           +1 tech Low
LOW       Add environment variants       +1 pal  Medium
```

### Step 6: Specific Recommendations
For each improvement, provide concrete actionable steps with code references.

## Do

- Critique the design, not the designer
- Always identify strengths before weaknesses
- Provide specific, actionable fixes (not vague "make it better")
- Consider the target context (game resolution, animation needs)
- Reference specific design principles in your critique

## Don't

- Only list problems without solutions
- Apply rules rigidly without considering design intent
- Compare unfairly to different styles (don't critique pixel art for lacking detail)
- Ignore the character's role in the larger cast
- Focus solely on aesthetics — technical quality matters too
