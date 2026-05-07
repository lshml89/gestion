import axios from "axios";

const api = axios.create({
  baseURL: "https://gestion-backend-cs5m.onrender.com",
});

export default api;