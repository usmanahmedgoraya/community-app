import { configureStore } from "@reduxjs/toolkit";
import userReducer from "@/redux/slices/userSlice"
import allUsersReducer from "@/redux/slices/allUsers"
import roomsReducer from "@/redux/slices/roomsSlice"
import { selectedRoomReducer } from "@/redux/slices/roomsSlice";
import  currentMessagesReducer from "./slices/messagesSlice";
import groupRoomSlice, { allGroupsSlice, currentGroupMessagesReducer, selectGroup, selectedGroupReducer, suggestedGroupsReducer } from "./slices/groupRoomSlice";



export const store = configureStore({
    reducer : {
        user : userReducer,
        allGroups:allGroupsSlice.reducer,
        suggestGroups:suggestedGroupsReducer,
        groups:groupRoomSlice,
        selectGroup:selectedGroupReducer,
        currentGroupMessages:currentGroupMessagesReducer,   
        allUsers : allUsersReducer,
        rooms : roomsReducer,
        selectedRoom : selectedRoomReducer,
        currentMessages : currentMessagesReducer
    }
})