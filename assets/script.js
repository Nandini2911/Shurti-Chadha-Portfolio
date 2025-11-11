// ================== Hero copy animation ==================
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

// ================== In-view pop-ins (single observer) ==================
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

/* ========= Contact form popup logic (safe if elements absent) ========= */
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
    const btn = popup.querySelector('button');
    if (btn) btn.focus();
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('body--locked');
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

    // TODO: wire to backend via fetch() if needed.
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

/* ========= Mailto rescue: force open + copy fallback ========= */
document.addEventListener('click', async (e) => {
  const a = e.target.closest('a[href^="mailto:"]');
  if (!a) return;

  // Ensure no ancestor overlay swallows the event
  e.stopPropagation();

  // Attempt to open the default mail handler
  try {
    window.location.href = a.href;
  } catch (_) {}

  // Fallback: copy email to clipboard so user can paste if no handler is set
  try {
    const addr = a.getAttribute('href').replace(/^mailto:/, '');
    await navigator.clipboard.writeText(addr);
    // Optional: show a toast or console info
    // console.info('Email copied:', addr);
  } catch (_) { /* ignore */ }
});
// Hard-open mail client and copy as fallback
function openMail(addr) {
  try {
    // Force navigation to mailto (works even if listeners stopped default)
    window.location.assign(`mailto:${addr}`);
  } catch (_) { /* ignore */ }

  // Fallback: copy to clipboard so user can paste if no handler is set
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(addr).catch(() => {});
  }
  // Always return true so browsers that do handle mailto still proceed
  return true;
}

// Diagnose if some overlay is blocking clicks (temporary; remove after test)
document.getElementById('mailtoWork')?.addEventListener('click', () => {
  console.log('mailto clicked');
});


 
  (function () {
    const video = document.getElementById('heroVideo');

    // Auto-unmute after the first user gesture (required by browsers)
    const tryEnableSound = () => {
      // start with a very low volume and ramp up
      video.muted = false;
      video.volume = 0.0;
      const fadeTo = 0.5;   // target volume (0.0 - 1.0)
      const steps = 10;     // fade steps
      const ms = 600;       // fade duration

      const ok = video.play();
      if (ok && ok.catch) ok.catch(() => {}); // ignore if already playing

      let i = 0;
      const tick = setInterval(() => {
        i++;
        video.volume = Math.min(fadeTo, (fadeTo / steps) * i);
        if (i >= steps) clearInterval(tick);
      }, ms / steps);

      // remove listeners so it only runs once
      window.removeEventListener('click', tryEnableSound);
      window.removeEventListener('touchstart', tryEnableSound, {passive:true});
      window.removeEventListener('scroll', tryEnableSound);
      window.removeEventListener('keydown', tryEnableSound);
    };

    // Listen for any reasonable gesture
    window.addEventListener('click', tryEnableSound);
    window.addEventListener('touchstart', tryEnableSound, {passive:true});
    window.addEventListener('scroll', tryEnableSound);
    window.addEventListener('keydown', tryEnableSound);

    // Helpful: warn if the video has no audio track
    video.addEventListener('loadedmetadata', () => {
      const hasAudio =
        (typeof video.mozHasAudio !== 'undefined' && video.mozHasAudio) ||
        (typeof video.webkitAudioDecodedByteCount !== 'undefined' && video.webkitAudioDecodedByteCount > 0) ||
        (video.audioTracks && video.audioTracks.length > 0);
      if (!hasAudio) {
        console.warn('This MP4 may not contain an audio track. If you still hear nothing after a click/scroll, re-export with audio.');
      }
    });
  })();




