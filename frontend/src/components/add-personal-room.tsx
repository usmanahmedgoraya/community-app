import { useEffect, useState } from "react";
import addSvg from "../../public/svgs/add-circular.svg";
import closeSvg from "../../public/svgs/cross.svg";
import Image from "next/image";
import sendSmall from "../../public/svgs/send-small.svg";
import { userType } from "@/types/basicTypes";
import { useDispatch, useSelector } from "react-redux";
import { stateType } from "@/types/stateTypes";
import { getAllUsers } from "@/API/users";
import { createRoomAPI, getPersonalRooms} from "@/API/rooms";
import Cookies from "js-cookie";
import { setAllUsers } from "@/redux/slices/allUsers";
import userSvg from "../../public/svgs/user.svg";
import refersh from "../../public/svgs/refresh.svg";
import chatAdd from "../../public/svgs/chat-add.svg";
import SkeletonLoader from "./skeletonLoader";
import { updateRooms } from "@/redux/slices/roomsSlice";

export default function AddPersonalRoom() {
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const users = useSelector((state: stateType) => state.allUsers);
  const [adding, setAdding] = useState(-1);
  const dispatch = useDispatch();
  const getUsers = async () => {
    users?.length > 0 ? setRefreshing(true) : setLoading(true);
    const newUsers = await getAllUsers(Cookies.get("userToken"));
    console.log(newUsers);
    
    dispatch(setAllUsers(newUsers));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const createRoom = async (index: number) => {
    if (adding === -1) {
      setAdding(index);
      const result = await createRoomAPI(
        Cookies.get("userToken"),
        [users[index]._id],
        "personal"
      );
      const newRooms = await getPersonalRooms(Cookies.get("userToken"));
      dispatch(updateRooms(newRooms));
      setAdd(false);
      setAdding(-1);
    }
  };

  return (
    <>
      {add && (
        <div className="  fixed top-0 left-0 w-screen h-screen backdrop-blur flex justify-center items-center pt-10">
          <div className="h-[85%] w-[500px] overflow-y-scroll max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl flex justify-start gap-2 cursor-pointer flex-row items-center font-bold leading-none text-gray-900 dark:text-white">
                All Users{" "}
                {(!refreshing) ? (
                  <Image
                    onClick={getUsers}
                    className=" w-8 h-8"
                    src={refersh}
                    alt="reload"
                  />
                ) : (
                  <>
                    {(refreshing && !loading) && (
                      <div
                        className="inline-block ms-2 text-[#615EF0] h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status"
                      >
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                          Loading...
                        </span>
                      </div>
                    )}
                  </>
                )}
              </h5>
              <Image
                className="w-10 h-10 cursor-pointer"
                onClick={() => {
                  setAdding(-1);
                  setRefreshing(false);
                  setAdd(false);
                }}
                src={closeSvg}
                alt=""
              />
            </div>
            <div className="flow-root">
              {users?.length > 0 ? (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 dark:divide-gray-700"
                >
                  {users?.map((userObj: userType, index: number) => {
                    return (
                      <li className="py-3 sm:py-4" key={index}>
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
                          <div
                            onClick={() => {
                              createRoom(index);
                            }}
                            className={`inline-flex rounded-lg ${
                              adding !== index && "hover:bg-[#615EF0]"
                            } ${
                              adding !== -1 && " cursor-not-allowed"
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
                                className="w-10 cursor-pointer  h-10"
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <>
                  {users?.length === 0 && loading ? (
                    <SkeletonLoader />
                  ) : (
                    <p className=" text-center my-4">No Users</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className=" hidden lg:block px-8 pt-2 h-[10%]">
        <button
          onClick={() => setAdd(true)}
          type="button"
          className="w-full flex justify-center gap-2 items-center text-white rounded-md py-2 font-medium text-lg bg-[#615EF0]"
        >
          <Image className=" w-8 h-8" src={addSvg} alt="" /> Add People
        </button>
      </div>
    </>
  );
}
