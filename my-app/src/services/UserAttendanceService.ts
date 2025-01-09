import { createApi } from '@reduxjs/toolkit/query/react'
import { IFilterTimekeepingForUser } from '@/models/Timekeeping'
import { createBaseQuery } from './api'

interface AttendanceResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserAttendance'

export const userAttendanceApi = createApi({
    reducerPath: 'userAttendanceApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchAttendanceForUser: builder.query<AttendanceResponse, IFilterTimekeepingForUser>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.IsEarly !== undefined) params.append('IsEarly', filter.IsEarly.toString())
                    if (filter.IsLate !== undefined) params.append('IsLate', filter.IsLate.toString())
                    if (filter.IsOnTime !== undefined) params.append('IsOnTime', filter.IsOnTime.toString())
                    if (filter.IsValid !== undefined) params.append('IsValid', filter.IsValid.toString())
                    if (filter.PageSize !== undefined) params.append('PageSize', filter.PageSize.toString())
                    if (filter.PageNumber) params.append('PageNumber', filter.PageNumber.toString())
                    if (filter.StartDate !== undefined) params.append('StartDate', filter.StartDate.toString())
                    if (filter.EndDate) params.append('EndDate', filter.EndDate.toString())
                }

                return `SearchForUser?${params.toString()}`
            }
        }),
        getByDate: builder.query<AttendanceResponse, string>({
            query: date => `GetByDate?Date=${date}`
        }),
        stats: builder.query<AttendanceResponse, string>({
            query: date => `Stats?Date=${date}`
        }),
        createAttendanceUser: builder.mutation<AttendanceResponse, string>({
            query: value => ({
                url: `CreateUser`,
                method: 'POST',
                body: { IPAddress: value }
            })
        }),
        checkout: builder.mutation<AttendanceResponse, number>({
            query: value => ({
                url: 'Checkout',
                method: 'PUT',
                body: { Id: value }
            })
        })
    })
})

export const {
    useSearchAttendanceForUserQuery,
    useCreateAttendanceUserMutation,
    useStatsQuery,
    useCheckoutMutation,
    useGetByDateQuery
} = userAttendanceApi
