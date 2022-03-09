require("dotenv").config();
const {
  PROD_DB_CONNECTION,
  DEV_DB_CONNECTION,
  PROD_FRONTEND_CORS,
  DEV_FRONTEND_CORS,
  PROD_MARKETPLACE_CORS,
  DEV_MARKETPLACE_CORS,
  DEV_TWITCH_CLIENTID,
  PROD_TWITCH_CLIENTID,
} = process.env;

// const { PORT, DB_CONNECTION, FRONTEND_CORS, MARKETPLACE_CORS } = process.env;

export const DB_CONNECTION =
  process.env.NODE_ENV === "development"
    ? DEV_DB_CONNECTION
    : PROD_DB_CONNECTION;
export const FRONTEND_CORS =
  process.env.NODE_ENV === "development"
    ? DEV_FRONTEND_CORS
    : PROD_FRONTEND_CORS;
export const MARKETPLACE_CORS =
  process.env.NODE_ENV === "development"
    ? DEV_MARKETPLACE_CORS
    : PROD_MARKETPLACE_CORS;

export const CLIENT_ID =
  process.env.NODE_ENV === "development"
    ? DEV_TWITCH_CLIENTID
    : PROD_TWITCH_CLIENTID;

export const COOKIE_DOMAIN =
  process.env.NODE_ENV === "development" ? "localhost" : ".nfstreamer.tech";

export const COOKIE_SECURE = 
  process.env.NODE_ENV === "development" ? false: true;
