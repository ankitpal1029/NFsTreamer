import { useEffect } from "react";
import axios from "../../../lib/axios_config";
import Loader from "../../../components/loader.js";
import { useRouter } from "next/router";

const CallbackAuth = () => {
  const Router = useRouter();
  useEffect(() => {
    const parsedHash = new URLSearchParams(window.location.hash.substring(1));
    if (parsedHash.get("access_token")) {
      var access_token = parsedHash.get("access_token");
      console.log(access_token);
      try {
        await axios.get(`/auth/twitch/callback?access_token=${access_token}`);
        Router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  });
  return (
    <div>
      <Loader />
    </div>
  );
};

export default CallbackAuth;
