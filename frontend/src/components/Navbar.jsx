import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 Task Manager</h1>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/projects" className="hover:underline">Projects</Link>
          {user.role === 'admin' && <Link to="/admin" className="hover:underline">Admin</Link>}
          <div className="flex items-center gap-2">
            <span className="text-sm">👤 {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
