import { groupType, messageType, roomType } from "@/types/basicTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialGroupsState: groupType[] = [];

export const groupsSlice = createSlice({
  name: "groups",
  initialState: initialGroupsState,
  reducers: {
    updateGroups: (_state: groupType[], action: PayloadAction<groupType[]>) => {
      return action.payload;
    },
  },
});


const initialAllGroupsState: groupType[] = [];
export const allGroupsSlice = createSlice({
  name: "allGroups",
  initialState: initialAllGroupsState,
  reducers: {
    updateAllGroups: (_state: groupType[], action: PayloadAction<groupType[]>) => {
      return action.payload;
    },
  },
});
const initialSuggestedGroupsState: groupType[] = [];
export const suggestedGroupsSlice = createSlice({
  name: "suggestGroups",
  initialState: initialSuggestedGroupsState,
  reducers: {
    updateSuggestGroups: (_state: groupType[], action: PayloadAction<groupType[]>) => {
      return action.payload;
    },
  },
});



const initialGroup: groupType = {
  admin: ""
};
export const selectedGroupSlice = createSlice({
  name: "selectedGroup",
  initialState: initialGroup,
  reducers: {
    selectGroup: (_state: groupType, action: PayloadAction<groupType>) => {
      return action.payload;
    },
  },
});

const initialState: messageType[] = [];
export const currentGroupMessagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateMessages: (state: messageType[], action: PayloadAction<messageType>) => {
      state.push(action.payload);
    },
    addNewMessages: (_state: messageType[], action: PayloadAction<messageType[]>) => {
      return action.payload;
    },
    // New action to set fetched data as the state
    setFetchedMessages: (_state: messageType[], action: PayloadAction<messageType[]>) => {
      return action.payload;
    },
  },
});

// export const { updateGroups } = groupsSlice.actions;
export const { selectGroup } = selectedGroupSlice.actions;
export const { updateAllGroups } = allGroupsSlice.actions;
export const { updateGroups } = groupsSlice.actions;
export const { updateSuggestGroups } = suggestedGroupsSlice.actions;
export const { updateMessages, addNewMessages, setFetchedMessages } = currentGroupMessagesSlice.actions;

export const selectedGroupReducer = selectedGroupSlice.reducer;
export const suggestedGroupsReducer = suggestedGroupsSlice.reducer;
export const currentGroupMessagesReducer = currentGroupMessagesSlice.reducer;
export default groupsSlice.reducer;
