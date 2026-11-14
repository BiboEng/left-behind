---
name: start-phase
description: Tell Ibrahim or Rayan what to work on next — finds their next unchecked phase in docs/PLAN.md, pulls the latest code, and proposes a plan for the first tasks.
argument-hint: <ibrahim|rayan>
disable-model-invocation: true
allowed-tools: Bash(git *) Read Grep Glob
---

Start the next phase for: $ARGUMENTS

1. Work out who it is (`ibrahim` = Moon, `rayan` = Mars). If no name was given, ask.
2. `git pull --rebase` to get the teammate's latest work. If there are uncommitted changes, suggest `/sync` first.
3. Read `CLAUDE.md` and `docs/PLAN.md`. Find this person's first phase section (P0 → P5, their
   own subsection) that still has unchecked boxes.
4. Check it's unblocked. Rayan's P2 needs Ibrahim's P1 engine pushed (look for `src/engine/Experience.tsx`).
   P4 needs both people's P3. P5 needs all of P4. If blocked, say what's missing and suggest
   something useful to do meanwhile (e.g. more research, writing intro/outro text).
5. Reply with:
   - the phase name, rough time budget, and its "Done when"
   - its checklist, marking anything the code already satisfies
   - which agent(s) and skills to use
   - a concrete step-by-step plan for the first 1–2 boxes
   - a reminder: plan mode (Shift+Tab) for big changes, `/sync` every hour or so
Don't write app code until the person says go.
