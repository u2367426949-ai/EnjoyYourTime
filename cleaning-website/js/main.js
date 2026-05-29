/* ===================================================
   NettoPro — JavaScript
   • Navigation sticky + burger menu
   • Animations au scroll (Intersection Observer)
   • Validation formulaire de contact
   =================================================== */

(function () {
  'use strict';

  // =====================
  // 1. NAVIGATION
  // =====================

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  // Scroll → style sticky
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Burger menu (mobile)
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    // Animation des barres
    burger.querySelectorAll('span').forEach((span, i) => {
      span.style.transform = isOpen
        ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
          : i === 1 ? 'opacity:0; scaleX(0)'
          : 'rotate(-45deg) translate(5px, -5px)'
        : '';
      if (i === 1) span.style.opacity = isOpen ? '0' : '1';
    });
  });

  // Fermer le menu au clic sur un lien
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.querySelectorAll('span').forEach(span => {
        span.style.transform = '';
        span.style.opacity = '1';
      });
    });
  });

  // =====================
  // 2. SCROLL ANIMATIONS
  // =====================
  // Anime les éléments avec [data-aos] lorsqu'ils entrent dans le viewport

  const animatedEls = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animatedEls.forEach(el => observer.observe(el));
  } else {
    // Fallback pour anciens navigateurs
    animatedEls.forEach(el => el.classList.add('aos-visible'));
  }

  // =====================
  // 3. FORMULAIRE
  // =====================

  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validation simple côté client
      const fields = {
        nom:     form.querySelector('#nom'),
        tel:     form.querySelector('#tel'),
        email:   form.querySelector('#email'),
        service: form.querySelector('#service'),
      };

      let isValid = true;

      // Nettoyage des erreurs précédentes
      Object.values(fields).forEach(f => f.classList.remove('error'));

      // Vérification champs obligatoires
      if (!fields.nom.value.trim()) {
        fields.nom.classList.add('error');
        isValid = false;
      }

      if (!fields.tel.value.trim()) {
        fields.tel.classList.add('error');
        isValid = false;
      }

      // Email basique
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fields.email.value.trim())) {
        fields.email.classList.add('error');
        isValid = false;
      }

      if (!fields.service.value) {
        fields.service.classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        // Scroller vers le premier champ en erreur
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Envoi via Formspree
      // ⚠️ Remplacer VOTRE_ID_FORMSPREE par l'ID fourni sur formspree.io
      sendToFormspree(new FormData(form));
    });
  }

  function sendToFormspree(data) {
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn__text');
    const formAction = form.getAttribute('action');

    submitBtn.disabled = true;
    btnText.textContent = 'Envoi en cours…';

    fetch(formAction, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          successMsg.hidden = false;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function () { successMsg.hidden = true; }, 6000);
        } else {
          return response.json().then(function (body) {
            var msg = (body && body.errors)
              ? body.errors.map(function (e) { return e.message; }).join(', ')
              : 'Une erreur est survenue. Veuillez réessayer ou nous appeler directement.';
            alert(msg);
          });
        }
      })
      .catch(function () {
        alert('Impossible d\'envoyer le message. Vérifiez votre connexion ou contactez-nous par téléphone.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        btnText.textContent = 'Envoyer ma demande';
      });
  }

  // =====================
  // 4. SMOOTH SCROLL POLYFILL
  // =====================
  // Fallback pour les navigateurs ne supportant pas scroll-behavior: smooth
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // hauteur du header fixe
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
