import { useRouter } from "next/router";
import twitchIcon from "../assets/twitch_icon.png";
import Image from "next/image";
import twitchRedirect from "../lib/twitch_redirect";

const SignIn = () => {
  // const redirect = "";
  const clientID = "j1ixdsvzh5g4uqj1a2p7lydufww406";
  // const secret = "a33vihxvbozdhxixx6l8eo20io5qcx";
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    router.push(
      `https://id.twitch.tv/oauth2/authorize?client_id=${clientID}&redirect_uri=${twitchRedirect}&response_type=token&scope=user:read:email`
    );
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <form className="p-10 bg-white rounded flex justify-center items-center flex-col shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-gray-600 mb-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          />
        </svg>
        <p className="mb-5 text-3xl uppercase text-gray-600">Login</p>
        <button
          className="bg-purple-600 hover:bg-purple-900 text-white font-bold p-2 rounded w-80 flex items-center justify-around"
          id="login"
          type="submit"
          onClick={handleLogin}
        >
          <div className="text-center pl-1">
            <span>Login with </span>
          </div>
          <div className="">
            <Image src={twitchIcon} alt="twitch" />
          </div>
        </button>
      </form>
    </div>
  );
};

export default SignIn;
