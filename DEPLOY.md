# Deploying wallykroeker.com

Website deploy pattern (FabLab). Full pattern: `~/projects/fablab/docs/website-deploy-pattern.md` on bob01.

- `./deploy.sh staging [ref]` builds `origin/main` (or `ref`) on web-staging (LXC 166) and runs it at
  `http://wallykroeker.staging.kroeker.fun` (port 8104, LAN/Tailscale only).
- `./deploy.sh prod` sends the exact image staging is running to wallykroeker-prod (LXC 170, 10.10.10.68). It does not rebuild.
- `./deploy.sh rollback` puts prod back on the previous release (last 3 images kept).

The old path, `scripts/deploy.sh` (build in place on LXC 102), stays until the cutover below is done and accepted.

## Runtime state (named volumes, backed up nightly by `web-backup` on LXC 170)

| Volume (`wallykroeker-<env>_…`) | Mounted at | What it is | Old location on LXC 102 |
|---|---|---|---|
| `tetris` | `/app/data` | tetris high scores | `~/wallykroeker.com/data/tetris-highscores.json` |
| `podcast` | `/app/public/pf` | private Pebble podcast feed | `~/wallykroeker.com/public/pf/` (gitignored) |
| `uploads` | `/app/public/uploads` | one legacy Easter photo in public/ | `~/wallykroeker.com/public/uploads/` |
| `easter` | `/home/node/easter2026-uploads` | Easter 2026 photo uploads | `~/easter2026-uploads/` |
| `print-requests` | `/home/node/print-requests` | /print form submissions | `~/print-requests/` |

Volume paths on the box: `/var/lib/docker/volumes/wallykroeker-prod_<name>/_data`, files owned by uid 1000.
Next reads `public/` at startup, so **restart the container after adding podcast files by hand**:
`ssh root@wallykroeker-prod.apps.kroeker.fun 'cd /srv/sites/wallykroeker && docker compose -p wallykroeker-prod restart'`.
`scripts/add-pebble-episode.sh --remote` still targets the old box and needs updating before cutover.

Secrets (Infisical FabLab `<env>:/websites/wallykroeker`): `MANIFESTO_PASSPHRASE`, `PRINT_NTFY_USER`, `PRINT_NTFY_PASSWORD`,
`PRINT_NTFY_TOPIC`, `PRINT_NTFY_DRYRUN`, and in prod `CF_TUNNEL_TOKEN`. Staging has `PRINT_NTFY_DRYRUN=1` and dummy ntfy
credentials, so a staging /print request is saved and logged but never sent to Wally's phone.

## Tunnels

| Tunnel | Id | Connector | Ingress |
|---|---|---|---|
| wallykroeker.com (old) | `78708d5c-3142-462d-b783-f72cb75720ce` | LXC 102 (token inline in its systemd unit) | `wallykroeker.com -> http://localhost:3000` |
| wallykroeker-prod (new) | `eacfca08-9030-4861-9616-4ecd7035b520` | LXC 170 (Ansible, `--token-file`) | `wallykroeker.com -> http://localhost:8104` |

Public traffic follows the DNS record, not the tunnel: `wallykroeker.com` is a proxied CNAME (record id
`85ffbc57207b342ff8f344d249c2d962`, zone `d85212a79628780655b7e44ea22275fa`). Whichever tunnel it names serves the site.

## Cutover (needs Wally's yes)

Two jobs on bob01 write to the OLD box today and must move with the site:

- **Pebble audio** (cron 07:30 daily, 08:00 Sunday): `TSFUR/scripts/pebble-audio/generate-{daily,weekly}-episode.py` rsync
  bob01's `~/projects/wallykroeker.com/public/pf/` to `docker@wallykroeker.apps.kroeker.fun:.../public/pf/`.
  New target: `root@wallykroeker-prod.apps.kroeker.fun:/var/lib/docker/volumes/wallykroeker-prod_podcast/_data/` with
  `-e "ssh -i ~/.ssh/web-deploy"`, then `chown -R 1000:1000` that folder and restart the container (Next only serves new public files after a restart).
- **Nightly build-log publish** (Howard, cron 23:30): commits to main and deploys with `scripts/deploy.sh`. New deploy:
  `./deploy.sh staging && ./deploy.sh prod`. Update the repo's CLAUDE.md deploy section and retire `scripts/deploy.sh` at the same time.

0. **Before the flip:** merge `deploy/per-site-pattern` into main (it only adds files), run `./deploy.sh staging` then
   `./deploy.sh prod` from main so the new box has every post published since, and repoint the two jobs above.
1. **Final state sync.** Freeze is not needed; copy the latest of each state folder from LXC 102 into the prod volumes,
   then restart the container (commands in `scripts/` are not used; run these from bob01):
   ```bash
   O="ssh docker@wallykroeker.apps.kroeker.fun"; N="ssh -i ~/.ssh/web-deploy root@wallykroeker-prod.apps.kroeker.fun"
   V=/var/lib/docker/volumes/wallykroeker-prod
   $O 'tar -C ~/wallykroeker.com/data -cf - tetris-highscores.json' | $N "tar -C ${V}_tetris/_data -xf -"
   $O 'tar -C ~/wallykroeker.com/public/pf -cf - .'                 | $N "tar -C ${V}_podcast/_data -xf -"
   $O 'tar -C ~/easter2026-uploads -cf - .'                          | $N "tar -C ${V}_easter/_data -xf -"
   $O 'tar -C ~/print-requests -cf - .'                              | $N "tar -C ${V}_print-requests/_data -xf -"
   $N "chown -R 1000:1000 ${V}_tetris/_data ${V}_podcast/_data ${V}_easter/_data ${V}_print-requests/_data && cd /srv/sites/wallykroeker && docker compose -p wallykroeker-prod restart"
   ```
2. **Point DNS at the new tunnel** (one API call; the site is served by LXC 170 within seconds):
   ```bash
   set -a; . ~/.claude/.env; set +a
   curl -s -X PATCH -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H 'Content-Type: application/json' \
     https://api.cloudflare.com/client/v4/zones/d85212a79628780655b7e44ea22275fa/dns_records/85ffbc57207b342ff8f344d249c2d962 \
     --data '{"content":"eacfca08-9030-4861-9616-4ecd7035b520.cfargotunnel.com"}'
   ```
3. **Check through the edge:** home headline, /about, /work, /print, /blog/2026-03-01-jellyfin-in-7-minutes, /tetris scores,
   /easter2026 photos, the podcast feed, and one real /print request (it should reach wally-inbox once).
4. **Leave LXC 102 running** (wally-web + its connector) for at least a week. Do not stop or delete anything there without Wally's yes.
5. After the week: new tunnel accepted, retire the old tunnel 78708d5c and LXC 102 (separate approval).

## Rollback (one step)

Point the CNAME back at the old tunnel. LXC 102 is untouched and still serving on its own tunnel, so this takes effect in seconds:

```bash
set -a; . ~/.claude/.env; set +a
curl -s -X PATCH -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H 'Content-Type: application/json' \
  https://api.cloudflare.com/client/v4/zones/d85212a79628780655b7e44ea22275fa/dns_records/85ffbc57207b342ff8f344d249c2d962 \
  --data '{"content":"78708d5c-3142-462d-b783-f72cb75720ce.cfargotunnel.com"}'
```

If the two jobs were already repointed, point them back too (or the next episode and build log land only on the new box).
Anything written on the new box after cutover (new tetris scores, uploads, print requests) stays in its volumes; copy it back by hand if needed.
