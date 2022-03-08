"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const twitch_users_1 = __importDefault(require("../../models/twitch-users"));
const constants_1 = require("../../lib/constants");
const AddWalletAddress = async (req, res) => {
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
            const response = await twitch_users_1.default.findOneAndUpdate({ id: req.body.id }, { wallet_address: req.body.wallet_address });
            console.log(response);
            res.send({ message: "updated wallet address" });
        }
        catch (error) {
            console.log(error);
            res.send({ message: error });
        }
    }
    return res.send();
};
exports.default = AddWalletAddress;
//# sourceMappingURL=add-wallet-address.js.map