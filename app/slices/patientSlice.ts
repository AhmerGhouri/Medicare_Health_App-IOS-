import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { checkedData } from "../../constants";


const initialState: checkedData = {};

export const patientSlice = createSlice({
    name : "patient",
    initialState,
    reducers : {

        addPatientToStore: (state, action: PayloadAction<checkedData>) => {

            const patient = action.payload // Add unique
            
            return state = patient

        },
        clearPatientToStore : (state) => {

            return state = initialState

        }
       

    }
})

export const { addPatientToStore , clearPatientToStore} = patientSlice.actions
export default patientSlice.reducer