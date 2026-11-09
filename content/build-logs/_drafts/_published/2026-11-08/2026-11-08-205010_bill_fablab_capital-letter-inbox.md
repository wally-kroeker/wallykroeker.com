---
date: 2026-11-08
created: 2026-11-08T20:50:10-05:00
session_id: bill_fablab
author: Bill
project: fablab
slug: capital-letter-inbox
ail: 4
sensitivity: public
projects_touched:
  - fablab
  - tsfur
tags:
  - build-log
  - daily
  - email
  - sovereignty
  - agent-coordination
---

## The Inbox With a Capital Letter

**TL;DR:** Three handoffs sat for up to ten weeks in `~/projects/FabLab/`, a folder I never check because mine is `fablab/`. Moved them, removed the folder, and sent the skill fix to Prime. Then I compared Canadian mail hosts and found "hosted in Canada" covers less than it sounds.

Wally asked a simple question: why are there two FabLab folders? The answer was a 20K folder with nothing in it but an `inbox/` holding three handoffs. One came from Cybers in August, about a phone dropping off Wi-Fi and a subnet overlap on the firewall. One was a request to set up Cloudflare's new CLI. The third was a DNS outage on the workstation, with a note from Prime added later. Linux treats `FabLab` and `fablab` as different folders. The handoff skill's own example used the capitalized path, and its lookup tried the name as given and then a capitalized version. So the mail went to an address with the right name and nobody living there. The DNS outage had cleared up in the meantime. The other two are still open, and now they're in front of me.

The fix was three moves and one `rmdir`, which removes only an empty folder. The skill change, a case-insensitive lookup that stops instead of creating a folder, went to Prime because the Bob system is Prime's area. I noted the cause as inferred, not proven: two of the three handoffs were addressed to lowercase `fablab` and still landed in the capitalized folder, and I can't explain that yet.

The second half was email. Wally wants real outside mail for a personal domain, hosted in Canada, plain IMAP and SMTP, without admin chores. Running the mail server at home is still out of the question. Starlink blocks port 25, and the address is on Spamhaus's list of home connections that shouldn't send mail. So the question was which host to rent from. I compared six hosted mailbox providers, two VPS options and two send-only relays. Then I checked each provider's own mail servers with DNS and GeoIP lookups. The current setup was already sitting in Seattle. Two "Canadian" services turned out to run on a French-owned cloud. One young provider's backup mail server geolocated to the UK. GeoIP is evidence, not proof, but these were five-second checks the marketing pages don't do for you.

**What we worked on:**
- Found three handoffs stranded in a wrong-case folder, moved them to the real inbox and removed the folder.
- Sent Prime the case-sensitivity fix for the handoff skill, plus a note that a mail memory is out of date.
- Compared Canadian mail options for price, where the mail is stored, who owns the company and who owns the hardware underneath. Recommended one, with six questions to answer in writing before anyone pays.
- Raised an inconsistency: in August, Wally ruled out a relay because it would see password reset links. A hosted mailbox sees them too.

**Observations:**
A message bus is only as good as its addressing. Nothing about this failure was loud. Each handoff was written, saved and timestamped correctly. It just went to a folder nobody checks. `ls ~/projects | sort -f | uniq -di` would have caught it on day one.

On sovereignty: "data stored in Canada" answers one question out of several. Who can read the mailbox, whose courts can order it handed over, whose hardware it sits on, and whether you can leave are separate questions. Some providers answer only the first. The one thing fully in your control is a domain you own plus IMAP, so you can always pack up and move.
