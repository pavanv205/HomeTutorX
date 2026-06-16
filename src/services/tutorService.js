import tutorsData from '../data/tutors.json';
import api from './api';

// Toggle this flag to switch between mock data and real API
const USE_MOCK = true;

// Simulate network latency for mock data
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const tutorService = {
  async getTutors(filters = {}) {
    if (!USE_MOCK) {
      const response = await api.get('/tutors', { params: filters });
      return response.data;
    }

    await delay(800); // 800ms loading simulation
    let list = [...tutorsData];

    const { search, subject, gradeClass, mode, city, maxPrice } = filters;

    // Apply search keyword filter
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.qualification.toLowerCase().includes(q) ||
          t.about.toLowerCase().includes(q) ||
          t.subjects.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Apply subject filter
    if (subject && subject !== 'All') {
      list = list.filter((t) =>
        t.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
      );
    }

    // Apply grade class filter
    if (gradeClass && gradeClass !== 'All') {
      list = list.filter((t) =>
        t.classes.some((c) => c.toLowerCase() === gradeClass.toLowerCase())
      );
    }

    // Apply mode filter
    if (mode && mode !== 'All') {
      list = list.filter((t) =>
        t.modes.some((m) => m.toLowerCase() === mode.toLowerCase())
      );
    }

    // Apply city filter
    if (city && city !== 'All') {
      list = list.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }

    // Apply max price filter
    if (maxPrice) {
      list = list.filter((t) => t.hourlyRate <= Number(maxPrice));
    }

    return list;
  },

  async getFeaturedTutors() {
    if (!USE_MOCK) {
      const response = await api.get('/tutors/featured');
      return response.data;
    }

    await delay(500);
    return tutorsData.filter((t) => t.featured);
  },

  async getTutorById(id) {
    if (!USE_MOCK) {
      const response = await api.get(`/tutors/${id}`);
      return response.data;
    }

    await delay(600);
    const tutor = tutorsData.find((t) => t.id === id);
    if (!tutor) {
      throw new Error('Tutor not found');
    }
    return tutor;
  }
};
