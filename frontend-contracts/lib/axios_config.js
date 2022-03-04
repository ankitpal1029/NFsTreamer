import Axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://api.nfstreamer.tech";

const axios = Axios.create({
  baseURL,
  withCredentials: true,
});

export default axios;
