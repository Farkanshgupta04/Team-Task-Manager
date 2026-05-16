import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
  });

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks?project_id=${id}`);
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
    setLoading(false);
  };

  const handleTaskChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        ...taskForm,
        project_id: id,
      });
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowTaskForm(false);
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading) return <p className="p-8">Loading project...</p>;
  if (!project) return <p className="p-8">Project not found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/projects')} className="text-blue-600 hover:underline mb-6">
        ← Back to Projects
      </button>
      
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📋 Tasks</h2>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showTaskForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showTaskForm && (
        <form onSubmit={handleTaskSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={taskForm.title}
            onChange={handleTaskChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={taskForm.description}
            onChange={handleTaskChange}
            className="w-full p-3 border rounded mb-4 h-20"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
              className="p-3 border rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="date"
              name="due_date"
              value={taskForm.due_date}
              onChange={handleTaskChange}
              className="p-3 border rounded"
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Task
          </button>
        </form>
      )}

      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex gap-3 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-gray-500">
                  Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task._id, e.target.value)}
              className="p-2 border rounded bg-white font-semibold"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>
      {tasks.length === 0 && <p className="text-gray-500 text-center py-8">No tasks yet</p>}
    </div>
  );
}
