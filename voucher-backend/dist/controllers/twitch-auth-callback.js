"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const TwitchAuthCallback = async (req, res) => {
    const { access_token } = req.query;
    console.log(access_token);
    const clientID = "j1ixdsvzh5g4uqj1a2p7lydufww406";
    try {
        const res = await axios_1.default.get("https://api.twitch.tv/helix/users", {
            headers: {
                "Client-ID": clientID,
                Authorization: "Bearer " + access_token,
            },
        });
        console.log(res === null || res === void 0 ? void 0 : res.data);
    }
    catch (error) {
        console.log(error);
    }
    res.status(200).cookie("TWITCH_ACCESS_TOKEN", access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 12 * 3600000),
    });
    return res.send();
};
exports.default = TwitchAuthCallback;
//# sourceMappingURL=twitch-auth-callback.js.map