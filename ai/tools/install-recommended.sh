#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
VENDOR_DIR="${ROOT_DIR}/ai/tools/vendor"
mkdir -p "${VENDOR_DIR}"

clone_or_update() {
  local name="$1"
  local url="$2"
  local dest="${VENDOR_DIR}/${name}"

  if [[ -d "${dest}/.git" ]]; then
    echo "[update] ${name}"
    git -C "${dest}" fetch --all --prune
    git -C "${dest}" pull --ff-only || true
  else
    echo "[clone] ${name}"
    git clone --depth 1 "${url}" "${dest}"
  fi
}

clone_or_update "context7" "https://github.com/upstash/context7.git"
clone_or_update "marketingskills" "https://github.com/coreyhaines31/marketingskills.git"
clone_or_update "ai-marketing-skills" "https://github.com/ericosiu/ai-marketing-skills.git"
clone_or_update "marketing-skills" "https://github.com/kostja94/marketing-skills.git"

echo "Done. Repositories available in: ${VENDOR_DIR}"
