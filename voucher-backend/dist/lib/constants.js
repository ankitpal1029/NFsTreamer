"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_SECURE = exports.COOKIE_DOMAIN = exports.CLIENT_ID = exports.MARKETPLACE_CORS = exports.FRONTEND_CORS = exports.DB_CONNECTION = void 0;
require("dotenv").config();
const { PROD_DB_CONNECTION, DEV_DB_CONNECTION, PROD_FRONTEND_CORS, DEV_FRONTEND_CORS, PROD_MARKETPLACE_CORS, DEV_MARKETPLACE_CORS, DEV_TWITCH_CLIENTID, PROD_TWITCH_CLIENTID, } = process.env;
exports.DB_CONNECTION = process.env.NODE_ENV === "development"
    ? DEV_DB_CONNECTION
    : PROD_DB_CONNECTION;
exports.FRONTEND_CORS = process.env.NODE_ENV === "development"
    ? DEV_FRONTEND_CORS
    : PROD_FRONTEND_CORS;
exports.MARKETPLACE_CORS = process.env.NODE_ENV === "development"
    ? DEV_MARKETPLACE_CORS
    : PROD_MARKETPLACE_CORS;
exports.CLIENT_ID = process.env.NODE_ENV === "development"
    ? DEV_TWITCH_CLIENTID
    : PROD_TWITCH_CLIENTID;
exports.COOKIE_DOMAIN = process.env.NODE_ENV === "development" ? "localhost" : ".nfstreamer.tech";
exports.COOKIE_SECURE = process.env.NODE_ENV === "development" ? false : true;
//# sourceMappingURL=constants.js.map