import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

export interface DriverState {
    driver: string
  }

const initialState: DriverState = {
    driver: ''
}

export const addDriverSlice = createSlice({
    name: 'ADD_DRIVER',
    initialState,
    reducers: {
        addDriver: (state, action) => {
            state.driver = action.payload
            console.log(state.driver)
        }
    }
})

export const { addDriver } = addDriverSlice.actions

export const selectDriver = (state: RootState) => state.ADD_DRIVER.driver

export default addDriverSlice.reducer