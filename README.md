# Inner Light Coaching website

Six-page life coaching site with a free self-help guide, deployed automatically to Vercel on every push.

- `index.html` – Home
- `how-it-works.html` – The 4-step process, what changes, what you get
- `coaching.html` – Coaching programs
- `faq.html` – Common questions
- `begin.html` – Free session booking form
- `guide.html`, `guide.js` – free Self-Help Guide (runs in the browser; nothing is sent or saved)
- `api/chat.js` – AI chat function, kept for a future AI Companion (inactive until `ANTHROPIC_API_KEY` is set)
- `styles.css`, `main.js` – shared styles and behaviour
- `img/` – hand-made SVG illustrations
- `vercel.json` – serves pages at clean URLs (`/coaching`, `/begin`)

To receive bookings by email, set `FORM_ENDPOINT` in `main.js` to a Formspree form URL.
