#!/usr/bin/env bash
# Thin wrapper: the shared FabLab deploy tool does the work.
# Usage: ./deploy.sh staging | prod | rollback | status
exec "$HOME/projects/fablab/tools/site-deploy/deploy.sh" "$(cd "$(dirname "$0")" && pwd)" "$@"
