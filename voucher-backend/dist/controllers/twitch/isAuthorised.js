"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../lib/constants");
const isAuthorised = async (req, res) => {
    if (!req.cookies["TWITCH_ACCESS_TOKEN"]) {
        res.send({ error: "Cookie not found" });
    }
    else {
        const access_token = req.cookies["TWITCH_ACCESS_TOKEN"];
        try {
            await axios_1.default.get("https://id.twitch.tv/oauth2/validate", {
                headers: {
                    "Client-ID": constants_1.CLIENT_ID,
                    Authorization: "Bearer " + access_token,
                },
            });
            res.send({ message: "valid access token" });
        }
        catch (error) {
            res.send({ message: error.response.data.message });
        }
    }
};
exports.default = isAuthorised;
//# sourceMappingURL=isAuthorised.js.map