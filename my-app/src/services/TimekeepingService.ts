import { createApi } from '@reduxjs/toolkit/query/react'
import { ITimekeepingFilter } from '@/models/Timekeeping'
import { createBaseQuery } from './api'
import { IFilterAttendanceSummary } from '@/models/Timekeeping'

interface TimekeepingResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Timekeeping'

export const timekeepingApi = createApi({
    reducerPath: 'timekeepingApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchTimekeeping: builder.query<TimekeepingResponse, ITimekeepingFilter | void>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize != null) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber != null) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.fullName != null) params.append('FullName', filter.fullName)
                    if (filter.startDate != null) params.append('StartDate', filter.startDate)
                    if (filter.endDate != null) params.append('EndDate', filter.endDate)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `Search?${params.toString()}`
            }
        }),
        getHourlyAttendanceStats: builder.query<TimekeepingResponse, string>({
            query: date => `GetHourlyAttendanceStats?date=${date}`
        }),
        statsDisplay: builder.query<TimekeepingResponse, string>({
            query: date => `StatsDisplay?date=${date}`
        }),
        getTodayAttendanceSummary: builder.query<TimekeepingResponse, string>({
            query: date => `GetTodayAttendanceSummary?date=${date}`
        }),
        getAttendanceSummary: builder.query<TimekeepingResponse, IFilterAttendanceSummary>({
            query: filter => `GetAttendanceSummary?date=${filter.date}&period=${filter.period}`
        })
    })
})

export const {
    useSearchTimekeepingQuery,
    useGetHourlyAttendanceStatsQuery,
    useGetTodayAttendanceSummaryQuery,
    useGetAttendanceSummaryQuery,
    useStatsDisplayQuery
} = timekeepingApi
