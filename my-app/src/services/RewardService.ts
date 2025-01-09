//import { IRewardGetAll } from "@/models/Reward";
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { ICreateReward, IRewardGetAll, IUpdateReward } from '@/models/Reward'
import { IFilterReward } from '@/models/Reward'

interface RewardResponse {
    Success: boolean
    Data: any
}
const apiPath = 'https://localhost:44381/api/admin/Reward'

export const rewardApi = createApi({
    reducerPath: 'rewardApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Reward'],
    endpoints: builder => ({
        createBenefit: builder.mutation<void, ICreateReward>({
            query: benefit => ({
                url: 'Create',
                method: 'POST',
                body: benefit
            }),
            invalidatesTags: ['Reward']
        }),

        changeStatusReward: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),

        updateBenefit: builder.mutation<void, IUpdateReward>({
            query: benefit => ({
                url: 'Update',
                method: 'PUT',
                body: benefit
            }),
            invalidatesTags: ['Reward']
        }),
        ChangeStatusManyBenefit: builder.mutation<void, string[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        }),
        GetByIdBenefit: builder.query<RewardResponse, string>({
            query: id => `GetById?id=${id}`
        }),
        getAllRewards: builder.query<RewardResponse, IFilterReward>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                    if (filter.department) params.append('Department', filter.department)
                }

                return `Search?${params.toString()}`
            },
            providesTags: ['Reward'] // Thêm providesTags để cập nhật cache
        })
    })
})

export const {
    useGetAllRewardsQuery,
    useChangeStatusRewardMutation,
    useChangeStatusManyBenefitMutation,
    useCreateBenefitMutation,
    useGetByIdBenefitQuery,
    useUpdateBenefitMutation
} = rewardApi
