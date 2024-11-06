"use server";
import axios from "axios";
import { backendUrl } from "../constants";

export const getRoomChats = async (userToken: string | undefined, roomId : string | undefined) => {
  console.log("getting room chats");
  console.log(userToken);

    const result = await axios
      .get(backendUrl + "/rooms/" + roomId + "/chats", {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log('chat response');
        
        console.log(res.data);
        
        return res.data;
      })
      .catch((err) => {
        console.log("error in fetching chats");
        console.log(err);

        //   console.log(err);
      });

    return result;
};

export const createRoomAPI = async (
  userToken: string | undefined,
  members: (string | undefined)[],
  type: string,
  name?: string
) => {
  console.log("creating Room");
  console.log(userToken);
  const data =
    type === "personal"
      ? { name: null, members, type }
      : { name, members, type };

  const response = await axios
    .post(backendUrl + "/rooms", data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      console.log("room created");
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log("error in creating room");
      console.log(err.response);

      //   console.log(err);
    });
  return response;
};
