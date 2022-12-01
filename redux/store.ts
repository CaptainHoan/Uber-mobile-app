import { configureStore } from "@reduxjs/toolkit";
import addDriverReducer from "./addDriverReducer";

export const store = configureStore({
    reducer: {
        ADD_DRIVER: addDriverReducer
    }
})

export type RootState = ReturnType<typeof store.getState>