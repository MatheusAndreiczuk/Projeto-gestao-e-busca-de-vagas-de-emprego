import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://26.112.230.232:22000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;