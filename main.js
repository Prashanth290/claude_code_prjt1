// Paste your Formspree form URL here (e.g. "https://formspree.io/f/abcdwxyz") to receive bookings by email.
const FORM_ENDPOINT = "";

const header = document.querySelector('.site-header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelector('.menu-btn').addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  document.querySelector('.menu-btn').setAttribute('aria-expanded', open);
});

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0, rootMargin: '0px 0px 120px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

document.querySelectorAll('.yr').forEach(el => el.textContent = new Date().getFullYear());

const form = document.getElementById('bookForm');
if (form) {
  const msg = document.getElementById('formMsg');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    msg.style.display = 'block';
    if (!FORM_ENDPOINT) {
      msg.textContent = "Bookings are opening very soon — please check back in a few days. Thank you for your interest!";
      return;
    }
    msg.textContent = "Sending…";
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error();
      form.reset();
      msg.textContent = "Thank you! Your request has been received. I'll be in touch within 24 hours.";
    } catch {
      msg.textContent = "Sorry, something went wrong. Please try again in a moment.";
    }
  });
}
