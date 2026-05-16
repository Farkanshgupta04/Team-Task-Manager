const User = require('../models/User');

exports.getAll = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.updateRole = async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role))
    return res.status(400).json({ error: 'Invalid role' });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password');
  
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};
