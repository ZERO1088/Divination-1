#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
cd "$PROJECT_DIR"

PORT="${DEPLOY_RUN_PORT:-5000}"

exec npx serve dist -l "$PORT"
