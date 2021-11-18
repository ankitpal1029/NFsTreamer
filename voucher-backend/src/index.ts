import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";
import liveChatRoutes from "./routes/live-chat";

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
      methods: ["GET", "POST,"],
      credentials: false,
    },
  });

  // starting server
  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });

  app.use(voucherRoutes);
  app.use(liveChatRoutes);
  app.set("socketio", io);
};

main().catch((err) => {
  console.log(err);
});
