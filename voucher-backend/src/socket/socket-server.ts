import { Server, Socket } from "socket.io";
import { addUser, removeUser, getUser, getUsersInRoom } from "../socket/users";
import TwitchUser from "../models/twitch-users";
import EvaluateTier from "../lib/evaluate-tier";

export interface IMessageRecieved {
  message: string;
  points: number;
}

export interface ITwitchUser {
  _id: any;
  id: number;
  email: string;
  display_name: string;
  wallet_address: string;
  points: number;
  profile_image_url: string;
  __v: number;
}

const SocketServer = (io: Server) => {
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

    socket.on(
      "sendMessage",
      async (message: IMessageRecieved, callback: any) => {
        const user = getUser(socket.id);

        if (user) {
          // increase points according to message.points in db
          console.log(message?.points);
          try {
            const prevPoints = await TwitchUser.find({id: user?.name.split("U")[1]});
            const updatedPoints = await TwitchUser.findOneAndUpdate(
              { id: user?.name.split("U")[1] },
              { points: message?.points + prevPoints[0]?.points}
            );
            console.log(updatedPoints);
            const tier = EvaluateTier( message?.points as number, prevPoints[0].points);
            console.log(tier, updatedPoints);
            if (tier !== "No Upgrade") {
              io.to(user!.room).emit("message", {
                user: "Admin",
                text: `Congratulations! ${user?.name} on hitting ${tier}`,
                type: "upgrade",
              });
            }
          } catch (err) {
            console.log(err);
          }
          io.to(user!.room).emit("message", {
            user: user?.name,
            text: message?.message,
            type: "emote",
          });
        } else {
          console.log("this user isn't there in the room");
        }

        callback();
      }
    );

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
};

export default SocketServer;
