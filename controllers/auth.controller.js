import crypto from 'node:crypto';
import { promisify } from 'node:util';
import {
  findUserByEmail,
  createUser,
  verifyPassword,
  publicUser
} from '../models/user.model.js';
import { icons } from '../src/icons.js';

const scrypt = promisify(crypto.scrypt);

const SESSION_COOKIE = 'sf_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const ROLES = ['company', 'cabinet', 'finance'];

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const emailOf = (value) => String(value ?? '').trim().toLowerCase();

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(16);
  const derived = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
};

/* ---------------- Validation ---------------- */

const validateSignUp = (values) => {
  const errors = {};

  if (values.firstName.length < 2) errors.firstName = 'Indiquez votre prénom.';
  if (values.lastName.length < 2) errors.lastName = 'Indiquez votre nom.';
  if (values.company.length < 2) errors.company = 'Indiquez votre société ou votre cabinet.';

  if (!values.email) errors.email = 'Renseignez votre adresse e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) errors.email = 'Adresse e-mail invalide.';

  if (!ROLES.includes(values.role)) errors.role = 'Sélectionnez le profil de votre organisation.';

  if (!values.password) errors.password = 'Choisissez un mot de passe.';
  else if (values.password.length < 10) errors.password = '10 caractères minimum.';
  else if (!/[0-9]/.test(values.password) || !/[a-zA-Z]/.test(values.password))
    errors.password = 'Le mot de passe doit contenir des lettres et des chiffres.';

  if (values.password !== values.confirm) errors.confirm = 'Les mots de passe ne correspondent pas.';
  if (!values.terms) errors.terms = "Vous devez accepter les conditions d'utilisation.";

  return errors;
};

const validateSignIn = ({ email, password }) => {
  const errors = {};
  if (!email) errors.email = 'Renseignez votre adresse e-mail.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Adresse e-mail invalide.';
  if (!password) errors.password = 'Saisissez votre mot de passe.';
  return errors;
};

const hasErrors = (errors) => Object.keys(errors).length > 0;

/* ---------------- Session ---------------- */

/** Lit l’en-tête Cookie à la main : évite d’ajouter cookie-parser au projet. */
const parseCookies = (header = '') =>
  Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf('=');
        if (separator === -1) return [part, ''];
        const name = part.slice(0, separator).trim();
        const value = part.slice(separator + 1).trim();
        try {
          return [name, decodeURIComponent(value)];
        } catch {
          return [name, value];
        }
      })
  );

const signSession = (user) => {
  const payload = Buffer.from(
    JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + SESSION_TTL_MS })
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.SESSION_SECRET || 'smartfinance-dev-secret-change-me')
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
};

export const sessionSecret = () => process.env.SESSION_SECRET || 'smartfinance-dev-secret-change-me';

export const readSession = (req) => {
  const raw = parseCookies(req.headers?.cookie)[SESSION_COOKIE];
  if (!raw) return null;

  const [payload, signature] = raw.split('.');
  if (!payload || !signature) return null;

  const expected = crypto
    .createHmac('sha256', sessionSecret())
    .update(payload)
    .digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
};

const startSession = (res, user) => {
  res.cookie(SESSION_COOKIE, signSession(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS,
    path: '/'
  });
};

export const destroySession = (req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/' });
};

/* ---------------- Contenu des panneaux latéraux ---------------- */

const SIGNUP_ASIDE = {
  eyebrow: 'Essai gratuit de 14 jours',
  quote: 'Importez un FEC et obtenez un état financier consolidé, analysé et projeté dès aujourd’hui.',
  initials: 'NB',
  author: 'Nadia Benali',
  authorRole: 'Directrice financière · Groupe Helios',
  stats: [
    { value: '-64 %', label: 'Temps de clôture' },
    { value: '48 h', label: 'Premier rapport complet' },
    { value: '0', label: 'Ressaisie manuelle' }
  ],
  checks: [
    'Sans carte bancaire, résiliable à tout moment',
    'Données hébergées dans l’Union européenne',
    'Un conseiller vous répond sous 4 h'
  ]
};

const SIGNIN_ASIDE = {
  eyebrow: 'Bon retour parmi nous',
  quote: 'Vos exercices, vos rapports et vos prévisions vous attendent, avec les alertes de la nuit.',
  initials: 'TL',
  author: 'Thomas Leclerc',
  authorRole: 'Associé-expert-comptable · Cabinet LVF',
  stats: [
    { value: '1,2 M', label: 'Écritures analysées' },
    { value: '37', label: 'Anomalies signalées' },
    { value: '24 mois', label: 'Horizon de prévision' }
  ],
  checks: [
    'Import FEC et balances en quelques minutes',
    'Pistes d’audit et versions historisées',
    'Support en français, du lundi au samedi'
  ]
};

/* ---------------- Contrôleurs ---------------- */

const signupView = (res, { status = 200, values = {}, errors = {}, plan = '' } = {}) =>
  res.status(status).render('auth/signup', {
    title: 'Créer un compte',
    description: 'Créez votre compte SmartFinance AI et lancez votre essai gratuit de 14 jours.',
    aside: SIGNUP_ASIDE,
    plan,
    values,
    errors,
    roleChecked: {
      company: values.role === 'company',
      cabinet: values.role === 'cabinet',
      finance: values.role === 'finance'
    },
    icons
  });

export const showSignUp = (req, res) => signupView(res, { plan: req.query.plan ?? '' });

export const register = asyncHandler(async (req, res) => {
  const values = {
    firstName: String(req.body.firstName ?? '').trim(),
    lastName: String(req.body.lastName ?? '').trim(),
    company: String(req.body.company ?? '').trim(),
    email: emailOf(req.body.email),
    role: String(req.body.role ?? ''),
    terms: req.body.terms === 'on' || req.body.terms === 'true'
  };
  const password = String(req.body.password ?? '');

  const errors = validateSignUp({
    ...values,
    password,
    confirm: String(req.body.confirm ?? '')
  });

  if (hasErrors(errors)) {
    return signupView(res, { status: 422, values, errors, plan: String(req.body.plan ?? '') });
  }

  try {
    const user = await createUser({ ...values, password: await hashPassword(password) });
    startSession(res, user);
    return res.redirect('/tableau-de-bord');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return signupView(res, {
        status: 409,
        values,
        plan: String(req.body.plan ?? ''),
        errors: { email: 'Un compte existe déjà avec cette adresse e-mail.' }
      });
    }
    throw error;
  }
});

const signinView = (res, { status = 200, values = {}, errors = {}, notice = '' } = {}) =>
  res.status(status).render('auth/signin', {
    title: 'Connexion',
    description: 'Accédez à votre espace SmartFinance AI.',
    aside: SIGNIN_ASIDE,
    values,
    errors,
    notice,
    icons
  });

export const showSignIn = (req, res) =>
  signinView(res, {
    notice:
      req.query.inscription === 'ok'
        ? 'Compte créé. Connectez-vous pour démarrer votre essai.'
        : ''
  });

export const login = asyncHandler(async (req, res) => {
  const values = { email: emailOf(req.body.email) };
  const password = String(req.body.password ?? '');
  const errors = validateSignIn({ email: values.email, password });

  if (hasErrors(errors)) return signinView(res, { status: 422, values, errors });

  const user = await findUserByEmail(values.email);
  const valid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!valid) {
    return signinView(res, {
      status: 401,
      values,
      errors: { password: 'Adresse e-mail ou mot de passe incorrect.' }
    });
  }

  startSession(res, user);
  return res.redirect('/tableau-de-bord');
});

/* ---------------- Espace connecté ---------------- */

export const renderDashboard = asyncHandler(async (req, res) => {
  const user = await findUserByEmail(req.session.email);
  res.render('dashboard', {
    title: 'Tableau de bord',
    user: publicUser(user),
    icons
  });
});