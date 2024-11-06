"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import calenderBlack from "../../public/svgs/calender-black.svg";
import chatBlack from "../../public/svgs/chat-black.svg";
import chatBlue from "../../public/svgs/chat-blue.svg";
import { Users } from "lucide-react";

export default function NavLinks() {
  const currentPath = usePathname();

  return (
    <div className="flex lg:flex-col flex-row md:justify-center justify-start w-full md:gap-8 items-start">
      <div className="w-full cursor-pointer">
        <Link href={"/"}>
          {currentPath === "/" ? (
            <Image className="mx-auto w-6" src={chatBlue} alt="chat" />
          ) : (
            <Image className="mx-auto w-6" src={chatBlack} alt="chat" />
          )}
        </Link>
      </div>
      <div className="w-full cursor-pointer">
        <Link href={"/groups"}>
          <Users className="mx-auto w-6" color={currentPath === "/groups" ? "blue" : "black"} />
        </Link>
        
      </div>
      <div className="w-full cursor-pointer">
        <Image className="mx-auto w-6" src={calenderBlack} alt="calendar" />
      </div>
    </div>
  );
}
