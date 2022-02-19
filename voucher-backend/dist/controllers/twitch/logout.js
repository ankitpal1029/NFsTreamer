"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogoutUser = async (req, res) => {
    if (req.cookies['TWITCH_ACCESS_TOKEN']) {
        res.clearCookie('TWITCH_ACCESS_TOKEN');
    }
    else {
        res.status(404).send({ error: "Auth Cookie not found" });
    }
};
exports.default = LogoutUser;
//# sourceMappingURL=logout.js.map