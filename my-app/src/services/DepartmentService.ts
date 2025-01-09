import { IDepartmentCreate, IDepartmentUpdate } from '@/models/Department'
import { IFilterSysConfiguration } from '@/models/SysConfiguration'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface DepartmentResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/Department'

export const departmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: createBaseQuery(apiPath),
    tagTypes: ['Department'],
    endpoints: builder => ({
        createDepartment: builder.mutation<void, IDepartmentCreate>({
            query: department => ({
                url: 'Create',
                method: 'POST',
                body: department
            }),
            invalidatesTags: ['Department']
        }),

        getByIdDepartment: builder.query<DepartmentResponse, number>({
            query: id => `GetById?id=${id}`
        }),

        updateDepartment: builder.mutation<void, IDepartmentUpdate>({
            query: department => ({
                url: 'Update',
                method: 'PUT',
                body: department
            }),
            invalidatesTags: ['Department']
        }),
        deleteDepartment: builder.mutation<void, number>({
            query: id => ({
                url: `Remove/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Department']
        }),
        deleteManyDepartments: builder.mutation<void, number[]>({
            query: ids => ({
                url: 'DeleteMany',
                method: 'DELETE',
                body: { Ids: ids }
            }),
            invalidatesTags: ['Department']
        }),
        changeStatus: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),
        ChangeStatusManyDepartment: builder.mutation<void, number[]>({
            query: ids => ({
                url: 'ChangeStatusMany',
                method: 'PUT',
                body: { Ids: ids }
            })
        }),
        getAllDepartment: builder.query<DepartmentResponse, IFilterSysConfiguration | void>({
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
            }
        })
    })
})

export const {
    useGetAllDepartmentQuery,
    useGetByIdDepartmentQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
    useDeleteManyDepartmentsMutation,
    useChangeStatusMutation,
    useChangeStatusManyDepartmentMutation
} = departmentApi
