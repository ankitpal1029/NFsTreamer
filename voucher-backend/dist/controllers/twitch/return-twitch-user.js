"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../lib/constants");
const twitch_users_1 = __importDefault(require("../../models/twitch-users"));
const ReturnTwitchUser = async (req, res) => {
    if (!req.cookies["TWITCH_ACCESS_TOKEN"]) {
        res.send({ error: "Cookie not found" });
    }
    else {
        const access_token = req.cookies["TWITCH_ACCESS_TOKEN"];
        console.log("Trying to fetch user");
        try {
            const resData = await axios_1.default.get("https://api.twitch.tv/helix/users", {
                headers: {
                    "Client-ID": constants_1.CLIENT_ID,
                    Authorization: "Bearer " + access_token,
                },
            });
            const insertData = {
                id: resData.data.data[0].id,
                email: resData.data.data[0].email,
                display_name: resData.data.data[0].display_name,
                points: 0,
                profile_image_url: resData.data.data[0].profile_image_url,
                wallet_address: "0x0",
            };
            try {
                const queryRes = await twitch_users_1.default.findOne({
                    id: resData.data.data[0].id,
                });
                if (!queryRes) {
                    twitch_users_1.default.create(insertData, (err, _) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("Created Twitch user");
                        }
                    });
                    res.send({ user: insertData });
                }
                else {
                    res.send({ user: queryRes });
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.default = ReturnTwitchUser;
//# sourceMappingURL=return-twitch-user.js.map