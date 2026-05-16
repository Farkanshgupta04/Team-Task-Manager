const Project = require('../models/Project');

exports.getAll = async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const query = isAdmin ? {} : { members: req.user.id };
  const projects = await Project.find(query)
    .populate('owner', 'name email')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });
  res.json(projects);
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.create({
    name,
    description,
    owner: req.user.id,
    members: [req.user.id],
  });
  res.status(201).json(project);
};

exports.getOne = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('members', 'name email role');
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
};

exports.update = async (req, res) => {
  const { name, description } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json(project);
};

exports.remove = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Project deleted' });
};

exports.addMember = async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, {
    $addToSet: { members: req.body.user_id },
  });
  res.json({ message: 'Member added' });
};

exports.removeMember = async (req, res) => {
  await Project.findByIdAndUpdate(req.params.id, {
    $pull: { members: req.params.uid },
  });
  res.json({ message: 'Member removed' });
};
