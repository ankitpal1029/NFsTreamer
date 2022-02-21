"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TwitchUserSchema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    wallet_address: {
        type: String,
        required: false,
    },
    points: {
        type: Number,
        default: 0,
        required: true,
    },
    profile_image_url: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("TwitchUser", TwitchUserSchema);
//# sourceMappingURL=twitch-users.js.map