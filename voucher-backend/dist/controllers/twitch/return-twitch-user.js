"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReturnTwitchUser = async (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
};
exports.default = ReturnTwitchUser;
//# sourceMappingURL=return-twitch-user.js.map