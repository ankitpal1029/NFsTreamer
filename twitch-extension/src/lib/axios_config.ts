import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://484e-49-204-132-57.ngrok.io"
    : "https://nft-streamer-backend.herokuapp.com";

const axios = Axios.create({
  baseURL,
});

export default axios;
