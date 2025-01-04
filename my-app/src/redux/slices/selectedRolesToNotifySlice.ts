import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { IAspNetRoleGetAll } from '@/models/AspNetRole'

export const selectedRolesToNotifySlice = createSlice({
    name: 'selectedRolesToNotifySlice',
    initialState: [] as IAspNetRoleGetAll[],
    reducers: {
        updateSelectedRolesToNotifySlice: (state, action) => action.payload
    }
})

export const selectedRolesToNotifySelector = (state: RootState) => state.selectedRolesToNotifySlice
