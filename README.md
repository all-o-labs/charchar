# charchar

**Character design skill pack for AI coding tools.**

Make your AI create stunning 2D/3D characters — pixel art, sprites, 3D models, avatars, and more. One install adds 19 slash commands to Claude Code that bring professional character design to AI-assisted development.

## Install

```bash
# One-line install (or update)
bash <(curl -fsSL https://raw.githubusercontent.com/all-o-labs/charchar/main/scripts/setup.sh)
```

Or manually:

```bash
# Claude Code plugin
claude plugin add all-o-labs/charchar

# npx (after npm publish)
npx charchar
```

Skills are installed into `.claude/skills/` and loaded automatically.

## Skills

### Auto-loaded (always active)

| Skill | Description |
|-------|-------------|
| `character-design` | Core best practices — proportions, color harmony, silhouette readability |

### Create

| Command | Description | Args |
|---------|-------------|------|
| `/create-character` | Full character from concept to code | `concept`, `style?`, `size?` |
| `/create-sprite` | 2D game sprites (pixel, vector, canvas) | `character`, `format?`, `resolution?` |
| `/create-3d` | Three.js / WebGL 3D character | `character`, `polycount?`, `texture?` |
| `/create-avatar` | Profile avatar (SVG, multi-platform) | `style?`, `size?`, `platform?` |

### Style

| Command | Description | Args |
|---------|-------------|------|
| `/pixel-art` | Pixel art with palette limits and dithering | `character`, `resolution?`, `palette?` |
| `/chibi` | Super-deformed 2-3 head ratio | `character`, `head_ratio?` |
| `/realistic` | Anatomically accurate realistic style | `character`, `detail_level?` |
| `/flat` | Minimal flat design, no outlines | `character`, `complexity?` |
| `/retro` | 8-bit / 16-bit retro era | `character`, `era?`, `platform?` |

### Enhance

| Command | Description | Args |
|---------|-------------|------|
| `/animate-char` | Character animations (idle, walk, run, attack) | `character`, `animation_type?`, `fps?` |
| `/expression-sheet` | Expression grid with intensity levels | `character`, `expressions?` |
| `/sprite-sheet` | Pack frames into optimized sprite sheets | `sprites`, `columns?`, `padding?` |
| `/color-palette` | Generate harmonious color palettes | `character?`, `mood?`, `scheme?` |
| `/turnaround` | Multi-view turnaround sheet | `character`, `views?` |

### Quality

| Command | Description | Args |
|---------|-------------|------|
| `/polish-char` | Scan and improve character quality | `character_file` |
| `/critique-char` | Design critique with scoring | `character_file`, `focus?` |
| `/harmonize` | Unify style across character cast | `character_files...` |

### System

| Command | Description |
|---------|-------------|
| `/teach-charchar` | Scan project and generate `.charchar` config |

## How It Works

charchar is a collection of Markdown skill files that teach AI coding tools how to create better characters. The core `character-design` skill loads automatically and applies best practices to every character-related task. Slash commands give you targeted control over specific workflows.

### What's inside each skill?

- **Do/Don't patterns** with code examples
- **Step-by-step workflows** for each character task
- **Reference guides** for anatomy, proportions, color theory, expressions, silhouettes, and style
- **Code patterns** for SVG, CSS, Canvas, Three.js, and game frameworks

## Development

```bash
# Build for all providers
npm run build

# Output goes to dist/
```

## License

MIT
