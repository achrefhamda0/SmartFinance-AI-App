import express from 'express';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

import homeRoutes from './routers/index.js';
import authRoutes from './routers/auth.routes.js';
import { readSession } from './controllers/auth.controller.js';
import { icons } from './src/icons.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
  })
);

/* L'icône est résolue par un helper plutôt que par un chemin Handlebars :
   le lookup `../icons.x` casse dès qu'un gabarit est imbriqué dans un #each,
   alors que le helper reste valable à toutes les profondeurs. */
Handlebars.registerHelper('icon', (name) => new Handlebars.SafeString(icons[name] ?? icons.check));

/* Les SVG qui utilisent un dégradé ont besoin d'un `id` unique à l'échelle du
   document : la marque est rendue plusieurs fois sur une même page (en-tête,
   pied de page, panneau d'authentification). */
let uniqueIdSeq = 0;
Handlebars.registerHelper('uniqueId', (prefix = 'uid') => `${prefix}-${++uniqueIdSeq}`);

app.set('view engine', 'hbs');
app.set('views', './views');
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: false, limit: '256kb' }));
app.use(express.json({ limit: '256kb' }));

if (!isProduction) app.use(morgan('dev'));

app.use(
  express.static('public', {
    maxAge: isProduction ? '7d' : 0,
    etag: true
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session = readSession(req);
  next();
});

app.use('/', homeRoutes);
app.use('/', authRoutes);

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page introuvable' });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error('[erreur]', error);
  res.status(500).render('errors/500', { title: 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`🚀 SmartFinance AI running on http://localhost:${PORT}`);
});