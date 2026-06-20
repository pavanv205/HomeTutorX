import api from './api';

// Normalize backend tutor data to match frontend field expectations
function normalizeTutor(t) {
  if (!t) return t;
  return {
    ...t,
    id: t.id || t._id || '',
    name: t.name || t.fullName || 'Anonymous Tutor',
    about: t.about || t.bio || 'No biography details provided.',
    modes: t.modes || (t.teachingMode
      ? (t.teachingMode === 'Both' ? ['Online', 'Offline'] : [t.teachingMode])
      : ['Online']),
    experience: t.experience !== undefined ? t.experience : (t.experienceYears || 3),
  };
}

export const tutorService = {
  async registerTutor(formData) {
    const debugObj = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        debugObj[key] = `[File: ${value.name}]`;
      } else {
        try { debugObj[key] = JSON.parse(value); } catch { debugObj[key] = value; }
      }
    }
    console.log('Sending tutor object to API:', debugObj);

    const response = await api.post('/tutors', formData);
    return response.data;
  },

  async getTutors(filters = {}) {
    const response = await api.get('/tutors', { params: filters });
    const data = Array.isArray(response.data) ? response.data.map(normalizeTutor) : response.data;
    console.log('API Response (Get Tutors):', data);
    return data;
  },

  async getTutorById(id) {
    const response = await api.get(`/tutors/${id}`);
    return normalizeTutor(response.data);
  },

  async getFeaturedTutors() {
    const response = await api.get('/tutors', { params: { featured: true } });
    const list = Array.isArray(response.data) ? response.data.map(normalizeTutor) : [];
    return list.filter(t => t.featured);
  },

  async updateTutor(id, data) {
    const response = await api.put(`/tutors/${id}`, data);
    return response.data;
  },

  async deleteTutor(id) {
    const response = await api.delete(`/tutors/${id}`);
    return response.data;
  }
};

