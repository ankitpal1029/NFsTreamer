import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";
import { createServer } from "http";

import voucherRoutes from "./routes/vouchers";

import { addUser, removeUser, getUser, getUsersInRoom } from "./socket/users";

require("dotenv").config();

const main = async () => {
  const app = express();
  const httpServer = createServer(app);

  app.use(express.json());
  app.use(
    cors({
      origin: false,
    })
  );

  app.use(voucherRoutes);

  const { PORT, DB_CONNECTION } = process.env;

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  // setting up socket io
  const io = new Server(httpServer, {
    path: "/",
    //cors: {
    //origin: "https://localhost:8080",
    //methods: ["GET", "POST"],
    //credentials: false,
    //},
    cors: {
      origin: "https://6e7f-49-204-115-11.ngrok.io",
      methods: ["GET", "POST,"],
      credentials: false,
    },
  });

  // socket.io logic have to move to seperate file
  io.on("connection", (socket: Socket) => {
    console.log(`We have a new connection !!!`);

    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser({ name, room, id: socket.id });

      if (error) {
        return callback(error);
      }

      // welcoming newly added user
      socket.emit("message", {
        user: "admin",
        text: `${user?.name}, welcome to the chat`,
      });

      // letting others know user has joined
      socket.broadcast.to(user!.room).emit("message", {
        user: "admin",
        text: `${user?.name}, has joined the chat`,
      });
      socket.join(user!.room);
      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      if (user) {
        io.to(user!.room).emit("message", { user: user?.name, text: message });
      } else {
        console.log("this user isn't there in the room");
      }

      callback();
    });

    socket.on("disconnect", () => {
      console.log(`User just left`);
      const result = removeUser(socket.id);
      console.log(result);

      if (result.user) {
        io.to(result!.user!.room).emit("message", {
          user: "Admin",
          text: `${result?.user?.name} has left.`,
        });
        io.to(result!.user!.room).emit("roomData", {
          room: result!.user!.room,
          users: getUsersInRoom(result!.user!.name),
        });
      }
    });
  });

  // starting server
  httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
