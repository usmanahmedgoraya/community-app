import Cookies from "js-cookie";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import chatAddIcon from "../../../public/svgs/chat-add.svg";
import userIcon from "../../../public/svgs/user.svg";

import { getGroupRooms, joinGroupAPI, suggestGroups } from "@/API/rooms";
import { updateGroups, updateSuggestGroups } from "@/redux/slices/groupRoomSlice";
import { stateType } from "@/types/stateTypes";
import SkeletonLoader from "./../skeletonLoader";
import { groupRoomT } from "./add-group";


interface Group {
    _id: string;
    name: string;
    email: string;
    members: string[];
}

const SuggestGroup: React.FC<groupRoomT> = ({ setIsModal, isModal }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [adding, setAdding] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [localGroup, setLocalGroup] = useState<Group[]>([]);

    const suggestedGroup = useSelector((state: stateType) => state.suggestGroups);
    const currentUser = useSelector((state: stateType) => state.user.user);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            setRefreshing(suggestedGroup.length > 0);
    
            const suggestGroupResponse = await suggestGroups(Cookies.get("userToken"));
    
            // Check for successful response and set localGroup with the data
            if (suggestGroupResponse.data) {
                setLocalGroup(suggestGroupResponse.data);
                dispatch(updateSuggestGroups(suggestGroupResponse.data));
            } else {
                // Handle error case if needed
                console.error(suggestGroupResponse.error);
            }
    
            setLoading(false);
            setRefreshing(false);
        };
    
        fetchGroups();
    }, [dispatch, suggestedGroup.length]);

    const joinGroup = async (index: number) => {
        if (adding === null) {
            setAdding(index);

            await joinGroupAPI(Cookies.get("userToken"), localGroup[index]._id);

            const updatedGroups = await getGroupRooms(Cookies.get("userToken"));
            dispatch(updateGroups(updatedGroups));

            setIsModal({ addGroup: false, createGroup: false, suggestGroup: false,editGroup: false });
            setAdding(null);
        }
    };

    const filteredGroups = (suggestedGroup.length > 0 ? suggestedGroup : localGroup)
    .filter(group => group?.name && group.name.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <>
            {isModal.suggestGroup && (
                <div className="fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
                    <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <ChevronLeft
                                    size={32}
                                    className="text-white cursor-pointer hover:text-blue-700"
                                    onClick={() => setIsModal({ createGroup: false, addGroup: true, suggestGroup: false,editGroup: false })}
                                />
                                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                                    Suggested Groups
                                </h5>
                            </div>
                        </div>

                        <div className="my-4">
                            <input
                                type="text"
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div className="flow-root">
                            {filteredGroups.length > 0 ? (
                                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredGroups.map((group, index) => {
                                        const isMember = group?.members && group?.members.includes(currentUser._id);

                                        return (
                                            <li className="py-3 sm:py-4" key={group._id}>
                                                <div className="flex items-center">
                                                    <Image className="w-10 h-10 rounded-full" src={userIcon} alt="User" />
                                                    <div className="flex-1 min-w-0 ms-2">
                                                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                            {group.name}
                                                        </p>
                                                        {/* <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                            {group.email}
                                                        </p> */}
                                                    </div>
                                                    {!isMember && (
                                                        <button
                                                            onClick={() => joinGroup(index)}
                                                            disabled={adding !== null}
                                                            className={`inline-flex items-center text-base font-semibold text-gray-900 dark:text-white rounded-lg ${
                                                                adding === index ? "cursor-not-allowed" : "hover:bg-[#615EF0]"
                                                            }`}
                                                        >
                                                            {adding === index ? (
                                                                <span className="inline-block text-[#615EF0] mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]">
                                                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                                                        Loading...
                                                                    </span>
                                                                </span>
                                                            ) : (
                                                                <Image src={chatAddIcon} alt="Add to group" className="w-10 h-10 cursor-pointer" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                loading ? <SkeletonLoader /> : <p className="text-center my-4 text-white">No Group</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SuggestGroup;
