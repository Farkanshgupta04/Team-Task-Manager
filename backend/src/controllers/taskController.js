const Task = require('../models/Task');

exports.getAll = async (req, res) => {
  const { project_id, status, assigned_to } = req.query;
  const filter = {};
  if (project_id)  filter.project     = project_id;
  if (status)      filter.status      = status;
  if (assigned_to) filter.assigned_to = assigned_to;

  const tasks = await Task.find(filter)
    .populate('assigned_to', 'name email')
    .populate('project', 'name')
    .sort({ due_date: 1 });
  res.json(tasks);
};

exports.create = async (req, res) => {
  const { title, description, status, priority, due_date, project_id, assigned_to } = req.body;
  const task = await Task.create({
    title,
    description,
    status:      status || 'todo',
    priority:    priority || 'medium',
    due_date,
    project:     project_id,
    assigned_to,
    created_by:  req.user.id,
  });
  res.status(201).json(task);
};

exports.update = async (req, res) => {
  const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'assigned_to'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (!Object.keys(updates).length)
    return res.status(400).json({ error: 'Nothing to update' });

  const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json(task);
};

exports.remove = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
};

exports.dashboard = async (req, res) => {
  const uid = req.user.id;
  const now = new Date();

  const [total, byStatus, overdue] = await Promise.all([
    Task.countDocuments({ assigned_to: uid }),
    Task.aggregate([
      { $match: { assigned_to: uid } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Task.find({
      assigned_to: uid,
      due_date: { $lt: now },
      status: { $ne: 'done' },
    }),
  ]);

  res.json({
    total,
    byStatus: byStatus.map(s => ({ status: s._id, count: s.count })),
    overdue,
  });
};
