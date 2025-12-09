// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer 5pake7mh5ln64h5t28kpvtv3iri`,
  },
});

export default api;
