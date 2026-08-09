

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

  