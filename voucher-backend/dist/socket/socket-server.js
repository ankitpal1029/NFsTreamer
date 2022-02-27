"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../socket/users");
const twitch_users_1 = __importDefault(require("../models/twitch-users"));
const evaluate_tier_1 = __importDefault(require("../lib/evaluate-tier"));
const SocketServer = (io) => {
    io.on("connection", (socket) => {
        console.log(`We have a new connection !!!`);
        socket.on("join", ({ name, room }, callback) => {
            const { error, user } = (0, users_1.addUser)({ name, room, id: socket.id });
            if (error) {
                return callback(error);
            }
            socket.emit("message", {
                user: "admin",
                text: `${user === null || user === void 0 ? void 0 : user.name}, welcome to the chat`,
            });
            socket.broadcast.to(user.room).emit("message", {
                user: "admin",
                text: `${user === null || user === void 0 ? void 0 : user.name}, has joined the chat`,
            });
            socket.join(user.room);
            callback();
        });
        socket.on("sendMessage", async (message, callback) => {
            var _a;
            const user = (0, users_1.getUser)(socket.id);
            if (user) {
                console.log(message === null || message === void 0 ? void 0 : message.points);
                try {
                    const prevPoints = await twitch_users_1.default.find({ id: user === null || user === void 0 ? void 0 : user.name.split("U")[1] });
                    const updatedPoints = await twitch_users_1.default.findOneAndUpdate({ id: user === null || user === void 0 ? void 0 : user.name.split("U")[1] }, { points: (message === null || message === void 0 ? void 0 : message.points) + ((_a = prevPoints[0]) === null || _a === void 0 ? void 0 : _a.points) });
                    console.log(updatedPoints);
                    const tier = (0, evaluate_tier_1.default)(message === null || message === void 0 ? void 0 : message.points, prevPoints[0].points);
                    console.log(tier, updatedPoints);
                    if (tier !== "No Upgrade") {
                        io.to(user.room).emit("message", {
                            user: "Admin",
                            text: `Congratulations! ${user === null || user === void 0 ? void 0 : user.name} on hitting ${tier}`,
                            type: "upgrade",
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                }
                io.to(user.room).emit("message", {
                    user: user === null || user === void 0 ? void 0 : user.name,
                    text: message === null || message === void 0 ? void 0 : message.message,
                    type: "emote",
                });
            }
            else {
                console.log("this user isn't there in the room");
            }
            callback();
        });
        socket.on("disconnect", () => {
            var _a;
            console.log(`User just left`);
            const result = (0, users_1.removeUser)(socket.id);
            console.log(result);
            if (result.user) {
                io.to(result.user.room).emit("message", {
                    user: "Admin",
                    text: `${(_a = result === null || result === void 0 ? void 0 : result.user) === null || _a === void 0 ? void 0 : _a.name} has left.`,
                });
                io.to(result.user.room).emit("roomData", {
                    room: result.user.room,
                    users: (0, users_1.getUsersInRoom)(result.user.name),
                });
            }
        });
    });
};
exports.default = SocketServer;
//# sourceMappingURL=socket-server.js.map