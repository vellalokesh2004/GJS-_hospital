/* ==========================================================================
   GJS MULTI SPECIALTY HOSPITAL - JAVASCRIPT
   Responsive interactions, gallery lightbox, FAQ accordions & enquiry handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- INIT AOS ANIMATIONS ----
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      offset: 50
    });
  }

  // ---- INIT LUCIDE ICONS ----
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ---- PRELOADER ----
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 600);
    });
    // Fallback if load already fired
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
      }
    }, 1500);
  }

  // ---- STICKY NAVBAR SCROLL BEHAVIOR ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ---- MOBILE MENU ----
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      if (menuOpen && menuClose) {
        menuOpen.classList.toggle('hidden', !isExpanded);
        menuClose.classList.toggle('hidden', isExpanded);
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        if (menuOpen && menuClose) {
          menuOpen.classList.remove('hidden');
          menuClose.classList.add('hidden');
        }
      });
    });
  }

  // ---- SCROLL TO TOP ----
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---- FAQ ACCORDION ----
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer && answer.classList.contains('open');

      // Close all other answers in the container
      document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question.active').forEach(q => {
        q.classList.remove('active');
        q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen && answer) {
        answer.classList.add('open');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- COUNTER ANIMATION ----
  const counterElements = document.querySelectorAll('[data-count]');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const duration = 1600;
          const startTime = performance.now();

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target + suffix;
            }
          };

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ---- GALLERY FILTER & LIGHTBOX ----
  initGalleryAndLightbox();

  // ---- SPECIALITIES SEARCH & FILTER ----
  initSpecialityFilter();

  // ---- APPOINTMENT & CONTACT FORMS ----
  initEnquiryForms();
});

// ---- GALLERY & LIGHTBOX IMPLEMENTATION ----
function initGalleryAndLightbox() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');

  if (!galleryItems.length) return;

  // Filter click handling
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox functionality
  if (!lightboxModal) return;

  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let visibleItems = [];
  let currentIndex = -1;

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  function openLightbox(index) {
    updateVisibleItems();
    if (index < 0 || index >= visibleItems.length) return;
    currentIndex = index;

    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.dataset.title || (img ? img.alt : '');
    const category = item.dataset.categoryLabel || item.dataset.category || 'Hospital Facility';

    if (lightboxImg && img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxCategory) lightboxCategory.textContent = category;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    updateVisibleItems();
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    updateVisibleItems();
    if (visibleItems.length === 0) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const index = visibleItems.indexOf(item);
      if (index !== -1) openLightbox(index);
    });
    // Keyboard accessibility: Enter or Space opens lightbox
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateVisibleItems();
        const index = visibleItems.indexOf(item);
        if (index !== -1) openLightbox(index);
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  // Global Keyboard Navigation for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

// ---- SPECIALITIES SEARCH / FILTER ----
function initSpecialityFilter() {
  const searchInput = document.getElementById('speciality-search');
  const specialityCards = document.querySelectorAll('.speciality-card');
  const noResultsMsg = document.getElementById('speciality-no-results');

  if (!searchInput || !specialityCards.length) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    specialityCards.forEach(card => {
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const desc = card.dataset.desc ? card.dataset.desc.toLowerCase() : '';
      if (name.includes(term) || desc.includes(term)) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  });
}

// ---- ENQUIRY FORMS WITH CLIENT VALIDATION & CLEAR NOTICE ----
function initEnquiryForms() {
  const forms = document.querySelectorAll('.hospital-enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = form.querySelector('[name="patient_name"]');
      const phoneInput = form.querySelector('[name="phone_number"]');
      const emailInput = form.querySelector('[name="email_address"]');
      const deptInput = form.querySelector('[name="department"]');
      const dateInput = form.querySelector('[name="appointment_date"]');
      const messageInput = form.querySelector('[name="message"]');

      // Clear previous error states
      form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      form.querySelectorAll('.error-message').forEach(el => el.classList.remove('visible'));

      // Validate Name
      if (nameInput && nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Please provide a valid patient name (at least 2 letters).');
        isValid = false;
      }

      // Validate Phone (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = phoneInput ? phoneInput.value.replace(/[\s\-()]/g, '') : '';
      if (phoneInput && !phoneRegex.test(cleanedPhone)) {
        showFieldError(phoneInput, 'Please enter a valid 10-digit Indian mobile number.');
        isValid = false;
      }

      // Validate Email (optional, but if filled must be valid)
      if (emailInput && emailInput.value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showFieldError(emailInput, 'Please provide a valid email address.');
          isValid = false;
        }
      }

      if (!isValid) return;

      // Handle submission state honestly:
      // Clearly inform the user that this is a client demonstration and guide them to call or email directly.
      const statusBox = form.querySelector('.form-status-box') || document.getElementById('form-status-box');
      const patientName = nameInput ? nameInput.value.trim() : 'Patient';
      const deptName = deptInput ? deptInput.value : 'General Medicine';

      if (statusBox) {
        statusBox.innerHTML = `
          <div class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-slate-800 text-sm">
            <div class="flex items-start gap-3">
              <span class="text-blue-600 font-bold text-lg leading-none mt-0.5">ℹ</span>
              <div>
                <p class="font-bold text-blue-900 mb-1">Enquiry Form Recorded Locally</p>
                <p class="mb-2">Thank you, <strong>${patientName}</strong>. Your enquiry details for <strong>${deptName}</strong> have been validated on the client side.</p>
                <div class="bg-white p-3 rounded-lg border border-blue-100 text-xs text-slate-700">
                  <p class="font-semibold text-slate-900 mb-1">To ensure immediate appointment confirmation:</p>
                  <p class="mb-1">📞 <strong>Direct Call:</strong> <a href="tel:7981225781" class="text-blue-600 underline font-semibold">7981225781</a> (24/7 Desk)</p>
                  <p>✉ <strong>Email:</strong> <a href="mailto:gjshospitalvizag@gmail.com" class="text-blue-600 underline">gjshospitalvizag@gmail.com</a></p>
                </div>
                <p class="text-xs text-slate-500 mt-2"><em>Notice: This website is running without an active backend mailer server. Direct calls provide instantaneous assistance for consultations and emergency care.</em></p>
              </div>
            </div>
          </div>
        `;
        statusBox.style.display = 'block';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}

function showFieldError(inputEl, message) {
  inputEl.classList.add('input-error');
  const errorEl = inputEl.parentElement.querySelector('.error-message');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}
