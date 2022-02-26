import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";
import authRoutes from "./routes/auth";

import SocketServer from "./socket/socket-server";
import {
  DB_CONNECTION,
  FRONTEND_CORS,
  MARKETPLACE_CORS,
} from "./lib/constants";
require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  const { PORT } = process.env;

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      //origin: [MARKETPLACE_CORS as string, FRONTEND_CORS as string],
      origin: [MARKETPLACE_CORS as string, FRONTEND_CORS as string],
      credentials: true,
    })
  );

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db ${DB_CONNECTION}`);
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
  app.use(authRoutes);
};

main().catch((err) => {
  console.log(err);
});
