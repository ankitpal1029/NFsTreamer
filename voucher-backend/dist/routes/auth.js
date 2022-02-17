"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const return_twitch_user_1 = __importDefault(require("../controllers/twitch/return-twitch-user"));
const twitch_auth_callback_1 = __importDefault(require("../controllers/twitch/twitch-auth-callback"));
const router = express_1.default.Router();
router.get("/auth/twitch/callback", twitch_auth_callback_1.default);
router.get("/auth/twitch/get-user", return_twitch_user_1.default);
exports.default = router;
//# sourceMappingURL=auth.js.map