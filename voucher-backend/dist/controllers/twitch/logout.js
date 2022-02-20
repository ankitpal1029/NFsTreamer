"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogoutUser = async (req, res) => {
    console.log("called");
    if (req.cookies["TWITCH_ACCESS_TOKEN"]) {
        res.clearCookie("TWITCH_ACCESS_TOKEN");
        res.send({ message: "Logged out" });
    }
    else {
        res.status(404).send({ error: "Auth Cookie not found" });
    }
};
exports.default = LogoutUser;
//# sourceMappingURL=logout.js.map