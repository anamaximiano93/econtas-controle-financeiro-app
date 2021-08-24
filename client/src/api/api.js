import axios from "axios";

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL });

/* api.interceptors.request.use(async (config) => {}); */

export default api;
