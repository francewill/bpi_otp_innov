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
js/data.js          constants (MISSION, BILLERS, TIERS, PATTERN…) + $ / ic / peso / pts helpers
js/state.js         S (global state), fresh(), mtype/dstatus/todayDone
js/nav.js           go/back/setStack/paint, toast, openSheet/closeSheet
js/dropzone.js      shared file-drop widget (dropField/wireDropzone) — used by screen-supp.js + screen-apply.js
js/screen-*.js       one file per screen (home, hub, pay, learn, success, redeem, supp, apply, inst,
                     ploan, loan — screen-loan.js is shared by auto/housing/moto via S.loanKind,
                     all three quest-eligible like everything else)
js/guide.js         side-panel walkthrough + demo shortcuts (demoGo/demoType/reset)
js/actions.js       `A` click-dispatch table + the 3 document-level event listeners
js/main.js          RENDER map + the bootstrap paint(true) call — must load LAST
```

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
- Conditionally-eligible missions (`supp`/`inst` gated on `S.hasCard`, `apply`
  gated on `!S.hasCard`; `ploan`/`auto`/`housing`/`moto` ungated — loans
  aren't tied to card ownership) follow the `elig()`/`suppElig()`/
  `applyElig()`/`instElig()`/`ploanElig()`/`loanElig(kind)` pattern: a pure
  function returning `{counts, tone, icon, msg}` that both the quest card
  and the mission screen read, so "does this count today" logic lives in
  exactly one place. `loanElig(kind)` is the parameterized variant, shared
  by `auto`/`housing`/`moto` since they're one screen (`screen-loan.js`).
- `S.ccRoute` ('pq'/'regular'/'express') simulates the bank's eligibility
  algorithm for the `apply` mission, `S.loanRoute` ('pq'/'regular') does the
  same for `ploan` — both are demo toggles in the guide panel, not real
  logic, and both are preserved across `reset()` the same way `S.hasCard` is.
- Every mission today is part of the points economy (same +100 pts/+1 stamp,
  except `learn` at +50/0). `updateSuccess()` still has an `S.result.noReward`
  escape hatch (skips the whole reward-card block for a plain confirmation)
  for if a future action is deliberately **not** meant to be scored — nothing
  currently sets it.

## Load-order gotcha
`js/main.js` defines the `RENDER` map (`{home:renderHome, hub:renderHub, ...}`)
and must load **last**, after every `render*` function exists. If you add a
new screen file, add its `<script src>` before `main.js` and add its entry to
`RENDER` in `main.js`.

## Adding a feature
New screen → new `js/screen-<name>.js` + a `<section class="screen" id="s-<name>">`
in the HTML + an entry in `RENDER` (main.js) + actions in `actions.js`. Keep
constants in `data.js`, not scattered inline.
