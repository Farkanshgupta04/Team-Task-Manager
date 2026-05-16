const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(password, 12);

    // First user to sign up becomes admin automatically
    const adminExists = await User.findOne({ role: 'admin' });
    const assignedRole = adminExists ? 'member' : 'admin';

    const user = await User.create({ name, email, password: hash, role: assignedRole });
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ token: signToken(user), user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user.toObject();
    res.json({ token: signToken(user), user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};
