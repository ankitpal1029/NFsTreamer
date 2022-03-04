const twitchRedirect =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/auth/twitch/callback"
    : "https://marketplace.nfstreamer.tech/auth/twitch/callback";

export default twitchRedirect;
