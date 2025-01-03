"use client";

import Image from "next/image";
import chatPerson from "../../public/images/chat-person.jpg";
import { useEffect, useState } from "react";
import { getAllGroups, getPersonalRooms } from "@/API/rooms";
import AddPersonalRoom from "../add-personal-room";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateRooms } from "@/redux/slices/roomsSlice";
import { groupType, roomType, userType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import SkeletonLoader from "../skeletonLoader";
import RoomBox from "../roomBox";
import AddPersonalRoomMobile from "../mobile-add-people";
import GroupBox from "./groupBox";
import AddGroupRoom, { groupRoomT } from "./add-group";
import MobileAddGroupRoom from "./mobile-add-group";
import { updateGroups } from "@/redux/slices/groupRoomSlice";

export default function MobileGroupList({ isModal, setIsModal }: groupRoomT) {
    const [loading, setLoading] = useState(true);
    const allRooms = useSelector((state: stateType) => state.groups);
    const dispatch = useDispatch();
    const currentUser = useSelector((state: stateType) => state.user);

    const fetchRooms = async () => {
        const newRooms = await getAllGroups(Cookies.get("userToken"));
        dispatch(updateGroups(newRooms));
        setLoading(false);
    };

    useEffect(() => {
        if (allRooms?.length === 0 || !allRooms) {
            setTimeout(fetchRooms, 3000);
            fetchRooms();
        }
    }, []);

    return (
        <>
            <div className="ps-4 pe-2 lg:hidden block py-2 w-full lg:h-[68%] h-[80%] overflow-y-scroll">
                {/* Single Chat Person Box  */}
                {(loading && allRooms?.length === 0) ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        {allRooms?.map((group: groupType) => {
                            return (
                                <>
                                    <GroupBox group={group} />
                                </>
                            );
                        })}
                    </>
                )}
            </div>
            <MobileAddGroupRoom setIsModal={setIsModal} isModal={isModal} />
        </>
    );
}
