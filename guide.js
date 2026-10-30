(() => {
  const log = document.getElementById('guideLog');
  const panel = document.getElementById('guidePanel');

  const TOPICS = {
    stuck: {
      label: 'I feel stuck in life',
      intro: "Feeling stuck is very common. It often means a part of you is ready for change. Let's take a few small steps together.",
      steps: [
        { type: 'choice', q: 'Which part of your life feels most stuck right now?', options: ['Work or studies', 'Relationships', 'Health', 'Money', 'Something else'] },
        { type: 'text', q: 'Imagine it is 6 months from now and things feel better. What is one thing that is different?', ph: 'For example: I enjoy my work again' },
        { type: 'text', q: 'What is one tiny step (10 minutes or less) you could take this week towards that?', ph: 'For example: Update my CV for 10 minutes', key: 'step' },
      ],
      close: "Write your tiny step where you will see it every day, like a sticky note or your phone wallpaper. Small steps, done often, create big change.",
    },
    overthink: {
      label: 'I overthink everything',
      intro: "When the mind keeps running, it is tiring. Let's slow it down together, starting with your breath.",
      steps: [
        { type: 'breathe', q: "Let's breathe together for one minute. Breathe in as the circle grows, and out as it gets smaller." },
        { type: 'text', q: 'What is the main thought that keeps coming back?', ph: 'Write it in a few words' },
        { type: 'choice', q: 'Is this something you can control?', options: ['Yes, partly', 'No, not really', 'I am not sure'] },
        { type: 'text', q: 'What is one small thing you can do about it today, or one thing you can let go of?', ph: 'For example: Send that message / Stop checking my phone after 10 pm', key: 'step' },
      ],
      close: "Thoughts are like clouds. They come and they go. You do not have to follow every one. When your mind starts racing again, come back to one minute of slow breathing.",
    },
    habit: {
      label: 'I want to quit a bad habit',
      intro: "Wanting to change a habit takes courage. By being here, you have already taken the first step.",
      steps: [
        { type: 'choice', q: 'Which habit would you like to change?', options: ['Smoking', 'Alcohol', 'Phone or social media', 'Gaming', 'Something else'] },
        { type: 'text', q: 'When does the urge usually come? Think about the time, place or feeling.', ph: 'For example: After dinner, when I feel stressed or bored' },
        { type: 'text', q: 'What could you do instead for 5 minutes when the urge comes?', ph: 'For example: Drink water, go for a short walk, call a friend', key: 'step' },
      ],
      close: "Urges come like waves. They rise, and then they pass. Next time an urge comes, do your 5-minute action and let the wave pass. Every time you do this, it gets a little easier.",
      note: "If you drink alcohol heavily every day or use drugs, please speak to a doctor before stopping. Stopping suddenly can be unsafe.",
    },
    clarity: {
      label: "I don't know what I want",
      intro: "Not knowing what you want is okay. Clarity comes step by step. Let's look for a few clues together.",
      steps: [
        { type: 'text', q: 'When did you last feel truly happy or proud? What were you doing?', ph: 'For example: Teaching my younger cousin' },
        { type: 'multi', q: 'What matters most to you? Choose up to 3.', options: ['Family', 'Health', 'Money', 'Freedom', 'Learning', 'Helping others', 'Peace', 'Creativity', 'Respect'], max: 3 },
        { type: 'text', q: 'Based on this, what is one thing you would like more of in your life?', ph: 'For example: More time to learn new things', key: 'step' },
      ],
      close: "Your happy moments and what matters to you are clues to what you really want. Keep noticing them. Clarity grows when you pay attention.",
    },
  };

  let topic, idx, answers, timer;

  function bubble(cls, text) {
    const d = document.createElement('div');
    d.className = 'bubble ' + cls;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }
  function btn(text, cls, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = text;
    b.addEventListener('click', onClick);
    return b;
  }
  function setPanel(...nodes) {
    clearInterval(timer);
    panel.replaceChildren(...nodes);
  }

  function showTopics() {
    const wrap = document.createElement('div');
    wrap.className = 'chips';
    for (const [id, t] of Object.entries(TOPICS)) wrap.appendChild(btn(t.label, 'chip', () => start(id)));
    setPanel(wrap);
  }

  function start(id) {
    topic = TOPICS[id];
    idx = 0;
    answers = [];
    bubble('user', topic.label);
    bubble('assistant', topic.intro);
    ask();
  }

  function answer(text) {
    if (text) bubble('user', text);
    idx++;
    ask();
  }

  function ask() {
    const s = topic.steps[idx];
    if (!s) return finish();
    bubble('assistant', `Step ${idx + 1} of ${topic.steps.length}: ${s.q}`);

    if (s.type === 'text') {
      const ta = document.createElement('textarea');
      ta.rows = 2;
      ta.maxLength = 500;
      ta.placeholder = s.ph || 'Type here…';
      const next = btn('Next →', 'btn', () => {
        const v = ta.value.trim();
        if (!v) { ta.focus(); return; }
        answers.push({ q: s.q, a: v, key: s.key });
        answer(v);
      });
      const skip = btn('Skip', 'link-btn', () => answer(''));
      const row = document.createElement('div');
      row.className = 'guide-row';
      row.append(skip, next);
      setPanel(ta, row);
      ta.focus({ preventScroll: true });
    } else if (s.type === 'choice') {
      const wrap = document.createElement('div');
      wrap.className = 'chips';
      for (const o of s.options) wrap.appendChild(btn(o, 'chip', () => { answers.push({ q: s.q, a: o }); answer(o); }));
      setPanel(wrap);
    } else if (s.type === 'multi') {
      const picked = new Set();
      const wrap = document.createElement('div');
      wrap.className = 'chips';
      const next = btn('Next →', 'btn', () => {
        if (!picked.size) return;
        const v = [...picked].join(', ');
        answers.push({ q: s.q, a: v });
        answer(v);
      });
      for (const o of s.options) {
        const c = btn(o, 'chip', () => {
          if (picked.has(o)) { picked.delete(o); c.classList.remove('on'); }
          else if (picked.size < s.max) { picked.add(o); c.classList.add('on'); }
        });
        wrap.appendChild(c);
      }
      const row = document.createElement('div');
      row.className = 'guide-row';
      row.append(next);
      setPanel(wrap, row);
    } else if (s.type === 'breathe') {
      const circle = document.createElement('div');
      circle.className = 'breath';
      const label = document.createElement('div');
      label.className = 'breath-label';
      label.textContent = 'Press start when you are ready';
      const go = btn('Start', 'btn', () => {
        go.remove();
        circle.classList.add('run');
        let t = 60;
        const tick = () => {
          const phase = (60 - t) % 8 < 4 ? 'Breathe in…' : 'Breathe out…';
          label.textContent = `${phase}  ${t}s`;
          if (t-- <= 0) { clearInterval(timer); bubble('user', 'Done'); idx++; ask(); }
        };
        tick();
        timer = setInterval(tick, 1000);
      });
      const skip = btn('Skip', 'link-btn', () => answer(''));
      const row = document.createElement('div');
      row.className = 'guide-row';
      row.append(skip, go);
      setPanel(circle, label, row);
    }
  }

  function finish() {
    bubble('assistant', 'You did it. 🌱 ' + topic.close);
    if (topic.note) bubble('assistant note', topic.note);
    const step = answers.find(a => a.key === 'step');
    if (step) bubble('assistant highlight', 'Your next small step: ' + step.a);

    const card = document.createElement('div');
    card.className = 'guide-end';
    const p = document.createElement('p');
    p.textContent = 'Would you like support to keep going? Talk to a coach in a free 30-minute session.';
    const book = document.createElement('a');
    book.className = 'btn';
    book.href = 'begin.html#book';
    book.textContent = 'Book a free session →';
    const again = btn('Try another topic', 'btn outline', () => { log.replaceChildren(); bubble('assistant', 'What would you like to work on?'); showTopics(); });
    const row = document.createElement('div');
    row.className = 'guide-row';
    row.append(again, book);
    card.append(p, row);
    setPanel(card);
  }

  showTopics();
})();
