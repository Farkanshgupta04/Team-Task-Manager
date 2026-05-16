import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  if (loading) return <p className="p-8">Loading projects...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📁 Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4 h-20"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Project
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {projects.map(proj => (
          <Link key={proj._id} to={`/projects/${proj._id}`}>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{proj.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{proj.description}</p>
              <p className="text-xs text-gray-500">👥 {proj.members?.length || 0} members</p>
            </div>
          </Link>
        ))}
      </div>
      {projects.length === 0 && <p className="text-gray-500 text-center py-8">No projects yet</p>}
    </div>
  );
}
