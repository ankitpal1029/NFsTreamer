import Axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://nft-streamer-backend.herokuapp.com";

const axios = Axios.create({
  baseURL,
  withCredentials: true,
});

export default axios;
