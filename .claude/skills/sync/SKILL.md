---
name: sync
description: Save and share work safely — commit my changes, pull my teammate's, run the tests, and push. Use whenever someone says sync, save, commit, push, or "get Rayan's/Ibrahim's changes".
argument-hint: "[short description of what changed]"
allowed-tools: Bash(git *) Bash(npm run build) Bash(npm test) Read Grep
---

Sync the repo. What changed (optional): $ARGUMENTS

1. `git status`. If nothing has changed, just `git pull --rebase` and report what came in.
2. Look at the changed files. If any belong to the other person's world (see the ownership table in
   `CLAUDE.md`), stop and ask before committing them.
3. `npm run build` and `npm test`. If either fails, show the error and don't push broken code.
   Offer to fix it first.
4. `git add -A` and commit with a clear message, e.g. `moon: add Apollo 15 and 17 relics`
   or `engine: smooth camera zoom`. If shared files changed, say so in the message.
5. `git pull --rebase`.
   - If there's a conflict: stop, explain in plain words which file and why, propose the fix,
     and only continue after the person agrees. Never force-push, and never discard their teammate's changes.
6. If the pull brought in new commits, run `npm install` (when package.json changed) and `npm test` again.
7. `git push`.
8. Summarize: what you pushed, what came in from the teammate (one line per commit), and anything they should look at.
