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

# Ask scope
echo "  Where do you want to install charchar?"
echo ""
echo "    1) Global  — available in all projects"
echo "    2) Project — this project only ($(basename "$PWD"))"
echo ""
printf "  Choose [1/2] (default: 1): "
read -r choice </dev/tty 2>/dev/null || choice="1"

case "${choice:-1}" in
  2) SCOPE="--project" ; SCOPE_LABEL="project" ;;
  *) SCOPE="--global"  ; SCOPE_LABEL="global" ;;
esac

echo ""

# Install or update
if claude plugin list 2>/dev/null | grep -q "charchar"; then
  echo "  ↻ Updating charchar ($SCOPE_LABEL)..."
  claude plugin update "$REPO" $SCOPE
  echo "  ✓ charchar updated ($SCOPE_LABEL)"
else
  echo "  ↓ Installing charchar ($SCOPE_LABEL)..."
  claude plugin add "$REPO" $SCOPE
  echo "  ✓ charchar installed ($SCOPE_LABEL)"
fi

echo ""
echo "  19 skills ready. Restart Claude Code to load them."
echo "  Try: /create-character \"a brave knight\""
echo ""
