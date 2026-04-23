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

if [[ -f "./cursor.md" ]]; then
  TARGETS+=("./cursor.md")
fi

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

failed=0

for target in "${TARGETS[@]}"; do
  if [[ ! -f "$target" ]]; then
    echo "missing: $target"
    failed=1
    continue
  fi

  if cmp -s "$SOURCE" "$target"; then
    echo "ok: $target"
  else
    echo "mismatch: $target"
    failed=1
  fi
done

exit "$failed"
