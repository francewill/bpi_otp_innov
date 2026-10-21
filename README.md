# BPI Daily Wins — Concept Prototype

A clickable, front-end-only prototype of a gamified daily-engagement feature
for the BPI mobile app. It simulates a single phone screen (Accounts home →
Daily Wins hub → individual mission flows) and is meant for demos, internal
pitches, and discussion — **not** a production build, and not connected to
any real account, ledger, or backend.

## What the app is

**Daily Wins** turns everyday banking actions into a 30-day "mission a day"
loop: each date in the demo month (November 2026) has one assigned mission.
Completing it on its day earns points and, for most missions, a stamp toward
a 5-stamp milestone. Points convert to real cashback at a fixed illustrative
rate (**100 pts = ₱5**), credited straight to the user's savings account.

The idea is to give the bank a lightweight, repeatable hook that nudges
customers toward actions they'd plausibly want anyway — paying a bill,
moving money to savings, trying a new product — while also surfacing
cross-sell opportunities (credit cards, loans, investments) in a way that
feels like part of a game rather than a sales pitch.

The prototype is built screen-by-screen around a single demo persona
("France"), with a side control panel (and a "More" sheet on narrow screens)
that lets a presenter jump between every state of the app on demand —
cardholder vs. non-holder, which application route the "bank's algorithm"
offers, already-invested vs. not, etc. — without needing a real backend to
drive any of it.

## Core loop

- **30 missions, one per day**, following a repeating pattern across the
  four original types (QR pay, bill pay, savings, a 1-minute money tip).
- Completing **today's** mission (and only today's — missions can't be done
  early or made up later) earns points, which show as *validating* for a
  couple of seconds and then *confirmed* — modeling a real settlement delay.
- A **5-stamp card**: most missions award a stamp; hitting 5 is called out
  as a small milestone moment.
- **Change today's mission**: a real, in-app control (not just a demo
  toggle) lets the user swap which mission counts for today, right up until
  they complete it — once done, the option disappears and can't be reopened.
- **Redeem**: once a user has at least 2,000 pts, they can convert to
  cashback in fixed tiers (2,000/5,000/10,000/20,000 pts → ₱100/₱250/₱500/
  ₱1,000), credited instantly to savings in the demo.

## Everyday missions

| Mission | What it simulates |
|---|---|
| **Pay with QR Ph** | Scan-to-pay at a merchant; counts if the amount clears a minimum. |
| **Pay a bill** | Pick a biller (Meralco, Maynilad, PLDT Home) and pay. |
| **Save to your goal** | Move money into a savings goal. |
| **Learn a money tip** | A 1-minute read + one quiz question; lower reward (+50 pts, no stamp), no money movement. |

## Product discovery missions (cross-sell, gamified)

Everything below shares the same mechanics as the everyday missions
(same points/stamp reward, same "does this count today" eligibility check,
same success screen) but represents a bank product rather than a basic
transaction:

- **Supplementary card** *(existing credit cardholders only)* — pitch screen
  explaining shared credit limits, free for the first card, a fee for
  additional ones; "apply" uploads a photo/scan of both the primary and
  supplementary cardholder's ID (drag-and-drop or tap-to-browse).
- **Apply for a credit card** *(non-holders only)* — the one product with
  three distinct outcomes, chosen by a toggle that stands in for "the bank's
  eligibility algorithm":
  - **Pre-qualified (PQ)** — no documents, instant approval, shows a
    pre-approved limit.
  - **Regular** — upload an income document; outcome is "under review," not
    an instant approval.
  - **Express Start** — a secured card: pick a hold amount (₱5,000 minimum)
    in savings/checking as collateral; approved immediately since the
    collateral removes the credit risk. Reachable either as its own route or
    as a switch-over from Regular ("can't provide income documents?").
- **Switch a purchase to installment** *(cardholders only)* — pick from a
  short list of eligible posted purchases, choose a 3/6/12-month term, and
  see the real math: a flat ₱500 processing fee is added to the purchase
  amount *before* dividing by the number of months, shown as a transparent
  breakdown (purchase amount → processing fee → total → monthly
  amortization) before the user commits.
- **Apply for a personal loan** *(everyone — not tied to card ownership)* —
  same PQ/Regular shape as the credit card flow (instant ₱150,000
  pre-approval vs. document upload + review), plus an "Employed /
  Business owner" toggle that changes which document is requested (COE,
  payslip, ITR vs. an Audited Financial Statement).
- **Auto / Housing / Motorcycle loans** *(everyone)* — one shared screen
  (just the title and icon change per loan type), Regular-only: income
  document → "under review."
- **BPI Wealth — UITF & ALFM funds** *(everyone)* — the lightest-friction
  flow in the app: no documents at all, just three quick questions (marital
  status, nature of job, monthly income bracket), each pre-filled to a
  sensible default so applying really can be "just click apply." Once
  invested, the Investments tab shows real holdings with **unrealized
  gain/loss** (the demo shows one fund up and one fund down, so both
  directions are visible), plus a "Deposit more" action that tops up an
  existing holding from the savings account — this top-up action is
  deliberately *not* part of the points economy, since it's ongoing account
  management rather than a new thing to try.

## Screens / navigation

The app is a single phone-sized view with a stack-based navigation (push a
screen on top, back pops it off): Accounts home → Daily Wins hub (with
Quests / Month / Activity tabs) → the specific mission screen → a shared
success screen → optionally the cashback redemption flow. A bottom sheet is
used for short, secondary content (the "How this works" explainer, the
mission-change picker, confirmations).

The Accounts home screen itself has five tabs: **Deposits**, **Investments**,
**Cards**, **Loans**, **Rewards** — each doubling as a discovery surface for
the relevant product mission(s), independent of whether that product happens
to be "today's" assigned mission.

## What's deliberately simulated, not real

This is a demo, so a few things are intentionally simplified and called out
as such in the app's own copy:

- **No backend, no real accounts.** All numbers (balance, points, holdings,
  ledger) live in one in-memory JavaScript object and reset if you reload
  the page.
- **"The bank's algorithm"** (which route a customer gets for the credit
  card and personal loan applications) is a manual toggle in the demo panel,
  not real decisioning logic.
- **Investment holding status is one flag covering both funds** — once
  "invested," the demo shows mock holdings for *both* UITF and ALFM
  together, rather than tracking each fund independently.
- **Document uploads aren't verified or stored** — picking a file just
  records its filename for the confirmation screen.
- **Illustrative figures everywhere**: 100 pts = ₱5, the ₱500 processing
  fee, the ₱150,000 personal-loan pre-approval, the ₱80,000 credit-card
  pre-approval, the mock fund values — all placeholders Finance would need
  to validate for anything resembling a real rollout.

## How to run it

Just open `BPI_Daily_Wins_Prototype.html` in a browser — double-click it, or
`open BPI_Daily_Wins_Prototype.html` from a terminal. No install, no build,
no server. It's plain HTML/CSS/JS on purpose (see `CLAUDE.md` for why and
for the internal file/architecture map if you're editing it with an AI
coding assistant).

## Status

Built incrementally, feature by feature, as a discussion prototype. Not
scoped, estimated, or approved for production — treat every number and
flow as a starting point for conversation, not a spec.
