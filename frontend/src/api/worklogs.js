import api from './axios';

// NOTE: matches the backend WorkLogController exactly — only create, list, and
// supervisor feedback are exposed there (no update/delete endpoints exist).
export const listWorkLogs = (params) => api.get('/worklogs', { params }).then((r) => r.data);
export const createWorkLog = (payload) => api.post('/worklogs', payload).then((r) => r.data);
export const feedbackWorkLog = (id, payload) => api.patch(`/worklogs/${id}/feedback`, payload).then((r) => r.data);
