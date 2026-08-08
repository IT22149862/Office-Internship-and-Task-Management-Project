import api from './axios';

export const listWorkLogs = (params) => api.get('/worklogs', { params }).then((r) => r.data);
export const createWorkLog = (payload) => api.post('/worklogs', payload).then((r) => r.data);
export const feedbackWorkLog = (id, payload) => api.patch(`/worklogs/${id}/feedback`, payload).then((r) => r.data);
