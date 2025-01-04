import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { IAspNetUserGetAll } from '@/models/AspNetUser'

export const selectedUsersToNotifySlice = createSlice({
    name: 'selectedUsersToNotifySlice',
    initialState: [] as IAspNetUserGetAll[],
    reducers: {
        updateSelectedUsersToNotifySlice: (state, action) => action.payload
    }
})

export const selectedUsersToNotifySliceSelector = (state: RootState) => state.selectedUsersToNotifySlice
