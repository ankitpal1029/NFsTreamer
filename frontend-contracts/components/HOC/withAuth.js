import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "../../lib/axios_config";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    useEffect(() => {
      axios.get("/auth/twitch/isAuth").then((res) => {
        if (res.data.message === "valid access token") {
          return <WrappedComponent {...props} />;
        } else {
          router.replace("/signin");
        }
      });
    });
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
