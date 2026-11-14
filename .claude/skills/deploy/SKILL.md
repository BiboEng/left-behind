---
name: deploy
description: Deploy Left Behind to Vercel. The LAST step — only run manually after P4 testing is done.
disable-model-invocation: true
allowed-tools: Bash(git *) Bash(npm *) Read Grep
---

Deploy to Vercel. This is the last step of the project.

1. Gate checks. Stop if any fail:
   - The working tree is clean and up to date with `origin/main` (run `/sync` first if not).
   - Every P4 box in `docs/PLAN.md` is checked (or the humans explicitly say to skip one).
   - `npm run build`, `npm test` and `npm run test:final` pass.
2. Tell the humans what's about to happen and wait for an explicit "yes, deploy".
3. `npx vercel` (the first time it asks them to log in and link a project: accept the detected
   Vite settings, build `npm run build`, output `dist`). This makes a *preview* URL. Ask them to open it.
4. If the preview looks right: `npx vercel --prod`. Print the production URL.
5. Ask them to open the production URL on a laptop and a phone and click through Moon and Mars once.
6. Tick the P5 boxes that are done in `docs/PLAN.md`, then `/sync`.
7. Remind them what to submit: live URL, GitHub repo, a 1–2 minute video, and the NASA datasets used (from `docs/NASA_DATA.md`).
