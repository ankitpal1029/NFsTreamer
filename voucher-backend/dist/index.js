"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const vouchers_1 = __importDefault(require("./routes/vouchers"));
const users_1 = require("./socket/users");
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: false,
    }));
    app.use(vouchers_1.default);
    const { PORT, DB_CONNECTION } = process.env;
    mongoose_1.default.connect(`${DB_CONNECTION}`, () => {
        console.log(`connected to db`);
    });
    const io = new socket_io_1.Server(httpServer, {
        path: "/",
        cors: {
            origin: "https://6e7f-49-204-115-11.ngrok.io",
            methods: ["GET", "POST,"],
            credentials: false,
        },
    });
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
        socket.on("sendMessage", (message, callback) => {
            const user = (0, users_1.getUser)(socket.id);
            if (user) {
                io.to(user.room).emit("message", { user: user === null || user === void 0 ? void 0 : user.name, text: message });
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
    httpServer.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map