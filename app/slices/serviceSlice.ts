import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../Store/Store";
import { servicesData } from "../../constants";


const shortCode : string =  "";
interface serviceDetail {
    shortCode? : string,
    serviceID? : string
}

// const initialState : serviceDetail = {}

const serviceDetail : serviceDetail = {}
const timeSlot : string = ''
const serviceArea : string = ''


export const ServiceSlice = createSlice({
    name : "shortCode",
    initialState : {
        serviceDetail : serviceDetail,
        timeSlot : timeSlot,
        serviceArea : serviceArea
    },
    reducers : {

        addSerShortCodeToStore : (state, action: PayloadAction<serviceDetail>) => {

            const serShortCode = action.payload // Add unique
            state.serviceDetail = serShortCode;
            // return state.serviceDetail = serShortCode

        },
        addTimeSlot : (state , action : PayloadAction<string>) => {

             const timeSlot = action.payload
             state.timeSlot = timeSlot
            //  console.log("timeSlot" , timeSlot);
            //  return state.timeSlot = timeSlot

        },
        addServiceArea : (state, action : PayloadAction<string>) => {
            const serviceArea = action.payload
            state.serviceArea = serviceArea
            // console.log("addServiceArea" , serviceArea);
        }
       

    }
})
export const { addSerShortCodeToStore , addTimeSlot , addServiceArea } = ServiceSlice.actions
export default ServiceSlice.reducer