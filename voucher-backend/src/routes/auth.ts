import express from "express";
import ReturnTwitchUser from "../controllers/twitch/return-twitch-user";
import TwitchAuthCallback from "../controllers/twitch/twitch-auth-callback";

const router = express.Router();

router.get("/auth/twitch/callback", TwitchAuthCallback);
router.get("/auth/twitch/get-user", ReturnTwitchUser);

export default router;
