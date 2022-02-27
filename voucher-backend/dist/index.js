"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const vouchers_1 = __importDefault(require("./routes/vouchers"));
const auth_1 = __importDefault(require("./routes/auth"));
const socket_server_1 = __importDefault(require("./socket/socket-server"));
const constants_1 = require("./lib/constants");
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const { PORT } = process.env;
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, cors_1.default)({
        credentials: true,
        origin: [constants_1.MARKETPLACE_CORS, constants_1.FRONTEND_CORS],
    }));
    mongoose_1.default.connect(`${constants_1.DB_CONNECTION}`, () => {
        console.log(`connected to db ${constants_1.DB_CONNECTION}`);
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
    app.use(auth_1.default);
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map