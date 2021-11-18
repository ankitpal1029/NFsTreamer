import express from "express";
import { Socket } from "socket.io";
const router = express.Router();

import { addUser, removeUser, getUser, getUsersInRoom } from "../socket/users";
const app = express();
const io = app.get("socketio");

router.get("/chat", function () {
  // socketio logic
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
});

export default router;
