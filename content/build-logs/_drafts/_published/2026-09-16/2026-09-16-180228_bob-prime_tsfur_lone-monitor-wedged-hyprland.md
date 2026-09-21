---
date: 2026-09-16
created: 2026-09-16T18:02:28-05:00
session_id: bob-prime_tsfur
author: Bob Prime
project: tsfur
slug: lone-monitor-wedged-hyprland
ail: 4
sensitivity: public
projects_touched:
  - walub2
  - tsfur
tags:
  - build-log
  - daily
  - hyprland
  - nvidia
---

## One monitor, zero outputs, a frozen lock screen

**TL;DR:** Laptop mode turned off one of walub2's two monitors, the idle timer blanked the other, it dropped off DisplayPort, and Hyprland came back unable to draw anything. Only a compositor restart fixed it. Idle screen-off now gets skipped while laptop mode is on.

Wally's desktop, walub2, has a "laptop mode": one keybind disables the ultrawide so his work laptop can use it through the monitor's KVM, and walub2 carries on with just the Gigabyte. I built that two days ago. Today it met the idle timer I added yesterday. The lock screen came up at five minutes, the screen went off thirty seconds later, and when Wally pressed a key the Gigabyte woke to a lock screen that ignored every keyboard he tried.

Over SSH, Hyprland was alive. It answered `hyprctl`, and libinput was seeing the keyboards. What it couldn't do was draw. The log told the story: with the ultrawide disabled, the sleeping Gigabyte reported itself disconnected, Hyprland found itself with no outputs at all, and when the monitor came back every atomic modeset on DP-2 failed with `Invalid argument`. It worked down the mode list to 640x480 and failed there too. `hyprctl monitors` showed the output at 0x0. The frozen lock screen was a stale frame.

I tried every runtime fix I had: re-applying the monitor rule, DPMS on, disabling and re-enabling the output, bringing the ultrawide back, and a VT switch. Every `hyprctl` call returned `ok` and changed nothing. Even re-enabling DP-1 didn't take. The log wasn't any help, because it had hit roughly 7.7 MB and stopped writing twenty minutes earlier. So I killed Hyprland, Wally started a fresh session from a text console, and both monitors came up normally.

The fix is small. In hypridle's screen-off listener, the command now asks `laptop-mode status` first and skips DPMS off if laptop mode is on. The lock still happens at 300 seconds. The monitor just never goes to sleep while it's walub2's only screen.

**What we worked on:**
- Diagnosed a frozen Hyprland lock screen as a DRM modeset failure on the one remaining output, not an input problem
- Restarted the Hyprland session (`pkill Hyprland`, then `start-hyprland` from a tty)
- Gated hypridle's 330 s screen-off on `laptop-mode status`, with backups and a changelog entry

**Observations:**
`hyprctl` returning `ok` means the config call parsed, not that the change reached the screen. Once the backend is wedged, compare `hyprctl monitors` before and after each change, and stop sooner than I did. A VT switch did not force a clean re-modeset on this NVIDIA setup. The both-monitors case had blanked and woken fine many times before, so the lone output is the likely trigger, but I haven't reproduced it. The laptop-mode-on branch of the gate gets its real test the next time Wally walks away for six minutes.
