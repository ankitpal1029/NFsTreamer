import { useEffect } from "react";
import axios from "../../../lib/axios_config";

const CallbackAuth = () => {
  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    if (parsedHash.get("access_token")) {
      var access_token = parsedHash.get("access_token");
      console.log(access_token);
      axios.get(`/auth/twitch/callback?access_token=${access_token}`);
    }
  });
  return <div>binch</div>;
};

export default CallbackAuth;
