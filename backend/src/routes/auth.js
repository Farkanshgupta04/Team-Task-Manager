const router = require('express').Router();
const { body } = require('express-validator');
const ctrl    = require('../controllers/authController');
const auth    = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

router.post('/signup',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  validate,
  ctrl.signup
);

router.post('/login',
  body('email').isEmail(),
  body('password').notEmpty(),
  validate,
  ctrl.login
);

router.get('/me', auth, ctrl.me);

module.exports = router;
