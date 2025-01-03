import { messageType, userType } from "@/types/basicTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: messageType[] = [];

export const currentMessagesSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateMessages: (state: messageType[], action: PayloadAction<messageType>) => {
      state.push(action.payload);
    },
    addNewMessages : (_state: messageType[], action: PayloadAction<messageType[]>) => {
      return action.payload
    }
  },
});

export const { updateMessages, addNewMessages } = currentMessagesSlice.actions;

export default currentMessagesSlice.reducer;
