/* ═══════════════════════════════════════════════════
   EnjoyYourTime V2 — JavaScript Premium
   • Loader animé
   • Curseur custom avec effet magnétique
   • Particules canvas hero
   • Scroll reveal (IntersectionObserver)
   • Compteurs animés
   • Navbar scrollspy
   • Formulaire Formspree live
   • Burger menu
   • Back to top
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ───────────────────────────────────────────────
     1. LOADER
  ─────────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  window.addEventListener('load', function () {
    setTimeout(function () {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Déclencher les animations hero après le loader
      triggerHeroReveal();
    }, 1900);
  });

  function triggerHeroReveal() {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-clip').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ───────────────────────────────────────────────
     2. CURSEUR CUSTOM + EFFET MAGNÉTIQUE
  ─────────────────────────────────────────────── */
  var cursor    = document.getElementById('cursor');
  var cursorDot = document.getElementById('cursorDot');

  if (cursor && window.innerWidth > 768) {
    var mouseX = 0, mouseY = 0;
    var curX   = 0, curY   = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    });

    // Lissage cursor ring
    function animateCursor() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.left = curX + 'px';
      cursor.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });

    document.addEventListener('mousedown', function () { cursor.classList.add('is-clicking'); });
    document.addEventListener('mouseup',   function () { cursor.classList.remove('is-clicking'); });

    // Magnétisme sur éléments .magnetic
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect   = el.getBoundingClientRect();
        var relX   = e.clientX - rect.left - rect.width  / 2;
        var relY   = e.clientY - rect.top  - rect.height / 2;
        el.style.transform = 'translate(' + relX * 0.22 + 'px, ' + relY * 0.22 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ───────────────────────────────────────────────
     3. PARTICULES CANVAS
  ─────────────────────────────────────────────── */
  var canvas = document.getElementById('particleCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 55;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.r     = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.hue   = Math.random() > 0.5 ? 200 : 250; // bleu ou indigo
    };

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += (Math.random() - 0.5) * 0.008;
      this.alpha = Math.max(0.05, Math.min(0.55, this.alpha));

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + this.hue + ', 85%, 70%, ' + this.alpha + ')';
      ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Tracé des connections entre particules proches
    function drawConnections() {
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx   = particles[a].x - particles[b].x;
          var dy   = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            var opacity = (1 - dist / 90) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = 'rgba(56, 189, 248, ' + opacity + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ───────────────────────────────────────────────
     4. SCROLL REVEAL (IntersectionObserver)
  ─────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal-up, .reveal-side, .reveal-clip');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function (el) {
      // Skip hero elements — gérés par le loader
      if (!el.closest('.hero')) {
        revealObserver.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ───────────────────────────────────────────────
     5. COMPTEURS ANIMÉS
  ─────────────────────────────────────────────── */
  var counters = document.querySelectorAll('.counter, [data-count]');
  var counted  = false;

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1600;
    var start    = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Easing : ease-out expo
      var ease = 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(function (c) { animateCounter(c); });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    if (counters.length) counterObserver.observe(counters[0]);
  }

  /* ───────────────────────────────────────────────
     6. NAVBAR — scroll + scrollspy
  ─────────────────────────────────────────────── */
  var header = document.getElementById('header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    toggleBackToTop();
  }, { passive: true });

  /* ───────────────────────────────────────────────
     7. BURGER MENU MOBILE
  ─────────────────────────────────────────────── */
  var burger   = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  var lines    = burger ? burger.querySelectorAll('.burger__line') : [];

  if (burger) {
    burger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        lines[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
        lines[1].style.opacity   = '0';
        lines[1].style.transform = 'scaleX(0)';
        lines[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
      } else {
        lines.forEach(function (l) { l.style.transform = ''; l.style.opacity = ''; });
      }
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        lines.forEach(function (l) { l.style.transform = ''; l.style.opacity = ''; });
      });
    });
  }

  /* ───────────────────────────────────────────────
     8. SMOOTH SCROLL
  ─────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id     = this.getAttribute('href');
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var navH = parseInt(getComputedStyle(document.documentElement)
                            .getPropertyValue('--nav-h'), 10) || 72;
        var top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ───────────────────────────────────────────────
     9. BACK TO TOP
  ─────────────────────────────────────────────── */
  var backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ───────────────────────────────────────────────
     10. FORMULAIRE DE CONTACT — Formspree
  ─────────────────────────────────────────────── */
  var form       = document.getElementById('contactForm');
  var successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = {
        nom:     document.getElementById('nom'),
        tel:     document.getElementById('tel'),
        email:   document.getElementById('email'),
        service: document.getElementById('service'),
      };

      var isValid = true;

      // Reset erreurs
      Object.values(fields).forEach(function (f) {
        f.closest('.cform__field').classList.remove('error');
      });

      if (!fields.nom.value.trim()) {
        fields.nom.closest('.cform__field').classList.add('error');
        isValid = false;
      }

      if (!fields.tel.value.trim()) {
        fields.tel.closest('.cform__field').classList.add('error');
        isValid = false;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fields.email.value.trim())) {
        fields.email.closest('.cform__field').classList.add('error');
        isValid = false;
      }

      if (!fields.service.value) {
        fields.service.closest('.cform__field').classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        var firstErr = form.querySelector('.cform__field.error input, .cform__field.error select');
        if (firstErr) firstErr.focus();
        return;
      }

      var submitBtn = form.querySelector('.cform__btn');
      var btnText   = submitBtn.querySelector('.cform__btn-text');

      submitBtn.disabled       = true;
      btnText.textContent      = 'Envoi en cours';

      fetch(form.getAttribute('action'), {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            successMsg.hidden = false;
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            setTimeout(function () { successMsg.hidden = true; }, 7000);
          } else {
            return response.json().then(function (body) {
              var msg = (body && body.errors)
                ? body.errors.map(function (e) { return e.message; }).join(', ')
                : 'Une erreur est survenue. Veuillez nous appeler directement.';
              alert(msg);
            });
          }
        })
        .catch(function () {
          alert('Impossible d\'envoyer. Vérifiez votre connexion ou contactez-nous par téléphone.');
        })
        .finally(function () {
          submitBtn.disabled  = false;
          btnText.textContent = 'Envoyer ma demande';
        });
    });
  }

  /* ───────────────────────────────────────────────
     11. TICKER — pause au hover
  ─────────────────────────────────────────────── */
  var tickerTrack = document.querySelector('.ticker__track');
  if (tickerTrack) {
    ticker.addEventListener('mouseenter', function () {
      tickerTrack.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', function () {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

})();
