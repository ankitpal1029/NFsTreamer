import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";
import SocketServer from "./socket/socket-server";

require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  const { PORT, DB_CONNECTION, FRONTEND_CORS } = process.env;

  app.use(express.json());
  app.use(
    cors({
      origin: FRONTEND_CORS,
    })
  );

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  // setting up socket io
  const io = new Server(httpServer, {
    path: "/chat",
    cors: {
      origin: FRONTEND_CORS,
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
