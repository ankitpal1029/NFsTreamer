import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://e931-49-205-85-29.ngrok.io"
    : "https://nft-streamer-backend.herokuapp.com";

const axios = Axios.create({
  baseURL,
});

export default axios;
