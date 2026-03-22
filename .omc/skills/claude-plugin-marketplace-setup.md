---
id: claude-plugin-marketplace-setup
name: Claude Code Plugin Marketplace Setup
description: How to make a GitHub repo installable as a Claude Code plugin via marketplace registration
source: charchar project — trial-and-error with claude plugin CLI
triggers:
  - "claude plugin install"
  - "plugin marketplace"
  - ".claude-plugin"
  - "marketplace.json"
  - "plugin validate"
  - "setup.sh curl bash"
quality: high
---

# Claude Code Plugin Marketplace Setup

## The Insight

A GitHub repo becomes a Claude Code plugin through a **two-layer system**: the repo is both a **marketplace** (registry) and a **plugin** (the actual extension). The CLI command is `plugin install`, NOT `plugin add`. The marketplace manifest has strict schema validation — only `name`, `owner`, and `plugins` are allowed at root level.

## Why This Matters

Without understanding this two-layer model, you'll get `unknown command 'add'` or `Plugin not found` errors. The CLI help shows `install`, but installation requires the plugin to be in a registered marketplace first. Self-hosting (repo = marketplace = plugin) is the fastest path.

## Recognition Pattern

- Building a Claude Code skill pack or plugin for distribution
- User wants `curl ... | bash` one-line install
- Seeing "Plugin not found" when running `claude plugin install`
- Need to make a GitHub repo installable as a plugin

## The Approach

### 1. Required Files

```
.claude-plugin/
├── plugin.json          # Plugin metadata
└── marketplace.json     # Marketplace registry (lists this repo as a plugin)
.claude/
└── skills/              # Actual skill files (SKILL.md per skill)
    └── my-skill/
        └── SKILL.md
```

### 2. marketplace.json — Strict Schema

Only these root fields are allowed (`claude plugin validate .` will reject extras):

```json
{
  "name": "my-plugin",
  "owner": { "name": "org-name" },
  "plugins": [
    {
      "name": "my-plugin",
      "description": "...",
      "version": "1.0.0",
      "author": { "name": "org-name" },
      "source": "./",
      "category": "development",
      "homepage": "https://github.com/org/repo",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

**Rejected fields at root**: `$schema`, `description`, `version` — these cause validation failure.

### 3. plugin.json

```json
{
  "name": "my-plugin",
  "description": "...",
  "version": "1.0.0",
  "author": { "name": "org-name" },
  "skills": "./.claude/skills"
}
```

The `skills` field points to where SKILL.md files live.

### 4. CLI Commands (correct ones)

```bash
# NOT "plugin add" — that doesn't exist
claude plugin marketplace add org/repo    # Register marketplace
claude plugin install my-plugin           # Install from marketplace
claude plugin update my-plugin            # Update existing
claude plugin list                        # List installed
claude plugin validate .                  # Validate manifest

# Scope options: --scope user|project|local
```

### 5. setup.sh Pattern for `curl | bash`

Key gotchas:
- `read` needs `/dev/tty` when piped: `read -r choice </dev/tty 2>/dev/null || choice="1"`
- Install-first, update-fallback (not update-first) — avoids scope mismatch errors
- `claude plugin install` fails silently with wrong scope if plugin exists elsewhere
- GitHub raw file cache can serve stale versions for a few minutes after push

### 6. Validate Before Publishing

```bash
claude plugin validate .
```

Must pass (warnings OK, errors not OK) before `git push`.

## Example

The charchar project setup.sh flow:
1. Check `claude` CLI exists
2. Ask scope (user/project) via `/dev/tty`
3. `claude plugin marketplace add org/repo` (idempotent)
4. `claude plugin install plugin-name --scope $SCOPE` (with update fallback)
