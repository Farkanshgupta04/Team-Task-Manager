const router = require('express').Router();
const ctrl    = require('../controllers/userController');
const auth    = require('../middleware/authMiddleware');
const role    = require('../middleware/roleMiddleware');

router.get('/', auth, role('admin'), ctrl.getAll);
router.patch('/:id/role', auth, role('admin'), ctrl.updateRole);

module.exports = router;
