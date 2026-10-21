# Seasonal banner pictures

Drop the campaign artwork in this folder, named after the month. Nothing else
needs to change — the app already looks for it.

## Naming

Each seasonal campaign in `js/data.js` is keyed by month, and its picture
uses the same key:

| Campaign | `SEASON` key | File the app looks for first |
|---|---|---|
| November — Jumpstart | `nov` | `img/nov.jpg` |
| December — Free annual fee for life | `dec` | `img/dec.jpg` |
| January — 2027: Ready, Set, Secure | `jan` | `img/jan.jpg` |

Save your picture under that exact name and it shows up. To use a different
name or format (`.png`, `.webp`, …), change that campaign's `img:` string in
`SEASON` (js/data.js) — it's one line each.

## Fallback order

If a file is missing or fails to load, the banner falls back on its own, so
the prototype never shows a broken image:

1. `SEASON[key].img` — your picture (`nov.jpg`, `dec.jpg`, `jan.jpg`)
2. `<key>.svg` — the placeholder shipped in this folder (`nov.svg` …)
3. `default.svg` — the generic default, used by any campaign with no
   artwork of its own
4. if even that is missing, the `<img>` hides and the banner's own gradient
   shows through

So you can add pictures one month at a time; months without one keep the
placeholder.

## Sizing

The banner is cropped to fill (`object-fit:cover`) at roughly **720 × 280**
on a 390 px-wide phone, and taller on the campaign screen itself. A dark
scrim runs from the left edge, where the month, title and tagline sit —
**keep the important part of the image on the right half** and avoid text
baked into the picture.
