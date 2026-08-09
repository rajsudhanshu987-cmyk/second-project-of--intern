

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

  