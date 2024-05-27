import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";


const initialState : string = ''


export const PaymentURL = createSlice({
    name: "Payment URL",
    initialState,
    reducers: {
        setPaymentURL: (state, action: PayloadAction<string>) => {
            
            const url = action.payload
            
            return url

        },
     

    }
});




export const { setPaymentURL } = PaymentURL.actions
export default PaymentURL.reducer 