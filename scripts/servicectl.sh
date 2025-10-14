#!/usr/bin/env bash
set -euo pipefail

# Simple controller for the wally-web systemd service.
# Usage:
#   ./scripts/servicectl.sh               # interactive menu
#   ./scripts/servicectl.sh status|restart|start|stop|logs|tail

UNIT_NAME=${SERVICE_NAME:-wally-web}
PORT=${PORT:-3000}

have_cmd() { command -v "$1" >/dev/null 2>&1; }

systemctl_cmd() {
  if have_cmd systemctl; then
    SYSTEMD_PAGER= systemctl --no-pager "$@" "$UNIT_NAME"
    return $?
  fi
  return 127
}

journal_cmd() {
  if have_cmd journalctl; then
    SYSTEMD_PAGER= journalctl --no-pager "$@" -u "$UNIT_NAME"
    return $?
  fi
  return 127
}

active_state() { systemctl is-active "$UNIT_NAME" 2>/dev/null || echo "unknown"; }
enabled_state() { systemctl is-enabled "$UNIT_NAME" 2>/dev/null || echo "unknown"; }
main_pid() { systemctl show -p MainPID --value "$UNIT_NAME" 2>/dev/null || echo "-"; }
listen_state() {
  if have_cmd ss && ss -ltnp 2>/dev/null | grep -qE ":$PORT\\b"; then echo listening; else echo not-listening; fi
}

status() {
  echo "==> Service: $UNIT_NAME"
  if systemctl_cmd status; then
    exit 0
  fi
  echo "systemd not available or service not registered. Falling back to heuristics..." >&2
  have_cmd ps && ps aux | grep -iE 'next|node' | grep -v grep || true
  if have_cmd ss; then
    ss -ltnp 2>/dev/null | grep -E ":$PORT\b" || true
  elif have_cmd netstat; then
    netstat -ltnp 2>/dev/null | grep -E ":$PORT\b" || true
  fi
}

restart() {
  echo "==> Restarting $UNIT_NAME"
  if systemctl_cmd restart; then
    status
    return
  fi
  echo "Access denied or restart failed. As a non-root user, configure PolicyKit to allow managing this unit." >&2
  echo "Hint: create /etc/polkit-1/rules.d/10-wally-web.rules allowing docker to restart wally-web.service" >&2
  echo "or run: systemctl restart $UNIT_NAME as a privileged user." >&2
  echo "Manual fallback (not managed by systemd): 'pnpm build && pnpm start -p $PORT'" >&2
  exit 1
}

start() {
  echo "==> Starting $UNIT_NAME"
  systemctl_cmd start || { 
    echo "Access denied or start failed. Configure PolicyKit or run as a privileged user." >&2
    exit 1
  }
  status
}

stop() {
  echo "==> Stopping $UNIT_NAME"
  systemctl_cmd stop || { echo "Access denied or stop failed. Configure PolicyKit or run as a privileged user." >&2; exit 1; }
  status
}

logs() {
  journal_cmd -n 100 --no-pager || { echo "journalctl unavailable. Try checking your process logs manually." >&2; exit 1; }
}

tail_logs() {
  journal_cmd -f || { echo "journalctl unavailable. Cannot tail logs." >&2; exit 1; }
}

header_line() {
  echo "Service control for '$UNIT_NAME' (port $PORT) — Active: $(active_state), Enabled: $(enabled_state), PID: $(main_pid), Port: $(listen_state)"
}

interactive_menu() {
  while true; do
    echo ""
    header_line
    echo "1) Status"
    echo "2) Restart"
    echo "3) Start"
    echo "4) Stop"
    echo "5) Show recent logs"
    echo "6) Tail logs (follow)"
    echo "7) Quit"
    read -rp "Select an option [1-7]: " choice
    case "$choice" in
      1) status ;;
      2) restart ;;
      3) start ;;
      4) stop ;;
      5) logs ;;
      6) tail_logs ;;
      7) exit 0 ;;
      *) echo "Invalid option." ;;
    esac
  done
}

main() {
  action=${1:-}
  case "$action" in
    status) status ;;
    restart) restart ;;
    start) start ;;
    stop) stop ;;
    logs) logs ;;
    tail) tail_logs ;;
    "" ) interactive_menu ;;
    *  ) echo "Usage: $0 [status|restart|start|stop|logs|tail]"; exit 2 ;;
  esac
}

main "$@"
