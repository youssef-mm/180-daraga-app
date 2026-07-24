import axios from 'axios';

// IP جهازك المباشر للاتصال بالسيرفر Local
const BASE_URL = 'http://192.168.1.9:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;