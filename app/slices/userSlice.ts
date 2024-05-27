import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { appUser } from "../../constants";


const initialState: appUser = {};

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {

        addUserToStore: (state, action: PayloadAction<appUser>) => {

            const user = action.payload // Add unique
            
            return state = user

        },
       

    }
})

export const { addUserToStore } = userSlice.actions
export default userSlice.reducer