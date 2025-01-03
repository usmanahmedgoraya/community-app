"use server";
import axios from "axios";
import { backendUrl } from "../constants";
import { userType } from "../types/basicTypes";

export const getAllUsers = async (userToken: string | undefined) => {
  const response = await axios
    .get(backendUrl + "/all-users", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      console.log(res.data,"response data");
      
      
      return res.data;
    })
    .catch((err) => {
      console.log("error in fetching");
      console.log(err);

      //   console.log(err);
    });
  return response;
};
