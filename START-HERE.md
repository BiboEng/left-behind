# Start here

**Left Behind**: the Moon (Ibrahim) and Mars (Rayan). Two days. Read this once.

> **Update:** the phases and per-person tasks below are retired. Setup steps still apply; after that,
> just prompt Claude with what you want to do. What is left is in `docs/PLAN.md`.

## 0. Both of you, before anything (~10 min)

Check these in a terminal (Mac: Terminal · Windows: PowerShell):

```
node -v        # needs v20 or newer → https://nodejs.org (LTS)
git --version  # Windows: install "Git for Windows" (Claude Code needs it too)
claude --version
```

You also need a GitHub account each.

> **If `npm run dev` fails with an error about a missing native module** (rolldown, sharp, etc.),
> usually right after pulling from a teammate on a different OS: delete the `node_modules`
> folder and `package-lock.json`, then run `npm install` again.
>
> **Windows tip:** if PowerShell says *"running scripts is disabled on this system"* when you run
> `npm`, run this once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then try again.

---

## 1. Ibrahim: get the project running and on GitHub (~20 min)

1. Unzip `left-behind.zip` somewhere easy (e.g. Documents). You get a `left-behind` folder.
2. Open a terminal **in that folder** and run:
   ```
   npm install
   npm test
   npm run dev
   ```
   Open http://localhost:5173. You should see **LEFT BEHIND** with Moon / Mars buttons; clicking
   one shows a plain starter globe. Press `Ctrl+C` in the terminal to stop.
3. On github.com, create a new **empty private** repo called `left-behind` (no README).
4. Start Claude in the folder and let it do the git part:
   ```
   claude
   ```
   > Initialize git in this folder, commit everything with the message "Day 0: starter kit",
   > set the branch to main, add https://github.com/<your-username>/left-behind.git as origin, and push.

   (If GitHub asks you to log in, follow the browser prompt. On a Mac you may need
   `gh auth login` or GitHub Desktop once.)
5. On GitHub → the repo → **Settings → Collaborators → Add people** → Rayan's username.

## 2. Rayan: clone it (~10 min)

1. Accept the invite (email or GitHub notifications).
2. In a terminal:
   ```
   git clone https://github.com/<ibrahim-username>/left-behind.git
   cd left-behind
   npm install
   npm test
   npm run dev
   ```
   Open http://localhost:5173 and check you see the same starter page.

## 3. Both: set up Claude Code (~5 min)

In the `left-behind` folder:
```
claude
```
then inside Claude:
```
/plugin install frontend-design@claude-plugins-official
/reload-plugins
```
Type `/` and check you see **start-phase, add-relic, sync, preview, deploy**.
Type `@` and check you see the agents **nasa-historian, world-builder, ui-engineer, qa-tester**.

## 4. Go

- Ibrahim: `/start-phase ibrahim` → building the engine
- Rayan: `/start-phase rayan` → researching Mars

## Your loop for the next two days

1. `/start-phase <your name>`: Claude tells you the next task and makes a plan
2. For anything big, press **Shift+Tab** until it says **plan mode**, read the plan, approve it
3. Look at it yourself: `npm run dev` → http://localhost:5173
4. `/sync` often (every hour or so): commits your work, pulls your teammate's, runs the tests, pushes
5. Tick the boxes in `docs/PLAN.md`

Testing before deploying: `/preview` builds the real production version and serves it on your
laptop (and your phone) so you can click through everything. **Deploying is the very last step:** `/deploy`.
