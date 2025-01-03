'use client';

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import closeSvg from "../../../public/svgs/cross.svg";
import defaultAvatar from "../../../public/svgs/defaultAvatar.svg"; // Placeholder for users without an avatar
import { stateType } from "@/types/stateTypes";
import { groupRoomT } from "./add-group";
import { useEffect, useState } from "react";

export default function GroupMemberComponent({ setIsModal, isModal }: groupRoomT) {
    const allUsers = useSelector((state: stateType) => state.allUsers);
    const currentGroup = useSelector((state: stateType) => state.selectGroup);
    const [groupMembers, setGroupMembers] = useState<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setGroupMembers(currentGroup?.members);
    }, [currentGroup, dispatch]);

    if (!isModal.editGroup) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen backdrop-blur-sm flex justify-center items-center">
            <div className="h-[85%] w-[90%] max-w-[600px] p-6 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 overflow-x-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h5 className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">Group Details</h5>
                    <Image
                        src={closeSvg}
                        alt="Close"
                        onClick={() => setIsModal({
                            addGroup: false,
                            createGroup: false,
                            suggestGroup: false,
                            editGroup: false
                        })}
                        className="w-8 h-8 cursor-pointer"
                    />
                </div>

                {/* Group Image */}
                {currentGroup?.imageUrl && (
                    <div className="mb-4 w-full flex justify-center">
                        <img
                            src={currentGroup?.imageUrl}
                            alt={currentGroup?.name}
                            className="rounded-full w-48 h-48 object-cover"
                        />
                    </div>
                )}

                <div className="space-y-6 overflow-y-auto max-h-[100%]"> {/* Added overflow-y-auto for scrolling */}
                    {/* Group Name */}
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Group Name</h6>
                        <p className="text-base text-gray-600 dark:text-gray-400">{currentGroup?.name}</p>
                    </div>

                    {/* Group Goals */}
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Group Goals</h6>
                        <p className="text-base text-gray-600 dark:text-gray-400">{currentGroup?.goal}</p>
                    </div>

                    {/* Members */}
                    <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-700">
                        <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Members</h6>
                        <ul className="space-y-2 mt-2">
                            {groupMembers?.map((userId: string) => {
                                const user = allUsers.find((u) => u._id === userId);
                                return user ? (
                                    <li key={user._id} className="flex items-center space-x-4 p-2 rounded-md justify-between ">
                                        {/* <Image
                                            src={user.avatar || defaultAvatar} // Display user's avatar or default avatar
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full object-cover"
                                        /> */}
                                        <span className="text-gray-700 dark:text-gray-300">{user.name}</span>
                                        {user._id === currentGroup?.admin && (
                                            <span className="ml-auto text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                                (Admin)
                                            </span>
                                        )}
                                    </li>
                                ) : null;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
