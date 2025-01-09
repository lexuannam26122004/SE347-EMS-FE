import { ICreateWorkShift, IFilterWorkShift, IUpdateWorkShift } from '@/models/WorkShift'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface IWorkShiftResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/WorkShift'

export const workShiftApis = createApi({
    reducerPath: 'workShiftApis',
    baseQuery: fetchBaseQuery({ baseUrl: apiPath }),
    endpoints: builder => ({
        SearchWorkShift: builder.query<IWorkShiftResponse, IFilterWorkShift>({
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

                return `Search?${params.toString()}`
            }
        }),
        CreateWorkShift: builder.mutation<void, ICreateWorkShift>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),
        UpdateWorkShift: builder.mutation<void, IUpdateWorkShift>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),
        GetByIdWorkShift: builder.query<IWorkShiftResponse, number>({
            query: id => `GetById?id=${id}`
        }),
        ChangeStatusWorkShift: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),
        ChangeStatusManyWorkShift: builder.mutation<void, number[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        })
    })
})

export const {
    useChangeStatusWorkShiftMutation,
    useCreateWorkShiftMutation,
    useGetByIdWorkShiftQuery,
    useSearchWorkShiftQuery,
    useUpdateWorkShiftMutation,
    useChangeStatusManyWorkShiftMutation
} = workShiftApis
