import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/redux/store'
import { IDepartmentGetAll } from '@/models/Department'

export const selectedDepartmentsToNotifySlice = createSlice({
    name: 'selectedDepartmentsToNotifySlice',
    initialState: [] as IDepartmentGetAll[],
    reducers: {
        updateSelectedDepartmentsToNotifySlice: (state, action) => action.payload
    }
})

export const selectedDepartmentsToNotifySelector = (state: RootState) => state.selectedDepartmentsToNotifySlice
