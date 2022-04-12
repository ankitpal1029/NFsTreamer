import Axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "https://224b-2401-4900-2321-5b60-cf68-e4be-d188-1a57.ngrok.io"
    : "https://api.nfstreamer.tech";

console.log(baseURL);
const axios = Axios.create({
  baseURL,
});

export default axios;
