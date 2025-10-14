// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  // A URL base do nosso backend
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;