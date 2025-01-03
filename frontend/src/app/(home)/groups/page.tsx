"use client";
import { getGroupMessages, getGroupRooms } from "@/API/rooms";
import GroupList from "@/components/groups/groups-list";
import MobileRoomsList from "@/components/mobile-rooms-list";
import { backendUrl } from "@/constants";
import { selectGroup, setFetchedMessages, updateGroups, updateMessages } from "@/redux/slices/groupRoomSlice";
import { groupType, userType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import Cookies from "js-cookie";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import chatPerson from "../../../../public/images/chat-person.jpg";
import fileUploadIcon from "../../../../public/svgs/attach.svg";
import backArrow from "../../../../public/svgs/back-arrow.svg";
import sendIcon from "../../../../public/svgs/send.svg";
import searchSvg from "./../../../../public/svgs/search.svg";
import EditGroup from "@/components/groups/edit-group";
import MobileGroupList from "@/components/groups/mobile-group-list";

// Define type for the modal state
export interface ModalState {
  addGroup: boolean;
  createGroup: boolean;
  suggestGroup: boolean;
  editGroup?: boolean;
}

export default function Groups() {
  const currentGroup = useSelector((state: stateType) => state.selectGroup);
  const allRooms = useSelector((state: stateType) => state.groups);
  const currentUser = useSelector((state: stateType) => state.user.user);
  const messages = useSelector((state: stateType) => state.currentGroupMessages);
  const [newMessage, setNewMessage] = useState<string>("");
  const dispatch = useDispatch();
  const userToken = Cookies.get("userToken");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isMessageSent, setIsMessageSent] = useState<boolean>(false)
  const [isModal, setIsModal] = useState<ModalState>({
    addGroup: false,
    createGroup: false,
    suggestGroup: false,
    editGroup: false
  });

  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const fetchGroupMessages = async (userToken: string | undefined, groupId: string | undefined, page: Number) => {
    if (userToken && groupId) {
      const messagesData = await getGroupMessages(userToken, groupId, page as number);
      dispatch(setFetchedMessages(messagesData?.messages));
      console.log(messagesData.messages);

    }
  }

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentGroup, messages])



  useEffect(() => {
    const socketInstance = io(`${backendUrl}/group-rooms`, {
      auth: {
        token: userToken,
      },
    })

    socketInstance.on('connect', () => {
      console.log('Connected to group chat socket server')
    })

    socketInstance.on('receive-group-message', (message) => {
      console.log('Received group message:', message)
      dispatch(updateMessages(message))
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [userToken, allRooms, dispatch, isMessageSent]);

  useEffect(() => {
    
    if (socket && currentGroup._id) {
      console.log(`Joining group: ${currentGroup._id}`)
      socket.emit('join-group', currentGroup._id)
    }

    fetchGroupMessages(userToken, currentGroup._id, 1);

  }, [currentGroup, socket])

  const handleSendMessage = () => {

    if (socket && newMessage.length > 0) {
      const messageData = {
        groupId: currentGroup?._id,
        content: newMessage,
        senderId: currentUser?._id,
      };
      console.log(messageData, "messageData");
      setIsMessageSent((prev) => !prev);
      socket.emit("send-group-message", messageData);

      setNewMessage("");
    }
  };

  const handleEditModal = () => {
    setIsModal({
      addGroup: false,
      createGroup: false,
      suggestGroup: false,
      editGroup: true
    })
  }

  return (
    <>
      <div className=" lg:w-[25%] h-[80%] lg:h-screen w-full border-r-2 border-[#F5F6F7]">
        {/* Messages Number Box */}
        {currentGroup && JSON.stringify(currentGroup) === JSON.stringify({admin:""}) ? (
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
            <MobileGroupList isModal={isModal} setIsModal={setIsModal} />
          </>
        ) : (
          <div className="w-full h-full block lg:hidden">
            {currentGroup && JSON.stringify(currentGroup) !== JSON.stringify({admin:""}) && (
              <>
                <div className="flex flex-row pt-2 justify-start lg:h-[12%] border-b-2 border-[#F5F6F7] gap-4 items-start px-5">
                  <div className=" flex flex-row items-start cursor-pointer">
                    <Image
                      src={backArrow}
                      alt="back"
                      className="w-8"
                      onClick={() => {
                        dispatch(selectGroup({
                          admin :""
                        }));
                      }}
                    />
                    <img
                      src={typeof currentGroup?.imageUrl === 'string' ? currentGroup.imageUrl : chatPerson.src}
                      className="w-12 rounded-lg h-12 object-cover"
                      alt="person"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className=" font-semibold text-xl mt-[0.5]">
                      {currentGroup?.type === "group"
                        ? currentGroup?.name
                        : currentGroup?.members?.find(
                          (member: userType) => member._id !== currentUser._id
                        )?.name}
                    </p>
                  </div>
                </div>
                <div
                  ref={chatBoxRef}
                  className=" w-full flex flex-col h-[80%] overflow-y-auto gap-1 p-6"
                >
                  {messages?.map((message, index) => {

                    return (
                      <>
                        {currentGroup && message.sender === currentUser?._id ? (
                          <>
                            {messages[index - 1]?.sender ===
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
                                  className=" w-12 rounded-full h-12"
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
                            {currentGroup && currentUser && messages[index - 1]?.sender ===
                              currentGroup?.members?.find(
                                (member: userType) =>
                                  member?._id !== currentUser?._id
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
                                  className=" w-12 rounded-full h-12"
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
              placeholder="Search Groups"
              type="text"
              className=" bg-[#F5F6F7] w-4/5 focus:outline-none h-full text-lg"
            />
          </div>
        </div>
        <GroupList isModal={isModal} setIsModal={setIsModal} />
      </div>

      <div className="w-[70%] hidden lg:flex flex-col items-start">
        {currentGroup && JSON.stringify(currentGroup) !== JSON.stringify({admin:""}) ? (

          <>
            <div className="flex flex-row justify-start cursor-pointer h-[12%] border-b-2 border-[#F5F6F7] gap-4 items-center px-5" onClick={handleEditModal}>
              <div className="">
                <img
                  src={typeof currentGroup?.imageUrl === 'string' ? currentGroup.imageUrl : chatPerson.src}
                  className=" w-12 rounded-lg h-12 object-cover"
                  alt="person"
                />
              </div>
              <div className="flex flex-col">
                <p className=" font-semibold text-xl mt-[0.5]">
                  {currentGroup?.type === "group"
                    ? currentGroup?.name
                    : currentGroup?.members?.find(
                      (member: userType) => member._id !== currentUser._id
                    )?.name}
                </p>
              </div>
            </div>
            <div className=" w-full flex flex-col h-[75%] overflow-y-scroll gap-1 p-6">
              {messages?.map((message, index) => {
                return (
                  <>
                    {currentGroup && currentUser && message.sender === currentUser?._id ? (
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
                              className=" w-12 rounded-full h-12"
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
                        {currentGroup && currentUser && messages[index - 1]?.sender ===
                          currentGroup?.members?.find(
                            (member: userType) =>
                              member._id !== currentUser._id
                          )?._id ? (
                          <div className=" w-full mt-4 justify-start flex flex-row  items-center">
                            <Image
                              src={chatPerson}
                              className=" w-12 rounded-full h-12"
                              alt=""
                            />
                            <div className="px-4 max-w-[70%] ms-4  radius-without-left-top py-2 bg-[#F5F6F7] text-[#333333]">
                              {message.content}
                            </div>
                          </div>
                        ) : (
                          <div className=" flex mt-4 flex-row items-start gap-4 w-full">
                            <Image
                              src={chatPerson}
                              className=" w-12 rounded-full h-12"
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
