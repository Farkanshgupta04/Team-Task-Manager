const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/taskController');
const auth     = require('../middleware/authMiddleware');
const role     = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.get('/dashboard', auth, ctrl.dashboard);

router.get('/',    auth, ctrl.getAll);
router.post('/',   auth,
  body('title').notEmpty(),
  body('project_id').notEmpty(),
  validate,
  ctrl.create
);
router.patch('/:id', auth, ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);

module.exports = router;
