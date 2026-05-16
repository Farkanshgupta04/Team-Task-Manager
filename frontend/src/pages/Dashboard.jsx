import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tasks/dashboard')
      .then(r => setSummary(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-8">Loading dashboard...</p>;
  if (!summary) return <p className="p-8">Failed to load dashboard</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500 uppercase font-semibold">Total Tasks</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{summary.total}</p>
        </div>
        {summary.byStatus && summary.byStatus.map(s => (
          <div key={s.status} className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
            <h3 className="text-sm text-gray-500 uppercase font-semibold capitalize">{s.status.replace('_', ' ')}</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">{s.count}</p>
          </div>
        ))}
      </div>

      {summary.overdue && summary.overdue.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-xl shadow">
          <h3 className="font-semibold text-red-600 mb-4 text-lg">
            ⚠️ Overdue Tasks ({summary.overdue.length})
          </h3>
          <div className="space-y-2">
            {summary.overdue.map(t => (
              <div key={t._id} className="flex justify-between items-center py-2 border-b border-red-200">
                <span className="font-medium text-gray-700">{t.title}</span>
                <span className="text-red-500 text-sm">
                  Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
