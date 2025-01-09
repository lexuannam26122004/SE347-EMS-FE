//import { IRewardGetAll } from "@/models/Reward";
import { IFilterReward } from '@/models/Reward'
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
        createDiscipline: builder.mutation<void, ICreateDiscipline>({
            query: benefit => ({
                url: 'Create',
                method: 'POST',
                body: benefit
            }),
            invalidatesTags: ['Discipline']
        }),

        changeStatusDiscipline: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),
        updateIsPenalized: builder.mutation<void, number>({
            query: id => ({
                url: `UpdateIsPenalized?Id=${id}`,
                method: 'PUT'
            })
        }),
        updateDiscipline: builder.mutation<void, IUpdateDiscipline>({
            query: body => ({
                url: 'Update',
                method: 'PUT',
                body: body
            }),
            invalidatesTags: ['Discipline']
        }),
        ChangeStatusManyDiscipline: builder.mutation<void, string[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        }),
        GetByIdDiscipline: builder.query<DisciplineResponse, number>({
            query: id => `GetById?id=${id}`
        }),
        getAllDisciplines: builder.query<DisciplineResponse, IFilterReward>({
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
            providesTags: ['Discipline'] // Thêm providesTags để cập nhật cache
        })
    })
})

export const {
    useGetAllDisciplinesQuery,
    useCreateDisciplineMutation,
    useChangeStatusDisciplineMutation,
    useChangeStatusManyDisciplineMutation,
    useGetByIdDisciplineQuery,
    useUpdateDisciplineMutation,
    useUpdateIsPenalizedMutation
} = disciplineApi
