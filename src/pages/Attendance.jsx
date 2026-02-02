import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Filter } from 'lucide-react';
import { attendanceAPI, employeeAPI } from '../services/api';
import { format } from 'date-fns';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'present',
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filterDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [attendanceRes, employeesRes] = await Promise.all([
                attendanceAPI.getAll(filterDate ? { date: filterDate } : {}),
                employeeAPI.getAll(),
            ]);

            setAttendance(attendanceRes.data);
            setEmployees(employeesRes.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        try {
            await attendanceAPI.create({
                ...formData,
                employee_id: parseInt(formData.employee_id),
            });
            setShowModal(false);
            setFormData({
                employee_id: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                status: 'present',
            });
            fetchData();
        } catch (err) {
            setFormError(err.response?.data?.detail || 'Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp ? emp.full_name : 'Unknown';
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchData} />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        <Filter size={18} className="text-gray-400" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="outline-none text-sm"
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate('')}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Calendar size={20} />
                        Mark Attendance
                    </button>
                </div>
            </div>

            {attendance.length === 0 ? (
                <EmptyState
                    message="No attendance records found"
                    description={filterDate ? "No records for selected date" : "Start by marking attendance for employees"}
                />
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Employee</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {attendance.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium text-sm">
                                                    {getEmployeeName(record.employee_id).charAt(0)}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {getEmployeeName(record.employee_id)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {format(new Date(record.date), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${record.status === 'present'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {record.status === 'present' ? (
                                                    <CheckCircle size={14} />
                                                ) : (
                                                    <XCircle size={14} />
                                                )}
                                                {record.status === 'present' ? 'Present' : 'Absent'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Mark Attendance</h3>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee *
                                </label>
                                <select
                                    required
                                    className="input-field"
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map((emp) => (
                                        <option key={emp.id} value={emp.id}>
                                            {emp.full_name} ({emp.employee_id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="input-field"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="present"
                                            checked={formData.status === 'present'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="flex items-center gap-1 text-green-700">
                                            <CheckCircle size={16} />
                                            Present
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="absent"
                                            checked={formData.status === 'absent'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="flex items-center gap-1 text-red-700">
                                            <XCircle size={16} />
                                            Absent
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : 'Mark Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;