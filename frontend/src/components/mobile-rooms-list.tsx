"use client";

import Image from "next/image";
import chatPerson from "../../public/images/chat-person.jpg";
import { useEffect, useState } from "react";
import { getPersonalRooms} from "@/API/rooms";
import AddPersonalRoom from "./add-personal-room";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { updateRooms } from "@/redux/slices/roomsSlice";
import { roomType, userType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import SkeletonLoader from "./skeletonLoader";
import RoomBox from "./roomBox";
import AddPersonalRoomMobile from "./mobile-add-people";

export default function MobileRoomsList() {
  const [loading, setLoading] = useState(true);
  const allRooms = useSelector((state: stateType) => state.rooms);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: stateType) => state.user);

  const fetchRooms = async () => {
    const newRooms = await getPersonalRooms(Cookies.get("userToken"));
    dispatch(updateRooms(newRooms));
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
            {allRooms?.map((room: roomType) => {
              return (
                <>
                  <RoomBox room={room} />
                </>
              );
            })}
          </>
        )}
      </div>
      <AddPersonalRoomMobile />
    </>
  );
}
