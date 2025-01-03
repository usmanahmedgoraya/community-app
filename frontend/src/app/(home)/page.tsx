"use client";
import Image from "next/image";
import searchSvg from "../../../public/svgs/search.svg";
import chatPerson from "../../../public/images/chat-person.jpg";
import online from "../../../public/svgs/online.svg";
import fileUploadIcon from "../../../public/svgs/attach.svg";
import sendIcon from "../../../public/svgs/send.svg";
import RoomsList from "@/components/rooms-list";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import { messageType, roomType, userType } from "@/types/basicTypes";
import io, { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { getRoomChats } from "@/API/chats";
import MobileRoomsList from "@/components/mobile-rooms-list";
import backArrow from "../../../public/svgs/back-arrow.svg";
import { selectRoom, updateRooms } from "@/redux/slices/roomsSlice";
import { updateMessages } from "@/redux/slices/messagesSlice";
import { backendUrl } from "@/constants";

export default function Home() {
  const currentRoom = useSelector((state: stateType) => state.selectedRoom);
  const allRooms = useSelector((state: stateType) => state.rooms);
  const currentUser = useSelector((state: stateType) => state.user.user);
  const messages = useSelector((state: stateType) => state.currentMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const dispatch = useDispatch();
  const userToken = Cookies.get("userToken");
  const [socket, setSocket] = useState<Socket | null>(null);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const socketInstance = io(
      `${backendUrl}/personal-rooms`,
      {
        auth: {
          token: userToken,
        },
      }
    );

    socketInstance.on("receive-message", (message) => {
      const roomId = message.room;
      const updatedRooms = allRooms.map((room) => {
        if (room._id === roomId) {
          const updatedMessages = room.recentMessages
            ? [...room.recentMessages, message]
            : [message];
          return {
            ...room,
            recentMessages: updatedMessages,
          };
        }
        return room;
      });
      dispatch(updateMessages(message));
      dispatch(updateRooms(updatedRooms));
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [userToken, allRooms, dispatch]);
  useEffect(() => {
    socket?.emit("join-room", currentRoom._id);
  }, [currentRoom, socket]);

  const handleSendMessage = () => {
    if (socket && newMessage.length > 0) {
      const messageData = {
        roomId: currentRoom._id,
        content: newMessage,
        senderId: currentUser?._id,
      };
      socket.emit("send-message", messageData);

      setNewMessage("");
    }
  };

  return (
    <>
      <div className=" lg:w-[25%] h-[80%] lg:h-screen w-full border-r-2 border-[#F5F6F7]">
        {/* Messages Number Box */}
        {currentRoom && JSON.stringify(currentRoom) === JSON.stringify({}) ? (
          <>
            {/* Search Box */}
            <div className=" px-8 lg:hidden w-full py-2 lg:h-[10%] h-[10%]">
              <div className=" bg-[#F5F6F7] flex flex-row gap-3 w-full text-xl h-full px-5 rounded-md">
                <Image
                  src={searchSvg}
                  alt="search"
                  className="h-full lg:w-7 w-5"
                />
                <input
                  placeholder="Search people"
                  type="text"
                  className=" bg-[#F5F6F7] w-4/5 focus:outline-none h-full text-lg"
                />
              </div>
            </div>
            <MobileRoomsList />
          </>
        ) : (
          <div className="w-full h-full block lg:hidden">
            {currentRoom && JSON.stringify(currentRoom) !== JSON.stringify({}) && (
              <>
                <div className="flex flex-row pt-2 justify-start lg:h-[12%] h-[10%] border-b-2 border-[#F5F6F7] gap-4 items-start px-5">
                  <div className=" flex flex-row items-start cursor-pointer">
                    <Image
                      src={backArrow}
                      alt="back"
                      className="w-8"
                      onClick={() => {
                        dispatch(selectRoom({}));
                      }}
                    />
                    <Image
                      src={chatPerson}
                      className=" w-12 rounded-lg"
                      alt="person"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className=" font-semibold text-xl mt-[0.5]">
                      {currentRoom?.type === "group"
                        ? currentRoom?.name
                        : currentRoom?.members?.find(
                            (member: userType) => member._id !== currentUser._id
                          )?.name}
                    </p>
                    <div className=" flex flex-row gap-2 justify-start">
                      <Image src={online} alt="anline" />
                      <span className=" text-[#333333] font-semibold text-sm">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  ref={chatBoxRef}
                  className=" w-full flex flex-col h-[80%] overflow-y-scroll gap-1 p-6"
                >
                  {messages?.map((message, index) => {
                    
                    return (
                      <>
                        {currentRoom && currentUser && message.sender === currentUser?._id ? (
                          <>
                            {currentRoom && currentUser && messages[index - 1]?.sender ===
                            currentUser?._id ? (
                              <div className=" w-full flex flex-row-reverse gap-4 items-start">
                                <div className="px-4 max-w-[70%] radius-without-right-top me-16 mb-2 py-2 bg-[#615EF0] text-[#FFFFFF]">
                                  {message.content}
                                </div>
                              </div>
                            ) : (
                              <div className=" w-full mt-4 justify-start flex flex-row-reverse gap-4 items-start">
                                <Image
                                  src={chatPerson}
                                  className=" w-12 rounded-lg h-12"
                                  alt=""
                                />
                                <div className="px-4 h-10 max-w-[70%] radius-without-right-top py-2 bg-[#615EF0] text-[#FFFFFF]">
                                  {message.content}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {currentRoom && currentUser && messages[index - 1]?.sender ===
                            currentRoom?.members?.find(
                              (member: userType) =>
                                member._id !== currentUser._id
                            )?._id ? (
                              <div className="w-full flex flex-row gap-4">
                                <div className="px-4 max-w-[70%] ms-16 mb-2 radius-without-left-top py-2 bg-[#F5F6F7] text-[#333333]">
                                  {message.content}
                                </div>
                              </div>
                            ) : (
                              <div className=" flex mt-4 flex-row items-start gap-4 w-full">
                                <Image
                                  src={chatPerson}
                                  className=" w-12 rounded-lg h-12"
                                  alt=""
                                />
                                <div className="px-4 mb-2 radius-without-left-top max-w-[70%] py-2 bg-[#F5F6F7] text-[#333333]">
                                  {message.content}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })}
                </div>
                <div className=" h-[12%] w-full flex flex-row px-8 items-center gap-4 justify-start">
                  <div className=" w-[4%]">
                    <Image
                      src={fileUploadIcon}
                      className=" w-full h-6"
                      alt=""
                    />
                  </div>
                  <div className=" w-[95%] px-4 p-3 flex flex-row justify-between rounded-lg bg-white border-2 border-[#F5F6F7]">
                    <input
                      value={newMessage}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newMessage.length > 0) {
                          handleSendMessage();
                        }
                      }}
                      onChange={(e) => setNewMessage(e.target.value)}
                      type="text"
                      placeholder="Type Here.."
                      className="w-[90%] focus:outline-none"
                    />
                    {newMessage?.length > 0 && (
                      <Image
                        onClick={handleSendMessage}
                        src={sendIcon}
                        alt=""
                        className="w-8 cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <div className="text-center hidden lg:flex flex-row justify-center lg:h-[12%] h-[4%] border-b-2 border-[#F5F6F7] items-center gap-3 lg:py-10 py-3">
          <p className=" font-semibold text-xl">Messages</p>
          <span className="px-2 py-1 h-7 bg-[#F5F6F7] rounded-full font-semibold text-sm">
            12
          </span>
        </div>

        {/* Search Box */}
        <div className=" px-8 hidden lg:block w-full py-2 lg:h-[10%] h-[6%]">
          <div className=" bg-[#F5F6F7] flex flex-row gap-3 w-full text-xl h-full px-5 rounded-md">
            <Image src={searchSvg} alt="search" className="h-full lg:w-7 w-5" />
            <input
              placeholder="Search people"
              type="text"
              className=" bg-[#F5F6F7] w-4/5 focus:outline-none h-full text-lg"
            />
          </div>
        </div>
        <RoomsList />
      </div>

      <div className="w-[70%] hidden lg:flex flex-col items-start">
        {currentRoom && currentUser && JSON.stringify(currentRoom) !== JSON.stringify({}) ? (
          <>
            <div className="flex flex-row justify-start h-[12%] border-b-2 border-[#F5F6F7] gap-4 items-center px-5">
              <div className="">
                <Image
                  src={chatPerson}
                  className=" w-12 rounded-lg"
                  alt="person"
                />
              </div>
              <div className="flex flex-col">
                <p className=" font-semibold text-xl mt-[0.5]">
                  {currentRoom && currentUser && currentRoom?.type === "group"
                    ? currentRoom?.name
                    : currentRoom?.members?.find(
                        (member: userType) => member._id !== currentUser._id
                      )?.name}
                </p>
                <div className=" flex flex-row gap-2 justify-start">
                  <Image src={online} alt="anline" />
                  <span className=" text-[#333333] font-semibold text-sm">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className=" w-full flex flex-col h-[75%] overflow-y-scroll gap-1 p-6">
              {currentRoom && currentUser && messages?.map((message, index) => {
                return (
                  <>
                    {message.sender === currentUser?._id ? (
                      <>
                        {messages[index - 1]?.sender === currentUser?._id ? (
                          <div className=" w-full flex flex-row-reverse gap-4 items-start">
                            <div className="px-4 max-w-[70%] radius-without-right-top me-16 mb-2 py-2 bg-[#615EF0] text-[#FFFFFF]">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className=" w-full mt-4 justify-start flex flex-row-reverse gap-4 items-start">
                            <Image
                              src={chatPerson}
                              className=" w-12 rounded-lg h-12"
                              alt=""
                            />
                            <div className="px-4 h-10 max-w-[70%] radius-without-right-top py-2 bg-[#615EF0] text-[#FFFFFF]">
                              {message.content}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                         {currentRoom && currentUser && messages[index - 1]?.sender ===
                            currentRoom?.members?.find(
                              (member: userType) =>
                                member._id !== currentUser._id
                            )?._id ? (
                              <div className="w-full flex flex-row gap-4">
                                <div className="px-4 max-w-[70%] ms-16 mb-2 radius-without-left-top py-2 bg-[#F5F6F7] text-[#333333]">
                                  {message.content}
                                </div>
                              </div>
                            ) : (
                              <div className=" flex mt-4 flex-row items-start gap-4 w-full">
                                <Image
                                  src={chatPerson}
                                  className=" w-12 rounded-lg h-12"
                                  alt=""
                                />
                                <div className="px-4 mb-2 radius-without-left-top max-w-[70%] py-2 bg-[#F5F6F7] text-[#333333]">
                                  {message.content}
                                </div>
                              </div>
                            )}
                      </>
                    )}
                  </>
                );
              })}
            </div>
            <div className=" h-[12%] w-full flex flex-row px-8 items-center gap-4 justify-start">
              <div className=" w-[4%]">
                <Image src={fileUploadIcon} className=" w-full h-6" alt="" />
              </div>
              <div className=" w-[95%] px-4 p-3 flex flex-row justify-between rounded-lg bg-white border-2 border-[#F5F6F7]">
                <input
                  value={newMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMessage.length > 0) {
                      handleSendMessage();
                    }
                  }}
                  onChange={(e) => setNewMessage(e.target.value)}
                  type="text"
                  placeholder="Type Here"
                  className="w-[90%] focus:outline-none"
                />
                {newMessage?.length > 0 && (
                  <Image
                    onClick={handleSendMessage}
                    src={sendIcon}
                    alt=""
                    className="w-8 cursor-pointer"
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center w-[80%] mx-auto h-full">
            <p>No chats to Show</p>
          </div>
        )}
      </div>
    </>
  );
}
