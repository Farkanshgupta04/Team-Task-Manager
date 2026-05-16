const router   = require('express').Router();
const { body } = require('express-validator');
const ctrl     = require('../controllers/projectController');
const auth     = require('../middleware/authMiddleware');
const role     = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');

router.get('/', auth, ctrl.getAll);
router.post('/', auth,
  body('name').notEmpty(),
  validate,
  ctrl.create
);
router.get('/:id', auth, ctrl.getOne);
router.patch('/:id', auth, role('admin'), ctrl.update);
router.delete('/:id', auth, role('admin'), ctrl.remove);
router.post('/:id/members', auth, role('admin'), ctrl.addMember);
router.delete('/:id/members/:uid', auth, role('admin'), ctrl.removeMember);

module.exports = router;
