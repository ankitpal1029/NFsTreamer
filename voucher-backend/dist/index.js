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
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const { PORT, DB_CONNECTION, FRONTEND_CORS, MARKETPLACE_CORS } = process.env;
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: [MARKETPLACE_CORS, FRONTEND_CORS],
    }));
    mongoose_1.default.connect(`${DB_CONNECTION}`, () => {
        console.log(`connected to db`);
    });
    const io = new socket_io_1.Server(httpServer, {
        path: "/chat",
        cors: {
            origin: [FRONTEND_CORS, MARKETPLACE_CORS],
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