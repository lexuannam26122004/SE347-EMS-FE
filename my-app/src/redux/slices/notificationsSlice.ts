import { INotificationsForUser } from '@/models/Notifications'
import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [] as INotificationsForUser[],
    reducers: {
        updateNotifications: (state, action) => action.payload
    }
})

export const notificationsSelector = (state: RootState) => state.notifications
