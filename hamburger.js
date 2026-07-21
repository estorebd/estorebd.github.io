const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Overlay setup
const overlay = document.getElementById('nav-overlay') || (() => {
  const el = document.createElement('div');
  el.id = 'nav-overlay';
  document.body.appendChild(el);
  return el;
})();

// ── State ──────────────────────────────────────────────
let isOpen = false;
let isSwiping = false;

// ── Core open/close ────────────────────────────────────
function openMenu(pushState = true) {
  if (isOpen) return;
  isOpen = true;
  
  navMenu.classList.add('active');
  hamburger.classList.add('active');
  overlay.classList.add('active');
  overlay.style.display = 'block';
  overlay.style.opacity = '0.6';
  navMenu.style.transform = 'translateX(0)';
  document.body.style.overflow = 'hidden';
  
  if (pushState) history.pushState({ popup: 'nav-menu' }, '', location.href);
}
function closeMenu(fromHistory = false) {
  if (!isOpen) return;
  isOpen = false;
  
  navMenu.classList.remove('active');
  hamburger.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  navMenu.style.transform = '';

  navMenu.addEventListener('transitionend', () => {
    if (!isOpen) overlay.style.display = 'none';
  }, { once: true });
  
  if (!fromHistory && history.state?.popup === 'nav-menu') {
    history.back();
  }
}

// ── Hamburger button ───────────────────────────────────
hamburger.addEventListener('click', () => isOpen ? closeMenu() : openMenu());

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    isOpen ? closeMenu() : openMenu();
  }
});

// ── Overlay click ──────────────────────────────────────
overlay.addEventListener('click', () => closeMenu());

// ── Back button (Android) ──────────────────────────────
window.addEventListener('popstate', (e) => {
  if (e.state?.popup === 'nav-menu') {
    openMenu(false);
  } else {
    closeMenu(true);
  }
});

// ── ESC key ────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) closeMenu();
});

const SWIPE_THRESHOLD = 60;
const SWIPE_VELOCITY = 0.3;

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let dragging = false;
let swipeType = null;
let menuWidth = 0;

function getMenuWidth() {
  return navMenu.getBoundingClientRect().width || 280;
}

document.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchStartTime = Date.now();
  dragging = false;
  swipeType = null;
  menuWidth = getMenuWidth();
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  
  if (!dragging) {
    if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    dragging = true;
  }
  
  if (!isOpen && dx < -10) {
    swipeType = 'open';
    const offset = Math.min(-dx, menuWidth);
    navMenu.style.transition = 'none';
    navMenu.style.transform = `translateX(${Math.max(menuWidth - offset, 0)}px)`;
    overlay.style.display = 'block';
    overlay.style.opacity = String((offset / menuWidth) * 0.6);
    e.preventDefault();
    return;
  }
  
  if (isOpen && dx > 10) {
    swipeType = 'close';
    const offset = Math.min(dx, menuWidth);
    navMenu.style.transition = 'none';
    navMenu.style.transform = `translateX(${offset}px)`;
    overlay.style.opacity = String(Math.max(0.6 - (offset / menuWidth) * 0.6, 0));
    e.preventDefault();
    return;
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  if (!dragging || !swipeType) return;
  
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dt = Math.max(Date.now() - touchStartTime, 1);
  const velocity = Math.abs(dx) / dt;
  
  navMenu.style.transition = '';
  
  const farEnough = Math.abs(dx) > SWIPE_THRESHOLD;
  const fastEnough = velocity > SWIPE_VELOCITY;
  
  if (swipeType === 'open') {
    if (dx < 0 && (farEnough || fastEnough)) {
      navMenu.style.transform = '';
      openMenu();
    } else {
      navMenu.style.transform = 'translateX(100%)';
      overlay.style.opacity = '0';
      overlay.style.display = 'none';
    }
  }
  
  if (swipeType === 'close') {
  if (dx > 0 && (farEnough || fastEnough)) {
    navMenu.style.transform = '';
    closeMenu();
    } else {
      navMenu.style.transform = 'translateX(0)';
      overlay.style.opacity = '0.6';
    }
  }
  
  dragging = false;
  swipeType = null;
}, { passive: true });


const sBar = document.querySelector('.s_bar input');
const sBtn = document.querySelector('.s_bar button');

function runSearch() {
  if (!sBar.value) return;
  const sVal = sBar.value;
  const arr = sVal.trim().split(/\s+/);

  sessionStorage.setItem("searchValueA", JSON.stringify(arr));
  sBar.value = '';
  window.location.href = '/SEARCH';
}

function getSearchId() {
  const url = new URL(window.location.href);
  const path = url.pathname.replace(/\/$/, '');

  if (path.endsWith('/SEARCH')) {
    let id = url.searchParams.get('id');

    if (id && /^\d{4}$/.test(id)) {
      id = "#" + id;
      return id;
    }
  }
  return null;
}

sBtn.addEventListener('click', runSearch);

sBar.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    runSearch();
  }
});

// ── এখানেই মূল ফিক্স: savedValue কে sessionStorage থেকে read করা ──
const rawSaved = JSON.parse(sessionStorage.getItem("searchValueA") || "null");
const savedValue = Array.isArray(rawSaved) ? rawSaved.join(' ') : (rawSaved || null);

if (window.location.pathname.startsWith('/SEARCH')) {
  if (savedValue) {
    sBar.value = savedValue;
    sessionStorage.setItem('searchValueA', '');
  }
}

const contactNumber = '+880 1872-605055';
const contactMaill = 'officialelectronicsstore@gmail.com';
const contact = [
  "Narayanganj, Dhaka, Bangladesh",
  contactNumber,
  contactMaill
];
const links = [
  "https://www.facebook.com/officialelectronicsstore",
  "https://www.instagram.com/officialelectronicsstore",
  "https://youtube.com/@officialelectronicsstore",
  "https://wa.me/8801872605055",
  "/",
  "/404",
  "/404",
  "https://www.google.com/maps?q=23.6818337,90.4797731",
  "tel:" + contactNumber,
  "mailto:" + contactMaill
];
document.querySelectorAll('.addI').forEach((e, n) => {
  e.innerHTML = contact[n];
});
document.querySelectorAll('.link').forEach((e, n) => {
  e.href = links[n];
});

// ── id প্যারামিটার থেকে সিঙ্গেল প্রোডাক্ট সার্চ (?id=3833) ──
const val = getSearchId();

if (val && !savedValue) {
  sBar.value = val;
  sessionStorage.setItem("searchValueA", JSON.stringify([val]));
}
