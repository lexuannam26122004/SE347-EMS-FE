//import { IRewardGetAll } from "@/models/Reward";
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'
import { ICreateDiscipline, IUpdateDiscipline } from '@/models/Discipline'

interface DisciplineResponse {
    Success: boolean
    Data: any
}
const apiPath = 'https://localhost:44381/api/admin/Discipline'

export const disciplineApi = createApi({
    reducerPath: 'disciplineApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Discipline'],
    endpoints: builder => ({
        createBenefit: builder.mutation<void, ICreateDiscipline>({
            query: benefit => ({
                url: 'Create',
                method: 'POST',
                body: benefit
            }),
            invalidatesTags: ['Discipline']
        }),

        ChangeStatusBenefit: builder.mutation<void, string>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),
        updateBenefit: builder.mutation<void, IUpdateDiscipline>({
            query: benefit => ({
                url: 'Update',
                method: 'PUT',
                body: benefit
            }),
            invalidatesTags: ['Discipline']
        }),
        ChangeStatusManyBenefit: builder.mutation<void, string[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        }),
        GetByIdBenefit: builder.query<DisciplineResponse, string>({
            query: id => `GetById?id=${id}`
        }),
        getAllDisciplines: builder.query<DisciplineResponse, IFilterSysConfiguration>({
            query: filter => {
                const params = new URLSearchParams()

                if (filter) {
                    if (filter.createdBy) params.append('CreatedBy', filter.createdBy)
                    if (filter.createdDate) params.append('CreatedDate', filter.createdDate.toDateString())
                    if (filter.pageSize) params.append('PageSize', filter.pageSize.toString())
                    if (filter.pageNumber) params.append('PageNumber', filter.pageNumber.toString())
                    if (filter.isActive !== undefined) params.append('IsActive', filter.isActive.toString())
                    if (filter.keyword) params.append('Keyword', filter.keyword)
                    if (filter.isDescending !== undefined) params.append('IsDescending', filter.isDescending.toString())
                    if (filter.sortBy) params.append('SortBy', filter.sortBy)
                }

                return `Search?${params.toString()}`
            },
            providesTags: ['Discipline'] // Thêm providesTags để cập nhật cache
        })
    })
})

export const {
    useGetAllDisciplinesQuery,
    useChangeStatusBenefitMutation,
    useCreateBenefitMutation,
    useChangeStatusManyBenefitMutation,
    useGetByIdBenefitQuery,
    useUpdateBenefitMutation
} = disciplineApi
