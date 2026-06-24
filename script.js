// theme toggle
const themeBtn = document.getElementById('themeToggle');
const iconMoon = themeBtn.querySelector('.icon-moon');
const iconSun  = themeBtn.querySelector('.icon-sun');

function applyTheme(light) {
  document.body.classList.toggle('light', light);
  iconMoon.style.display = light ? 'none'  : '';
  iconSun.style.display  = light ? ''      : 'none';
}

applyTheme(localStorage.getItem('theme') === 'light');

themeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  iconMoon.style.display = isLight ? 'none' : '';
  iconSun.style.display  = isLight ? ''     : 'none';
});

// nav shadow on scroll
const hdr = document.getElementById('hdr');
addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 10));

// scroll spy — highlight active nav link
const navLinks = document.querySelectorAll('.nav-links a');

const spy = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.remove('active'));
    const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (link) link.classList.add('active');
  });
}, { rootMargin: '-15% 0px -75% 0px' });

['services', 'netsuite', 'odoo-detail', 'process'].forEach(id => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

// stat counter animation
(function(){
  function animateNum(el) {
    const raw = el.textContent.trim();
    const suffix = raw.replace(/[0-9]/g, '');
    const target = parseInt(raw);
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.floor(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateNum(e.target.querySelector('.stat-num'));
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-card').forEach(c => statObs.observe(c));
})();

// testimonials carousel with auto-scroll
(function(){
  const track = document.getElementById('testiTrack');
  const dotsWrap = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.children.length;
  const isMobile = () => window.innerWidth <= 920;
  const perPage = () => isMobile() ? 1 : 2;
  let page = 0;
  let timer;

  function pages() { return Math.ceil(cards / perPage()); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < pages(); i++) {
      const d = document.createElement('button');
      d.className = 'testi-dot' + (i === page ? ' active' : '');
      d.addEventListener('click', () => { goTo(i); resetTimer(); });
      dotsWrap.appendChild(d);
    }
  }

  function goTo(p) {
    page = ((p % pages()) + pages()) % pages();
    const cardWidth = 100 / perPage();
    track.style.transform = `translateX(-${page * perPage() * cardWidth}%)`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function startTimer() { timer = setInterval(() => goTo(page + 1), 4000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  document.querySelector('.testi-prev').addEventListener('click', () => { goTo(page - 1); resetTimer(); });
  document.querySelector('.testi-next').addEventListener('click', () => { goTo(page + 1); resetTimer(); });

  const outer = document.querySelector('.testi-outer');
  outer.addEventListener('mouseenter', () => clearInterval(timer));
  outer.addEventListener('mouseleave', startTimer);

  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  buildDots();
  startTimer();
})();

// scroll reveal
const io = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 60 + 'ms';
  io.observe(el);
});
