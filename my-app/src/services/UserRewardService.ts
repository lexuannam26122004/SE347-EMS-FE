import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IFilterReward } from '@/models/Reward'

interface RewardResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/user/UserReward'
export const userRewardApi = createApi({
    reducerPath: 'userRewardApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Reward'],
    endpoints: builder => ({
        getMeRewardInfo: builder.query<RewardResponse, IFilterReward>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.department) params.append('Department', filter.department)
                    if (filter.startDate) params.append('StartDate', filter.startDate)
                    if (filter.endDate) params.append('EndDate', filter.endDate)
                }

                return `GetMeRewardInfo?${params.toString()}`
            },
            providesTags: ['Reward']
        }),
        getSummary: builder.query<RewardResponse, string>({
            query: type => `GetSummary?type=${type}`
        })
    })
})

export const { useGetMeRewardInfoQuery, useGetSummaryQuery } = userRewardApi
