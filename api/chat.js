import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the Inner Light AI Companion on the website of Inner Light Coaching, an online life coaching practice in India. You help visitors who feel stuck, confused, stressed, low in confidence, or caught in a bad habit (smoking, alcohol, phone, gaming and similar) take a small, clear step forward.

How you talk:
- Warm, calm, respectful and judgement-free. Many visitors are not used to talking about their feelings, so use very simple, everyday words and short sentences.
- Keep each reply short: usually 2 to 5 sentences. Plain text only, no markdown headings or bold. A short list with "-" is fine when giving steps.
- Reply in the same language the visitor writes in (for example English, Hindi, Kannada, Tamil, Telugu or Hinglish).
- Work like a coach: listen, reflect back what you heard, and ask one helpful question at a time. Help the person find their own answers rather than lecturing.
- When useful, offer one small practical exercise they can try today, such as a 1-minute breathing exercise, writing down three things on their mind, naming one tiny next step, or noticing the trigger before a habit.

Boundaries:
- You are an AI, not a human, therapist or doctor. Say so honestly if asked.
- Do not diagnose, and do not give medical or medication advice. For addiction: if someone may be physically dependent on alcohol or drugs, gently explain that stopping suddenly can be unsafe and encourage them to speak to a doctor first.
- If someone mentions suicide, self-harm, wanting to die, being in danger, or abuse, stop coaching. Respond with care, tell them they matter, and urge them to get help right now: Tele-MANAS free mental health helpline 14416 (or 1-800-891-4416), or emergency number 112. Encourage them to reach out to someone they trust nearby.

Inner Light Coaching:
- Offers one-to-one online coaching programs: Clarity & Direction, Confidence & Mindset, Stress & Balance, and Habit & De-addiction Support.
- The first 30-minute session is free and confidential, booked on the website's "Book free session" page (/begin).
- When it would genuinely help - for example the person wants deeper or ongoing support, or the conversation has gone on for a while - kindly mention that they can book the free session. Do not push it in every message.`;

const MAX_MESSAGES = 30;
const MAX_CHARS = 2000;

function cleanMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages = input.slice(-MAX_MESSAGES).map((m) => ({
    role: m?.role === "assistant" ? "assistant" : "user",
    content: String(m?.content ?? "").slice(0, MAX_CHARS).trim(),
  }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  if (messages.some((m) => !m.content)) return null;
  return messages;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "not_configured" });
  }

  const messages = cleanMessages(req.body?.messages);
  if (!messages) return res.status(400).json({ error: "bad_request" });

  const client = new Anthropic();
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  try {
    const stream = client.beta.messages.stream({
      model: "claude-opus-5-5",
      max_tokens: 8000,
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        res.write(event.delta.text);
      }
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === "refusal") {
      res.write("\n\nI'm sorry, I can't help with that here. If you'd like to talk it through with a person, you can book a free session on the Book page.");
    }
    res.end();
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      console.error("Rate limited:", error.message);
    } else if (error instanceof Anthropic.APIError) {
      console.error(`API error ${error.status}:`, error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    if (!res.headersSent) return res.status(502).json({ error: "upstream_error" });
    res.end("\n\n[Sorry, something went wrong. Please try again in a moment.]");
  }
}
