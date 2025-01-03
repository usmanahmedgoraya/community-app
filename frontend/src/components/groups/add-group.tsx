import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { PlusCircle, Sparkle, X } from "lucide-react";

import addSvg from "../../../public/svgs/add-circular.svg";
import userSvg from "../../../public/svgs/user.svg";
import chatAdd from "../../../public/svgs/chat-add.svg";

import { roomType, userType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import { getAllGroups, joinGroupAPI, getGroupRooms } from "@/API/rooms";
import { updateAllGroups, updateGroups } from "@/redux/slices/groupRoomSlice";
import SkeletonLoader from "./../skeletonLoader";
import { ModalState } from "@/app/(home)/groups/page";

export type groupRoomT = {
  setIsModal: Dispatch<SetStateAction<ModalState>>;
  isModal: ModalState;
};

export default function AddGroupRoom({ setIsModal, isModal }: groupRoomT) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const allGroups = useSelector((state: stateType) => state.allGroups);
  const currentUser = useSelector((state: stateType) => state.user.user);

  // Fetch all groups
  const getGroups = async () => {
    setLoading(true);
    const allGroup = await getAllGroups(Cookies.get("userToken"));
    dispatch(updateAllGroups(allGroup));
    setLoading(false);
  };

  useEffect(() => {
    if (isModal.addGroup) {
      getGroups(); // Refresh groups list each time the modal opens
    }
  }, [isModal.addGroup,adding]);

  // Handle joining a group
  const joinGroup = async (id: number) => {
    if (adding === null) {
      setAdding(id);

      try {
        // Join the group
        const joinedGroup = await joinGroupAPI(Cookies.get("userToken"), id.toString());

        // Refetch all joined groups
        const updatedGroups = await getGroupRooms(Cookies.get("userToken"));
        dispatch(updateGroups(updatedGroups));

        // Optionally, refetch all available groups to update the filtered list
        await getGroups();
      } catch (error) {
        console.error("Error joining group:", error);
      } finally {
        setAdding(null);
      }
    }
  };
  

  // Filter groups based on search term and membership
  const filteredGroups = allGroups?.filter((group: any) => {
    const isMember = group?.members?.includes(currentUser?._id);
    const matchesSearch =
      group?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group?.goal.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && !isMember;
  });

  return (
    <>
      {isModal.addGroup && (
        <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
          <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setIsModal({ addGroup: false, createGroup: true, suggestGroup: false, editGroup: false })
                }
                className="flex items-center border p-3 rounded-md hover:bg-white gap-2 text-blue-600 hover:text-blue-800"
              >
                <PlusCircle size={20} />
                Create Group
              </button>
              <button
                onClick={() =>
                  setIsModal({ addGroup: false, createGroup: false, suggestGroup: true, editGroup: false })
                }
                className="flex items-center border p-3 rounded-md hover:bg-white gap-2 text-blue-600 hover:text-blue-800"
              >
                <Sparkle size={20} />
                Suggested Group
              </button>
              <button
                onClick={() =>
                  setIsModal({ addGroup: false, createGroup: false, suggestGroup: false, editGroup: false })
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <h5 className="text-xl mt-6 font-bold leading-none text-gray-900 dark:text-white">All Groups</h5>
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
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredGroups.map((group: any, index: number) => (
                    <li className="py-3 sm:py-4" key={group._id}>
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={group.imageUrl || userSvg}
                          alt="Group"
                        />
                        <div className="flex-1 min-w-0 ms-2">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {group.name}
                          </p>
                          <p className="text-xs font-medium text-gray-900 truncate dark:text-gray-400">
                            {group.goal}
                          </p>
                        </div>
                        <button
                          onClick={() => joinGroup(group._id)}
                          disabled={adding === index}
                          className={`inline-flex rounded-lg items-center ${adding === group._id ? "cursor-not-allowed opacity-50" : "hover:bg-[#615EF0]"
                            }`}
                        >
                          {adding === group._id ? (
                            <div
                              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
                              role="status"
                            >
                              <span className="visually-hidden"></span>
                            </div>
                          ) : (
                            <Image src={chatAdd} alt="Add Group" className="w-10 h-10" />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center my-4 text-white">No Groups Found</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="hidden lg:block px-8 pt-2 h-[10%]">
        <button
          onClick={() =>
            setIsModal({
              addGroup: true,
              createGroup: false,
              suggestGroup: false,
              editGroup: false,
            })
          }
          type="button"
          className="w-full flex justify-center gap-2 items-center text-white rounded-md py-2 font-medium text-lg bg-[#615EF0]"
        >
          <Image className="w-8 h-8" src={addSvg} alt="" /> Add Group
        </button>
      </div>
    </>
  );
}
