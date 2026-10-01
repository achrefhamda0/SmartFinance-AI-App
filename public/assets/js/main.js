/**
 * SmartFinance AI — interactions de la page publique.
 *
 * Chaque comportement est opt-in via un attribut data-*, ce qui garde le
 * gabarit lisible et permet de servir les mêmes partials sur d'autres pages.
 */

const onReady = (fn) =>
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/* Navigation : ombre au défilement + menu mobile                      */
/* ------------------------------------------------------------------ */

function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    let ticking = false;
    const sync = () => {
      nav.dataset.state = window.scrollY > 16 ? 'scrolled' : 'top';
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(sync);
      },
      { passive: true }
    );
    sync();
  }

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;

  const icons = toggle.querySelectorAll('[data-menu-icon] span');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    menu.classList.toggle('hidden', !open);
    icons.forEach((icon) => {
      const isClose = icon.dataset.iconClose !== undefined;
      icon.classList.toggle('hidden', isClose ? !open : open);
    });
  };

  setOpen(false);
  toggle.addEventListener('click', () =>
    setOpen(toggle.getAttribute('aria-expanded') !== 'true')
  );

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) setOpen(false);
  });
}

/* ------------------------------------------------------------------ */
/* Révélations au défilement                                          */
/* ------------------------------------------------------------------ */

function initReveals() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const hero = [...document.querySelectorAll('[data-hero]')];

  if (!items.length && !hero.length) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    [...items, ...hero].forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  [...items, ...hero].forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------ */
/* Halo suivant le pointeur sur les cartes                             */
/* ------------------------------------------------------------------ */

function initPointerGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.feature-card, .concept-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Parallaxe légère des cartes flottantes                             */
/* ------------------------------------------------------------------ */

function initFloat() {
  const cards = [...document.querySelectorAll('[data-float]')];
  if (!cards.length || prefersReducedMotion()) return;

  let ticking = false;
  const update = () => {
    const offset = window.scrollY;
    cards.forEach((card) => {
      const range = Number(card.dataset.floatRange ?? 12);
      card.style.transform = `translate3d(0, ${(offset * range) / 100}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
}

/* ------------------------------------------------------------------ */
/* Progression de la ligne d'étapes                                   */
/* ------------------------------------------------------------------ */

function initStepsProgress() {
  const progress = document.querySelector('[data-steps-progress]');
  if (!progress) return;

  if (prefersReducedMotion()) {
    progress.style.transform = 'scaleX(1)';
    return;
  }

  let ticking = false;
  const update = () => {
    const rect = progress.parentElement.getBoundingClientRect();
    const anchor = window.innerHeight * 0.7;
    const ratio = (anchor - rect.top) / rect.height;
    progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true }
  );
  update();
}

/* ------------------------------------------------------------------ */
/* Accordéon FAQ                                                       */
/* ------------------------------------------------------------------ */

function initAccordions() {
  document.querySelectorAll('[data-accordion]').forEach((item) => {
    const trigger = item.querySelector('.faq-item__trigger');
    const panel = item.querySelector('.faq-item__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') === 'true';

      document
        .querySelectorAll('[data-accordion] .faq-item__trigger[aria-expanded="true"]')
        .forEach((other) => {
          if (other === trigger) return;
          other.setAttribute('aria-expanded', 'false');
          other.parentElement?.parentElement
            ?.querySelector('.faq-item__panel')
            ?.classList.remove('is-open');
        });

      trigger.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Bascule de périodicité des tarifs                                   */
/* ------------------------------------------------------------------ */

function initBillingToggle() {
  const toggle = document.querySelector('.billing-toggle');
  if (!toggle) return;

  const notes = {
    monthly: 'Facturation mensuelle · sans engagement',
    yearly: 'Facturation annuelle · deux mois offerts'
  };

  toggle.addEventListener('click', (event) => {
    const button = event.target.closest('[data-billing]');
    if (!button) return;

    const period = button.dataset.billing;
    toggle.dataset.active = period;
    toggle.querySelectorAll('[data-billing]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    document.querySelectorAll('[data-price]').forEach((price) => {
      const next = price.dataset[period];
      if (!next || price.textContent.trim() === next) return;
      price.classList.add('is-swapping');
      setTimeout(() => {
        price.textContent = next;
        price.classList.remove('is-swapping');
      }, 160);
    });

    document.querySelectorAll('[data-price-note]').forEach((note) => {
      note.textContent = notes[period];
    });
  });
}

/* ------------------------------------------------------------------ */
/* Bascule de langue (feedback visuel, sans rechargement)              */
/* ------------------------------------------------------------------ */

function initLocaleSwitcher() {
  const switcher = document.querySelector('.locale-switcher');
  if (!switcher) return;

  switcher.addEventListener('click', (event) => {
    const item = event.target.closest('.locale-switcher__item');
    if (!item) return;
    switcher
      .querySelectorAll('.locale-switcher__item')
      .forEach((other) => {
        const active = other === item;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
    document.documentElement.lang = item.textContent.trim().toLowerCase() === 'ar' ? 'ar' : item.textContent.trim().toLowerCase();
  });
}

/* ------------------------------------------------------------------ */
/* Formulaires : mot de passe, jauge de robustesse, rôle               */
/* ------------------------------------------------------------------ */

function initPasswordFields() {
  document.querySelectorAll('[data-password]').forEach((input) => {
    const toggle = document.querySelector(`[data-password-toggle="${input.dataset.password}"]`);
    if (!toggle) return;

    const swap = (visible) => {
      input.type = visible ? 'text' : 'password';
      toggle.setAttribute('aria-pressed', String(visible));
      const off = toggle.querySelector('[data-icon-off]');
      const on = toggle.querySelector('[data-icon-on]');
      off?.classList.toggle('hidden', visible);
      on?.classList.toggle('hidden', !visible);
    };

    toggle.addEventListener('click', () => swap(input.type === 'password'));
  });
}

function initStrengthMeter() {
  const input = document.querySelector('[data-strength-source]');
  const meter = document.querySelector('[data-strength]');
  const label = document.querySelector('[data-strength-label]');
  if (!input || !meter) return;

  const levels = ['Trop court', 'Faible', 'Correct', 'Solide'];

  const score = (value) => {
    if (!value) return 0;
    let points = Math.min(value.length >= 12 ? 1 : 0, 1);
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points += 1;
    if (/\d/.test(value)) points += 1;
    if (/[^\w\s]/.test(value)) points += 1;
    return Math.min(points, 4);
  };

  input.addEventListener('input', () => {
    const level = score(input.value);
    meter.dataset.level = String(level);
    if (label) label.textContent = input.value ? levels[level - 1] ?? levels[0] : '';
  });
}

function initRoleOptions() {
  const group = document.querySelector('[data-role-group]');
  if (!group) return;

  group.addEventListener('change', (event) => {
    if (!event.target.matches('input[type="radio"]')) return;
    group.dataset.selected = event.target.value;
  });
}

/* ------------------------------------------------------------------ */
/* Soumission : état de chargement du bouton                           */
/* ------------------------------------------------------------------ */

function initSubmitState() {
  document.querySelectorAll('form[data-loading-button]').forEach((form) => {
    form.addEventListener('submit', () => {
      const submit = form.querySelector('[type="submit"]');
      if (!submit || submit.disabled) return;
      submit.disabled = true;
      const label = submit.querySelector('[data-submit-label]');
      if (label) {
        submit.dataset.label = label.textContent;
        label.textContent = submit.dataset.busyLabel || 'En cours…';
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/* Validation légère côté client                                       */
/* ------------------------------------------------------------------ */

function initFieldValidation() {
  document.querySelectorAll('form[data-validate]').forEach((form) => {
    const fields = [...form.querySelectorAll('.field')];

    const validate = (field) => {
      const control = field.querySelector('[data-validate-control]');
      const message = field.querySelector('[data-validate-message]');
      if (!control) return true;

      const value = control.value.trim();
      let error = '';

      if (control.required && !value) {
        error = control.dataset.errorRequired || 'Ce champ est obligatoire.';
      } else if (control.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        error = 'Adresse e-mail invalide.';
      } else if (control.dataset.match && value !== form.querySelector(control.dataset.match)?.value) {
        error = control.dataset.errorMatch || 'Les valeurs ne correspondent pas.';
      } else if (control.minLength > 0 && value && value.length < control.minLength) {
        error = `${control.minLength} caractères minimum.`;
      }

      field.classList.toggle('is-invalid', Boolean(error));
      control.setAttribute('aria-invalid', String(Boolean(error)));
      if (message) message.textContent = error;

      return !error;
    };

    fields.forEach((field) => {
      const control = field.querySelector('[data-validate-control]');
      if (!control) return;
      control.addEventListener('blur', () => validate(field));
      control.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) validate(field);
      });
    });

    form.addEventListener('submit', (event) => {
      const invalid = fields.filter((field) => !validate(field));
      if (invalid.length === 0) return;
      event.preventDefault();
      invalid[0].querySelector('[data-validate-control]')?.focus();
    });
  });
}

onReady(() => {
  initNav();
  initReveals();
  initPointerGlow();
  initFloat();
  initStepsProgress();
  initAccordions();
  initBillingToggle();
  initLocaleSwitcher();
  initPasswordFields();
  initStrengthMeter();
  initRoleOptions();
  initSubmitState();
  initFieldValidation();
});