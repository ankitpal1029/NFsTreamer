import express from "express";
import cors from "cors";

import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";
import SocketServer from "./socket/socket-server";
import {
  DB_CONNECTION,
  FRONTEND_CORS,
  MARKETPLACE_CORS,
} from "./lib/constants";
console.log(FRONTEND_CORS);
console.log(MARKETPLACE_CORS);
require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  const { PORT } = process.env;

  app.use(express.json());
  console.log(MARKETPLACE_CORS);

  app.use(
    cors({
      //origin: [MARKETPLACE_CORS as string, FRONTEND_CORS as string],
      origin: MARKETPLACE_CORS,
    })
  );

  //connect to db
  console.log("DB connection");
  console.log(DB_CONNECTION);
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  // setting up socket io
  const io = new Server(httpServer, {
    path: "/chat",
    cors: {
      origin: [FRONTEND_CORS as string, MARKETPLACE_CORS as string],
      //origin: "https://localhost:8080",
      methods: ["GET", "POST,"],
      credentials: false,
    },
  });

  // Socket Logic
  SocketServer(io);

  // starting server
  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });

  app.use(voucherRoutes);
};

main().catch((err) => {
  console.log(err);
});
