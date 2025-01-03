import React from "react";
import userIcon from "../../public/svgs/user.svg";
import { roomType, userType } from "@/types/basicTypes";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import Image from "next/image";
import { getRoomChats } from "@/API/chats";
import Cookies from "js-cookie";
import { selectRoom } from "@/redux/slices/roomsSlice";
import { addNewMessages, updateMessages } from "@/redux/slices/messagesSlice";

const RoomBox = (props: { room: roomType }) => {
  const { room } = props;

  const dispatch = useDispatch();
  const currentUser = useSelector((state: stateType) => state.user.user);

  const getChats = async () => {
    dispatch(addNewMessages(room.recentMessages || []));
    dispatch(selectRoom(room));
  };

  const recentMessage =
    room.recentMessages && room.recentMessages[room.recentMessages?.length - 1];

  return (
    <div
      onClick={getChats}
      className="p-2 m-2 cursor-pointer bg-[#EEF1FF] justify-between rounded-lg flex flex-row"
    >
      <div className="w-4/5 p-1 flex flex-row gap-1">
        <Image src={userIcon} alt="user" className="rounded-lg w-14" />
        <div className="flex flex-col justify-between w-full font-semibold text-lg ">
          <h4 className="mt-1 mb-[0.5] text-[#333333]">
            {room?.type === "group"
              ? room?.name
              : room?.members?.find(
                  (member: userType) => member._id !== currentUser?._id
                )?.name}
          </h4>
          <p className="font-semibold text-sm text-[#8C8C8C]">
            {recentMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
      <div className="w-1/5 p-1 flex flex-end">
        <p className="w-full text-gray-400 text-end">
          {recentMessage
            ? new Date(recentMessage?.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ""}
        </p>
      </div>
    </div>
  );
};

export default RoomBox;

