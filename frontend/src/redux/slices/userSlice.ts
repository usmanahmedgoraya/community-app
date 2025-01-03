import { userType } from "@/types/basicTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: userType = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (_state: any, action: PayloadAction<userType>) => {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
