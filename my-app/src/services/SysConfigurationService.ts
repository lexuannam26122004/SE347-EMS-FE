import { ICreateSysConfiguration, IFilterSysConfiguration, IUpdateSysConfiguration } from '@/models/SysConfiguration'
import { createApi } from '@reduxjs/toolkit/query/react'
import { createBaseQuery } from './api'

interface ISysConfigurationResponse {
    Success: boolean
    Data: any
}

const apiPath = 'https://localhost:44381/api/admin/SysConfiguration'

export const sysConfigurationApis = createApi({
    reducerPath: 'sysConfigurationApis',
    baseQuery: createBaseQuery(apiPath),
    endpoints: builder => ({
        SearchSysConfiguration: builder.query<ISysConfigurationResponse, IFilterSysConfiguration>({
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
        }),
        CreateSysConfiguration: builder.mutation<void, ICreateSysConfiguration>({
            query: body => ({
                url: `Create`,
                method: 'POST',
                body: body
            })
        }),
        UpdateSysConfiguration: builder.mutation<void, IUpdateSysConfiguration>({
            query: body => ({
                url: `Update`,
                method: 'PUT',
                body: body
            })
        }),
        GetByIdSysConfiguration: builder.query<ISysConfigurationResponse, number>({
            query: id => `GetById?id=${id}`
        }),
        ChangeStatusSysConfiguration: builder.mutation<void, number>({
            query: id => ({
                url: `ChangeStatus/${id}`,
                method: 'PUT'
            })
        }),
        ChangeStatusManySysConfiguration: builder.mutation<void, number[]>({
            query: ids => ({
                url: `ChangeStatusMany`,
                method: 'PUT',
                body: { Ids: ids }
            })
        })
    })
})

export const {
    useChangeStatusSysConfigurationMutation,
    useCreateSysConfigurationMutation,
    useGetByIdSysConfigurationQuery,
    useSearchSysConfigurationQuery,
    useUpdateSysConfigurationMutation,
    useChangeStatusManySysConfigurationMutation
} = sysConfigurationApis
