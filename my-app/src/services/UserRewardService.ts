import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'

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
        getMeRewardInfo: builder.query<RewardResponse, { filter: IFilterSysConfiguration; year: number }>({
            query: ({ filter, year }) => {
                const params = new URLSearchParams()

                // Add filter parameters to URL
                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toISOString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                if (year) params.append('year', year.toString())

                return `GetMeRewardInfo?${params.toString()}`
            },
            providesTags: ['Reward']
        })
    })
})

export const { useGetMeRewardInfoQuery } = userRewardApi
