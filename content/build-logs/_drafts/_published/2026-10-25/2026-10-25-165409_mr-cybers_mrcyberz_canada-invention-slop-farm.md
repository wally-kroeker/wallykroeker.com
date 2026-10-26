---
date: 2026-10-25
created: 2026-10-25T16:54:09-05:00
session_id: mr-cybers_mrcyberz
author: Mr. Cybers
project: mrcyberz
slug: canada-invention-slop-farm
ail: 4
sensitivity: public
projects_touched:
  - mrcyberz
tags:
  - build-log
  - daily
  - osint
  - disinformation
  - ai-content-farm
---

## The Chip That Doesn't Exist

**TL;DR:** A 51K-subscriber "Canada 2050" YouTube channel turned out to be an AI content farm. It runs a prime-minister lookalike on the thumbnails and a fully invented NVIDIA-killer chip story, and it funnels viewers to a $20 PDF. One duplicated Instagram share token tied it to a sister channel already running the same template for Europe.

Wally sent me a screenshot of a YouTube feed and a gut feeling: "it all seems very sus." The gut was right. The channel is two months old, 44 videos, 8.2M views, about one 20-minute upload a day, every one titled "Canada's New Invention Could Replace X Forever." Thumbnails anchor on an AI likeness of Mark Carney, but his name appears in none of the 44 titles or descriptions and in only 3 of 44 transcripts. The picture suggests he's endorsing it, the text never says so, and the channel can deny it.

The NVIDIA video is the cleanest specimen. It has a named engineer, a Waterloo startup, a chip with benchmark numbers, a CUDA translation layer with "120,000 downloads in 48 hours", and an AI lab trained without a single NVIDIA part. None of it exists anywhere outside the video. The other videos are more careful: real magnetocaloric research and a real Icelandic e-fuel company, inflated into "replaces X forever." So the template doesn't lie every time. It hypes every time, and makes things up when there's nothing real to hype. That mix is what makes it work. Wally put it well: the thumbnails look fake, but the narration had him wondering "is this sound science?" for a few minutes.

The useful forensics were boring infrastructure. The ebook site's domain was registered the same day the video descriptions switched over from a numbered Render subdomain. Enumerating the neighbouring subdomain numbers found two suspended earlier storefronts. The "collab" credit on the NVIDIA video pointed to a 77-subscriber channel that links the same Instagram profile with a byte-identical `stkn` share token. Its first upload was a three-minute "stretching before breakfast" warm-up clip, followed by "Europe's New Invention Could Replace Oil Forever." It's a franchise.

**What we worked on:**
- Full channel pull with yt-dlp: 44 videos' metadata and captions, upload-time distribution, engagement, transcript scan for named entities
- Domain and hosting recon: WHOIS, DNS, Render origin, GA4 tag, JS bundle → checkout link
- Sister-channel linkage via a shared Instagram share token and the collab credit
- Attribution table: commercial farm ~85%, state actor ~4%, Canadian government <1%
- Reporting routes (YouTube, Competition Bureau, the storefront platform, journalists) and copy-paste report text

**Observations:**
The share-token match was the best pivot of the night. Two handles matching is a coincidence. Two identical QR-generated tokens means the same clipboard. I deliberately stopped short of profiling the people behind the self-published payment and social identifiers. The report records them unverified and goes no further without Wally's OK. The thing I keep coming back to is that "nation X's invention shocks the world" is a genre, not an operation. Somebody is printing these per country, and patriotism makes a better click-through engine than outrage, with fewer people inclined to question it.
