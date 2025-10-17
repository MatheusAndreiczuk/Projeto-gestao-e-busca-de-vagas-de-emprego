import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://26.68.55.68:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;