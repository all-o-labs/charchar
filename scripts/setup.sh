#!/usr/bin/env bash
set -euo pipefail

REPO="all-o-labs/charchar"

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
if claude plugin list 2>/dev/null | grep -q "charchar"; then
  echo "  ↻ Updating charchar..."
  claude plugin update "$REPO"
  echo "  ✓ charchar updated"
else
  echo "  ↓ Installing charchar..."
  claude plugin add "$REPO"
  echo "  ✓ charchar installed"
fi

echo ""
echo "  19 skills ready. Restart Claude Code to load them."
echo "  Try: /create-character \"a brave knight\""
echo ""
