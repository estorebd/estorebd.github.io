const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const savedValue = sessionStorage.getItem('searchValueN');

const overlay = document.createElement('div');
overlay.id = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  if (navMenu.classList.contains('active')) return;
  
  hamburger.classList.add('active');
  navMenu.classList.add('active');
  overlay.classList.add('active');
  
  history.pushState({ popup: 'nav-menu' }, '', location.href);
}

function closeMenu(fromHistory = false) {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  overlay.classList.remove('active');
  
  if (!fromHistory && history.state?.popup === 'nav-menu') {
    history.back();
  }
}

hamburger.addEventListener('click', () => {
  if (navMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});

hamburger.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (navMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  }
});

overlay.addEventListener('click', () => {
  closeMenu()
});

window.addEventListener('popstate', (e) => {
  const p = e.state?.popup || null;
  
  if (p === 'nav-menu') {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
  } else {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
  }
});


const sBar = document.querySelector('.s_bar input');
const sBtn = document.querySelector('.s_bar button');

function runSearch() {
  if (!sBar.value) return;
  const sVal = sBar.value;
  const arr = sVal.trim().split(/\s+/);
  
  sessionStorage.setItem("searchValueA", JSON.stringify(arr));
  sessionStorage.setItem('searchValueN', sVal);
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

if (window.location.pathname.startsWith('/SEARCH')) {
  if (savedValue) {
    sBar.value = savedValue;
    sessionStorage.setItem('searchValueN', '');
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

const val = getSearchId();

if (val && !savedValue) {
  sBar.value = '';
  sessionStorage.setItem("searchValueA", JSON.stringify(val));
}
