#!/usr/bin/env bash
set -euo pipefail

REPO="all-o-labs/charchar"
PLUGIN_DIR="${HOME}/.claude/plugins/${REPO}"

echo ""
echo "  ✦ charchar — character design skill pack for Claude Code"
echo ""

# Check if claude CLI exists
if ! command -v claude &>/dev/null; then
  echo "  ✗ Claude Code CLI not found. Install it first:"
  echo "    https://docs.anthropic.com/en/docs/claude-code"
  exit 1
fi

# Install or update
if [ -d "$PLUGIN_DIR" ]; then
  echo "  ↻ Updating existing installation..."
  git -C "$PLUGIN_DIR" pull --ff-only 2>/dev/null || {
    echo "  ↻ Pull failed, re-cloning..."
    rm -rf "$PLUGIN_DIR"
    git clone --depth 1 "https://github.com/${REPO}.git" "$PLUGIN_DIR"
  }
else
  echo "  ↓ Installing charchar plugin..."
  mkdir -p "$(dirname "$PLUGIN_DIR")"
  git clone --depth 1 "https://github.com/${REPO}.git" "$PLUGIN_DIR"
fi

# Register plugin if not already registered
SETTINGS_FILE="${HOME}/.claude/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
  if grep -q "charchar" "$SETTINGS_FILE" 2>/dev/null; then
    echo "  ✓ Plugin already registered"
  else
    # Add to plugins array using node for safe JSON manipulation
    node -e "
      const fs = require('fs');
      const s = JSON.parse(fs.readFileSync('$SETTINGS_FILE', 'utf-8'));
      if (!s.plugins) s.plugins = [];
      if (!s.plugins.includes('$PLUGIN_DIR')) s.plugins.push('$PLUGIN_DIR');
      fs.writeFileSync('$SETTINGS_FILE', JSON.stringify(s, null, 2) + '\n');
    " 2>/dev/null && echo "  ✓ Plugin registered in settings.json" || {
      echo "  ! Could not auto-register. Run manually:"
      echo "    claude plugin add ${REPO}"
    }
  fi
else
  echo "  ! No settings.json found. Run manually:"
  echo "    claude plugin add ${REPO}"
fi

echo ""
echo "  ✓ charchar installed at: $PLUGIN_DIR"
echo ""
echo "  19 skills ready. Restart Claude Code to load them."
echo "  Try: /create-character \"a brave knight\""
echo ""
