/* aigrowthly — shared site behaviour */
(function () {
  'use strict';

  /* mobile nav toggle */
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;
    toggle.addEventListener('click', function () {
      header.classList.toggle('nav-open');
      var open = header.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    header.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { header.classList.remove('nav-open'); });
    });
  }

  /* scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* count-up for [data-count] */
  function initCounters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    var fmt = function (el, v) {
      var end = parseFloat(el.getAttribute('data-count'));
      var dec = (el.getAttribute('data-count').split('.')[1] || '').length;
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      return pre + v.toFixed(dec) + suf;
    };
    // Pre-fill final value so the span has size (and works without animation/JS-failure).
    nums.forEach(function (el) { el.textContent = fmt(el, parseFloat(el.getAttribute('data-count'))); });
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var end = parseFloat(el.getAttribute('data-count'));
        var dur = 1300, t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(el, end * e);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = fmt(el, end);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* copy-to-clipboard for [data-copy] */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-copy');
        var done = function () {
          btn.classList.add('copied');
          var lbl = btn.querySelector('[data-copy-label]');
          if (lbl) { var old = lbl.textContent; lbl.textContent = 'Copied!'; setTimeout(function () { lbl.textContent = old; btn.classList.remove('copied'); }, 1600); }
        };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
        else done();
      });
    });
  }

  /* contact form -> mailto */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var g = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var subject = 'New website request — ' + (g('business') || 'Small business');
      var lines = [
        'Business name: ' + g('business'),
        'What you do: ' + g('about'),
        'Pages you want: ' + g('pages'),
        'Sites you like: ' + g('likes'),
        'Best email/phone: ' + g('contact'),
        '',
        'Notes:',
        g('notes')
      ];
      var href = 'mailto:aigrowthly@outlook.com?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var ok = document.getElementById('form-sent');
      if (ok) ok.hidden = false;
      window.location.href = href;
    });
  }

  /* simple FAQ accordion */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        if (!q.closest('[data-faq-multi]')) {
          (item.closest('.faq-list') || document).querySelectorAll('.faq-item.open').forEach(function (o) {
            if (o !== item) { o.classList.remove('open'); var b = o.querySelector('.faq-q'); if (b) b.setAttribute('aria-expanded', 'false'); }
          });
        }
        item.classList.toggle('open', !open);
        q.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
    initNav(); initReveal(); initCounters(); initCopy(); initContactForm(); initFaq();
  });
})();
