import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";

require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  app.use(express.json());
  app.use(
    cors({
      origin: "https://localhost:8080",
    })
  );

  app.use(voucherRoutes);

  const { PORT, DB_CONNECTION } = process.env;

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  //app.listen(PORT, () => {
  //console.log(`server is running on port ${PORT}`);
  //});

  const io = new Server(httpServer, {
    path: "/",
    cors: {
      origin: "https://localhost:8080",
      methods: ["GET", "POST"],
      credentials: false,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`We have a new connection !!!`);
    socket.on("disconnect", () => {
      console.log(`User just left`);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
