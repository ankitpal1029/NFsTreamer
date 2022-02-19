import express from "express";
import isAuthorised from "../controllers/twitch/isAuthorised";
import LogoutUser from "../controllers/twitch/logout";
import ReturnTwitchUser from "../controllers/twitch/return-twitch-user";
import TwitchAuthCallback from "../controllers/twitch/twitch-auth-callback";

const router = express.Router();

router.get("/auth/twitch/callback", TwitchAuthCallback);
router.get("/auth/twitch/get-user", ReturnTwitchUser);
router.post("auth/twitch/logout", LogoutUser);
router.get("/auth/twitch/isAuth", isAuthorised);

export default router;
