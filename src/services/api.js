import axios from "axios";

const api = axios.create({
  baseURL: "https://699c5fbb110b5b738cc280f4.mockapi.io/api/v1",
});

export default api;