document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.has-dropdown > .dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var parent = btn.parentElement;
      var isOpen = parent.classList.contains('open');
      document.querySelectorAll('.has-dropdown.open').forEach(function (el) { el.classList.remove('open'); });
      if (!isOpen) parent.classList.add('open');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (el) { el.classList.remove('open'); });
    }
  });
});

// ページ遷移アニメーション
document.documentElement.classList.add('page-loading');
window.addEventListener('DOMContentLoaded', function () {
  requestAnimationFrame(function () {
    document.documentElement.classList.remove('page-loading');
    document.documentElement.classList.add('page-loaded');
  });
});

document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href]');
  if (!link) return;
  var href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;
  e.preventDefault();
  document.documentElement.classList.add('page-leaving');
  setTimeout(function () {
    window.location.href = href;
  }, 220);
});

// ページトップへ戻るボタン
(function () {
  var btn = document.getElementById('page-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ローディング画面（4-1-4：ロゴアニメーション／4-1-7：同日2回目は非表示）
(function () {
  var splash = document.getElementById('splash');
  if (!splash) return;
  var today = new Date().toISOString().slice(0, 10);
  var last = localStorage.getItem('hrc_splash_date');
  if (last === today) {
    splash.style.display = 'none';
    return;
  }
  window.addEventListener('load', function () {
    setTimeout(function () {
      splash.classList.add('hide');
      localStorage.setItem('hrc_splash_date', today);
      setTimeout(function () { splash.style.display = 'none'; }, 700);
    }, 1500);
  });
})();

// ハンバーガーメニュー（モバイル専用）
(function () {
  var btn = document.getElementById('hamburger-btn');
  var nav = document.querySelector('nav');
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('mobile-open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  function openMenu() {
    nav.classList.add('mobile-open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  btn.addEventListener('click', function () {
    if (nav.classList.contains('mobile-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // 通常のリンク（ドロップダウン開閉ボタン以外）をクリックしたらメニューを閉じる
  nav.querySelectorAll('a').forEach(function (a) {
    if (a.classList.contains('dropdown-toggle')) return;
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMenu();
  });
})();

// 追従メニューの現在地ハイライト（5-1-26・PC版のみ）
(function () {
  if (window.innerWidth <= 760) return;

  var SECTION_TO_NAV = {
    news: 'doc', about: 'doc', activity: 'doc', gallery: 'doc',
    members: 'join', join: 'join',
    contact: 'contact'
  };

  var sections = [];
  Object.keys(SECTION_TO_NAV).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, target: SECTION_TO_NAV[id] });
  });
  if (sections.length === 0) return;

  var docToggle = document.querySelector('.has-dropdown:nth-of-type(1) > .dropdown-toggle');
  var joinToggle = document.querySelector('.has-dropdown:nth-of-type(2) > .dropdown-toggle');
  var contactLink = document.querySelector('nav > a[href="contact.html"]');
  var NAV_EL = { doc: docToggle, join: joinToggle, contact: contactLink };

  function clearHighlight() {
    Object.keys(NAV_EL).forEach(function (k) {
      if (NAV_EL[k]) NAV_EL[k].classList.remove('scroll-current');
    });
  }

  function onScroll() {
    var navH = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
    var scrollPos = window.scrollY + navH + 10;
    var current = null;
    sections.forEach(function (s) {
      if (s.el.offsetTop <= scrollPos) current = s.target;
    });
    clearHighlight();
    if (current && NAV_EL[current]) NAV_EL[current].classList.add('scroll-current');
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('load', onScroll);
})();
