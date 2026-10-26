# Inner Light Coaching website

Six-page life coaching site with an AI companion chat, deployed automatically to Vercel on every push.

- `index.html` – Home
- `how-it-works.html` – The 4-step process, what changes, what you get
- `coaching.html` – Coaching programs
- `faq.html` – Common questions
- `begin.html` – Free session booking form
- `companion.html`, `companion.js` – AI Companion chat page
- `api/chat.js` – Vercel serverless function that streams replies from Claude
- `styles.css`, `main.js` – shared styles and behaviour
- `img/` – hand-made SVG illustrations
- `vercel.json` – serves pages at clean URLs (`/coaching`, `/begin`)

To receive bookings by email, set `FORM_ENDPOINT` in `main.js` to a Formspree form URL.

The AI Companion needs an `ANTHROPIC_API_KEY` environment variable set in Vercel (Settings → Environment Variables). Without it, the chat shows a friendly "being set up" message.
