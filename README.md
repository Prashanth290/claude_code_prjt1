# Inner Light Coaching website

Static three-page life coaching site, deployed automatically to Vercel on every push.

- `index.html` – Home
- `coaching.html` – What coaching is, services, how it works
- `begin.html` – Free session booking form and FAQ
- `styles.css`, `main.js` – shared styles and behaviour
- `img/` – hand-made SVG illustrations
- `vercel.json` – serves pages at clean URLs (`/coaching`, `/begin`)

To receive bookings by email, set `FORM_ENDPOINT` in `main.js` to a Formspree form URL.
