

document.addEventListener('DOMContentLoaded', () => {

  
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
    });
  }

  
  const loader = document.getElementById('loader');
  const MIN_LOADER_TIME = 900;
  const loadStart = Date.now();

  const hideLoader = () => {
    const elapsed = Date.now() - loadStart;
    const remaining = Math.max(MIN_LOADER_TIME - elapsed, 0);
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, remaining);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  
  const root = document.documentElement;
  const darkToggle = document.getElementById('darkToggle');
  const darkToggleIcon = document.getElementById('darkToggleIcon');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.classList.add('light');
      if (darkToggleIcon) {
        darkToggleIcon.classList.remove('fa-moon');
        darkToggleIcon.classList.add('fa-sun');
      }
    } else {
      root.classList.remove('light');
      if (darkToggleIcon) {
        darkToggleIcon.classList.remove('fa-sun');
        darkToggleIcon.classList.add('fa-moon');
      }
    }
  };

  
  let currentTheme = 'dark';
  applyTheme(currentTheme);

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  
  const menuToggle = document.getElementById('menuToggle');
  const menuIcon = document.getElementById('menuIcon');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      if (menuIcon) {
        menuIcon.classList.toggle('fa-bars', !isOpen);
        menuIcon.classList.toggle('fa-xmark', isOpen);
      }
    });

   
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (menuIcon) {
          menuIcon.classList.add('fa-bars');
          menuIcon.classList.remove('fa-xmark');
        }
      });
    });
  }

  
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

   
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 12);

    
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }

    
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', scrollY > 480);
  };

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  
  const sections = Array.from(document.querySelectorAll('main section[id], section[id]'))
    .filter((s) => s.id);
  const navLinkEls = document.querySelectorAll('.nav-link[data-nav]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach((link) => {
          const match = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active-link', match);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => spyObserver.observe(section));

  
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  
  const counters = document.querySelectorAll('[data-count]');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
     
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => counterObserver.observe(counter));

  
  const timelineSection = document.getElementById('timeline');
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineFill = document.getElementById('timelineFill');

  if (timelineSection) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          timelineSteps.forEach((step, i) => {
            setTimeout(() => step.classList.add('lit'), i * 180);
          });
          if (timelineFill) {
            timelineFill.style.transition = 'stroke-dashoffset 1.6s ease';
            timelineFill.style.strokeDashoffset = '0';
          }
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    timelineObserver.observe(timelineSection);
  }

  
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      
      faqItems.forEach((other) => {
        other.classList.remove('open');
        const otherQuestion = other.querySelector('.faq-question');
        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const setFieldValidity = (fieldEl, valid) => {
    const wrapper = fieldEl.closest('.form-field');
    if (!wrapper) return;
    wrapper.classList.toggle('invalid', !valid);
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      let valid = true;

      if (!fullName.value.trim()) {
        setFieldValidity(fullName, false);
        valid = false;
      } else {
        setFieldValidity(fullName, true);
      }

    