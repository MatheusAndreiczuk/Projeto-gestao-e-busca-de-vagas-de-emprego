import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://26.12.52.22:21150', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;