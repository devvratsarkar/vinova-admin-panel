// countrySlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    country: localStorage.getItem("country") || "IR"
}

export const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {
        setCountry: (state, action) => {
            state.country = action.payload
            localStorage.setItem("country", action.payload)
        }
    }
})

export const { setCountry } = countrySlice.actions
export default countrySlice.reducer
