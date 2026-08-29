# Questions for the owner

Everything here is a business decision, not a coding task. Each item names the
file to change once we have the answer. Items marked **before launch** are
things the site currently states or implies, so they need checking before the
new version goes to `main`.

## Prices

- [ ] **Before launch.** Confirm the 48 taxi/minibus prices in `taxi-rates.json`.
      They were transcribed from a photo of the handwritten sheet. The Ayia Napa
      12–14 cell had a crossed-out value; €270 was used.
- [ ] Are transfer prices the same in both directions (to and from Pafos)?
- [ ] Is there a night surcharge, a waiting-time charge, or a child-seat charge?
- [ ] The site previously advertised Larnaca at €130. The sheet says €140 and the
      site now shows €140. Correct?

## Fleet

- [ ] **Before launch.** Confirm the specs now shown on every car card —
      category, seats, gearbox, fuel, number of bags — in `prices.json`. They were
      inferred from the model names.
- [ ] Any car that is manual rather than automatic, or without A/C?

## Policies (shown in the FAQ, `components/Faq.tsx`)

- [ ] **Before launch.** Deposit: how much, and how is it taken?
- [ ] **Before launch.** Fuel policy: full-to-full, or something else?
- [ ] Cancellation terms.
- [ ] Minimum driver age is set to 25 and licence held for one year — correct?
- [ ] Is airport/hotel delivery really free, and within what area? The hero says
      "Free delivery to Pafos Airport, your hotel or villa."

## Business details (`app/lib/site-config.ts`)

- [ ] Confirm both phone numbers, the email address and the opening hours.
- [ ] Founding year, if you want a "family business since ____" line.
- [ ] Is `public/logo.png` the official logo? The footer now uses the gold
      wordmark badge instead; the file is currently unused.

## Legal

- [ ] **Before launch.** Have `/privacy` checked against your GDPR obligations:
      how long booking data is kept, and any third party it is shared with.

## Domain and notifications

- [ ] Real domain name, so `metadataBase` and `NEXT_PUBLIC_SITE_URL` can move off
      the `.vercel.app` address.
- [ ] For booking alerts (FEAT-01): a Resend API key and the email address to
      notify, and/or a Telegram bot token and chat id.

## One file to add by hand

`.github/workflows/ci.yml` could not be pushed — a fine-grained token needs the
`workflow` scope to create workflow files. The contents are in
`docs/ci-workflow.yml`; move it to `.github/workflows/ci.yml` and commit from a
machine with normal git access to turn CI on.
