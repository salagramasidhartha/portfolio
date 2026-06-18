/* ─── NAV: scroll state + hamburger ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── HERO CANVAS: animated dot grid ─── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, dots;

  const ACCENT = '56,189,248';
  const GREEN  = '52,211,153';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildDots();
  }

  function buildDots() {
    const cols = Math.ceil(W / 60);
    const rows = Math.ceil(H / 60);
    dots = [];
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        dots.push({
          x: c * 60 + (Math.random() - 0.5) * 10,
          y: r * 60 + (Math.random() - 0.5) * 10,
          baseAlpha: Math.random() * 0.25 + 0.05,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.008 + 0.004,
          color: Math.random() > 0.7 ? GREEN : ACCENT,
        });
      }
    }
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);

    /* radial gradient vignette */
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.7);
    grad.addColorStop(0, 'rgba(56,189,248,0.04)');
    grad.addColorStop(1, 'rgba(11,17,32,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    /* dots */
    dots.forEach(d => {
      const alpha = d.baseAlpha * (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
      const r = alpha > 0.18 ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color},${alpha.toFixed(2)})`;
      ctx.fill();
    });

    /* faint connecting lines between nearby dots */
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          const a = (1 - dist / 80) * 0.06;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(${ACCENT},${a.toFixed(2)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    t++;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-title, .section-label, .about-grid, .skills-grid, .timeline-item, .project-card, .contact-grid').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

document.querySelectorAll('.hero-stats').forEach(el => {
  el.classList.add('reveal-children');
  observer.observe(el);
});

/* ─── CONTACT FORM: mailto fallback ─── */
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(this);
  const name    = data.get('name')    || '';
  const email   = data.get('email')   || '';
  const subject = data.get('subject') || 'Portfolio Contact';
  const message = data.get('message') || '';

  const body = encodeURIComponent(
    `Name: ${name}\nFrom: ${email}\n\n${message}`
  );
  const mailtoLink = `mailto:salagramasidhartha@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = mailtoLink;

  const status = document.getElementById('form-status');
  status.textContent = 'Opening your mail client...';
  setTimeout(() => { status.textContent = ''; }, 4000);
});

/* ─── ACTIVE NAV LINK on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
}, { passive: true });
