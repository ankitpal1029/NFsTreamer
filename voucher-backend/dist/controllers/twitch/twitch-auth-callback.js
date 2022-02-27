"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const twitch_users_1 = __importDefault(require("../../models/twitch-users"));
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
        const insertData = {
            id: res.data.data[0].id,
            email: res.data.data[0].email,
            display_name: res.data.data[0].display_name,
            points: 0,
            profile_image_url: res.data.data[0].profile_image_url,
            wallet_address: "0x0",
        };
        const queryRes = await twitch_users_1.default.findOne({ id: res.data.data[0].id });
        if (!queryRes) {
            twitch_users_1.default.create(insertData, (err, _) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Created Twitch user");
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
    res.status(200).cookie("TWITCH_ACCESS_TOKEN", access_token, {
        domain: ".herokuapp.com",
        maxAge: 60 * 60 * 1000,
    });
    return res.send();
};
exports.default = TwitchAuthCallback;
//# sourceMappingURL=twitch-auth-callback.js.map