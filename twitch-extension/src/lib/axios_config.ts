import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://1996-49-204-143-56.ngrok.io"
    : "https://nft-streamer-backend.herokuapp.com";

const axios = Axios.create({
  baseURL,
});

alert(baseURL);
export default axios;
