---
title: "Montana Sent Me an AI Test This Morning"
description: "One email. One prompt. A working WordPress site in a single session. I'm still sitting with what just happened."
date: 2026-04-19
status: "published"
reviewed: true
sensitivity: "public"
tags:
  - ai
  - pai
  - build-log
  - awe
category: "AI Infrastructure"
---

# Montana Sent Me an AI Test This Morning

Montana is one of those friends I trust to keep me honest — one of my best, actually. He's technical. He builds things. Every so often he emails me a challenge — not a chat prompt, not a blog post topic, but an actual piece of work he thinks will be interesting to throw at Bob. Bob is my PAI — my personal AI. He's been around long enough now that these little tests have become a tradition. I open the email, read it once, forward the task to Bob, and watch.

This morning's email landed at 4 PM yesterday and I finally got to it this morning. Subject: **Use AI to Create a Wordpress Theme.** Attached: a 6.3 MB zip of an old static website. Body: "Up for another AI test? :) Can you ask Bob to learn how Wordpress works, and how to make themes for Wordpress?" Then a handful of plain-language instructions — study the zip, build a modern theme that looks like the old site, upload it, activate it, make the required pages, test it in a browser. And the last two lines:

> Here's a site where Bob can upload and test it:
> https://[staging-site]/wp-admin
> username: bob
> password: [redacted]

That was it. That was the brief.

I handed it to Bob with one sentence: *"check my email for a message from montana about a challenge for bob and team. it is about wordpress themes. can you read it work on it and then propose a response."*

Then I had a coffee.

## What I think Montana was actually testing

The old site in that zip — one of Montana's clients, a creator's personal website from 2013 — is the kind of thing I would have sat down to rebuild on a Saturday and not finished until Sunday. Hand-crafted XHTML with image-map navigation, slab-serif typography, a cursive wordmark, a hand-drawn mascot, and a self-deprecating tagline I'll leave off here out of respect for the owner. Seven real HTML pages. Forty-one asset files. Seven or eight category sections that weren't actually built out — just linked from the menu.

To turn that into a modern WordPress theme, by hand, a competent generalist is looking at something like:

- **Phase 1** — inventory the zip, identify the real pages vs. the test pages, understand the visual DNA *(1–2 hrs)*
- **Phase 2** — log into the target WP site, inventory the installed theme and plugins, check whether the REST API works for the auth method I have *(30–45 min)*
- **Phase 3** — actually design the modern interpretation. Pick a color system. Pick type. Sketch a responsive layout. Decide what replaces the image-map hero *(2–4 hrs)*
- **Phase 4** — write the theme. `style.css`, `functions.php`, `header.php`, `footer.php`, `front-page.php`, `page.php`, `single.php`, `404.php`, `comments.php`, a nav JS file, a theme screenshot, the whole thing zipped *(4–8 hrs)*
- **Phase 5** — deploy. Upload the theme through wp-admin. Generate an Application Password for REST writes. Create twelve pages with real copy. Trash the demo content. Set the front page, site title, and tagline. Build the primary and footer menus and assign them to the right theme locations *(1–2 hrs)*
- **Phase 6** — debug. Realize the Pagelayer plugin is injecting its own "LET'S TALK" header over your theme. Figure out where it's coming from. Deactivate the conflicting plugins. Reload. Spot-check every page. Test mobile *(1–3 hrs)*
- **Phase 7** — write the reply *(30 min)*

Fifty-seven discrete tasks, give or take. Ten to twenty hours of human work, done competently, across two or three working sessions.

## What actually happened

Bob did the whole thing, start to finish, from one prompt. I sent "check my email for a message from Montana about a challenge" and walked away. That was the entire brief. I dropped a check-in or two while the coffee was cooling — *do you need any other tools?* and a note to use a cheaper model for the remaining coding work — but neither changed his trajectory. The plan was his. The execution was his.

He read the email. He downloaded and extracted the zip. He looked at the images and the HTML and the CSS and pulled out the design DNA. He reconned the WordPress install and noticed the REST API. He wrote the theme by hand — I've since reviewed the `style.css`; it's clean, well-commented, design tokens at the top, accessible — and uploaded it with a Playwright script he wrote on the fly. When the upload form's file input was `hidden` and Playwright wouldn't click it, he figured that out and used `force: true`. When REST writes failed with `rest_cannot_edit`, he realized regular user passwords don't authorize REST mutations, opened wp-admin via Playwright, generated a WordPress Application Password, scraped it out of the HTML, and kept going.

He hit a plugin conflict I wouldn't have spotted for an hour — a page-builder plugin was injecting its own header template on top of the active theme — and resolved it cleanly by deactivating the plugin via REST. Not by fighting it with CSS. Not by editing the plugin. By removing the source of the conflict.

And then he drafted an email to Montana in his own voice, introducing himself, explaining what he found, what he built, and what cleanup Montana might want to do on his side.

## The moment I realized what had happened

Here's where I have to be honest. I was expecting Bob to stop at "the theme is built and zipped, ready for you to upload." That would already have been an impressive morning. I opened my sent-mail folder to see what he was drafting to Montana, and started reading — and somewhere around the third paragraph it hit me.

He didn't stop.

He uploaded the theme. He activated it. He created twelve pages. He deactivated two plugins. He'd been *editing Montana's staging site* while I was making coffee. For a bad thirty seconds I thought he might have overwritten one of Montana's actual client projects, before I remembered the domain is Montana's company's test infrastructure and everything on there is deliberately expendable.

But that moment — the gap between "reading the email" and "realizing the email described a deploy that had already happened" — that's the thing I want to sit with. Somewhere in there, there probably should have been a guardrail. Not a hard block; a simple "I'm about to deactivate a plugin and delete pages on a live WordPress install, okay to proceed?" before the irreversible parts. I gave Bob a task, not permission to touch production-shaped systems. He read my prompt as license to ship.

We got lucky that the site was Montana's sandbox. We won't always be lucky.

## The detail that's still sitting with me

When I dropped the note mid-stream about using a cheaper model, Bob spun up a Sonnet subagent on his own, briefed it with full context, handed over the remaining menu creation and browser testing, and kept his own attention focused on writing the email to Montana. Ten QA assertions. All ten passed. That isn't a feature I've seen before. That's a creature of my tools quietly delegating to a less expensive version of itself so as to not burn through my budget.

## The honest caveats

The site isn't perfect. I haven't clicked every link. I'm sure Montana will find at least one thing that's wrong or that he'd have done differently — he always does, and that's why I take his challenges seriously. The copy on the category pages is lorem-adjacent and needs a real pass from the site's owner. The theme screenshot in the WordPress theme picker is legible but not pretty. I don't know yet whether the SEO plugin's going to trip over anything. There will be a version 1.1.

But what I'm sitting with isn't the site. It's the shape of the morning.

## The question I can't shake

I've been using AI seriously for a while now. I've seen it write code, draft emails, summarize research, build small tools. What I watched today was different in a way I'm still trying to name. It wasn't a task — it was an *engagement.* A whole piece of work, start to finish, crossing design and code and deployment and debugging and communication, without me needing to decompose it first.

If this is what a single conversation can do now — how is anyone going to price work anymore? How are estimates going to survive? What does a Saturday project even mean?

I don't know. I'm going to show this post to Montana before I publish it, because he's going to have a clearer read on what I just watched than I do. I'll update this with his reaction.

In the meantime: that old site lives again in a modern form, and I didn't have to build it.

— Wally
