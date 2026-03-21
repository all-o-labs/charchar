#!/usr/bin/env bash
set -euo pipefail

MARKETPLACE="all-o-labs/charchar"
PLUGIN="charchar"

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
echo "    1) User    — available in all your projects (default)"
echo "    2) Project — this project only ($(basename "$PWD"))"
echo ""
printf "  Choose [1/2] (default: 1): "
read -r choice </dev/tty 2>/dev/null || choice="1"

case "${choice:-1}" in
  2) SCOPE="project" ;;
  *) SCOPE="user" ;;
esac

echo ""

# Add marketplace if not already added
if claude plugin marketplace list 2>/dev/null | grep -q "$PLUGIN"; then
  echo "  ✓ Marketplace already registered"
else
  echo "  + Adding charchar marketplace..."
  claude plugin marketplace add "$MARKETPLACE" --scope "$SCOPE"
fi

# Try update first, if it fails then install fresh
if claude plugin update "$PLUGIN" --scope "$SCOPE" 2>/dev/null; then
  echo "  ✓ charchar updated ($SCOPE)"
else
  echo "  ↓ Installing charchar ($SCOPE)..."
  claude plugin install "$PLUGIN" --scope "$SCOPE"
  echo "  ✓ charchar installed ($SCOPE)"
fi

echo ""
echo "  19 skills ready. Restart Claude Code to load them."
echo "  Try: /create-character \"a brave knight\""
echo ""
