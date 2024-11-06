import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { PlusCircle, Sparkle, X } from "lucide-react";
import { useRouter } from "next/navigation";

import addSvg from "../../../public/svgs/add-circular.svg";
import closeSvg from "../../../public/svgs/cross.svg";
import sendSmall from "../../../public/svgs/send-small.svg";
import userSvg from "../../../public/svgs/user.svg";
import refersh from "../../../public/svgs/refresh.svg";
import chatAdd from "../../../public/svgs/chat-add.svg";

import { roomType, userType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import { getAllGroups, joinGroupAPI, getGroupRooms } from "@/API/rooms";
import { setAllUsers } from "@/redux/slices/allUsers";
import { updateRooms } from "@/redux/slices/roomsSlice";
import SkeletonLoader from "./../skeletonLoader";
import { updateAllGroups, updateGroups } from "@/redux/slices/groupRoomSlice";
import { ModalState } from "@/app/(home)/groups/page";


export type groupRoomT = {
  setIsModal: Dispatch<SetStateAction<ModalState>>;
  isModal: ModalState
}

export default function AddGroupRoom({ setIsModal,
  isModal }: groupRoomT) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [localGroup, setLocalGroup] = useState<any | null>();
  
  const allGroups = useSelector((state: stateType) => state.allGroups);
  const [adding, setAdding] = useState(-1);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: stateType) => state.user.user);
  const [searchTerm, setSearchTerm] = useState("");

  const getGroups = async () => {
    allGroups?.length > 0 ? setRefreshing(true) : setLoading(true);
    const allGroup = await getAllGroups(Cookies.get("userToken"));
    setLocalGroup(allGroup);
    console.log(allGroup);

    dispatch(updateAllGroups(allGroup));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    getGroups();
  }, [allGroups,dispatch]);

  const joinGroup = async (index: number) => {
    if (adding === -1) {
      setAdding(index);
      const result = await joinGroupAPI(
        Cookies.get("userToken"),
        localGroup[index]._id
      );
      const newGroups = await getGroupRooms(Cookies.get("userToken"));

      dispatch(updateGroups(newGroups));
      setIsModal({
        addGroup: false,
        createGroup: false,
        suggestGroup: false,
        editGroup: false
      })
      setAdding(-1);
    }
  };

  const handleCreateGroup = async () => {
    setIsModal({
      addGroup: false,
      createGroup: true,
      suggestGroup: false,
      editGroup: false
    })
  }
  const handleSuggestedGroup = async () => {
    setIsModal({
      addGroup: false,
      createGroup: false,
      suggestGroup: true,
      editGroup: false
    })
  }

  const filteredGroups = allGroups?.length > 0 ?allGroups?.filter((group: any | undefined) =>
    group && group?.name.toLowerCase().includes(searchTerm.toLowerCase())) : localGroup?.filter((group: any | undefined) =>
    group && group?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isModal.addGroup && (
        <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
          <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button onClick={handleCreateGroup} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <PlusCircle size={20} />
                Create Group
              </button>
              <button onClick={handleSuggestedGroup} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                <Sparkle size={20} />
                Suggested Group
              </button>

              <button onClick={() => setIsModal({
                addGroup: false,
                createGroup: false,
                suggestGroup: false,
                editGroup: false
              })} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <h5 className="text-xl mt-6 font-bold leading-none text-gray-900 dark:text-white">
              All Groups
            </h5>
            <div className="my-4">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="flow-root">
              {filteredGroups?.length > 0 ? (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {filteredGroups?.map((userObj: any, index: number) => {
                    const isMember = userObj?.members?.includes(currentUser?._id);

                    return (
                      <li className="py-3 sm:py-4" key={userObj._id}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Image
                              className="w-10 h-10 rounded-full"
                              src={userSvg}
                              alt="User"
                            />
                          </div>
                          <div className="flex-1 min-w-0 ms-2">
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                              {userObj?.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {userObj?.email}
                            </p>
                          </div>
                          {!isMember && (
                            <div
                              onClick={() => joinGroup(index)}
                              className={`inline-flex rounded-lg ${adding !== index && "hover:bg-[#615EF0]"
                                } ${adding !== -1 && " cursor-not-allowed"
                                }  items-center text-base font-semibold text-gray-900 dark:text-white`}
                            >
                              {adding === index ? (
                                <div
                                  className="inline-block text-[#615EF0] mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                  role="status"
                                >
                                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <Image
                                  src={chatAdd}
                                  alt=""
                                  className="w-10 cursor-pointer h-10"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <>
                  {allGroups?.length === 0 && loading ? (
                    <SkeletonLoader />
                  ) : (
                    <p className="text-center my-4">No Group</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="hidden lg:block px-8 pt-2 h-[10%]">
        <button
          onClick={() => setIsModal({
            addGroup: true,
            createGroup: false,
            suggestGroup: false,
            editGroup: false
          })}
          type="button"
          className="w-full flex justify-center gap-2 items-center text-white rounded-md py-2 font-medium text-lg bg-[#615EF0]"
        >
          <Image className="w-8 h-8" src={addSvg} alt="" /> Add Group
        </button>
      </div>
    </>
  );
}