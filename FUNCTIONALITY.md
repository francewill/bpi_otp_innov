# BPI Quest — functionality reference

What the prototype *does*, screen by screen and flow by flow. Companion to
`CLAUDE.md`, which covers how the code is organised. Pinned to **November
2026**, `S.today = 14`.

## The premise

A gamified rewards layer inside a mock BPI mobile-banking app. Everyday
banking actions earn **points**; points convert to **cashback** credited to
the savings account at **100 pts = ₱5**. Starting state: 19,900 pts, 1 stamp,
3-day streak, ₱48,250.75 balance, 11 of the first 13 November days collected.

## Three mission kinds

| Kind | Keys | Cadence | Reward | Where it lives |
|---|---|---|---|---|
| **daily** | `qr`, `bill`, `learn` | one per date, bank-assigned from `PATTERN`, must be done that day | 100 pts + 1 stamp (`learn`: 50 pts, no stamp) | hub **Daily** / **Month** tabs, quest card |
| **major** | `supp`, `apply`, `inst`, `ploan`, `auto`, `housing`, `moto`, `uitf`, `alfm` | one-off, once per 6-month cycle (Jul–Dec 2026, resets Jan 1 2027) | 100 pts + 1 stamp each | hub **Major** tab + Home product tabs |
| **season** | `jump` (Nov), `annual` (Dec), `insure` (Jan) | one campaign per calendar month | 200 pts + 1 stamp | banner above the date strip; no tab |

There is no in-app mission picker — the day's daily mission is auto-assigned,
which is what the quest card's "Picked for you from your recent activity"
note means.

## Screens

- **Home (`s-home`)** — greeting, 3-card swipe carousel (today's quest, a
  dead-end Insights teaser, a dead-end auto-pay teaser), balance eye toggle,
  and five product chips:
  - *Deposits* — masked savings card + BPI Quest tile
  - *Investments* — if `S.hasFund`: UITF + ALFM holdings cards with invested /
    current value / unrealised gain-loss and a **Deposit more** button;
    otherwise two apply tiles
  - *Cards* — if `S.hasCard`: credit-card visual + installment + supplementary
    tiles; otherwise a single "you may be eligible" apply tile
  - *Loans* — featured Personal Loan tile + auto / housing / motorcycle
  - *Rewards* — BPI Quest tile, Major-missions tile, Convert-to-cashback
    (disabled under 2,000 pts)
  Bottom nav: Accounts (current), Move money and Products are toasts, **More**
  opens the prototype-controls sheet, and the centre FAB jumps straight into
  the QR scanner.
- **BPI Quest hub (`s-hub`)** — points hero (total, cashback worth, validating
  points, streak chip, meter toward the 20,000-pt / ₱1,000 milestone, convert
  button) over a 4-tab segmented control:
  - **Daily** — seasonal banner, horizontal 30-day strip (done / today /
    missed / upcoming states), quest card for the selected date, major-missions
    entry tile, 5-stamp card, and the "Your Everyday Quests" November checklist
    (salary through BPI, recurring bill, digital payment) with a % ring
  - **Major** — cycle progress card (n of 9, days left, reset date) plus the
    nine major missions, each row showing points, a lock, or a Done chip
  - **Month** — calendar grid of the same 30 dates + legend + quest card
  - **Activity** — points ledger with Validating / Confirmed / Converted chips
  The appbar info button opens a "How BPI Quest works" sheet.
- **Seasonal campaign (`s-season`)** — picture hero, plain-language `lede` and
  bullets, reward chips, then the month's mechanic: Nov = upload a photo of
  your child in a Disney costume + optional referral code; Dec = referral code
  only; Jan = pick one of three plans (AIA life, BPI MS non-life, Pamana
  Savings). Confirms in a **bottom sheet**, not the success screen, and that
  sheet live-updates its points chip from Validating to Confirmed.
- **QR scanner (`s-scan`)** — fake viewfinder with a "simulate scanning"
  button; banner shows the reward if `qr` is today's mission.
- **Pay (`s-pay`)** — QR (fixed Kape Kalye Coffee payee) or bill (Meralco /
  Maynilad / PLDT radio list). Amount field with quick-amount chips,
  over-balance validation, and a live eligibility note that explains in real
  time whether this payment will count. Minimums: QR ₱400, bill ₱300.
- **Learn (`s-learn`)** — 2-step: a 1-minute "pay yourself first" tip, then a
  one-question quiz. Claim button stays disabled until the answer is right.
- **Supplementary card (`s-supp`)** — pitch + two ID uploads (primary and
  supplementary cardholder), both required. Non-cardholders see the pitch, the
  reason it's blocked, and a link to apply.
- **Apply for a credit card (`s-apply`)** — three routes driven by `S.ccRoute`:
  *Pre-qualified* (₱80,000 pre-approved limit, one tap), *Regular* (upload
  payslip / ITR / COE), *Express Start* (secured card, ₱5,000 minimum hold in
  savings as collateral, instant approval). Regular and Express cross-link to
  each other. Cardholders see a "you already have one" note.
- **Installment (`s-inst`)** — pick one of three posted purchases, pick 3 / 6 /
  12 months, see purchase + ₱500 flat processing fee + total + monthly
  amortisation recomputed live. Cardholders only.
- **Personal loan (`s-ploan`)** — `S.loanRoute`: *Pre-qualified* (₱150,000, no
  docs) or *Regular* (Employed vs Business owner toggle changes the required
  document label; upload required). Ungated — no card needed.
- **Auto / Housing / Motorcycle loan (`s-loan`)** — one shared screen keyed by
  `S.loanKind`; document upload required, regular route only.
- **BPI Wealth apply (`s-fundApply`)** — UITF or ALFM via `S.fundKind`. No
  uploads: three radio questions (marital status, nature of job, income
  bracket), all pre-filled, so "just tap apply" is literally true. Sets
  `S.hasFund`.
- **BPI Wealth deposit (`s-fundDeposit`)** — top up an existing fund. Moves
  money from savings into the holding. **Deliberately not quest-gated** — plain
  confirmation, no reward card (`S.result.noReward`).
- **Success (`s-success`)** — shared by every non-seasonal flow. Headline and
  subcopy per result type, then either the reward card (points chip flips
  Validating → Confirmed after ~1.8s, stamp strip with a pop on a new stamp,
  and a "₱1,000 cashback ready" unlock banner once points cross 20,000) or the
  reason it didn't count, taken from the eligibility message captured at submit
  time. Footer returns to Major missions or BPI Quest depending on kind.
- **Redeem (`s-redeem`) → Done (`s-done`)** — four cashback tiers (₱100 / ₱250
  / ₱500 / ₱1,000 at 2k / 5k / 10k / 20k pts), unaffordable ones locked,
  confirmation sheet, then a receipt showing points used, points left, and the
  new balance. Logs a negative ledger entry.

## Reward mechanics

- `earn()` is the single shared path: ledger entry at `pending`, points held in
  `S.pendingPts`, and after 1.8s the entry flips to `confirmed` and the points
  land in `S.pts`. Any visible screen or open sheet repaints itself at that
  moment via `refreshTop()`.
- A daily mission also closes today's date, bumps `S.streak`, and ticks the
  November checklist (`qr` → digital payment, `bill` → recurring bill). A major
  mission is struck off the cycle; a seasonal one off the month's campaign.
- Stamps cap at 5. Every mission grants 1 except `learn`.
- Every mission owns one `elig()` returning `{counts, tone, icon, msg}` (majors
  add a `tag`), read by both the mission screen and the list row — so "does
  this count" and its wording exist in exactly one place.

## Prototype controls (guide panel / "More" sheet)

- **Walkthrough** — six one-tap demo jumps: discover today's mission → month
  view → complete the mission → convert to cashback → major missions →
  seasonal campaign. Steps 3 and 4 auto-reset state if needed.
- **Preserved across reset** (`S.hasCard`, `S.ccRoute`, `S.loanRoute`,
  `S.hasFund`, `S.season`) — simulated "bank algorithm" outcomes: cardholder
  vs non-holder, which of the three card-application routes you get, which of
  the two personal-loan routes, whether you already invest, and which month's
  campaign to preview.
- **Not preserved** (they're progress, not identity) — "Try today's daily
  mission as" reassigns `S.todayType` through a reset, and "Major mission
  progress" fills or clears `S.majorDone`.
- **Reset demo** restores the opening state.

## Deliberate non-features

Inbox, Insights, Move money, Products, auto-pay and account details are all
toasts. There is no `save` mission — moving money into a goal is covered by the
UITF / ALFM investment missions. No persistence: a page reload is a fresh
start. All amounts, rates and fees are illustrative and flagged in footnotes as
needing Finance / Marketing sign-off.
