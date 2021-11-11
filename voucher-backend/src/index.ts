import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";

require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  const io = new Server(httpServer);
  io.on("connection", (socket) => {});

  app.use(express.json());
  app.use(cors());

  app.use(voucherRoutes);

  const { PORT, DB_CONNECTION } = process.env;

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  //app.listen(PORT, () => {
  //console.log(`server is running on port ${PORT}`);
  //});

  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
