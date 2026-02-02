import { useState, useEffect } from 'react';
import { Plus, Trash2, Mail, Building2, Badge } from 'lucide-react';
import { employeeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await employeeAPI.getAll();
            setEmployees(response.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);

        try {
            await employeeAPI.create(formData);
            setShowModal(false);
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            setFormError(err.response?.data?.detail || 'Failed to create employee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;

        try {
            await employeeAPI.delete(id);
            fetchEmployees();
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to delete employee');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Employee
                </button>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    message="No employees found"
                    description="Add your first employee to get started"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map((employee) => (
                        <div key={employee.id} className="card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                                    {employee.full_name.charAt(0)}
                                </div>
                                <button
                                    onClick={() => handleDelete(employee.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{employee.full_name}</h3>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Badge size={16} />
                                    <span>{employee.employee_id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span className="truncate">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    <span>{employee.department}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Employee</h3>

                        {formError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee ID *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                    placeholder="e.g., EMP001"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="e.g., John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="e.g., john@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="e.g., Engineering"
                                />
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
                                    {submitting ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;