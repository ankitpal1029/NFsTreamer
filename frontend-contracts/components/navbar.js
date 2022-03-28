import Link from "next/link";
import twitchIcon from "../assets/twitch_icon.png";
import metamaskIcon from "../assets/metamask.png";
import Image from "next/image";

import { useSelector } from "react-redux";
import { ShortenAddress } from "../lib/shorten_address";
import withAuth from "../components/HOC/withAuth";
import { useDispatch } from "react-redux";
import { connectWallet, logout } from "../redux/slices/auth/authSlice.js";
import { useRouter } from "next/router";

import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  MenuIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
// import nfstreamerIcon from "../assets/nfstreamer_logo.png";

const navigation = [
  { name: "Marketplace", href: "/", current: true },
  { name: "Create Item", href: "/create-item", current: false },
];

const profileDropDown = [{ name: "Profile" }, { name: "Logout" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const handleWalletConnect = (e) => {
    e.preventDefault();
    dispatch(connectWallet());
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    router.replace("/");
  };

  const handleProfileDropDownEvents = (e, name) => {
    if (name === "Logout") {
      console.log("reached here");
      handleLogout(e);
    }
    if (name === "Profile") {
      console.log("Should take to profile some time !");
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  {/* <Image
                      src={nfstreamerIcon}
                       height="40"
                       width="40"
                       alt="twitch"
                       className="block lg:hidden h-8 w-auto"
              /> */}

                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item, i) => (
                      <div
                        key={item.name}
                        className={classNames(
                          item.href == router.asPath
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <Link href={item.href} key={i}>
                          {item.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Showing Wallet Address */}
                {user && user?.wallet_address != "0x0000000000000" && (
                  <div className="text-gray-300 hover:bg-gray-700 hover:text-white">
                    <p>{ShortenAddress(user?.wallet_address)}</p>
                  </div>
                )}
                {/* Connect to Metamask */}
                {user && user?.wallet_address == "0x0000000000000" && (
                  <div className="ml-2">
                    <button
                      className="bg-white border-2 border-black hover:bg-gray-100 text-white p-0.5 font-bold rounded flex items-center justify-around"
                      onClick={handleWalletConnect}
                    >
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
                )}

                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      {user && user?.profile_image_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.profile_image_url}
                          alt=""
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8 rounded-full" />
                      )}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {profileDropDown.map((menu, i) => {
                        return (
                          <Menu.Item key={i}>
                            {({ active }) => (
                              <div
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                                onClick={(e) =>
                                  handleProfileDropDownEvents(e, menu.name)
                                }
                              >
                                {menu.name}
                              </div>
                            )}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item, i) => (
                <Link href={item.href} key={i}>
                  <Disclosure.Button
                    key={item.name}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );

  // return (
  //   <div>
  //     <nav className="border-b p-6 pb-3">
  //       <div className="flex flex-row justify-between">
  //         <div>
  //           <p className="text-4xl font-bold">NFsTreamer</p>
  //           <div className="flex mt-4">
  //             <Link href="/">
  //               <a href="url" className="mr-6 text-blue-500">
  //                 Marketplace
  //               </a>
  //             </Link>
  //             <Link href="/create-item">
  //               <a className="mr-6 text-blue-500">Mint and Sell</a>
  //             </Link>
  //           </div>
  //         </div>
  //
  //         <div className="flex flex-col">
  //           <div className="flex">
  //             <div>
  //               <button
  //                 className="bg-purple-600 border-2 border-black hover:bg-purple-900 text-white p-0.5 font-bold rounded flex items-center justify-around"
  //                 onClick={handleLogout}
  //               >
  //                 <div className="text-center pl-1">
  //                   <span>Logout</span>
  //                 </div>
  //                 <div className="">
  //                   <Image
  //                     src={twitchIcon}
  //                     height="30"
  //                     width="30"
  //                     alt="twitch"
  //                   />
  //                 </div>
  //               </button>
  //             </div>
  //
  //             <div className="ml-2">
  //               <button
  //                 className="bg-white border-2 border-black hover:bg-gray-100 text-white p-0.5 font-bold rounded flex items-center justify-around"
  //                 onClick={handleWalletConnect}
  //               >
  //                 <div className="text-center pl-1 text-black">
  //                   <span>Connect</span>
  //                 </div>
  //                 <div className="">
  //                   <Image
  //                     src={metamaskIcon}
  //                     height="30"
  //                     width="30"
  //                     alt="twitch"
  //                   />
  //                 </div>
  //               </button>
  //             </div>
  //           </div>
  //
  //           <div className="mt-4 text-center">
  //             <p>
  //               {isSuccess ? `${user?.display_name}'s` : "user"} wallet address:{" "}
  //             </p>
  //             <p>
  //               {isSuccess ? ShortenAddress(user?.wallet_address) : "0x0..0"}
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </nav>
  //   </div>
  // );
};

export default withAuth(Navbar);
