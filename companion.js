(() => {
  const log = document.getElementById('chatLog');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const chatHistory = [];

  function addBubble(role, text) {
    const div = document.createElement('div');
    div.className = 'bubble ' + role;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
    return div;
  }

  function setBusy(busy) {
    sendBtn.disabled = busy;
    input.disabled = busy;
    if (!busy) input.focus({ preventScroll: true });
  }

  async function send(text) {
    text = text.trim();
    if (!text) return;
    document.getElementById('chips').hidden = true;
    addBubble('user', text);
    chatHistory.push({ role: 'user', content: text });
    input.value = '';
    input.style.height = '';
    setBusy(true);

    const reply = addBubble('assistant typing', '');
    let full = '';
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'error');
      }
      reply.classList.remove('typing');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        reply.textContent = full;
        log.scrollTop = log.scrollHeight;
      }
      chatHistory.push({ role: 'assistant', content: full });
    } catch (e) {
      reply.classList.remove('typing');
      reply.classList.add('error');
      reply.textContent = e.message === 'not_configured'
        ? "The AI companion is being set up and will be available very soon. Meanwhile, you can book a free session with a real coach on the Book page."
        : "Sorry, I couldn't reply just now. Please check your internet connection and try again.";
      chatHistory.pop();
    } finally {
      setBusy(false);
    }
  }

  form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input.value); }
  });
  input.addEventListener('input', () => {
    input.style.height = '';
    input.style.height = Math.min(input.scrollHeight, 140) + 'px';
  });
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => send(c.textContent)));
})();
