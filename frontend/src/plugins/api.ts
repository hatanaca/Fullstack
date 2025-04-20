// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  // Adicionar isto para debug
 // withCredentials: true
});

// Adicionar interceptores para debug
//api.interceptors.request.use(request => {
//  console.log('Starting Request', request);
//  return request;
//});

//api.interceptors.response.use(
//  response => {
//    console.log('Response:', response);
//    return response;
//  },
//  error => {
//    console.log('Error Response:', error.response);
//    return Promise.reject(error);
 // }
//);

export default api;
