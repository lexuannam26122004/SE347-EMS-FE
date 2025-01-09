import { IWorkingRulesCreate, IWorkingRulesUpdate } from '@/models/WorkingRules'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface WorkingRulesResponse {
    Success: boolean
    Data: any
}

export interface IFilter {
    isActive?: boolean
    createdDate?: Date
    createdBy?: string
    pageSize?: number
    pageNumber?: number
    sortBy?: string
    isDescending?: boolean
    keyword?: string
    name?: string
}

const apiPath = 'https://localhost:44381/api/admin/WorkingRules'

export const WorkingRulesApi = createApi({
    reducerPath: 'WorkingRulesApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['WorkingRules'],
    endpoints: builder => ({
        createWorkingRules: builder.mutation<void, IWorkingRulesCreate>({
            query: WorkingRules => ({
                url: 'Create',
                method: 'POST',
                body: WorkingRules
            })
        }),

        getByIdWorkingRules: builder.query<WorkingRulesResponse, number>({
            query: id => `GetById?id=${id}`
        }),

        updateWorkingRules: builder.mutation<void, IWorkingRulesUpdate>({
            query: WorkingRules => ({
                url: 'Update',
                method: 'PUT',
                body: WorkingRules
            })
        }),
        deleteWorkingRules: builder.mutation<void, number>({
            query: id => ({
                url: `Remove/${id}`,
                method: 'DELETE'
            })
        }),
        deleteManyWorkingRuless: builder.mutation<void, number[]>({
            query: ids => ({
                url: 'DeleteMany',
                method: 'DELETE',
                body: { Ids: ids }
            })
        }),
        changeStatus: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),

        getAllWorkingRules: builder.query<WorkingRulesResponse, IFilter | void>({
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
                    if (filter.name) params.append('Name', filter.name)
                }
                return `Search?${params.toString()}`
            }
        })
    })
})

export const {
    useGetAllWorkingRulesQuery,
    useGetByIdWorkingRulesQuery,
    useCreateWorkingRulesMutation,
    useUpdateWorkingRulesMutation,
    useDeleteWorkingRulesMutation,
    useDeleteManyWorkingRulessMutation,
    useChangeStatusMutation
} = WorkingRulesApi
