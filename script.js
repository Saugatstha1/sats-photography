// ============================================================
// SAT'S PHOTOGRAPHY — script.js
// Shared across all pages; each block checks the DOM before running.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Portfolio filter (portfolio.html) ---------- */
  var filterButtons = document.querySelectorAll('.filter-row button');
  var shots = document.querySelectorAll('.journal-entry');
  if (filterButtons.length && shots.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var category = btn.dataset.filter;
        shots.forEach(function (shot) {
          var match = category === 'all' || shot.dataset.category === category;
          shot.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Booking form validation (contact.html) ---------- */
  var form = document.querySelector('form.booking');
  if (form) {
    var status = document.getElementById('form-status');

    function showError(field, message) {
      var errEl = document.getElementById(field.id + '-err');
      if (errEl) errEl.textContent = message;
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validateField(field) {
      if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && field.value) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value)) {
          showError(field, 'Enter a valid email address.');
          return false;
        }
      }
      if (field.type === 'tel' && field.value) {
        var digits = field.value.replace(/\D/g, '');
        if (digits.length < 7) {
          showError(field, 'Enter a valid phone number.');
          return false;
        }
      }
      if (field.id === 'date' && field.value) {
        var chosen = new Date(field.value);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen < today) {
          showError(field, 'Please choose a date in the future.');
          return false;
        }
      }
      if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        showError(field, 'Please confirm before submitting.');
        return false;
      }
      showError(field, '');
      return true;
    }

    var fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validateField(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var allValid = true;
      fields.forEach(function (f) {
        if (!validateField(f)) allValid = false;
      });

      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields and try again.';
        status.className = 'error';
        status.focus();
        return;
      }

      status.textContent = "Thanks — your enquiry has been noted. Sat will reply within 1–2 days to confirm your session.";
      status.className = 'success';
      status.setAttribute('tabindex', '-1');
      status.focus();
      form.reset();
    });
  }

});
