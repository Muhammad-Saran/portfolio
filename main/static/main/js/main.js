/* ==========================================================
   Muhammad Saran — AI Portfolio JavaScript
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===================== PARTICLE CANVAS =====================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 140;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animateParticles);
  }

  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


  // ===================== TYPING ANIMATION =====================
  const typedEl = document.querySelector('.typed-text');
  const titles = [
    'Senior AI Software Engineer',
    'LLM Systems Architect',
    'RAG Pipeline Specialist',
    'MLOps Engineer',
    'Prompt Engineering Expert',
    'AI Product Builder'
  ];
  let titleIdx = 0, charIdx = 0, isDeleting = false;

  function typeEffect() {
    if (!typedEl) return;
    const current = titles[titleIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(typeEffect, 400);
        return;
      }
      setTimeout(typeEffect, 40);
    } else {
      typedEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2200);
        return;
      }
      setTimeout(typeEffect, 70);
    }
  }
  setTimeout(typeEffect, 800);


  // ===================== SCROLL REVEAL =====================
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ===================== SKILL BARS =====================
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target.dataset.pct;
        entry.target.style.width = target + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));


  // ===================== COUNTER ANIMATION =====================
  const counters = document.querySelectorAll('.count-up');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = end / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, end);
          el.textContent = Math.floor(current) + suffix;
          if (current >= end) clearInterval(timer);
        }, 20);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));


  // ===================== ACTIVE NAV ON SCROLL =====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sidebar-nav a');

  function setActiveNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.sidebar-nav a[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();


  // ===================== RESUME TABS =====================
  const tabs = document.querySelectorAll('.resume-tab');
  const contents = document.querySelectorAll('.resume-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });


  // ===================== PROJECT FILTER =====================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const categories = card.dataset.category ? card.dataset.category.split(',') : [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ===================== TESTIMONIAL CAROUSEL =====================
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentSlide = 0;
  const totalSlides = document.querySelectorAll('.testimonial-slide').length;

  function goToSlide(idx) {
    currentSlide = (idx + totalSlides) % totalSlides;
    if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

  // Auto-play
  let autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
  if (track) {
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.parentElement.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });
  }
  goToSlide(0);


  // ===================== MOBILE MENU =====================
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      });
    });
  }


  // ===================== CONTACT FORM =====================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-send');
      const originalHTML = btn.innerHTML;

      // Show loading state
      btn.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.8';

      // Prefer the CSRF token rendered into the form; fall back to cookie
      const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
      const csrfToken = csrfInput ? csrfInput.value : (document.cookie.split(';')
        .find(c => c.trim().startsWith('csrftoken='))
        ?.split('=')[1] || '');

      const formData = new FormData(contactForm);

      try {
        const res = await fetch('/contact/', {
          method: 'POST',
          headers: { 'X-CSRFToken': csrfToken },
          body: formData,
          credentials: 'same-origin',
        });

        // Safely handle non-JSON error responses (e.g., Django 403/500 HTML pages)
        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Unexpected server response (${res.status}): ${text.substring(0,200)}`);
        }

        if (res.ok && data.status === 'ok') {
          btn.innerHTML = '<i class="ri-check-double-line"></i> Message Sent!';
          btn.style.background = 'linear-gradient(90deg, #00c853, #69f0ae)';
          btn.style.opacity = '1';
          contactForm.reset();
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
          }, 4000);
        } else {
          btn.innerHTML = '<i class="ri-error-warning-line"></i> Failed — Try Again';
          btn.style.background = 'linear-gradient(90deg, #ff4444, #cc0000)';
          btn.style.opacity = '1';
          btn.disabled = false;
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
          }, 4000);
        }
      } catch (err) {
        console.error('Contact form error:', err);
        btn.innerHTML = '<i class="ri-wifi-off-line"></i> Network Error';
        btn.style.background = 'linear-gradient(90deg, #ff4444, #cc0000)';
        btn.style.opacity = '1';
        btn.disabled = false;
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
        }, 4000);
      }
    });
  }

});
