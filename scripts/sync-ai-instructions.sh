#!/usr/bin/env bash
set -euo pipefail

SOURCE="AI_SHARED_INSTRUCTIONS.md"

if [[ ! -f "$SOURCE" ]]; then
  echo "Error: $SOURCE not found in repository root." >&2
  exit 1
fi

TARGETS=(
  "./AGENTS.md"
  "./CLAUDE.md"
  "./GEMINI.md"
  "./CODEX.md"
  "./CURSOR.md"
)

if [[ -d "./frontend" ]]; then
  TARGETS+=(
    "./frontend/AGENTS.md"
    "./frontend/CLAUDE.md"
    "./frontend/GEMINI.md"
    "./frontend/CODEX.md"
    "./frontend/CURSOR.md"
  )
fi

if [[ -d "./backend" ]]; then
  TARGETS+=(
    "./backend/AGENTS.md"
    "./backend/CLAUDE.md"
    "./backend/GEMINI.md"
    "./backend/CODEX.md"
    "./backend/CURSOR.md"
  )
fi

for target in "${TARGETS[@]}"; do
  cp "$SOURCE" "$target"
  echo "synced: $target"
done
