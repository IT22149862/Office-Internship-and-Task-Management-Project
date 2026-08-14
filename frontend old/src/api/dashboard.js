import api from './axios';

export const fetchAdminDashboard = () => api.get('/dashboard/admin').then((r) => r.data);
export const fetchInternDashboard = () => api.get('/dashboard/intern').then((r) => r.data);
