import { configureStore } from "@reduxjs/toolkit";
import { commonDataSlice } from "./slices/commonApiSlice";
import allModalSlice from "./slices/allModalSlice";
import userNotificationSlice from "./slices/userNotificationSlice";
import authSlice from './slices/authSlice'
import languageReducer from './slices/languageSlice'
import { commonApi } from "./services/commonApi";
import { catalogueSlice } from "./services/catalogueSlice";
import { countrySlice } from "./slices/countrySlice";
import { postApiDataSlice } from "./services/allPostApi";
import { optometristSlice } from "./slices/optometristSlice";

export const store = configureStore({
    reducer: {
        [commonApi.reducerPath]: commonApi.reducer,
        [catalogueSlice.reducerPath]: catalogueSlice.reducer,
        [postApiDataSlice.reducerPath]: postApiDataSlice.reducer,
        [commonDataSlice.reducerPath]: commonDataSlice.reducer,
        [optometristSlice.reducerPath]: optometristSlice.reducer,
        auth: authSlice,
        allCommonModal: allModalSlice,
        userNotification: userNotificationSlice,
        country: countrySlice,
        language: languageReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(commonApi.middleware, catalogueSlice.middleware, postApiDataSlice.middleware, commonDataSlice.middleware, optometristSlice.middleware),
    devTools: true
})