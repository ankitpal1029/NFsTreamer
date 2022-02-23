import express from "express";
import AddWalletAddress from "../controllers/twitch/add-wallet-address";
import isAuthorised from "../controllers/twitch/isAuthorised";
import LogoutUser from "../controllers/twitch/logout";
import ReturnTwitchUser from "../controllers/twitch/return-twitch-user";
import TwitchAuthCallback from "../controllers/twitch/twitch-auth-callback";

const router = express.Router();

router.get("/auth/twitch/callback", TwitchAuthCallback);
router.get("/auth/twitch/get-user", ReturnTwitchUser);
router.get("/auth/twitch/logout", LogoutUser);
router.get("/auth/twitch/isAuth", isAuthorised);
router.post("/add-wallet-address", AddWalletAddress);

export default router;
