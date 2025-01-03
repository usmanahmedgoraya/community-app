import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserType {
    id: string;
    name: string;
}

const initialState: UserType[] = [];

const allUsersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setAllUsers: (_state: UserType[], action: PayloadAction<UserType[]>) => {
            return action.payload;
        },
    },
});

export const { setAllUsers } = allUsersSlice.actions;

export default allUsersSlice.reducer;
