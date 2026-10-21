# BPI Daily Wins — prototype

Solo-built demo prototype (not production). Plain HTML/CSS/JS, **no build step,
no framework, no backend** — intentional, not a shortcut. Keep it that way
unless the user explicitly asks to add tooling or a framework.

## Run it
Open `BPI_Daily_Wins_Prototype.html` directly in a browser (double-click or
`open <file>`). Must keep working via `file://` with zero server — this is
why scripts are classic `<script src>` tags, never `type="module"` (modules
are blocked by CORS on `file://`).

## Files
```
BPI_Daily_Wins_Prototype.html   shell: markup, icon <symbol> sprite, <link>/<script> tags
css/styles.css                  all styling
js/data.js          constants (MISSION, DAILY_KEYS/MAJOR_KEYS, MAJOR_CYCLE, BILLERS,
                    TIERS, PATTERN…) + $ / ic / peso / pts helpers
js/state.js         S (global state), fresh(), mtype/dstatus/todayDone,
                    nMajor/cycleDaysLeft/majorDoneElig/majorOpenElig
js/nav.js           go/back/setStack/paint, toast, openSheet/closeSheet
js/dropzone.js      shared file-drop widget (dropField/wireDropzone) — used by screen-supp.js + screen-apply.js
js/screen-*.js       one file per screen, except where siblings share one file (screen-redeem.js
                     covers redeem+done; screen-fund.js covers fundApply+fundDeposit — both pairs
                     are tightly related sub-screens of the same feature):
                     home, hub, pay, learn, success, redeem, supp, apply, inst, ploan, loan, fund.
                     screen-pay.js covers the daily qr/bill missions and owns openMission() + earn().
                     screen-loan.js is shared by auto/housing/moto via S.loanKind (all major missions).
                     screen-fund.js covers BPI Wealth (UITF/ALFM): applying is a major mission and
                     shared by S.fundKind; depositing more into an existing fund is not quest-gated.
js/guide.js         side-panel walkthrough + demo shortcuts (demoGo/demoType/reset)
js/actions.js       `A` click-dispatch table + the 3 document-level event listeners
js/main.js          RENDER map + the bootstrap paint(true) call — must load LAST
```

## Two kinds of mission
`MISSION` (data.js) is one table split by a `kind` field, and `DAILY_KEYS` /
`MAJOR_KEYS` are derived from it — never hardcode either list.
- **daily** (`qr`/`bill`/`learn`) — one per date, assigned by the bank via
  `PATTERN` (which therefore only ever holds `DAILY_KEYS`). There is no
  in-app mission picker: the day's mission is auto-detected, which is what
  questCard()'s "Picked for you…" note says. `S.done` tracks which dates are
  collected; completing one also bumps `S.streak` and the November `CHECKS`.
- **major** (`supp`/`apply`/`inst`/`ploan`/`auto`/`housing`/`moto`/`uitf`/
  `alfm`) — one-off product milestones with no daily deadline. Each is
  earnable once per 6-month cycle (`MAJOR_CYCLE`); `S.majorDone` holds the
  keys already earned, and the whole set unlocks again on `MAJOR_CYCLE.next`.
  They live on the hub's **Major** tab (`majorCycleCard()`/`majorList()` in
  screen-hub.js) and are also reachable from the Home product tabs.

`earn()` (screen-pay.js) is shared by both and branches on `m.kind` — that's
the only place the difference is written down.

There is deliberately no `save` mission: moving money into a goal is covered
by the `uitf`/`alfm` investment missions.

## The pattern (don't reinvent it)
- One global mutable object `S` is the entire app state.
- Each screen has a `render<Screen>()` that rebuilds its DOM from `S` via
  `innerHTML` template strings (no vdom, no diffing).
- Navigation is a stack: `go(name)`, `back()`, `setStack([...])` push/pop/replace
  `S.stack`, then call `paint()`, which shows/hides `.screen` elements and
  calls the right `render*`.
- User interaction is one delegated `click` listener in `actions.js` reading
  `data-act`/`data-*` attributes and dispatching through the `A` object —
  never attach one-off `addEventListener`s inside render functions.
- Every mission owns one `elig()` function returning
  `{counts, tone, icon, msg}` (major ones add a short `tag` for the list
  row), so "does this count" lives in exactly one place, read by both the
  mission screen and the quest card / major list. `elig(p)` covers the daily
  pay missions; `suppElig()`/`applyElig()`/`instElig()`/`ploanElig()`/
  `loanElig(kind)`/`fundElig(kind)` cover the majors, with `loanElig`/
  `fundElig` taking a `kind` param since they're shared by several MISSION
  entries on one screen. `majorElig(k)` (screen-hub.js) just routes to the
  right one — it must not duplicate any of their rules. Each major checks
  its product gate first (`supp`/`inst` need `S.hasCard`, `apply` needs
  `!S.hasCard`, `uitf`/`alfm` need `!S.hasFund`; `ploan`/`auto`/`housing`/
  `moto` are ungated — loans aren't tied to card ownership), then defers to
  the shared `majorDoneElig(k)`/`majorOpenElig(k)` helpers in state.js so
  the cycle copy isn't written out nine times.
- Submitting stashes the elig message on `S.result.why`, captured *before*
  `earn()` runs, which is what the success screen shows when a mission
  didn't count — don't re-derive it there from live state.
- Three independent demo toggles in the guide panel simulate "the bank's
  algorithm," none of them real logic, all preserved across `reset()` the
  same way `S.hasCard` is: `S.ccRoute` ('pq'/'regular'/'express') for
  `apply`, `S.loanRoute` ('pq'/'regular') for `ploan`, and `S.hasFund`
  (boolean) for `uitf`/`alfm` — the last one is a prototype simplification:
  it covers both funds together rather than tracking them independently.
  The guide's other switchers are progress, not toggles, so they are *not*
  preserved: "Try today's daily mission as" reassigns `S.todayType` through
  `reset()` (daily keys only), and "Major mission progress" fills or clears
  `S.majorDone`.
- Every mission today is part of the points economy (same +100 pts/+1 stamp,
  except `learn` at +50/0). Depositing more into an *existing* fund
  (`screen-fund.js`'s `fundDeposit`) is deliberately not quest-gated, same
  logic as "Convert to cashback" — it's ongoing account management, not a
  discovery action. It uses `S.result.noReward` (also documented on
  `updateSuccess()`) to skip the reward-card block for a plain confirmation.
- The hub's four tabs are `S.tab` = `daily` | `major` | `month` | `activity`
  (the `.seg.s4` CSS modifier widens the segmented control to four). `daily`
  is the default and what `goHub` returns to; `goMajor` opens `major`, and
  the success screen picks between the two based on the finished mission's
  `kind`.
- `openMission(t)` (screen-pay.js) is the single MISSION-key → screen map,
  shared by `startMission()` (today's daily quest card) and `A.startMajor`
  (the major list). It deliberately does *not* pre-check eligibility: an
  ineligible major still opens, because its screen explains why and offers
  the way in (e.g. "Apply for a BPI credit card").

## Load-order gotcha
`js/main.js` defines the `RENDER` map (`{home:renderHome, hub:renderHub, ...}`)
and must load **last**, after every `render*` function exists. If you add a
new screen file, add its `<script src>` before `main.js` and add its entry to
`RENDER` in `main.js`.

## Adding a feature
New screen → new `js/screen-<name>.js` + a `<section class="screen" id="s-<name>">`
in the HTML + an entry in `RENDER` (main.js) + actions in `actions.js`. Keep
constants in `data.js`, not scattered inline.
