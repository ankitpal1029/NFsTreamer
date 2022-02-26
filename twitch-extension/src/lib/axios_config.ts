import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://f715-49-204-113-73.ngrok.io"
    : "https://nft-streamer-backend.herokuapp.com";

const axios = Axios.create({
  baseURL,
});

alert(baseURL);
export default axios;
