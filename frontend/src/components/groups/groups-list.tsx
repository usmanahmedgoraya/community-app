"use client";

import { getGroupRooms } from "@/API/rooms";
import { updateGroups } from "@/redux/slices/groupRoomSlice";
import { groupType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "../skeletonLoader";
import AddGroupRoom, { groupRoomT } from "./add-group";
import GroupBox from "./groupBox";
import CreateGroup from "./create-group";
import SuggestGroup from "./suggest-group";
import EditGroup from "./edit-group";
import GroupMemberComponent from "./GroupMemberComponent";

// Define type for the component's props (if any)
const GroupList = ({ isModal, setIsModal }: groupRoomT) => {
  const [loading, setLoading] = useState<boolean>(true);
  const currentGroup = useSelector((state: stateType) => state.selectGroup);
  const currentUser = useSelector((state: stateType) => state.user.user);
  const allGroups: groupType[] = useSelector((state: stateType) => state.groups);
  const dispatch = useDispatch();

  const fetchGroups = async (): Promise<void> => {
    try {
      setLoading(true);
      const newGroups: groupType[] = await getGroupRooms(Cookies.get("userToken"));
      dispatch(updateGroups(newGroups));
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [dispatch]);

  return (
    <>
      <div className="ps-4 hidden lg:block pe-2 py-2 w-full lg:h-[68%] h-[75%] overflow-y-scroll">
        {loading ? (
          <SkeletonLoader />
        ) : (
          allGroups?.map((group: groupType) => (
            <GroupBox group={group} key={group._id} />
          ))
        )}
      </div>
      <AddGroupRoom setIsModal={setIsModal} isModal={isModal} />
      <CreateGroup setIsModal={setIsModal} isModal={isModal} />
      <SuggestGroup setIsModal={setIsModal} isModal={isModal} />
      {currentGroup && currentGroup.admin?.toString() == currentUser?._id ? (
        <EditGroup setIsModal={setIsModal} isModal={isModal} />
      ) : (
        <GroupMemberComponent setIsModal={setIsModal} isModal={isModal} />
      )}
    </>
  );
};

export default GroupList;
