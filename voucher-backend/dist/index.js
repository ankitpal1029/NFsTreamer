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
const socket_server_1 = __importDefault(require("./socket/socket-server"));
const constants_1 = require("./lib/constants");
console.log(constants_1.FRONTEND_CORS);
console.log(constants_1.MARKETPLACE_CORS);
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const { PORT } = process.env;
    app.use(express_1.default.json());
    console.log(constants_1.MARKETPLACE_CORS);
    app.use((0, cors_1.default)({
        origin: constants_1.MARKETPLACE_CORS,
    }));
    console.log("DB connection");
    console.log(constants_1.DB_CONNECTION);
    mongoose_1.default.connect(`${constants_1.DB_CONNECTION}`, () => {
        console.log(`connected to db`);
    });
    const io = new socket_io_1.Server(httpServer, {
        path: "/chat",
        cors: {
            origin: [constants_1.FRONTEND_CORS, constants_1.MARKETPLACE_CORS],
            methods: ["GET", "POST,"],
            credentials: false,
        },
    });
    (0, socket_server_1.default)(io);
    httpServer.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
    app.use(vouchers_1.default);
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map