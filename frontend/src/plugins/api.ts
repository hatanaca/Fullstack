import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Aponte para o Nginx na porta 8080
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default api;
