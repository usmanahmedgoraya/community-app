import Cookies from "js-cookie";
import { PlusCircle, Sparkle, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import userSvg from "../../../public/svgs/user.svg";

import { getAllGroups, getGroupRooms, joinGroupAPI } from "@/API/rooms";
import { ModalState } from "@/app/(home)/groups/page";
import { updateAllGroups, updateGroups } from "@/redux/slices/groupRoomSlice";
import { stateType } from "@/types/stateTypes";
import SkeletonLoader from "../skeletonLoader";

export type groupRoomT = {
  setIsModal: Dispatch<SetStateAction<ModalState>>;
  isModal: ModalState;
};

export default function MobileAddGroupRoom({ setIsModal, isModal }: groupRoomT) {
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const allGroups = useSelector((state: stateType) => state.allGroups);
  const currentUser = useSelector((state: stateType) => state.user.user);

  const getGroups = async () => {
    setLoading(true);
    const allGroup = await getAllGroups(Cookies.get("userToken"));
    dispatch(updateAllGroups(allGroup));
    setLoading(false);
  };

  useEffect(() => {
    if (isModal.addGroup) {
      getGroups();
    }
  }, [isModal.addGroup]);

  const joinGroup = async (groupId: string) => {
    if (adding === null) {
      setAdding(parseInt(groupId));
      try {
        await joinGroupAPI(Cookies.get("userToken"), groupId);
        const updatedGroups = await getGroupRooms(Cookies.get("userToken"));
        dispatch(updateGroups(updatedGroups));
        await getGroups();
      } catch (error) {
        console.error("Error joining group:", error);
      } finally {
        setAdding(null);
      }
    }
  };

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
        <div className="fixed inset-0 w-full h-full flex justify-center items-center backdrop-blur-sm">
          <div className="h-[85%] w-[90%] md:w-[500px] max-w-md overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() =>
                  setIsModal({ addGroup: false, createGroup: true, suggestGroup: false, editGroup: false })
                }
                className="flex items-center border text-[11px] rounded-md text-blue-600 hover:text-blue-800"
              >
                <PlusCircle size={20} />
                <span className="ml-2">Create Group</span>
              </button>
              <button
                onClick={() =>
                  setIsModal({ addGroup: false, createGroup: false, suggestGroup: true, editGroup: false })
                }
                className="flex items-center border p-0.5 rounded-md text-blue-600 hover:text-blue-800"
              >
                <Sparkle size={14} />
                <span className="ml-2 text-[10px]">Suggested Group</span>
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
            <h5 className="text-lg md:text-xl mt-4 font-bold leading-none text-gray-900 dark:text-white">
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
            <div>
              {loading ? (
                <SkeletonLoader />
              ) : filteredGroups.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredGroups.map((group: any) => (
                    <li className="py-3 sm:py-4" key={group._id}>
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={group.imageUrl || userSvg}
                          alt="Group"
                        />
                        <div className="flex-1 min-w-0 ml-2">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {group.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate dark:text-gray-400">
                            {group.goal}
                          </p>
                        </div>
                        <button
                          onClick={() => joinGroup(group._id)}
                          disabled={adding === parseInt(group._id)}
                          className={`ml-2 px-4 py-2 rounded-md ${
                            adding === parseInt(group._id)
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-800 text-white"
                          }`}
                        >
                          {adding === parseInt(group._id) ? "Joining..." : "Join"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center mt-4">No Groups Found</p>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 left-0 w-full px-4">
        <button
          onClick={() =>
            setIsModal({
              addGroup: true,
              createGroup: false,
              suggestGroup: false,
              editGroup: false,
            })
          }
          className="w-full  md:hidden flex justify-center items-center text-white bg-blue-600 rounded-md py-2 font-medium text-lg hover:bg-blue-800"
        >
          <PlusCircle className="w-6 h-6 mr-2 " />
          Add Group
        </button>
      </div>
    </>
  );
}
