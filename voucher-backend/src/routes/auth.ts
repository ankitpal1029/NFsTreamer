import express from "express";
import TwitchAuthCallback from "../controllers/twitch/twitch-auth-callback";

const router = express.Router();

router.get("/auth/twitch/callback", TwitchAuthCallback);

export default router;
