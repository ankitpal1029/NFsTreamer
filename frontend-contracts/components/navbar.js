import Link from "next/link";
import twitchIcon from "../assets/twitch_icon.png";
import metamaskIcon from "../assets/metamask.png";
import Image from "next/image";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  return (
    <div>
      <nav className="border-b p-6 pb-3">
        <div className="flex flex-row justify-between">
          <div>
            <p className="text-4xl font-bold">NFsTreamer</p>
            <div className="flex mt-4">
              <Link href="/">
                <a href="url" className="mr-6 text-blue-500">
                  Marketplace
                </a>
              </Link>
              <Link href="/create-item">
                <a className="mr-6 text-blue-500">Mint and Sell</a>
              </Link>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex">
              <div>
                <button className="bg-purple-600 border-2 border-black hover:bg-purple-900 text-white p-0.5 font-bold rounded flex items-center justify-around">
                  <div className="text-center pl-1">
                    <span>Logout</span>
                  </div>
                  <div className="">
                    <Image
                      src={twitchIcon}
                      height="30"
                      width="30"
                      alt="twitch"
                    />
                  </div>
                </button>
              </div>

              <div className="ml-2">
                <button className="bg-white border-2 border-black hover:bg-gray-100 text-white p-0.5 font-bold rounded flex items-center justify-around">
                  <div className="text-center pl-1 text-black">
                    <span>Connect</span>
                  </div>
                  <div className="">
                    <Image
                      src={metamaskIcon}
                      height="30"
                      width="30"
                      alt="twitch"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p>
                {isSuccess ? `${user?.display_name}'s` : "user"} wallet address:{" "}
              </p>
              <p>{user?.wallet_address}</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
