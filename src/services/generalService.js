import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'false' ? false : true;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generalService = {
  async subscribeNewsletter(email) {
    if (!USE_MOCK) {
      const response = await api.post('/newsletter/subscribe', { email });
      return response.data;
    }

    await delay(800);
    console.log('Newsletter subscription:', email);
    return {
      success: true,
      message: 'Subscribed successfully! Thank you for staying tuned.'
    };
  },

  async submitContact(contactData) {
    if (!USE_MOCK) {
      const response = await api.post('/contact', contactData);
      return response.data;
    }

    await delay(1000);
    console.log('Contact form submitted:', contactData);
    return {
      success: true,
      message: 'Your message has been received! Our support representative will email you shortly.'
    };
  }
};
