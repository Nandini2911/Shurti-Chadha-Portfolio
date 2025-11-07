// Hero copy animation
const hero = document.getElementById('heroCopy');
const ioHero = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      hero.classList.add('animate-scale-in');
      ioHero.disconnect();
    }
  });
}, { threshold: 0.3 });

if (hero) ioHero.observe(hero);

// Pop-in observer for elements with [data-pop]
const ioPop = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const delay = +e.target.getAttribute('data-pop-delay') || 0;
      setTimeout(()=> e.target.classList.add('pop-in'), delay);
      ioPop.unobserve(e.target);
    }
  });
}, {threshold:0.15});

document.querySelectorAll('[data-pop]').forEach(el=> ioPop.observe(el));
/* ========= In-view animations ========= */
(function () {
  // Pop-in observer for elements with [data-pop]
  const ioPop = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const delay = +e.target.getAttribute('data-pop-delay') || 0;
        setTimeout(()=> e.target.classList.add('pop-in'), delay);
        ioPop.unobserve(e.target);
      }
    });
  }, {threshold:0.15});

  document.querySelectorAll('[data-pop]').forEach(el=> ioPop.observe(el));
})();

/* ========= Contact form popup logic ========= */
(function () {
  const form = document.getElementById('enquiryForm');
  const sendBtn = document.getElementById('sendBtn');
  const popup = document.getElementById('popup');
  const popupContent = popup ? popup.querySelector('.popup-content') : null;

  function openPopup() {
    if (!popup) return;
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('body--locked');
    // focus the close button for accessibility
    const btn = popup.querySelector('button');
    if (btn) btn.focus();
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--locked');
    // return focus to send button
    if (sendBtn) sendBtn.focus();
  }
  // expose for inline onclick fallback
  window.closePopup = closePopup;

  function handleSendClick() {
    if (!form) return;

    // simple HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // If you later wire a backend, submit here via fetch().
    // For now, just show confirmation popup.
    openPopup();
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSendClick);

  // Close on outside click
  if (popup) {
    popup.addEventListener('click', (e) => {
      if (!popupContent) return;
      if (!popupContent.contains(e.target)) closePopup();
    });
  }

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });
})();
