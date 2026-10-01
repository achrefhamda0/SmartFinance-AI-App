import { Router } from 'express';
import {
  showSignUp,
  register,
  showSignIn,
  login,
  renderDashboard,
  destroySession
} from '../controllers/auth.controller.js';

const router = Router();

router.get('/inscription', showSignUp);
router.post('/inscription', register);

router.get('/connexion', showSignIn);
router.post('/connexion', login);

router.get('/tableau-de-bord', (req, res, next) => {
  if (!req.session) {
    return res.redirect(`/connexion?suite=${encodeURIComponent(req.originalUrl)}`);
  }
  return renderDashboard(req, res, next);
});

router.post('/deconnexion', (req, res) => {
  destroySession(req, res);
  res.redirect('/');
});

export default router;