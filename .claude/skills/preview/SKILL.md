---
name: preview
description: Build the real production version and serve it locally (and on phones on the same Wi-Fi) so a human can click through everything before deploying. Use for "let me see it", "preview", "test it", and in P4.
allowed-tools: Bash(npm *) Bash(git *) Read Glob Grep
---

Get the app ready for a human to look at. Nothing here deploys anything.

1. Use the `qa-tester` subagent and summarize its table.
2. If the build fails, stop and show the error.
3. Start the production preview in the background: `npm run preview -- --host`
   (http://localhost:4173, plus a Network URL for phones on the same Wi-Fi).
4. Give the human this click-through checklist:
   - Landing → **Moon** → scroll slowly top to bottom. Does each card match the marker the globe
     turned to? Are the years in order? Do the photos load? Do the hero models spin?
   - Back → **Mars** → same.
   - Click years on the rail; try ↑/↓ and Esc.
   - Open the Network URL on a phone: bottom-sheet card readable? Scrolling smooth?
   - Credits screen: is everything credited?
5. Remind them to stop the preview server when done (Ctrl+C or ask you), and that deploying only happens with `/deploy`.
