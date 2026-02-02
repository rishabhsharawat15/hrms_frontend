import { useState, useEffect } from 'react';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await dashboardAPI.getStats();
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500">Today: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats?.total_employees || 0}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Attendance Today"
                    value={stats?.total_attendance_today || 0}
                    icon={Calendar}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Present Today"
                    value={stats?.present_today || 0}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
                <StatCard
                    title="Absent Today"
                    value={stats?.absent_today || 0}
                    icon={XCircle}
                    color="bg-red-500"
                />
            </div>

            <div className="card">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="flex gap-4">
                    <a href="/employees" className="btn-primary">
                        Manage Employees
                    </a>
                    <a href="/attendance" className="btn-secondary">
                        Mark Attendance
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;