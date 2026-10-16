# Inner Light Coaching website

Static six-page life coaching site, deployed automatically to Vercel on every push.

- `index.html` – Home
- `how-it-works.html` – The 4-step process, what changes, what you get
- `coaching.html` – Coaching programs
- `faq.html` – Common questions
- `begin.html` – Free session booking form
- `privacy.html` – Privacy policy
- `styles.css`, `main.js` – shared styles and behaviour
- `img/` – hand-made SVG illustrations
- `vercel.json` – serves pages at clean URLs (`/coaching`, `/begin`)

To receive bookings by email, set `FORM_ENDPOINT` in `main.js` to a Formspree form URL.
