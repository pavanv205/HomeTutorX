import api from './api';

export const generalService = {
  async subscribeNewsletter(email) {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  async submitContact(contactData) {
    const response = await api.post('/student-requests', contactData);
    return response.data;
  }
};
