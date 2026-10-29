const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Server request failed');
    }
    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getProfile: (id) => request(`/auth/profile/${id}`),
  getUsers: () => request('/auth/users'),

  // Academics
  getTimetable: (day) => request(`/academics/timetable${day ? `?day=${day}` : ''}`),
  getAttendance: (studentId) => request(`/academics/attendance/${studentId}`),
  getMaterials: () => request('/academics/materials'),
  uploadMaterial: (data) => request('/academics/materials', { method: 'POST', body: JSON.stringify(data) }),
  getAssignments: (studentId) => request(`/academics/assignments?studentId=${studentId}`),
  submitAssignment: (id, data) => request(`/academics/assignments/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  createAssignment: (data) => request('/academics/assignments', { method: 'POST', body: JSON.stringify(data) }),
  getExams: () => request('/academics/exams'),

  // Notices
  getNotices: (category, urgent) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (urgent) params.append('urgent', 'true');
    return request(`/notices?${params.toString()}`);
  },
  createNotice: (data) => request('/notices', { method: 'POST', body: JSON.stringify(data) }),
  togglePinNotice: (id) => request(`/notices/${id}/pin`, { method: 'PATCH' }),
  deleteNotice: (id) => request(`/notices/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: (studentId, category) => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (category) params.append('category', category);
    return request(`/events?${params.toString()}`);
  },
  createEvent: (data) => request('/events', { method: 'POST', body: JSON.stringify(data) }),
  registerEvent: (id, studentId) => request(`/events/${id}/register`, { method: 'POST', body: JSON.stringify({ studentId }) }),
  unregisterEvent: (id, studentId) => request(`/events/${id}/unregister`, { method: 'POST', body: JSON.stringify({ studentId }) }),

  // Clubs
  getClubs: (studentId) => request(`/clubs?studentId=${studentId || ''}`),
  joinClub: (id, studentId) => request(`/clubs/${id}/join`, { method: 'POST', body: JSON.stringify({ studentId }) }),
  leaveClub: (id, studentId) => request(`/clubs/${id}/leave`, { method: 'POST', body: JSON.stringify({ studentId }) }),
  createClub: (data) => request('/clubs', { method: 'POST', body: JSON.stringify(data) }),

  // Lost & Found
  getLostFound: (type, status) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    return request(`/lostfound?${params.toString()}`);
  },
  reportLostFound: (data) => request('/lostfound', { method: 'POST', body: JSON.stringify(data) }),
  claimLostFound: (id, data) => request(`/lostfound/${id}/claim`, { method: 'POST', body: JSON.stringify(data) }),
  updateClaimStatus: (claimId, data) => request(`/lostfound/claims/${claimId}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Marketplace
  getMarketplace: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return request(`/marketplace?${params.toString()}`);
  },
  postMarketplaceItem: (data) => request('/marketplace', { method: 'POST', body: JSON.stringify(data) }),
  updateItemStatus: (id, status) => request(`/marketplace/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Opportunities
  getOpportunities: (studentId, type) => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (type) params.append('type', type);
    return request(`/opportunities?${params.toString()}`);
  },
  createOpportunity: (data) => request('/opportunities', { method: 'POST', body: JSON.stringify(data) }),
  interactOpportunity: (id, data) => request(`/opportunities/${id}/interact`, { method: 'POST', body: JSON.stringify(data) }),

  // Utilities
  getCanteenMenu: () => request('/utilities/canteen'),
  getLocations: () => request('/utilities/locations'),
  getRoutes: () => request('/utilities/routes'),
  getEmergencyContacts: () => request('/utilities/emergency'),
  getGrievances: () => request('/utilities/grievances'),
  submitGrievance: (data) => request('/utilities/grievances', { method: 'POST', body: JSON.stringify(data) }),
  updateGrievanceStatus: (id, data) => request(`/utilities/grievances/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: (role) => request(`/notifications?role=${role || ''}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  readAllNotifications: () => request('/notifications/read-all', { method: 'POST' }),

  // AI Assistant
  queryAI: (prompt, studentId) => request('/ai/query', { method: 'POST', body: JSON.stringify({ prompt, studentId }) })
};
