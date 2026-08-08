import api from './axios';

export const listInterns = (params) => api.get('/interns', { params }).then((r) => r.data);
export const getIntern = (id) => api.get(`/interns/${id}`).then((r) => r.data);
export const createIntern = (payload) => api.post('/interns', payload).then((r) => r.data);
export const updateIntern = (id, payload) => api.put(`/interns/${id}`, payload).then((r) => r.data);
export const setInternActive = (id, active) => api.patch(`/interns/${id}/status`, { active }).then((r) => r.data);
export const deleteIntern = (id) => api.delete(`/interns/${id}`).then((r) => r.data);
