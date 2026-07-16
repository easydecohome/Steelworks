/* =========================================
   SHENGXI STEEL — main interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initHeroSlider();
  initTestimonialSlider();
  initChatbot();
  initExitPopup();
  initForms();
  initFaqAccordion();
  initLazyLoad();
});

/* Mobile navigation */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  document.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth < 992) {
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });
}

/* Hero slideshow */
function initHeroSlider() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  const dotsWrap = slider.querySelector('.slider-dots');
  const prev = slider.querySelector('.slider-arrow.prev');
  const next = slider.querySelector('.slider-arrow.next');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function showSlide(index) {
    slides.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (d, i) {
        d.classList.toggle('active', i === index);
      });
    }
    current = index;
  }

  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlide() { showSlide((current - 1 + slides.length) % slides.length); }

  if (dotsWrap) {
    slides.forEach(function (_, i) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { showSlide(i); resetTimer(); });
      dotsWrap.appendChild(b);
    });
  }

  if (prev) prev.addEventListener('click', function () { prevSlide(); resetTimer(); });
  if (next) next.addEventListener('click', function () { nextSlide(); resetTimer(); });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 5500);
  }

  resetTimer();
}

/* Testimonials slider */
function initTestimonialSlider() {
  const wrap = document.querySelector('.testimonials');
  if (!wrap) return;

  const slides = wrap.querySelectorAll('.testimonial-slide');
  const dotsWrap = wrap.querySelector('.testimonial-dots');
  if (!slides.length) return;

  let current = 0;

  function show(i) {
    slides.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
    if (dotsWrap) {
      dotsWrap.querySelectorAll('button').forEach(function (d, idx) {
        d.classList.toggle('active', idx === i);
      });
    }
    current = i;
  }

  if (dotsWrap) {
    slides.forEach(function (_, i) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { show(i); });
      dotsWrap.appendChild(b);
    });
  }

  setInterval(function () { show((current + 1) % slides.length); }, 7000);
}

/* Lightweight chatbot */
function initChatbot() {
  const launcher = document.querySelector('.chatbot-launcher button');
  const windowEl = document.querySelector('.chatbot-window');
  const closeBtn = document.querySelector('.chatbot-header button');
  const body = document.querySelector('.chatbot-body');
  const actions = document.querySelector('.chatbot-actions');
  if (!launcher || !windowEl || !body) return;

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = 'chat-message ' + sender;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  function botReply(text) {
    setTimeout(function () { addMessage(text, 'bot'); }, 450);
  }

  launcher.addEventListener('click', function () {
    windowEl.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () { windowEl.classList.remove('open'); });
  }

  if (actions) {
    actions.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const q = this.textContent.trim();
        addMessage(q, 'user');
        const replies = {
          'Request a quote': 'Great! Please tell me the product, grade, size and quantity you need.',
          'Product catalog': 'We supply seamless steel pipe, steel plate and steel rods/bars. Which category interests you?',
          'Delivery & shipping': 'We ship FOB, CIF and EXW worldwide. Typical lead time is 7–45 days depending on order size.',
          'Talk to sales': 'You can reach Sam Li at +86-15962506807 or [email protected]. What can I help with?'
        };
        botReply(replies[q] || 'Our team will get back to you shortly.');
      });
    });
  }
}

/* Exit-intent popup */
function initExitPopup() {
  const popup = document.querySelector('.exit-popup');
  if (!popup) return;

  const close = popup.querySelector('.close');
  let shown = false;

  function showPopup() {
    if (shown) return;
    popup.classList.add('open');
    shown = true;
  }

  document.addEventListener('mouseout', function (e) {
    if (e.clientY < 10 && !e.relatedTarget) showPopup();
  });

  if (close) {
    close.addEventListener('click', function () { popup.classList.remove('open'); });
  }

  popup.addEventListener('click', function (e) {
    if (e.target === popup) popup.classList.remove('open');
  });
}

/* Form handling (placeholders) */
function initForms() {
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const action = form.getAttribute('action') || '';
      // Prevent submission for placeholder actions so the page does not reload.
      if (action.includes('YOUR_FORM_ID') || action.includes('javascript:void(0)')) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn ? btn.textContent : '';
        if (btn) {
          btn.textContent = 'Sent! We will reply shortly.';
          btn.disabled = true;
        }
        setTimeout(function () {
          form.reset();
          if (btn) {
            btn.textContent = originalText;
            btn.disabled = false;
          }
        }, 2500);
      }
    });
  });
}

/* FAQ accordion */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* Lazy load images */
function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(function (img) { observer.observe(img); });
  } else {
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.dataset.src;
    });
  }
}
