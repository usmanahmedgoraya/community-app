"use client";
import { Inter } from "next/font/google";
import Image from "next/image";
import { asap } from "@/styles/fonts";
import notificationIcon from "../../../public/svgs/notification.svg";
import chatPerson from "../../../public/images/chat-person.jpg";
import NavLinks from "@/components/nav-links";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import Cookies from "js-cookie";
import axios from "axios";
import { backendUrl } from "@/constants";
import { setUser } from "@/redux/slices/userSlice";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state: stateType) => state.user);
  const userToken = Cookies.get("userToken");

  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const checkLogin = async () => {
    await axios
      .get(backendUrl + "/auth-me", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        dispatch(setUser(res.data));
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        router.push("/login");
      });
  };

  useEffect(() => {
    if (userToken && (JSON.stringify(user) === JSON.stringify({}) || user === null)) {
      checkLogin();
    } else if (!userToken) {
      router.push("/login");
    }
  }, [userToken]);

  const handleLogout = async () => {
    setIsLoading(true); // Start loading
    try {
      Cookies.remove("userToken");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
      redirect("/login");
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div
      style={{ height: "100vh" }}
      className="flex lg:flex-row flex-col h-screen fixed top-0 left-0 w-screen"
    >
      <div className="lg:h-screen h-[15%] shadow-[4px_4px_4px_0px_#E3E3E340] flex lg:flex-col flex-col-reverse lg:justify-between justify-end lg:py-5 py-1 gap-2 p-5 lg:w-24 w-full">
        <div className="flex lg:flex-col w-full flex-row lg:gap-10 gap-2">
          <Link href={'/feed'}>
          <div className="hidden h-14 w-14 lg:flex justify-center items-center text-white font-bold text-2xl font-family-asap rounded-xl bg-[#615EF0]">
            <span className={`${asap.className}`}>Q</span>
          </div>
          </Link>
          <NavLinks />
        </div>

        <div className="flex lg:flex-col flex-row mb-2 md:mb-0 justify-end lg:justify-center w-full lg:gap-4 gap-2 items-start">
          <div className="w-[48px] lg:mx-auto border-2 cursor-pointer border-[#8C8C8C] py-2 rounded-full">
            <Link href={"/notifications"}>
            <Image
              className="mx-auto w-7"
              src={notificationIcon}
              alt="notification"
            />
            </Link>
          </div>
          <Menu placement="bottom-start">
            <MenuHandler>
              <Image
                className="mx-auto w-[50px] rounded-full cursor-pointer"
                src={chatPerson}
                alt="profile"
              />
            </MenuHandler>
            <MenuList
              className="p-0 w-36" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            >
              
              <MenuItem className="hover:bg-gray-200 border-b border-b-gray-200 text-base px-5 py-2 rounded-none" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                className="hover:bg-gray-200 text-base text-blue-600 px-5 py-2 rounded-none" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                {isLoading ? (
                  <span className="animate-spin border-b-2 border-gray-600 w-4 h-4 rounded-full inline-block"></span> // Spinner
                ) : (
                  "Logout"
                )}
              </MenuItem>
            </MenuList>

          </Menu>
        </div>
      </div>
      {children}
    </div>
  );
}
