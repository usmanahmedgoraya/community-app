import { groupType, roomType } from "@/types/basicTypes";
import { stateType } from "@/types/stateTypes";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../../public/svgs/user.svg";
// import { getGroupChats } from "@/API/chats";
import { selectGroup } from "@/redux/slices/groupRoomSlice";
import { addNewMessages } from "@/redux/slices/messagesSlice";

const GroupBox = (props: { group: groupType }) => {
  const { group } = props;
  
  const dispatch = useDispatch();
  const currentUser = useSelector((state: stateType) => state.user.user);

  const getChats = async () => {
    dispatch(addNewMessages(group.recentMessages || []));
    dispatch(selectGroup(group));
  };

  const recentMessage =
    group.recentMessages && group.recentMessages[group.recentMessages?.length - 1];

  return (
    <div
      onClick={getChats}
      className="p-2 m-2 cursor-pointer bg-[#EEF1FF] justify-between rounded-lg flex flex-row"
    >
      <div className="w-4/5 p-1 flex items-center flex-row gap-1">
        <img src={group?.imageUrl || userIcon} width={12} height={12} alt="group" className="rounded-full w-12 h-12 mr-2 object-cover" />
        <div className="flex flex-col justify-between w-full font-semibold text-lg">
          <h4 className="mt-1 mb-[0.5] text-[#333333]">
            {group.name}
          </h4>
          <p className="font-semibold text-sm text-[#8C8C8C]">
            {recentMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
      <div className="w-1/5 p-1 flex flex-end">
        <p className="w-full text-gray-400 text-end">
          {recentMessage
            ? new Date(recentMessage?.timestamp).toLocaleTimeString()
            : ""}
        </p>
      </div>
    </div>
  );
};

export default GroupBox;
