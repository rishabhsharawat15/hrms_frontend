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
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employees</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center justify-center gap-2 py-2.5"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Add Employee</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {employees.length === 0 ? (
                <EmptyState
                    message="No employees found"
                    description="Add your first employee to get started"
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map((employee) => (
                        <div key={employee.id} className="card p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-base sm:text-lg shrink-0">
                                    {employee.full_name.charAt(0)}
                                </div>
                                <button
                                    onClick={() => handleDelete(employee.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 truncate">{employee.full_name}</h3>

                            <div className="space-y-1.5 sm:space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Badge size={16} className="shrink-0" />
                                    <span className="truncate">{employee.employee_id}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Mail size={16} className="shrink-0" />
                                    <span className="truncate text-xs sm:text-sm">{employee.email}</span>
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                    <Building2 size={16} className="shrink-0" />
                                    <span className="truncate">{employee.department}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />

                    <div className="relative bg-white w-full sm:max-w-md sm:rounded-xl shadow-xl overflow-hidden max-h-screen sm:max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg sm:text-xl font-bold">Add New Employee</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6">
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

                                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="btn-secondary flex-1 py-2.5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex-1 disabled:opacity-50 py-2.5"
                                    >
                                        {submitting ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;