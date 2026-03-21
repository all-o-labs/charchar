# Character Expressions

## The 6 Universal Expressions

Every character needs at least these six base expressions, derived from Paul Ekman's research:

| Expression | Eyebrows | Eyes | Mouth |
|-----------|----------|------|-------|
| Joy | Relaxed/raised | Squinted, crow's feet | Wide smile, teeth visible |
| Sadness | Inner brows raised | Drooping, watery | Corners down, trembling |
| Anger | Pulled down, furrowed | Narrowed, intense | Tight, bared teeth |
| Surprise | Raised high | Wide open, whites visible | Open, round |
| Fear | Raised, pulled together | Wide, tense | Open, pulled back |
| Disgust | Lowered asymmetrically | Narrowed, nose wrinkle | Upper lip raised, tongue out |

## Expression Parameters

Define expressions as a parameter system for programmatic control:

```javascript
const EXPRESSIONS = {
  joy: {
    eyebrowAngle: 5,      // degrees, positive = raised
    eyebrowHeight: 2,     // pixels offset from neutral
    eyeOpenness: 0.6,     // 0 = closed, 1 = wide open
    pupilSize: 1.0,       // multiplier
    mouthWidth: 1.3,      // multiplier from neutral
    mouthHeight: 0.8,     // open amount
    mouthCurve: 0.7,      // -1 = frown, 0 = neutral, 1 = smile
  },
  sadness: {
    eyebrowAngle: -10,
    eyebrowHeight: 3,     // inner brow raised
    eyeOpenness: 0.5,
    pupilSize: 1.1,       // slightly larger (sympathetic)
    mouthWidth: 0.85,
    mouthHeight: 0.1,
    mouthCurve: -0.5,
  },
  anger: {
    eyebrowAngle: -20,
    eyebrowHeight: -2,    // pulled down
    eyeOpenness: 0.4,
    pupilSize: 0.8,       // constricted
    mouthWidth: 0.9,
    mouthHeight: 0.3,
    mouthCurve: -0.3,
  },
  surprise: {
    eyebrowAngle: 15,
    eyebrowHeight: 5,
    eyeOpenness: 1.0,
    pupilSize: 0.7,       // small from shock
    mouthWidth: 0.8,
    mouthHeight: 1.0,
    mouthCurve: 0.0,
  },
  fear: {
    eyebrowAngle: 12,
    eyebrowHeight: 4,
    eyeOpenness: 0.95,
    pupilSize: 0.6,
    mouthWidth: 0.75,
    mouthHeight: 0.7,
    mouthCurve: -0.2,
  },
  disgust: {
    eyebrowAngle: -8,
    eyebrowHeight: -1,
    eyeOpenness: 0.35,
    pupilSize: 0.9,
    mouthWidth: 0.7,
    mouthHeight: 0.4,
    mouthCurve: -0.6,
  },
};
```

## Intensity Levels

Each expression has three intensity levels:

- **Subtle** (0.3x): Slight change, barely noticeable. For background characters or restraint.
- **Normal** (1.0x): Standard readable expression. Default for gameplay.
- **Exaggerated** (1.8x): Over-the-top, squash-and-stretch. For comedy or dramatic moments.

```javascript
function applyIntensity(expression, level) {
  const multiplier = { subtle: 0.3, normal: 1.0, exaggerated: 1.8 }[level];
  const neutral = { eyebrowAngle: 0, eyebrowHeight: 0, eyeOpenness: 0.7,
                     pupilSize: 1.0, mouthWidth: 1.0, mouthHeight: 0, mouthCurve: 0 };
  const result = {};
  for (const [key, value] of Object.entries(expression)) {
    const delta = value - neutral[key];
    result[key] = neutral[key] + delta * multiplier;
  }
  return result;
}
```

## SVG Expression Implementation

```svg
<g class="face" data-expression="joy">
  <!-- Left eyebrow -->
  <path class="eyebrow eyebrow-left"
    d="M 25,38 Q 32,33 40,36"
    stroke="currentColor" stroke-width="2.5" fill="none"
    stroke-linecap="round"/>

  <!-- Right eyebrow -->
  <path class="eyebrow eyebrow-right"
    d="M 55,36 Q 63,33 70,38"
    stroke="currentColor" stroke-width="2.5" fill="none"
    stroke-linecap="round"/>

  <!-- Eyes (squinted for joy) -->
  <ellipse class="eye eye-left" cx="35" cy="45" rx="6" ry="4" fill="currentColor"/>
  <ellipse class="eye eye-right" cx="60" cy="45" rx="6" ry="4" fill="currentColor"/>

  <!-- Mouth (wide smile) -->
  <path class="mouth"
    d="M 33,62 Q 47,75 62,62"
    stroke="currentColor" stroke-width="2" fill="none"
    stroke-linecap="round"/>
</g>
```

## CSS Expression Transitions

```css
.face * {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.face[data-expression="joy"] .eyebrow {
  transform: translateY(-2px) rotate(5deg);
}
.face[data-expression="joy"] .eye {
  transform: scaleY(0.6);
}
.face[data-expression="joy"] .mouth {
  transform: scaleX(1.3) translateY(2px);
}

.face[data-expression="anger"] .eyebrow {
  transform: translateY(2px) rotate(-20deg);
}
.face[data-expression="anger"] .eye {
  transform: scaleY(0.5) scaleX(0.9);
}
.face[data-expression="anger"] .mouth {
  transform: scaleX(0.9) scaleY(0.5);
}

.face[data-expression="surprise"] .eyebrow {
  transform: translateY(-5px) rotate(15deg);
}
.face[data-expression="surprise"] .eye {
  transform: scale(1.3);
}
.face[data-expression="surprise"] .mouth {
  transform: scaleX(0.8) scaleY(1.5);
  border-radius: 50%;
}
```

## Extended Expressions

Beyond the basic six, characters benefit from:

| Expression | Key Features | Use Case |
|-----------|-------------|----------|
| Smirk | Asymmetric smile, one raised brow | Confidence, mischief |
| Confusion | Tilted head, one raised brow, slight frown | Puzzle, lost |
| Determination | Set jaw, focused eyes, slight frown | Boss fight, challenge |
| Embarrassment | Blush, averted gaze, nervous smile | Social, comedy |
| Love | Heart eyes or dilated pupils, soft smile | Romance, admiration |
| Exhaustion | Half-closed eyes, open mouth, drooping | Post-battle, comedy |
| Scheming | Narrowed eyes, thin smile, steepled fingers | Villain, planner |

## Blending Expressions

Complex emotions are blends of basic expressions:

```javascript
function blendExpressions(expr1, expr2, ratio = 0.5) {
  const result = {};
  for (const key of Object.keys(expr1)) {
    result[key] = expr1[key] * (1 - ratio) + expr2[key] * ratio;
  }
  return result;
}

// Nervous smile = joy (0.4) + fear (0.6)
const nervous = blendExpressions(EXPRESSIONS.joy, EXPRESSIONS.fear, 0.6);

// Bitter = sadness (0.5) + anger (0.5)
const bitter = blendExpressions(EXPRESSIONS.sadness, EXPRESSIONS.anger, 0.5);
```

## Do / Don't

### Do
- Keep facial features proportional to the expression intensity
- Use asymmetry for natural-looking expressions
- Animate transitions between expressions smoothly (0.2-0.4s)
- Consider the character's personality when choosing expression style

### Don't
- Make all characters express emotions the same way
- Use extreme expressions for subtle emotional moments
- Forget to animate the return to neutral
- Ignore the rest of the body — shoulders, hands, and posture reinforce expressions
