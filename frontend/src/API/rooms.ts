"use server";
import axios from "axios";
import { backendUrl } from "../constants";

export const getPersonalRooms = async (userToken: string | undefined) => {
  console.log("getting rooms");
  console.log(userToken);

  const result = await axios
    .get(backendUrl + "/personal-rooms", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error in fetching rooms");
      console.log(err);

      //   console.log(err);
    });

  return result;
};
export const getGroupRooms = async (userToken: string | undefined) => {
  console.log("getting group rooms");
  // console.log(userToken,"group token");

  const result = await axios
    .get(backendUrl + "/joined-groups", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error in fetching rooms");
      console.log(err);

      //   console.log(err);
    });

  return result;
};

export const joinGroupAPI = async (userToken: string | undefined, groupId: string | undefined) => {
  console.log(userToken,groupId,"join group data");
  const data = { groupId: groupId }
  const result = await axios
    .post(backendUrl + "/join-group", data, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },

    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error in fetching rooms");
      console.log(err);

      //   console.log(err);
    });

  return result;
}
export const getAllGroups = async (userToken: string | undefined) => {
  console.log("getting all groups");
  const result = await axios
    .get(backendUrl + "/all-groups", {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error in fetching rooms");
      console.log(err);

      //   console.log(err);
    });

  return result;
}

export const getGroupMessages = async (userToken: string | undefined, groupId: string, page: number = 1) => {
  try {
    const response = await axios.get(`${backendUrl}/groups/${groupId}/messages`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching group messages:", error);
    return { message: "Failed to fetch messages", error };
  }
};

export const suggestGroups = async (userToken: string | undefined) => {
  console.log("Fetching suggested groups");

  try {
    const response = await axios.get(`${backendUrl}/suggested-groups`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Suggested groups fetched successfully");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching suggested groups:", error);

    if (error instanceof Error) {
      return {
        message: "Failed to fetch suggested groups",
        error: (error as any).response?.data || error.message,
      };
    } else {
      return {
        message: "Failed to fetch suggested groups",
        error: "An unknown error occurred",
      };
    }
  }
};
export const getGroupById = async (userToken: string | undefined, groupId: string | undefined) => {
  console.log("Fetching suggested groups");

  try {
    const response = await axios.get(`${backendUrl}/groups/${groupId}`, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Suggested groups fetched successfully");
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching suggested groups:", error);

    if (error instanceof Error) {
      return {
        message: "Failed to fetch suggested groups",
        error: (error as any).response?.data || error.message,
      };
    } else {
      return {
        message: "Failed to fetch suggested groups",
        error: "An unknown error occurred",
      };
    }
  }
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
    .post(backendUrl + "/create-room", data, {
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
export const createGroupAPI = async (
  userToken: string | undefined,
  data: FormData // Accept FormData instead of a plain object
) => {
  console.log("creating Room");
  console.log(userToken);

  const response = await axios
      .post(backendUrl + "/create-group", data, {
          headers: {
              accept: "*/*",
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'multipart/form-data', // Specify the content type for FormData
          },
      })
      .then((res) => {
          console.log("group created");
          console.log(res.data);
          return res.data;
      })
      .catch((err) => {
          console.log("error in creating room");
          console.log(err.response);
      });
  return response;
};



export const editGroupInfoAPI = async (
  userToken: string | undefined,
  groupId: string,
  updatedFields: {
    name?: string;
    goal?: string;
    members?: (string | undefined)[];
  }
) => {
  console.log("Editing group info");
  console.log(userToken);

  try {
    const response = await axios.put(`${backendUrl}/groups/${groupId}`, updatedFields, {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${userToken}`,
      },
    });

    console.log("Group info updated successfully");
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating group info:", error);

    if (error instanceof Error) {
      return {
        message: "Failed to update group info",
        error: (error as any).response?.data || error.message,
      };
    } else {
      return {
        message: "Failed to update group info",
        error: "An unknown error occurred",
      };
    }
  }
};


