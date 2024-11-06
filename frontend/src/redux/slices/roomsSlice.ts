import { roomType } from "@/types/basicTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: roomType[] = [];

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateRooms: (_state: roomType[], action: PayloadAction<roomType[]>) => {
      return action.payload;
    },
  },
});

const initialRoom: roomType = {};
export const selectedRoomSlice = createSlice({
  name: "selectedRoom",
  initialState: initialRoom,
  reducers: {
    selectRoom: (_state: roomType, action: PayloadAction<roomType>) => {
      return action.payload;
    },
  },
});

export const { updateRooms } = roomsSlice.actions;
export const { selectRoom } = selectedRoomSlice.actions;
export const selectedRoomReducer = selectedRoomSlice.reducer;

export default roomsSlice.reducer;
