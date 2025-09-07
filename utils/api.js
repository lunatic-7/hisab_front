import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://moti.pythonanywhere.com/api/', // Replace with your Django server IP
});
