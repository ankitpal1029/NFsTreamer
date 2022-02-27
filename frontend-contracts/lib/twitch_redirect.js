const twitchRedirect =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/auth/twitch/callback"
    : "https://nft-streamer-marketplace.netlify.app/auth/twitch/callback";

export default twitchRedirect;
