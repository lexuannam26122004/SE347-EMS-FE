import { createApi } from '@reduxjs/toolkit/query/react'
import { ITimeOffCreate, ITimeOffUpdate } from '@/models/TimeOff'
import { createBaseQuery } from './api'
interface TimeOffResponse {
    Success: boolean
    Data: any
}
interface IMonthAndYear {
    Month: number
    Year: number
}

interface IFilter {
    isActive?: boolean
    createdDate?: Date
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
}

const apiPath = 'https://localhost:44381/api/user/UserTimeOff'

export const userTimeOffApi = createApi({
    reducerPath: 'userTimeOffApi',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        searchByUserId: builder.query<TimeOffResponse, IFilter>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toDateString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `SearchByUserId?${params.toString()}`
            }
        }),

        createTimeOffs: builder.mutation<void, ITimeOffCreate>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),
        updateTimeOffs: builder.mutation<void, ITimeOffUpdate>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),

        countTimeOffsInMonthUser: builder.query<TimeOffResponse, IMonthAndYear>({
            query: params => `CountTimeOffsInMonthUser?month=${params.Month}&year=${params.Year}`
        }),

        getByIdTimeOffs: builder.query<TimeOffResponse, number>({
            query: id => `GetById/${id}`
        }),


        changeStatusTimeOffs: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}/status`,
                method: 'PUT'
            })
        })
    })
})

export const {
    useSearchByUserIdQuery,
    useCreateTimeOffsMutation,
    useUpdateTimeOffsMutation,
    useGetByIdTimeOffsQuery,
    useCountTimeOffsInMonthUserQuery,
    useChangeStatusTimeOffsMutation
} = userTimeOffApi
