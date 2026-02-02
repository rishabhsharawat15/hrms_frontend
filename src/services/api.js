import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const employeeAPI = {
    getAll: () => api.get('/api/employees'),
    getById: (id) => api.get(`/api/employees/${id}`),
    create: (data) => api.post('/api/employees', data),
    delete: (id) => api.delete(`/api/employees/${id}`),
    getAttendance: (id) => api.get(`/api/employees/${id}/attendance`),
    getAttendanceSummary: (id) => api.get(`/api/employees/${id}/attendance/summary`),
};

export const attendanceAPI = {
    getAll: (params) => api.get('/api/attendance', { params }),
    create: (data) => api.post('/api/attendance', data),
};

export const dashboardAPI = {
    getStats: () => api.get('/api/dashboard/stats'),
    getAttendanceSummary: () => api.get('/api/dashboard/attendance-summary'),
};

export default api;