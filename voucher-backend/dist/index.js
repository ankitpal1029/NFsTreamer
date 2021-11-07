"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const vouchers_1 = __importDefault(require("./routes/vouchers"));
require("dotenv").config();
const main = async () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    const { PORT, DB_CONNECTION } = process.env;
    mongoose_1.default.connect(`${DB_CONNECTION}`, () => {
        console.log(`connected to db`);
    });
    app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
    app.use(vouchers_1.default);
};
main().catch((err) => {
    console.log(err);
});
//# sourceMappingURL=index.js.map