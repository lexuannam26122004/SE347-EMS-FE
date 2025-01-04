import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'

export const countNewNotificationSlice = createSlice({
    name: 'countNewNotificationSlice',
    initialState: 0,
    reducers: {
        updateCountNewNotification: (state, action) => action.payload,
        resetCountNewNotification: () => 0,
        increasingCountNewNotification: state => state + 1
    }
})

export const countNewNotificationSelector = (state: RootState) => state.countNewNotificationSlice
